'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/profileStore';
import type { BusinessProfile } from '@/types/profile.types';
import { StepBusinessInfo } from './StepBusinessInfo';
import { StepContactDetails } from './StepContactDetails';
import { StepBankDetails } from './StepBankDetails';
import { StepVatDetails } from './StepVatDetails';
import { StepLogoUpload } from './StepLogoUpload';

const STEPS = ['Business Info', 'Contact & Address', 'Bank Details', 'VAT Details', 'Logo'];

const EMPTY_PROFILE: BusinessProfile = {
  ownerName: '',
  businessName: '',
  email: '',
  phone: '',
  address: { line1: '', city: '', postcode: '' },
  vatRegistered: false,
  bankAccountNumber: '',
  sortCode: '',
};

export function OnboardingWizard() {
  const router = useRouter();
  const { saveProfile } = useProfileStore();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<BusinessProfile>(EMPTY_PROFILE);
  const [saving, setSaving] = useState(false);

  const update = (data: Partial<BusinessProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const finish = async () => {
    setSaving(true);
    await saveProfile(profile);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-6">
        <h1 className="text-2xl font-bold">Set Up Your Business</h1>
        <p className="text-blue-200 text-sm mt-1">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-blue-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-4 py-6">
        {step === 0 && (
          <StepBusinessInfo profile={profile} onChange={update} onNext={next} />
        )}
        {step === 1 && (
          <StepContactDetails profile={profile} onChange={update} onNext={next} onBack={prev} />
        )}
        {step === 2 && (
          <StepBankDetails profile={profile} onChange={update} onNext={next} onBack={prev} />
        )}
        {step === 3 && (
          <StepVatDetails profile={profile} onChange={update} onNext={next} onBack={prev} />
        )}
        {step === 4 && (
          <StepLogoUpload profile={profile} onChange={update} onFinish={finish} onBack={prev} saving={saving} />
        )}
      </div>
    </div>
  );
}
