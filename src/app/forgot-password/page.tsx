'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { authService } from '@/app/utils/firebase';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/app/components/LoadingScreen';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.isLoggedIn();
        if (user) {
          router.push('/jobs');
          return;
        }
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await authService.sendPasswordResetEmail(email);
      if (result && 'error' in result) {
        setError(result.message);
      } else {
        setSuccess('Password reset email sent! Please check your inbox.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send password reset email.');
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
          <h1 className="text-center text-3xl font-bold text-white">Forgot your password?</h1>
          <p className="text-center text-sm text-white/70">
            Enter your email and we&apos;ll send you a reset link.
          </p>
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
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={handleChange}
              className="bg-white border-gray-300 text-[#0a2540] placeholder-gray-500"
              disabled={loading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white text-gray-900 hover:bg-blue-200 font-bold"
            disabled={loading}
          >
            {loading ? 'Sending reset link...' : 'Send reset link'}
          </Button>

          <div className="relative flex items-center justify-center gap-4">
            <Separator className="flex-1 bg-white/20" />
            <span className="text-sm text-white/70">or</span>
            <Separator className="flex-1 bg-white/20" />
          </div>

          <Link href="/login" className="block w-full text-center text-white underline hover:text-blue-300">
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
} 