'use client';
import { useState } from 'react';
import { bankDetailsSchema } from '@/lib/validation/profileSchema';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import type { BusinessProfile } from '@/types/profile.types';

interface Props {
  profile: BusinessProfile;
  onChange: (data: Partial<BusinessProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepBankDetails({ profile, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatSortCode = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 6);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
  };

  const validate = () => {
    const result = bankDetailsSchema.safeParse({
      bankAccountNumber: profile.bankAccountNumber,
      sortCode: profile.sortCode,
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
        <h2 className="text-xl font-bold text-text-base">Bank Details</h2>
        <p className="text-gray-500 text-sm mt-1">Printed on invoices so customers can pay you.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Account Number"
          value={profile.bankAccountNumber}
          onChange={e => onChange({ bankAccountNumber: e.target.value.replace(/\D/g, '').slice(0, 8) })}
          error={errors.bankAccountNumber}
          placeholder="12345678"
          inputMode="numeric"
          maxLength={8}
          hint="8-digit UK account number"
        />
        <Input
          label="Sort Code"
          value={profile.sortCode}
          onChange={e => onChange({ sortCode: formatSortCode(e.target.value) })}
          error={errors.sortCode}
          placeholder="12-34-56"
          hint="Format: XX-XX-XX"
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Security note:</strong> Your bank details are stored only on this device and printed on invoices you create. They are never sent to our servers.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" size="lg">← Back</Button>
        <Button onClick={() => { if (validate()) onNext(); }} className="flex-1" size="lg">Continue →</Button>
      </div>
    </div>
  );
}
