import { z } from 'zod';

const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  county: z.string().optional(),
  postcode: z.string().regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, 'Enter a valid UK postcode'),
});

export const businessInfoSchema = z.object({
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
});

export const contactDetailsSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^(\+44|0)[1-9]\d{8,9}$/, 'Enter a valid UK phone number'),
  address: addressSchema,
});

export const bankDetailsSchema = z.object({
  bankAccountNumber: z.string().regex(/^\d{8}$/, 'Account number must be 8 digits'),
  sortCode: z.string().regex(/^\d{2}-\d{2}-\d{2}$/, 'Sort code must be in format XX-XX-XX'),
});

export const vatDetailsSchema = z.object({
  vatRegistered: z.boolean(),
  vatNumber: z.string().optional().refine(
    (val) => !val || /^GB\d{9}$/.test(val),
    { message: 'VAT number must be in format GB123456789' }
  ),
});

export const profileSchema = businessInfoSchema
  .merge(contactDetailsSchema)
  .merge(bankDetailsSchema)
  .merge(vatDetailsSchema);

export type ProfileFormData = z.infer<typeof profileSchema>;
