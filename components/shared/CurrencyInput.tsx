'use client';
import React, { useState } from 'react';
import { poundsToPence, penceToPounds } from '@/lib/formatters/currency';

interface CurrencyInputProps {
  label?: string;
  error?: string;
  valuePence: number;
  onChange: (pence: number) => void;
  disabled?: boolean;
}

export function CurrencyInput({ label, error, valuePence, onChange, disabled }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(
    valuePence > 0 ? penceToPounds(valuePence).toFixed(2) : ''
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    onChange(poundsToPence(raw));
  };

  const handleBlur = () => {
    const pence = poundsToPence(displayValue);
    setDisplayValue(pence > 0 ? penceToPounds(pence).toFixed(2) : '');
    onChange(pence);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-text-base">{label}</label>}
      <div className={`
        flex items-center border rounded-xl bg-surface overflow-hidden
        ${error ? 'border-danger' : 'border-gray-300'}
      `}>
        <span className="pl-4 pr-2 text-gray-500 font-medium">£</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className="flex-1 py-3 pr-4 text-base bg-transparent focus:outline-none min-h-[44px]"
          placeholder="0.00"
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
