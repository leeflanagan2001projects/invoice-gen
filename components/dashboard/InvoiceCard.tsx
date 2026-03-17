'use client';
import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { formatPence } from '@/lib/formatters/currency';
import { formatDateShort } from '@/lib/formatters/date';
import type { Invoice } from '@/types/invoice.types';

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <Link href={`/invoices/${invoice.id}`}>
      <div className="bg-surface rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-primary/30 transition-colors active:bg-gray-50">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text-base truncate">{invoice.customer.name}</p>
            {invoice.customer.company && (
              <p className="text-sm text-gray-500 truncate">{invoice.customer.company}</p>
            )}
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500">{invoice.invoiceNumber}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Due {formatDateShort(invoice.dueDate)}
            </p>
          </div>
          <p className="text-xl font-bold text-text-base">{formatPence(invoice.total)}</p>
        </div>
      </div>
    </Link>
  );
}
