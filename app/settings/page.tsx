'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/profileStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useUIStore } from '@/store/uiStore';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { AddressFields } from '@/components/shared/AddressFields';
import { PhoneInput } from '@/components/shared/PhoneInput';
import { getAuthEmail } from '@/lib/db/auth';
import { clearSession } from '@/lib/auth/session';
import type { Address } from '@/types/invoice.types';

export default function SettingsPage() {
  const router = useRouter();
  const { profile, loadProfile, saveProfile } = useProfileStore();
  const { settings, loadSettings, updateSettings } = useSettingsStore();
  const { addToast } = useUIStore();

  const [saving, setSaving] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const [paymentTerms, setPaymentTerms] = useState(settings?.defaultPaymentTermsDays ?? 30);
  const [reminderInterval, setReminderInterval] = useState(settings?.reminderIntervalDays ?? 3);
  const [authEmail, setAuthEmail] = useState<string | undefined>(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadProfile(); loadSettings(); getAuthEmail().then(setAuthEmail); }, []);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  useEffect(() => {
    if (settings) {
      setPaymentTerms(settings.defaultPaymentTermsDays);
      setReminderInterval(settings.reminderIntervalDays);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!localProfile) return;
    setSaving(true);
    try {
      await saveProfile(localProfile);
      await updateSettings({
        defaultPaymentTermsDays: paymentTerms,
        reminderIntervalDays: reminderInterval,
        defaultVatEnabled: localProfile.vatRegistered,
      });
      addToast({ type: 'success', message: 'Settings saved' });
    } catch {
      addToast({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const update = (field: string, value: string | boolean) => {
    setLocalProfile(p => p ? { ...p, [field]: value } : p);
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  if (!localProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-primary text-white px-4 pt-10 pb-4 flex items-center gap-3">
        <Link href="/dashboard">
          <button className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-xl">
            ←
          </button>
        </Link>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Business Profile */}
        <section className="bg-surface rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-bold text-text-base">Business Profile</h2>
          <Input label="Owner Name" value={localProfile.ownerName} onChange={e => update('ownerName', e.target.value)} />
          <Input label="Business Name" value={localProfile.businessName} onChange={e => update('businessName', e.target.value)} />
          <Input label="Email" type="email" value={localProfile.email} onChange={e => update('email', e.target.value)} inputMode="email" />
          <PhoneInput value={localProfile.phone} onChange={v => update('phone', v)} />
          <AddressFields
            value={localProfile.address}
            onChange={(address: Address) => setLocalProfile(p => p ? { ...p, address } : p)}
          />
        </section>

        {/* Bank Details */}
        <section className="bg-surface rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-bold text-text-base">Bank Details</h2>
          <Input
            label="Account Number"
            value={localProfile.bankAccountNumber}
            onChange={e => update('bankAccountNumber', e.target.value.replace(/\D/g, '').slice(0, 8))}
            inputMode="numeric"
          />
          <Input
            label="Sort Code"
            value={localProfile.sortCode}
            onChange={e => update('sortCode', e.target.value)}
            placeholder="XX-XX-XX"
          />
        </section>

        {/* VAT */}
        <section className="bg-surface rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-bold text-text-base">VAT Settings</h2>
          <button
            type="button"
            onClick={() => update('vatRegistered', !localProfile.vatRegistered)}
            className={`
              flex items-center justify-between w-full p-4 rounded-xl border-2 transition-colors min-h-[44px]
              ${localProfile.vatRegistered ? 'border-primary bg-blue-50' : 'border-gray-200'}
            `}
          >
            <span className="font-semibold">VAT Registered</span>
            <div className={`w-12 h-7 rounded-full relative ${localProfile.vatRegistered ? 'bg-primary' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${localProfile.vatRegistered ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </button>
          {localProfile.vatRegistered && (
            <Input
              label="VAT Number"
              value={localProfile.vatNumber ?? ''}
              onChange={e => update('vatNumber', e.target.value.toUpperCase())}
              placeholder="GB123456789"
            />
          )}
        </section>

        {/* Invoice Defaults */}
        <section className="bg-surface rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-bold text-text-base">Invoice Defaults</h2>
          <Input
            label="Default Payment Terms (days)"
            type="number"
            inputMode="numeric"
            min="1"
            max="365"
            value={paymentTerms}
            onChange={e => setPaymentTerms(Number(e.target.value))}
          />
          <Input
            label="Reminder Interval (days)"
            type="number"
            inputMode="numeric"
            min="1"
            max="30"
            value={reminderInterval}
            onChange={e => setReminderInterval(Number(e.target.value))}
            hint="How often to send payment reminders"
          />
        </section>
        {/* Account */}
        <section className="bg-surface rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-bold text-text-base">Account</h2>
          {authEmail && <p className="text-sm text-gray-500">Logged in as {authEmail}</p>}
          <Button variant="danger" fullWidth onClick={handleLogout}>Log Out</Button>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <Button onClick={handleSave} loading={saving} fullWidth variant="primary" size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
