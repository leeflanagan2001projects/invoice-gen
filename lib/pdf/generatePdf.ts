import type { Invoice } from '@/types/invoice.types';
import type { BusinessProfile } from '@/types/profile.types';

export async function generatePdfBlob(invoice: Invoice, profile: BusinessProfile): Promise<Blob> {
  // Dynamic import to avoid SSR issues with @react-pdf/renderer
  const { pdf } = await import('@react-pdf/renderer');
  const React = await import('react');
  const { InvoiceDocument } = await import('@/components/pdf/InvoiceDocument');

  const element = React.createElement(InvoiceDocument, { invoice, profile });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await pdf(element as any).toBlob();
  return blob;
}

export async function downloadPdf(invoice: Invoice, profile: BusinessProfile): Promise<void> {
  const blob = await generatePdfBlob(invoice, profile);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${invoice.invoiceNumber}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
