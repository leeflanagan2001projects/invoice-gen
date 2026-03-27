'use client';
import { useRequireAuth } from '@/lib/auth/useRequireAuth';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  useRequireAuth();
  return <OnboardingWizard />;
}
