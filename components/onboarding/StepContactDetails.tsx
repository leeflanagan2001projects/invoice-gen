'use client';
import { useState } from 'react';
import { contactDetailsSchema } from '@/lib/validation/profileSchema';
import { Input } from '@/components/shared/Input';
import { PhoneInput } from '@/components/shared/PhoneInput';
import { AddressFields } from '@/components/shared/AddressFields';
import { Button } from '@/components/shared/Button';
import type { BusinessProfile } from '@/types/profile.types';
import type { Address } from '@/types/invoice.types';

interface Props {
  profile: BusinessProfile;
  onChange: (data: Partial<BusinessProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepContactDetails({ profile, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = contactDetailsSchema.safeParse({
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
    });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(i => {
        const path = i.path.join('.');
        errs[path] = i.message;
      });
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
        <h2 className="text-xl font-bold text-text-base">Contact Details</h2>
        <p className="text-gray-500 text-sm mt-1">How customers and HMRC can reach you.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          value={profile.email}
          onChange={e => onChange({ email: e.target.value })}
          error={errors.email}
          placeholder="john@smithelectrical.co.uk"
          autoComplete="email"
          inputMode="email"
        />
        <PhoneInput
          value={profile.phone}
          onChange={phone => onChange({ phone })}
          error={errors.phone}
          required
        />

        <div className="mt-2">
          <p className="text-sm font-semibold text-text-base mb-3">Business Address</p>
          <AddressFields
            value={profile.address}
            onChange={(address: Address) => onChange({ address })}
            errors={{
              line1: errors['address.line1'],
              city: errors['address.city'],
              postcode: errors['address.postcode'],
            }}
            prefix="billing-"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" size="lg">← Back</Button>
        <Button onClick={handleNext} className="flex-1" size="lg">Continue →</Button>
      </div>
    </div>
  );
}
