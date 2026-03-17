'use client';
import Link from 'next/link';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';

export default function NewInvoicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white px-4 pt-10 pb-4 flex items-center gap-3">
        <Link href="/dashboard">
          <button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-xl">
            ←
          </button>
        </Link>
        <h1 className="text-xl font-bold">New Invoice</h1>
      </div>

      <div className="px-4 py-4">
        <InvoiceForm mode="create" />
      </div>
    </div>
  );
}
