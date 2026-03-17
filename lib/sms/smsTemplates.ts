import type { Invoice } from '@/types/invoice.types';
import type { BusinessProfile } from '@/types/profile.types';
import { formatPence } from '@/lib/formatters/currency';
import { formatDateShort } from '@/lib/formatters/date';

export function invoiceSmsText(invoice: Invoice, profile: BusinessProfile): string {
  return `Invoice ${invoice.invoiceNumber} from ${profile.businessName}. Amount: ${formatPence(invoice.total)}. Due: ${formatDateShort(invoice.dueDate)}. Pay to: ${profile.bankAccountNumber} / ${profile.sortCode}. Ref: ${invoice.invoiceNumber}`;
}

export function reminderSmsText(invoice: Invoice, profile: BusinessProfile, reminderNumber: number): string {
  const urgency = reminderNumber >= 3 ? 'URGENT: ' : '';
  return `${urgency}Payment reminder from ${profile.businessName}. Invoice ${invoice.invoiceNumber} for ${formatPence(invoice.total)} was due ${formatDateShort(invoice.dueDate)}. Please pay to sort code ${invoice.customer.name ? '' : ''}${profile.sortCode}, account ${profile.bankAccountNumber}, ref ${invoice.invoiceNumber}. Queries: ${profile.phone}`;
}
