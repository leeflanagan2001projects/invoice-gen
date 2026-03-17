'use client';
import { useRef } from 'react';
import { Button } from '@/components/shared/Button';
import type { BusinessProfile } from '@/types/profile.types';

interface Props {
  profile: BusinessProfile;
  onChange: (data: Partial<BusinessProfile>) => void;
  onFinish: () => void;
  onBack: () => void;
  saving: boolean;
}

async function resizeImage(file: File, maxPx = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function StepLogoUpload({ profile, onChange, onFinish, onBack, saving }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const dataUrl = await resizeImage(file, 200);
    onChange({ logoDataUrl: dataUrl });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-text-base">Business Logo</h2>
        <p className="text-gray-500 text-sm mt-1">Optional — appears on your invoices.</p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {profile.logoDataUrl ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.logoDataUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
          </div>
          <Button
            variant="outline"
            onClick={() => { onChange({ logoDataUrl: undefined }); if (fileRef.current) fileRef.current.value = ''; }}
          >
            Remove Logo
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary hover:bg-blue-50 transition-colors min-h-[44px]"
        >
          <div className="text-4xl">📸</div>
          <div className="text-center">
            <p className="font-semibold text-text-base">Upload Logo</p>
            <p className="text-sm text-gray-500">PNG, JPG — max 200×200px</p>
          </div>
        </button>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" size="lg" disabled={saving}>← Back</Button>
        <Button onClick={onFinish} className="flex-1" size="lg" loading={saving} variant="accent">
          {saving ? 'Saving...' : 'Finish Setup'}
        </Button>
      </div>
    </div>
  );
}
