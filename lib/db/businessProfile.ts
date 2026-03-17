import { db } from './database';
import type { BusinessProfile } from '@/types/profile.types';

export async function getBusinessProfile(): Promise<BusinessProfile | undefined> {
  return db.businessProfile.toCollection().first();
}

export async function saveBusinessProfile(profile: BusinessProfile): Promise<void> {
  const existing = await getBusinessProfile();
  if (existing?.id) {
    await db.businessProfile.put({ ...profile, id: existing.id });
  } else {
    await db.businessProfile.add(profile);
  }
}
