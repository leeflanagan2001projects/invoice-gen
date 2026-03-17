import { db } from './database';
import type { Reminder } from '@/types/reminder.types';

export async function createReminder(reminder: Omit<Reminder, 'id'>): Promise<number> {
  return db.reminders.add(reminder);
}

export async function getDueReminders(): Promise<Reminder[]> {
  const now = new Date().toISOString();
  return db.reminders
    .filter(r => r.active && r.nextReminderAt <= now)
    .toArray();
}

export async function updateReminder(id: number, data: Partial<Reminder>): Promise<void> {
  await db.reminders.update(id, data);
}

export async function deactivateRemindersForInvoice(invoiceId: string): Promise<void> {
  await db.reminders.where('invoiceId').equals(invoiceId).modify({ active: false });
}

export async function deleteRemindersForInvoice(invoiceId: string): Promise<void> {
  await db.reminders.where('invoiceId').equals(invoiceId).delete();
}
