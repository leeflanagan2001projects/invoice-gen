'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { registerUser } from '@/lib/db/auth';
import { setSession } from '@/lib/auth/session';
import { getBusinessProfile } from '@/lib/db/businessProfile';

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  useEffect(() => {
    getBusinessProfile().then(p => setHasExistingProfile(!!p));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password);
      setSession(email);
      const profile = await getBusinessProfile();
      router.replace(profile ? '/dashboard' : '/onboarding');
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'ConstraintError') {
        setError('An account already exists on this device');
      } else {
        setError('Failed to create account. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-white px-4 pt-10 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
          <span className="text-2xl font-bold">£</span>
        </div>
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-blue-200 text-sm mt-1">Keep your invoices secure</p>
      </div>

      <div className="flex-1 px-4 py-6 space-y-4">
        {hasExistingProfile && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm text-blue-800 font-semibold mb-1">Welcome back</p>
            <p className="text-sm text-blue-700">
              To keep your data secure, please create a password. Your invoices and business details are safe.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            hint="Minimum 8 characters"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}
