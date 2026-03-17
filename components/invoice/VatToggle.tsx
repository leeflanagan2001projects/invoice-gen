'use client';

interface VatToggleProps {
  vatEnabled: boolean;
  drcMode: boolean;
  onVatChange: (enabled: boolean) => void;
  onDrcChange: (enabled: boolean) => void;
}

export function VatToggle({ vatEnabled, drcMode, onVatChange, onDrcChange }: VatToggleProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-text-base">VAT</p>

      <button
        type="button"
        onClick={() => { onVatChange(!vatEnabled); if (vatEnabled) onDrcChange(false); }}
        className={`
          flex items-center justify-between p-4 rounded-xl border-2 transition-colors min-h-[44px]
          ${vatEnabled ? 'border-primary bg-blue-50' : 'border-gray-200 bg-surface'}
        `}
      >
        <div className="text-left">
          <p className="font-semibold text-text-base">Charge VAT at 20%</p>
          <p className="text-sm text-gray-500">Standard UK VAT rate</p>
        </div>
        <div className={`w-12 h-7 rounded-full transition-colors relative ${vatEnabled ? 'bg-primary' : 'bg-gray-300'}`}>
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${vatEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </div>
      </button>

      {vatEnabled && (
        <button
          type="button"
          onClick={() => onDrcChange(!drcMode)}
          className={`
            flex items-center justify-between p-4 rounded-xl border-2 transition-colors min-h-[44px]
            ${drcMode ? 'border-warning bg-yellow-50' : 'border-gray-200 bg-surface'}
          `}
        >
          <div className="text-left">
            <p className="font-semibold text-text-base">Domestic Reverse Charge</p>
            <p className="text-sm text-gray-500">CIS subcontractors — customer accounts for VAT</p>
          </div>
          <div className={`w-12 h-7 rounded-full transition-colors relative ${drcMode ? 'bg-warning' : 'bg-gray-300'}`}>
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${drcMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
        </button>
      )}

      {drcMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-sm text-yellow-800">
            DRC mode: VAT amount will be £0. Your invoice will include the note: &ldquo;Reverse Charge – Customer to account for VAT to HMRC&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
