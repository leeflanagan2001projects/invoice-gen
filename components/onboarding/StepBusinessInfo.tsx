'use client';
import { useState } from 'react';
import { businessInfoSchema } from '@/lib/validation/profileSchema';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import type { BusinessProfile } from '@/types/profile.types';

interface Props {
  profile: BusinessProfile;
  onChange: (data: Partial<BusinessProfile>) => void;
  onNext: () => void;
}

export function StepBusinessInfo({ profile, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = businessInfoSchema.safeParse({
      ownerName: profile.ownerName,
      businessName: profile.businessName,
    });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(i => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-text-base">Business Information</h2>
        <p className="text-gray-500 text-sm mt-1">This will appear on all your invoices.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Your Full Name"
          value={profile.ownerName}
          onChange={e => onChange({ ownerName: e.target.value })}
          error={errors.ownerName}
          placeholder="John Smith"
          autoComplete="name"
        />
        <Input
          label="Business / Trading Name"
          value={profile.businessName}
          onChange={e => onChange({ businessName: e.target.value })}
          error={errors.businessName}
          placeholder="Smith Electrical Ltd"
          autoComplete="organization"
        />
      </div>

      <Button onClick={handleNext} fullWidth size="lg">
        Continue →
      </Button>
    </div>
  );
}
