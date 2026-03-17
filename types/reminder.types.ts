export interface Reminder {
  id?: number;
  invoiceId: string;
  invoiceNumber: string;
  customerEmail: string;
  customerPhone?: string;
  reminderPreference: 'email' | 'sms' | 'both';
  nextReminderAt: string; // ISO datetime
  remindersSent: number;
  active: boolean;
}
