import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import twilio from 'twilio';
import { render } from '@react-email/components';
import React from 'react';
import { ReminderEmail } from '@/lib/email/templates/reminderEmail';
import { reminderSmsText } from '@/lib/sms/smsTemplates';
import type { Invoice } from '@/types/invoice.types';
import type { BusinessProfile } from '@/types/profile.types';


function normaliseMobile(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return `+44${digits.slice(1)}`;
  if (digits.startsWith('44')) return `+${digits}`;
  return `+${digits}`;
}

export async function POST(req: NextRequest) {
  // Verify Vercel Cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    const body = await req.json();
    const { overdueInvoices, profile } = body as {
      overdueInvoices: Array<{ invoice: Invoice; reminderNumber: number }>;
      profile: BusinessProfile;
    };

    const results = [];
    const errors = [];

    for (const { invoice, reminderNumber } of overdueInvoices) {
      try {
        const pref = invoice.reminderPreference;

        if (pref === 'email' || pref === 'both') {
          const html = await render(
            React.createElement(ReminderEmail, { invoice, profile, reminderNumber })
          );
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? `${profile.businessName} <onboarding@resend.dev>`,
            to: invoice.customer.email,
            subject: `Payment Reminder: Invoice ${invoice.invoiceNumber}`,
            html,
          });
        }

        if ((pref === 'sms' || pref === 'both') && invoice.customer.phone) {
          const smsBody = reminderSmsText(invoice, profile, reminderNumber);
          await twilioClient.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: normaliseMobile(invoice.customer.phone),
            body: smsBody,
          });
        }

        results.push(invoice.invoiceNumber);
      } catch (err) {
        errors.push({ invoice: invoice.invoiceNumber, error: String(err) });
      }
    }

    return NextResponse.json({ processed: results.length, errors });
  } catch (err) {
    console.error('reminder process error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
