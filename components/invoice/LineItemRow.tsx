'use client';
import { Input } from '@/components/shared/Input';
import { CurrencyInput } from '@/components/shared/CurrencyInput';
import { formatPence } from '@/lib/formatters/currency';
import type { LineItem } from '@/types/invoice.types';

interface LineItemRowProps {
  item: LineItem;
  onChange: (item: LineItem) => void;
  onRemove: () => void;
  showRemove: boolean;
}

export function LineItemRow({ item, onChange, onRemove, showRemove }: LineItemRowProps) {
  const update = (field: keyof LineItem, value: string | number) => {
    const updated = { ...item, [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      updated.subtotal = Math.round(Number(updated.quantity) * Number(updated.unitPrice));
    }
    onChange(updated);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Line Item</p>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-danger text-lg hover:bg-red-50 rounded-lg"
          >
            ✕
          </button>
        )}
      </div>

      <Input
        label="Description"
        value={item.description}
        onChange={e => update('description', e.target.value)}
        placeholder="Labour – electrical installation"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Quantity"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.5"
          value={item.quantity === 0 ? '' : item.quantity}
          onChange={e => update('quantity', parseFloat(e.target.value) || 0)}
          placeholder="1"
        />
        <CurrencyInput
          label="Unit Price"
          valuePence={item.unitPrice}
          onChange={pence => update('unitPrice', pence)}
        />
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-200">
        <span className="text-sm text-gray-500">Subtotal</span>
        <span className="font-bold text-text-base">{formatPence(item.subtotal)}</span>
      </div>
    </div>
  );
}
