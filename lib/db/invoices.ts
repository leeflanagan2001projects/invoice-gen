import { db } from './database';
import type { Invoice, InvoiceStatus } from '@/types/invoice.types';

export async function getInvoices(): Promise<Invoice[]> {
  return db.invoices.orderBy('createdAt').reverse().toArray();
}

export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
  return db.invoices.get(id);
}

export async function saveInvoice(invoice: Invoice): Promise<void> {
  await db.invoices.put(invoice);
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus, extra?: Partial<Invoice>): Promise<void> {
  await db.invoices.update(id, { status, ...extra, updatedAt: new Date().toISOString() });
}

export async function deleteInvoice(id: string): Promise<void> {
  await db.invoices.delete(id);
  await db.reminders.where('invoiceId').equals(id).delete();
}

export async function getOverdueInvoices(): Promise<Invoice[]> {
  const today = new Date().toISOString().split('T')[0];
  return db.invoices
    .where('status')
    .anyOf(['sent', 'overdue'])
    .filter(inv => inv.dueDate < today)
    .toArray();
}

export async function markInvoiceOverdue(): Promise<number> {
  const overdue = await getOverdueInvoices();
  let count = 0;
  for (const inv of overdue) {
    if (inv.status !== 'overdue') {
      await db.invoices.update(inv.id, { status: 'overdue', updatedAt: new Date().toISOString() });
      count++;
    }
  }
  return count;
}
