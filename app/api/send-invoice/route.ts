import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import React from 'react';
import { InvoiceEmail } from '@/lib/email/templates/invoiceEmail';
import type { Invoice } from '@/types/invoice.types';
import type { BusinessProfile } from '@/types/profile.types';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { invoice, profile, pdfBase64 } = body as {
      invoice: Invoice;
      profile: BusinessProfile;
      pdfBase64: string;
    };

    if (!invoice || !profile || !pdfBase64) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const html = await render(React.createElement(InvoiceEmail, { invoice, profile }));
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? `${profile.businessName} <onboarding@resend.dev>`,
      to: invoice.customer.email,
      subject: `Invoice ${invoice.invoiceNumber} from ${profile.businessName}`,
      html,
      attachments: [
        {
          filename: `${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('send-invoice error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
