import type { Invoice } from '@/types/invoice.types';
import type { Reminder } from '@/types/reminder.types';

export function buildReminder(invoice: Invoice, intervalDays = 3): Omit<Reminder, 'id'> {
  const nextReminderAt = new Date();
  nextReminderAt.setDate(nextReminderAt.getDate() + intervalDays);

  return {
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerEmail: invoice.customer.email,
    customerPhone: invoice.customer.phone,
    reminderPreference: invoice.reminderPreference === 'none' ? 'email' : invoice.reminderPreference as 'email' | 'sms' | 'both',
    nextReminderAt: nextReminderAt.toISOString(),
    remindersSent: 0,
    active: true,
  };
}

export function nextReminderDate(intervalDays = 3): string {
  const d = new Date();
  d.setDate(d.getDate() + intervalDays);
  return d.toISOString();
}
