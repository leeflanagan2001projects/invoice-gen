'use client';
import { Input } from './Input';
import type { Address } from '@/types/invoice.types';

interface AddressFieldsProps {
  value: Address;
  onChange: (address: Address) => void;
  errors?: Partial<Record<keyof Address, string>>;
  prefix?: string;
}

export function AddressFields({ value, onChange, errors = {}, prefix = '' }: AddressFieldsProps) {
  const update = (field: keyof Address, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Address Line 1"
        value={value.line1}
        onChange={e => update('line1', e.target.value)}
        error={errors.line1}
        placeholder="123 High Street"
        autoComplete={`${prefix}address-line1`}
      />
      <Input
        label="Address Line 2 (optional)"
        value={value.line2 ?? ''}
        onChange={e => update('line2', e.target.value)}
        placeholder="Unit, Building name"
        autoComplete={`${prefix}address-line2`}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="City"
          value={value.city}
          onChange={e => update('city', e.target.value)}
          error={errors.city}
          placeholder="London"
          autoComplete={`${prefix}address-level2`}
        />
        <Input
          label="County (optional)"
          value={value.county ?? ''}
          onChange={e => update('county', e.target.value)}
          placeholder="Essex"
        />
      </div>
      <Input
        label="Postcode"
        value={value.postcode}
        onChange={e => update('postcode', e.target.value.toUpperCase())}
        error={errors.postcode}
        placeholder="SW1A 1AA"
        autoComplete={`${prefix}postal-code`}
        className="uppercase"
      />
    </div>
  );
}
