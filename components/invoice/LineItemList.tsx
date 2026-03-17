'use client';
import { v4 as uuidv4 } from 'uuid';
import { LineItemRow } from './LineItemRow';
import { Button } from '@/components/shared/Button';
import type { LineItem } from '@/types/invoice.types';

interface LineItemListProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

const newItem = (): LineItem => ({
  id: uuidv4(),
  description: '',
  quantity: 1,
  unitPrice: 0,
  subtotal: 0,
});

export function LineItemList({ items, onChange }: LineItemListProps) {
  const update = (idx: number, item: LineItem) => {
    const updated = [...items];
    updated[idx] = item;
    onChange(updated);
  };

  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const add = () => {
    onChange([...items, newItem()]);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-text-base">Line Items</p>
      {items.map((item, idx) => (
        <LineItemRow
          key={item.id}
          item={item}
          onChange={item => update(idx, item)}
          onRemove={() => remove(idx)}
          showRemove={items.length > 1}
        />
      ))}
      <Button variant="outline" onClick={add} fullWidth>
        + Add Line Item
      </Button>
    </div>
  );
}
