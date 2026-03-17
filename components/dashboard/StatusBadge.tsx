import type { InvoiceStatus } from '@/types/invoice.types';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const CONFIG: Record<InvoiceStatus, { label: string; classes: string }> = {
  draft: { label: 'Draft', classes: 'bg-gray-100 text-gray-600' },
  sent: { label: 'Sent', classes: 'bg-blue-100 text-primary' },
  overdue: { label: 'Overdue', classes: 'bg-yellow-100 text-warning font-bold' },
  paid: { label: 'Paid', classes: 'bg-green-100 text-success font-bold' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, classes } = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}
