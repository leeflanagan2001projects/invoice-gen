export interface AuthRecord {
  id?: number;
  email: string;    // stored lowercase-trimmed
  hash: string;     // base64url PBKDF2 output
  salt: string;     // base64url random 16-byte salt
  createdAt: number; // Date.now()
}
