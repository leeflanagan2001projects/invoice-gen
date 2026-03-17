export type InvoiceStatus = 'draft' | 'sent' | 'overdue' | 'paid';
export type ReminderPreference = 'email' | 'sms' | 'both' | 'none';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
}

export interface Customer {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: Address;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // pence
  subtotal: number;  // pence
}

export interface Invoice {
  id: string;
  invoiceNumber: string;  // INV-YYYY-XXXX
  status: InvoiceStatus;
  customer: Customer;
  jobAddress: Address;
  lineItems: LineItem[];
  subtotal: number;   // pence
  vatAmount: number;  // pence
  total: number;      // pence
  vatEnabled: boolean;
  vatRate: 20;
  drcMode: boolean;   // Domestic Reverse Charge
  issueDate: string;  // ISO date
  dueDate: string;    // ISO date
  dateSent?: string;
  datePaid?: string;
  reminderPreference: ReminderPreference;
  remindersSent: number;
  lastReminderAt?: string;
  nextReminderAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceFormData = Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'remindersSent' | 'createdAt' | 'updatedAt'>;
