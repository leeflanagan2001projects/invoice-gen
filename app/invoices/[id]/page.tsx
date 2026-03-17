'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useProfileStore } from '@/store/profileStore';
import { useUIStore } from '@/store/uiStore';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { formatPence } from '@/lib/formatters/currency';
import { formatDate } from '@/lib/formatters/date';
import { generatePdfBlob, downloadPdf } from '@/lib/pdf/generatePdf';
import { invoiceSmsText } from '@/lib/sms/smsTemplates';
import { buildReminder } from '@/lib/reminders/scheduleReminder';
import { createReminder } from '@/lib/db/reminders';
import { updateInvoiceStatus } from '@/lib/db/invoices';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { invoices, markPaid, removeInvoice, loadInvoices } = useInvoiceStore();
  const { profile, loadProfile } = useProfileStore();
  const { addToast } = useUIStore();

  const [confirmPaid, setConfirmPaid] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadProfile(); if (invoices.length === 0) loadInvoices(); }, []);

  const invoice = invoices.find(i => i.id === id);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Invoice not found</p>
          <Link href="/dashboard" className="text-primary text-sm mt-2 block">← Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!profile) return;
    setDownloading(true);
    try {
      await downloadPdf(invoice, profile);
    } catch {
      addToast({ type: 'error', message: 'Failed to generate PDF' });
    } finally {
      setDownloading(false);
    }
  };

  const handleSend = async () => {
    if (!profile) {
      addToast({ type: 'error', message: 'Business profile not loaded' });
      return;
    }
    setSending(true);
    try {
      // Generate PDF
      const pdfBlob = await generatePdfBlob(invoice, profile);
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const pdfBase64 = btoa(Array.from(new Uint8Array(arrayBuffer), c => String.fromCharCode(c)).join(''));

      // Send email
      const emailRes = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice, profile, pdfBase64 }),
      });

      if (!emailRes.ok) {
        const err = await emailRes.json();
        throw new Error(err.error ?? 'Email send failed');
      }

      // Send SMS if required
      if ((invoice.reminderPreference === 'sms' || invoice.reminderPreference === 'both') && invoice.customer.phone) {
        const smsBody = invoiceSmsText(invoice, profile);
        await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: invoice.customer.phone, body: smsBody }),
        });
      }

      // Update status + schedule reminder
      const now = new Date().toISOString();
      await updateInvoiceStatus(id, 'sent', { dateSent: now });

      if (invoice.reminderPreference !== 'none') {
        const reminder = buildReminder(invoice);
        await createReminder(reminder);
      }

      await loadInvoices();
      addToast({ type: 'success', message: 'Invoice sent successfully' });
    } catch (err) {
      addToast({ type: 'error', message: String(err) });
    } finally {
      setSending(false);
    }
  };

  const handleMarkPaid = async () => {
    await markPaid(id);
    setConfirmPaid(false);
    addToast({ type: 'success', message: `Invoice ${invoice.invoiceNumber} marked as paid` });
  };

  const handleDelete = async () => {
    await removeInvoice(id);
    setConfirmDelete(false);
    addToast({ type: 'info', message: 'Invoice deleted' });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-primary text-white px-4 pt-10 pb-4 flex items-center gap-3">
        <Link href="/dashboard">
          <button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-xl">
            ←
          </button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{invoice.invoiceNumber}</h1>
            <StatusBadge status={invoice.status} />
          </div>
          <p className="text-blue-200 text-sm">{invoice.customer.name}</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Amount */}
        <div className="bg-surface rounded-2xl p-6 shadow-sm text-center">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-4xl font-bold text-text-base mt-1">{formatPence(invoice.total)}</p>
          {invoice.vatEnabled && !invoice.drcMode && (
            <p className="text-sm text-gray-400 mt-1">
              inc. £{(invoice.vatAmount / 100).toFixed(2)} VAT (20%)
            </p>
          )}
          {invoice.drcMode && (
            <p className="text-sm text-yellow-600 mt-1 font-medium">Domestic Reverse Charge</p>
          )}
        </div>

        {/* Details */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm space-y-3">
          <DetailRow label="Customer" value={invoice.customer.name} />
          {invoice.customer.company && <DetailRow label="Company" value={invoice.customer.company} />}
          <DetailRow label="Email" value={invoice.customer.email} />
          {invoice.customer.phone && <DetailRow label="Phone" value={invoice.customer.phone} />}
          <hr className="border-gray-100" />
          <DetailRow label="Issue Date" value={formatDate(invoice.issueDate)} />
          <DetailRow label="Due Date" value={formatDate(invoice.dueDate)} />
          {invoice.dateSent && <DetailRow label="Sent" value={formatDate(invoice.dateSent)} />}
          {invoice.datePaid && <DetailRow label="Paid" value={formatDate(invoice.datePaid)} />}
          <hr className="border-gray-100" />
          <DetailRow label="Reminders" value={`${invoice.remindersSent} sent`} />
          {invoice.nextReminderAt && invoice.status !== 'paid' && (
            <DetailRow label="Next Reminder" value={formatDate(invoice.nextReminderAt.split('T')[0])} />
          )}
        </div>

        {/* Line items */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-text-base mb-3">Line Items</p>
          <div className="space-y-2">
            {invoice.lineItems.map(item => (
              <div key={item.id} className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-base">{item.description}</p>
                  <p className="text-xs text-gray-400">{item.quantity} × {formatPence(item.unitPrice)}</p>
                </div>
                <p className="text-sm font-semibold">{formatPence(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <hr className="my-3 border-gray-100" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatPence(invoice.subtotal)}</span>
          </div>
          {invoice.vatEnabled && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">{invoice.drcMode ? 'VAT (RC)' : 'VAT (20%)'}</span>
              <span>{invoice.drcMode ? '£0.00' : formatPence(invoice.vatAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-primary">{formatPence(invoice.total)}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="bg-surface rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold mb-2">Notes</p>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 space-y-2">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload} loading={downloading} className="flex-1">
            Download PDF
          </Button>
          <Link href={`/invoices/${id}/preview`} className="flex-1">
            <Button variant="ghost" fullWidth>Preview</Button>
          </Link>
        </div>

        {invoice.status === 'draft' && (
          <div className="flex gap-2">
            <Link href={`/invoices/${id}/edit`} className="flex-1">
              <Button variant="outline" fullWidth>Edit</Button>
            </Link>
            <Button onClick={handleSend} loading={sending} fullWidth variant="primary">
              Send Invoice
            </Button>
          </div>
        )}

        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={() => setConfirmDelete(true)}
              className="flex-shrink-0"
            >
              Delete
            </Button>
            <Button onClick={() => setConfirmPaid(true)} fullWidth variant="accent" size="lg">
              Mark as Paid ✓
            </Button>
          </div>
        )}

        {invoice.status === 'paid' && (
          <Button variant="ghost" onClick={() => setConfirmDelete(true)} fullWidth>
            Delete Invoice
          </Button>
        )}
      </div>

      {/* Mark Paid Modal */}
      <Modal
        isOpen={confirmPaid}
        onClose={() => setConfirmPaid(false)}
        title="Mark as Paid?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmPaid(false)} fullWidth>Cancel</Button>
            <Button onClick={handleMarkPaid} variant="accent" fullWidth>Confirm Paid</Button>
          </>
        }
      >
        <p className="text-gray-600">
          Mark invoice <strong>{invoice.invoiceNumber}</strong> as paid?
          This will stop all payment reminders.
        </p>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete Invoice?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmDelete(false)} fullWidth>Cancel</Button>
            <Button onClick={handleDelete} variant="danger" fullWidth>Delete</Button>
          </>
        }
      >
        <p className="text-gray-600">
          Permanently delete <strong>{invoice.invoiceNumber}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-text-base text-right">{value}</span>
    </div>
  );
}
