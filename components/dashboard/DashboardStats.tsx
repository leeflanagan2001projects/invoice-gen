import { formatPence } from '@/lib/formatters/currency';
import { firstDayOfMonth } from '@/lib/formatters/date';
import type { Invoice } from '@/types/invoice.types';

interface DashboardStatsProps {
  invoices: Invoice[];
}

export function DashboardStats({ invoices }: DashboardStatsProps) {
  const outstanding = invoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0);

  const monthStart = firstDayOfMonth();
  const paidThisMonth = invoices
    .filter(i => i.status === 'paid' && i.datePaid && i.datePaid >= monthStart)
    .reduce((sum, i) => sum + i.total, 0);

  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-surface rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 font-medium">Outstanding</p>
        <p className="text-2xl font-bold text-text-base mt-1">{formatPence(outstanding)}</p>
        {overdueCount > 0 && (
          <p className="text-xs text-warning font-semibold mt-1">{overdueCount} overdue</p>
        )}
      </div>
      <div className="bg-surface rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 font-medium">Paid This Month</p>
        <p className="text-2xl font-bold text-success mt-1">{formatPence(paidThisMonth)}</p>
      </div>
    </div>
  );
}
