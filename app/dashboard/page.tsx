'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useProfileStore } from '@/store/profileStore';
import { useSettingsStore } from '@/store/settingsStore';
import { InvoiceCard } from '@/components/dashboard/InvoiceCard';
import { FilterTabs } from '@/components/dashboard/FilterTabs';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { Button } from '@/components/shared/Button';
import type { InvoiceStatus } from '@/types/invoice.types';

type FilterValue = 'all' | InvoiceStatus;

export default function DashboardPage() {
  const { invoices, loadInvoices, loading } = useInvoiceStore();
  const { profile, loadProfile } = useProfileStore();
  const { loadSettings } = useSettingsStore();
  const [filter, setFilter] = useState<FilterValue>('all');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadProfile(); loadSettings(); loadInvoices(); }, []);

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  const counts = {
    all: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    paid: invoices.filter(i => i.status === 'paid').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white px-4 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm">Welcome back</p>
            <h1 className="text-2xl font-bold">{profile?.businessName ?? 'My Business'}</h1>
          </div>
          <Link href="/settings">
            <button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <span className="text-xl">⚙️</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="px-4 -mt-2 space-y-4 pb-24">
        {/* Stats */}
        <DashboardStats invoices={invoices} />

        {/* Filter tabs */}
        <FilterTabs active={filter} counts={counts} onChange={setFilter} />

        {/* Invoice list */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-surface rounded-2xl p-4 h-24 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-gray-500 font-medium">
              {filter === 'all' ? 'No invoices yet' : `No ${filter} invoices`}
            </p>
            {filter === 'all' && (
              <p className="text-gray-400 text-sm mt-1">Tap the button below to create your first invoice</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(invoice => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-4">
        <Link href="/invoices/new">
          <Button variant="accent" size="lg" className="shadow-lg shadow-orange-200 rounded-2xl px-6">
            + New Invoice
          </Button>
        </Link>
      </div>
    </div>
  );
}
