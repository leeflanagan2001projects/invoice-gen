'use client';
import { create } from 'zustand';
import type { Invoice } from '@/types/invoice.types';
import { getInvoices, saveInvoice, deleteInvoice, updateInvoiceStatus } from '@/lib/db/invoices';
import { markInvoiceOverdue } from '@/lib/db/invoices';

interface InvoiceStore {
  invoices: Invoice[];
  loading: boolean;
  loadInvoices: () => Promise<void>;
  addInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoice: (invoice: Invoice) => Promise<void>;
  removeInvoice: (id: string) => Promise<void>;
  markPaid: (id: string) => Promise<void>;
  refreshOverdue: () => Promise<void>;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  loading: false,

  loadInvoices: async () => {
    set({ loading: true });
    await markInvoiceOverdue();
    const invoices = await getInvoices();
    set({ invoices, loading: false });
  },

  addInvoice: async (invoice) => {
    await saveInvoice(invoice);
    set({ invoices: [invoice, ...get().invoices] });
  },

  updateInvoice: async (invoice) => {
    await saveInvoice(invoice);
    set({ invoices: get().invoices.map(i => i.id === invoice.id ? invoice : i) });
  },

  removeInvoice: async (id) => {
    await deleteInvoice(id);
    set({ invoices: get().invoices.filter(i => i.id !== id) });
  },

  markPaid: async (id) => {
    const datePaid = new Date().toISOString();
    await updateInvoiceStatus(id, 'paid', { datePaid });
    const { deactivateRemindersForInvoice } = await import('@/lib/db/reminders');
    await deactivateRemindersForInvoice(id);
    set({
      invoices: get().invoices.map(i =>
        i.id === id ? { ...i, status: 'paid', datePaid } : i
      ),
    });
  },

  refreshOverdue: async () => {
    await markInvoiceOverdue();
    const invoices = await getInvoices();
    set({ invoices });
  },
}));
