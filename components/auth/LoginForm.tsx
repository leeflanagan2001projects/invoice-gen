'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { loginUser } from '@/lib/db/auth';
import { setSession } from '@/lib/auth/session';
import { getBusinessProfile } from '@/lib/db/businessProfile';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const record = await loginUser(email, password);
      if (!record) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }
      setSession(record.email);
      const profile = await getBusinessProfile();
      router.replace(profile ? '/dashboard' : '/onboarding');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-white px-4 pt-10 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
          <span className="text-2xl font-bold">£</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-blue-200 text-sm mt-1">Sign in to your account</p>
      </div>

      <div className="flex-1 px-4 py-6 space-y-4">
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
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            Sign In
          </Button>
        </form>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-gray-700 mb-1">Forgot your password?</p>
          <p className="text-sm text-gray-500">
            As this app stores data locally, passwords cannot be recovered. You can reset by clearing app data in your browser settings.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500">
          No account?{' '}
          <Link href="/register" className="text-primary font-semibold">
            Register instead
          </Link>
        </p>
      </div>
    </div>
  );
}
