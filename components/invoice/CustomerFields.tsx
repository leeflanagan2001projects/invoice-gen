'use client';
import { Input } from '@/components/shared/Input';
import { PhoneInput } from '@/components/shared/PhoneInput';
import { AddressFields } from '@/components/shared/AddressFields';
import type { Customer } from '@/types/invoice.types';
import type { Address } from '@/types/invoice.types';

interface CustomerFieldsProps {
  value: Customer;
  onChange: (customer: Customer) => void;
  errors?: Partial<Record<string, string>>;
}

export function CustomerFields({ value, onChange, errors = {} }: CustomerFieldsProps) {
  const update = (field: keyof Customer, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Customer Name"
          value={value.name}
          onChange={e => update('name', e.target.value)}
          error={errors['customer.name'] ?? errors.name}
          placeholder="Jane Davies"
          autoComplete="name"
        />
        <Input
          label="Company (optional)"
          value={value.company ?? ''}
          onChange={e => update('company', e.target.value)}
          placeholder="Davies Construction Ltd"
          autoComplete="organization"
        />
      </div>

      <Input
        label="Customer Email"
        type="email"
        value={value.email}
        onChange={e => update('email', e.target.value)}
        error={errors['customer.email'] ?? errors.email}
        placeholder="jane@example.co.uk"
        autoComplete="email"
        inputMode="email"
      />

      <PhoneInput
        label="Customer Phone (optional)"
        value={value.phone ?? ''}
        onChange={phone => onChange({ ...value, phone })}
      />

      <div className="mt-1">
        <p className="text-sm font-semibold text-text-base mb-3">Customer Address</p>
        <AddressFields
          value={value.address}
          onChange={(address: Address) => onChange({ ...value, address })}
          errors={{
            postcode: errors['customer.address.postcode'],
          }}
        />
      </div>
    </div>
  );
}
