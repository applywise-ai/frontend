'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export function useAuthProtection() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're done loading and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log('useAuthProtection: User not authenticated, redirecting to login');
          router.push('/login');
        }
  }, [isLoading, isAuthenticated, router]);

  return { isLoading, isAuthenticated };
} 