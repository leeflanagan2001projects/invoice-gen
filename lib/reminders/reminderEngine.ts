import { db } from '@/lib/db/database';

const INTERVAL_DAYS = 3;

export async function processReminders(): Promise<{ processed: number; errors: string[] }> {
  const now = new Date().toISOString();
  const errors: string[] = [];
  let processed = 0;

  const dueReminders = await db.reminders
    .filter(r => r.active && r.nextReminderAt <= now)
    .toArray();

  if (dueReminders.length === 0) {
    return { processed: 0, errors: [] };
  }

  for (const reminder of dueReminders) {
    try {
      const invoice = await db.invoices.get(reminder.invoiceId);
      if (!invoice || invoice.status === 'paid') {
        await db.reminders.update(reminder.id!, { active: false });
        continue;
      }

      const newCount = reminder.remindersSent + 1;
      const nextAt = new Date();
      nextAt.setDate(nextAt.getDate() + INTERVAL_DAYS);

      await db.reminders.update(reminder.id!, {
        remindersSent: newCount,
        nextReminderAt: nextAt.toISOString(),
      });

      await db.invoices.update(invoice.id, {
        remindersSent: newCount,
        lastReminderAt: now,
        nextReminderAt: nextAt.toISOString(),
        updatedAt: now,
      });

      processed++;
    } catch (err) {
      errors.push(`Reminder ${reminder.id}: ${String(err)}`);
    }
  }

  return { processed, errors };
}
