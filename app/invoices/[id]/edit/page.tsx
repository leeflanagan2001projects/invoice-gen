'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';

export default function EditInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { invoices, loadInvoices } = useInvoiceStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (invoices.length === 0) loadInvoices(); }, []);

  const invoice = invoices.find(i => i.id === id);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-white px-4 pt-10 pb-4 flex items-center gap-3">
        <Link href={`/invoices/${id}`}>
          <button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-xl">
            ←
          </button>
        </Link>
        <h1 className="text-xl font-bold">Edit {invoice.invoiceNumber}</h1>
      </div>
      <div className="px-4 py-4">
        <InvoiceForm initialData={invoice} mode="edit" />
      </div>
    </div>
  );
}
