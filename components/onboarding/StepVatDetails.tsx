'use client';
import { useState } from 'react';
import { vatDetailsSchema } from '@/lib/validation/profileSchema';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import type { BusinessProfile } from '@/types/profile.types';

interface Props {
  profile: BusinessProfile;
  onChange: (data: Partial<BusinessProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepVatDetails({ profile, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = vatDetailsSchema.safeParse({
      vatRegistered: profile.vatRegistered,
      vatNumber: profile.vatNumber,
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-text-base">VAT Registration</h2>
        <p className="text-gray-500 text-sm mt-1">Required for VAT-registered businesses.</p>
      </div>

      {/* VAT toggle */}
      <button
        type="button"
        onClick={() => onChange({ vatRegistered: !profile.vatRegistered, vatNumber: undefined })}
        className={`
          flex items-center justify-between p-4 rounded-xl border-2 transition-colors
          ${profile.vatRegistered ? 'border-primary bg-blue-50' : 'border-gray-200 bg-surface'}
          min-h-[44px]
        `}
      >
        <div className="text-left">
          <p className="font-semibold text-text-base">VAT Registered</p>
          <p className="text-sm text-gray-500">I charge VAT at 20%</p>
        </div>
        <div className={`
          w-12 h-7 rounded-full transition-colors relative
          ${profile.vatRegistered ? 'bg-primary' : 'bg-gray-300'}
        `}>
          <div className={`
            absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform
            ${profile.vatRegistered ? 'translate-x-6' : 'translate-x-1'}
          `} />
        </div>
      </button>

      {profile.vatRegistered && (
        <Input
          label="VAT Number"
          value={profile.vatNumber ?? ''}
          onChange={e => onChange({ vatNumber: e.target.value.toUpperCase() })}
          error={errors.vatNumber}
          placeholder="GB123456789"
          hint="Format: GB followed by 9 digits"
        />
      )}

      {!profile.vatRegistered && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            If you&apos;re not VAT registered, no VAT will be added to your invoices. You can change this later in Settings.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" size="lg">← Back</Button>
        <Button onClick={() => { if (validate()) onNext(); }} className="flex-1" size="lg">Continue →</Button>
      </div>
    </div>
  );
}
