'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBusinessProfile } from '@/lib/db/businessProfile';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    getBusinessProfile().then(profile => {
      if (profile) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-white font-bold">£</span>
        </div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
