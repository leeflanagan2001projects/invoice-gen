import { db } from './database';
import type { AppSettings } from '@/types/settings.types';

const DEFAULTS: AppSettings = {
  defaultPaymentTermsDays: 30,
  defaultVatEnabled: false,
  reminderIntervalDays: 3,
  invoiceNumberSequence: 0,
};

export async function getSettings(): Promise<AppSettings> {
  const existing = await db.settings.toCollection().first();
  return existing ?? DEFAULTS;
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  const existing = await db.settings.toCollection().first();
  if (existing?.id) {
    await db.settings.update(existing.id, settings);
  } else {
    await db.settings.add({ ...DEFAULTS, ...settings });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getNextInvoiceSequence(_year: number): Promise<number> {
  const settings = await getSettings();
  const next = settings.invoiceNumberSequence + 1;
  await saveSettings({ invoiceNumberSequence: next });
  return next;
}
