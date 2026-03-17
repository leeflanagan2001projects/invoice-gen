'use client';
import { Input } from './Input';

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function PhoneInput({ label = 'Phone Number', value, onChange, error, required }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d+\s()-]/g, '');
    onChange(val);
  };

  return (
    <Input
      label={label}
      type="tel"
      value={value}
      onChange={handleChange}
      error={error}
      required={required}
      placeholder="07700 900000"
      autoComplete="tel"
      inputMode="tel"
    />
  );
}
