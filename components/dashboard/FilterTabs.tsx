'use client';
import type { InvoiceStatus } from '@/types/invoice.types';

type FilterValue = 'all' | InvoiceStatus;

interface FilterTabsProps {
  active: FilterValue;
  counts: Record<FilterValue, number>;
  onChange: (filter: FilterValue) => void;
}

const TABS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'paid', label: 'Paid' },
];

export function FilterTabs({ active, counts, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
      {TABS.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold
            whitespace-nowrap transition-colors min-h-[44px] flex-shrink-0
            ${active === tab.value
              ? 'bg-primary text-white'
              : 'bg-surface text-gray-600 border border-gray-200'
            }
          `}
        >
          {tab.label}
          {counts[tab.value] > 0 && (
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full font-bold
              ${active === tab.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}
            `}>
              {counts[tab.value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
