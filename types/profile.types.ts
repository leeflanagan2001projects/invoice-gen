import { Address } from './invoice.types';

export interface BusinessProfile {
  id?: number;
  ownerName: string;
  businessName: string;
  email: string;
  phone: string;
  address: Address;
  vatNumber?: string;       // GB + 9 digits e.g. GB123456789
  vatRegistered: boolean;
  logoDataUrl?: string;     // base64 stored in IndexedDB
  bankAccountNumber: string; // 8 digits
  sortCode: string;          // XX-XX-XX format
}
