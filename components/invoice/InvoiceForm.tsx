'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { CustomerFields } from './CustomerFields';
import { LineItemList } from './LineItemList';
import { VatToggle } from './VatToggle';
import { ReminderPreferenceSelector } from './ReminderPreference';
import { InvoiceSummary } from './InvoiceSummary';
import { Input } from '@/components/shared/Input';
import { TextArea } from '@/components/shared/TextArea';
import { AddressFields } from '@/components/shared/AddressFields';
import { Button } from '@/components/shared/Button';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useUIStore } from '@/store/uiStore';
import { getNextInvoiceSequence } from '@/lib/db/settings';
import { generateInvoiceNumber } from '@/lib/formatters/invoiceNumber';
import { todayISO, addDays } from '@/lib/formatters/date';
import { calculateVat } from '@/lib/formatters/currency';
import type { Invoice, LineItem, Customer, Address, ReminderPreference } from '@/types/invoice.types';

interface InvoiceFormProps {
  initialData?: Invoice;
  mode?: 'create' | 'edit';
}

const EMPTY_ADDRESS: Address = { line1: '', city: '', postcode: '' };
const EMPTY_CUSTOMER: Customer = {
  name: '', email: '', address: { ...EMPTY_ADDRESS },
};

export function InvoiceForm({ initialData, mode = 'create' }: InvoiceFormProps) {
  const router = useRouter();
  const { addInvoice, updateInvoice } = useInvoiceStore();
  const { settings } = useSettingsStore();
  const { addToast } = useUIStore();

  const [customer, setCustomer] = useState<Customer>(initialData?.customer ?? EMPTY_CUSTOMER);
  const [jobAddress, setJobAddress] = useState<Address>(initialData?.jobAddress ?? { ...EMPTY_ADDRESS });
  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialData?.lineItems ?? [{ id: uuidv4(), description: '', quantity: 1, unitPrice: 0, subtotal: 0 }]
  );
  const [vatEnabled, setVatEnabled] = useState(initialData?.vatEnabled ?? settings?.defaultVatEnabled ?? false);
  const [drcMode, setDrcMode] = useState(initialData?.drcMode ?? false);
  const [issueDate, setIssueDate] = useState(initialData?.issueDate ?? todayISO());
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ?? addDays(todayISO(), settings?.defaultPaymentTermsDays ?? 30)
  );
  const [reminderPref, setReminderPref] = useState<ReminderPreference>(
    initialData?.reminderPreference ?? 'email'
  );
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [saving, setSaving] = useState(false);

  // Recalculate totals when line items or VAT settings change
  const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const vatAmount = vatEnabled && !drcMode ? calculateVat(subtotal, 20) : 0;
  const total = subtotal + vatAmount;

  const handleSaveDraft = async () => {
    if (!customer.name || !customer.email) {
      addToast({ type: 'error', message: 'Customer name and email are required' });
      return;
    }
    if (lineItems.every(i => i.subtotal === 0)) {
      addToast({ type: 'error', message: 'Add at least one line item' });
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();

      if (mode === 'edit' && initialData) {
        const updated: Invoice = {
          ...initialData,
          customer, jobAddress, lineItems,
          subtotal, vatAmount, total,
          vatEnabled, vatRate: 20, drcMode,
          issueDate, dueDate,
          reminderPreference: reminderPref,
          notes,
          updatedAt: now,
        };
        await updateInvoice(updated);
        addToast({ type: 'success', message: 'Invoice updated' });
        router.push(`/invoices/${initialData.id}`);
      } else {
        const year = new Date().getFullYear();
        const seq = await getNextInvoiceSequence(year);
        const invoiceNumber = generateInvoiceNumber(year, seq);

        const invoice: Invoice = {
          id: uuidv4(),
          invoiceNumber,
          status: 'draft',
          customer, jobAddress, lineItems,
          subtotal, vatAmount, total,
          vatEnabled, vatRate: 20, drcMode,
          issueDate, dueDate,
          reminderPreference: reminderPref,
          remindersSent: 0,
          notes,
          createdAt: now,
          updatedAt: now,
        };
        await addInvoice(invoice);
        addToast({ type: 'success', message: `Invoice ${invoiceNumber} saved as draft` });
        router.push(`/invoices/${invoice.id}`);
      }
    } catch {
      addToast({ type: 'error', message: 'Failed to save invoice' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Customer */}
      <section className="bg-surface rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-text-base mb-4">Customer Details</h2>
        <CustomerFields value={customer} onChange={setCustomer} />
      </section>

      {/* Job Address */}
      <section className="bg-surface rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-text-base mb-4">Job Address</h2>
        <AddressFields value={jobAddress} onChange={setJobAddress} />
      </section>

      {/* Dates */}
      <section className="bg-surface rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-text-base mb-4">Dates</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Issue Date"
            type="date"
            value={issueDate}
            onChange={e => setIssueDate(e.target.value)}
          />
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            min={issueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
      </section>

      {/* Line Items */}
      <section className="bg-surface rounded-2xl p-4 shadow-sm">
        <LineItemList items={lineItems} onChange={setLineItems} />
      </section>

      {/* VAT */}
      <section className="bg-surface rounded-2xl p-4 shadow-sm">
        <VatToggle
          vatEnabled={vatEnabled}
          drcMode={drcMode}
          onVatChange={setVatEnabled}
          onDrcChange={setDrcMode}
        />
      </section>

      {/* Totals */}
      <InvoiceSummary
        subtotal={subtotal}
        vatAmount={vatAmount}
        total={total}
        vatEnabled={vatEnabled}
        drcMode={drcMode}
      />

      {/* Reminders */}
      <section className="bg-surface rounded-2xl p-4 shadow-sm">
        <ReminderPreferenceSelector value={reminderPref} onChange={setReminderPref} />
      </section>

      {/* Notes */}
      <section className="bg-surface rounded-2xl p-4 shadow-sm">
        <TextArea
          label="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Payment by bank transfer within 30 days. Thank you for your business."
          rows={4}
        />
      </section>

      {/* Sticky save button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3">
        <Button variant="ghost" onClick={() => router.back()} className="flex-shrink-0">
          Cancel
        </Button>
        <Button
          onClick={handleSaveDraft}
          loading={saving}
          fullWidth
          variant="accent"
          size="lg"
        >
          {mode === 'edit' ? 'Save Changes' : 'Save as Draft'}
        </Button>
      </div>
    </div>
  );
}
