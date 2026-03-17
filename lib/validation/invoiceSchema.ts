import { z } from 'zod';

const addressSchema = z.object({
  line1: z.string().min(1, 'Required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  county: z.string().optional(),
  postcode: z.string().regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, 'Invalid UK postcode'),
});

const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: addressSchema,
});

const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description required'),
  quantity: z.number().positive('Must be > 0'),
  unitPrice: z.number().min(0, 'Must be ≥ 0'), // pence
  subtotal: z.number().min(0),                  // pence
});

export const invoiceSchema = z.object({
  customer: customerSchema,
  jobAddress: addressSchema,
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item required'),
  subtotal: z.number().min(0),
  vatAmount: z.number().min(0),
  total: z.number().min(0),
  vatEnabled: z.boolean(),
  vatRate: z.literal(20),
  drcMode: z.boolean(),
  issueDate: z.string().min(1, 'Issue date required'),
  dueDate: z.string().min(1, 'Due date required'),
  reminderPreference: z.enum(['email', 'sms', 'both', 'none']),
  notes: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
