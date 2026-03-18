import { db } from './database';
import { hashPassword, verifyPassword } from '@/lib/auth/crypto';
import type { AuthRecord } from '@/types/auth.types';

export async function authRecordExists(): Promise<boolean> {
  const count = await db.auth.count();
  return count > 0;
}

export async function registerUser(email: string, password: string): Promise<void> {
  const { hash, salt } = await hashPassword(password);
  const record: AuthRecord = {
    email: email.toLowerCase().trim(),
    hash,
    salt,
    createdAt: Date.now(),
  };
  await db.auth.add(record);
}

export async function loginUser(email: string, password: string): Promise<AuthRecord | null> {
  const record = await db.auth.where('email').equals(email.toLowerCase().trim()).first();
  if (!record) return null;
  const valid = await verifyPassword(password, record.hash, record.salt);
  return valid ? record : null;
}

export async function getAuthEmail(): Promise<string | undefined> {
  const record = await db.auth.toCollection().first();
  return record?.email;
}
