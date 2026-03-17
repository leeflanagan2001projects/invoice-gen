'use client';
import { formatPence } from '@/lib/formatters/currency';

interface InvoiceSummaryProps {
  subtotal: number;
  vatAmount: number;
  total: number;
  vatEnabled: boolean;
  drcMode: boolean;
}

export function InvoiceSummary({ subtotal, vatAmount, total, vatEnabled, drcMode }: InvoiceSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal (net)</span>
          <span className="font-medium">{formatPence(subtotal)}</span>
        </div>

        {vatEnabled && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {drcMode ? 'VAT (Reverse Charge)' : 'VAT (20%)'}
            </span>
            <span className="font-medium">{drcMode ? '£0.00' : formatPence(vatAmount)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="font-bold text-text-base">Total</span>
          <span className="font-bold text-xl text-primary">{formatPence(total)}</span>
        </div>
      </div>

      {drcMode && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 italic">
            Reverse Charge – Customer to account for VAT to HMRC
          </p>
        </div>
      )}
    </div>
  );
}
