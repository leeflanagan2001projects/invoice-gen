'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authRecordExists } from '@/lib/db/auth';
import { isLoggedIn } from '@/lib/auth/session';
import { getBusinessProfile } from '@/lib/db/businessProfile';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const hasAuth = await authRecordExists();
        if (!hasAuth) {
          router.replace('/register');
          return;
        }

        if (!isLoggedIn()) {
          router.replace('/login');
          return;
        }

        const profile = await getBusinessProfile();
        router.replace(profile ? '/dashboard' : '/onboarding');
      } catch {
        router.replace('/register');
      }
    })();
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
