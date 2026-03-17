'use client';
import type { ReminderPreference } from '@/types/invoice.types';

interface ReminderPreferenceProps {
  value: ReminderPreference;
  onChange: (value: ReminderPreference) => void;
}

const OPTIONS: { value: ReminderPreference; label: string; desc: string; icon: string }[] = [
  { value: 'email', label: 'Email', desc: 'Send payment reminders by email', icon: '✉️' },
  { value: 'sms', label: 'SMS', desc: 'Send payment reminders by text message', icon: '📱' },
  { value: 'both', label: 'Email + SMS', desc: 'Send via both channels', icon: '🔔' },
  { value: 'none', label: 'No Reminders', desc: 'Manage manually', icon: '🔕' },
];

export function ReminderPreferenceSelector({ value, onChange }: ReminderPreferenceProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-text-base">Payment Reminders</p>
      <p className="text-xs text-gray-500">Automatic reminders sent every 3 days until paid</p>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              flex flex-col items-start p-3 rounded-xl border-2 transition-colors min-h-[44px]
              ${value === opt.value ? 'border-primary bg-blue-50' : 'border-gray-200 bg-surface hover:border-gray-300'}
            `}
          >
            <span className="text-xl mb-1">{opt.icon}</span>
            <span className="font-semibold text-sm text-text-base">{opt.label}</span>
            <span className="text-xs text-gray-500 mt-0.5">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
