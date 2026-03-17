import { Resend } from 'resend';
import { render } from '@react-email/components';
import { InvoiceEmail } from './templates/invoiceEmail';
import { ReminderEmail } from './templates/reminderEmail';
import React from 'react';
import type { Invoice } from '@/types/invoice.types';
import type { BusinessProfile } from '@/types/profile.types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail(
  invoice: Invoice,
  profile: BusinessProfile,
  pdfBuffer: Buffer
): Promise<void> {
  const html = await render(React.createElement(InvoiceEmail, { invoice, profile }));

  await resend.emails.send({
    from: `${profile.businessName} <invoices@resend.dev>`,
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
}

export async function sendReminderEmail(
  invoice: Invoice,
  profile: BusinessProfile,
  reminderNumber: number
): Promise<void> {
  const html = await render(
    React.createElement(ReminderEmail, { invoice, profile, reminderNumber })
  );

  await resend.emails.send({
    from: `${profile.businessName} <invoices@resend.dev>`,
    to: invoice.customer.email,
    subject: `Payment Reminder: Invoice ${invoice.invoiceNumber} from ${profile.businessName}`,
    html,
  });
}
