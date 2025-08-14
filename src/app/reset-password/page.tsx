'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { authService } from '@/app/services/firebase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('oobCode');

  useEffect(() => {
    const verifyCode = async () => {
      if (!code) {
        setError('Invalid or missing reset code. Please request a new password reset link.');
        return;
      }

      try {
        const result = await authService.verifyPasswordResetCode(code);
        if (typeof result === 'string') {
          setEmail(result);
        } else {
          setError(result.message);
        }
      } catch (err: any) {
        setError('Invalid or expired reset code. Please request a new password reset link.');
      }
    };

    verifyCode();
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await authService.confirmPasswordReset(code, password);
      if (result && 'error' in result) {
        setError(result.message);
      } else {
        setSuccess('Password has been reset successfully!');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gray-900 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900 z-0"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="w-full max-w-xl space-y-8 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Link href="/">
            <Image 
              src="/images/logo_icon.png"
              alt="Logo"
              width={80}
              height={80}
              className="mb-2 hover:opacity-80 transition-opacity"
            />
          </Link>
          <h1 className="text-center text-3xl font-bold text-white">Reset your password</h1>
          {email && (
            <p className="text-center text-sm text-white/70">
              Reset password for {email}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-2 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border-gray-300 text-[#0a2540] placeholder-gray-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white border-gray-300 text-[#0a2540] placeholder-gray-500"
              disabled={loading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white text-gray-900 hover:bg-blue-200 font-bold"
            disabled={loading || !code}
          >
            {loading ? 'Resetting password...' : 'Reset Password'}
          </Button>

          <Link href="/login" className="block w-full text-center text-white underline hover:text-blue-300">
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
} 