'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/app/components/loading/LoadingScreen';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
          router.push('/jobs');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await login(formData.email, formData.password);
      router.push('/jobs');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll import authService directly for Google auth
      // TODO: Add Google auth to AuthContext
      const { authService } = await import('@/app/services/firebase');
    const result = await authService.googleAuth();
    
    if ('error' in result) {
      setError(result.message);
      setLoading(false);
    } else {
      router.push('/jobs');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign-in failed');
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
          <h1 className="text-center text-3xl font-bold text-white">Sign in to your account</h1>
          <p className="text-center text-sm text-white/70">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-white underline hover:text-blue-300">
              Sign up
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm">
            {error}
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
              value={formData.email}
              onChange={handleChange}
              className="bg-white border-gray-300 text-[#0a2540] placeholder-gray-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Link href="/forgot-password" className="text-xs text-white underline hover:text-blue-300">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
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
            {loading ? 'Logging in...' : 'Sign in'}
          </Button>

          <div className="relative flex items-center justify-center gap-4">
            <Separator className="flex-1 bg-white/20" />
            <span className="text-sm text-white/70">or</span>
            <Separator className="flex-1 bg-white/20" />
          </div>

          <Button 
            type="button" 
            variant="social" 
            className="w-full bg-white text-[#0a2540] border border-white hover:bg-blue-100"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </form>
      </div>
    </div>
  );
} 