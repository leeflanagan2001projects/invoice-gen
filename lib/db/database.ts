import Dexie, { type Table } from 'dexie';
import type { Invoice } from '@/types/invoice.types';
import type { BusinessProfile } from '@/types/profile.types';
import type { AppSettings } from '@/types/settings.types';
import type { Reminder } from '@/types/reminder.types';
import type { AuthRecord } from '@/types/auth.types';

export class InvoiceDatabase extends Dexie {
  invoices!: Table<Invoice, string>;
  businessProfile!: Table<BusinessProfile, number>;
  settings!: Table<AppSettings, number>;
  reminders!: Table<Reminder, number>;
  auth!: Table<AuthRecord, number>;

  constructor() {
    super('InvoiceGenDB');

    this.version(1).stores({
      invoices: 'id, &invoiceNumber, status, createdAt, dueDate, nextReminderAt',
      businessProfile: '++id',
      settings: '++id',
      reminders: '++id, invoiceId, nextReminderAt, active',
    });

    this.version(2).stores({
      invoices: 'id, &invoiceNumber, status, createdAt, dueDate, nextReminderAt',
      businessProfile: '++id',
      settings: '++id',
      reminders: '++id, invoiceId, nextReminderAt, active',
      auth: '++id, &email',
    });
  }
}

export const db = new InvoiceDatabase();
