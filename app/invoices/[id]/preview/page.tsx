'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/shared/Button';
import { downloadPdf } from '@/lib/pdf/generatePdf';
import { useUIStore } from '@/store/uiStore';

// PDFViewer must be client-only
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center"><p className="text-gray-500">Loading preview...</p></div> }
);

const InvoiceDocument = dynamic(
  () => import('@/components/pdf/InvoiceDocument').then(mod => mod.InvoiceDocument),
  { ssr: false }
);

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { invoices, loadInvoices } = useInvoiceStore();
  const { profile, loadProfile } = useProfileStore();
  const { addToast } = useUIStore();
  const [downloading, setDownloading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadProfile(); if (invoices.length === 0) loadInvoices(); }, []);

  const invoice = invoices.find(i => i.id === id);

  const handleDownload = async () => {
    if (!invoice || !profile) return;
    setDownloading(true);
    try {
      await downloadPdf(invoice, profile);
    } catch {
      addToast({ type: 'error', message: 'Download failed' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary text-white px-4 pt-10 pb-4 flex items-center gap-3 flex-shrink-0">
        <Link href={`/invoices/${id}`}>
          <button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-xl">
            ←
          </button>
        </Link>
        <h1 className="text-xl font-bold flex-1">PDF Preview</h1>
        <Button
          variant="accent"
          size="sm"
          onClick={handleDownload}
          loading={downloading}
        >
          Download
        </Button>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1" style={{ height: 'calc(100vh - 80px)' }}>
        {invoice && profile && InvoiceDocument ? (
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <InvoiceDocument invoice={invoice} profile={profile} />
          </PDFViewer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading document...</p>
          </div>
        )}
      </div>
    </div>
  );
}
