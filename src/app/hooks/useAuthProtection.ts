'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/utils/firebase';

export function useAuthProtection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.isLoggedIn();
        if (user) {
          setIsAuthenticated(true);
        } else {
          // Redirect to login page
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // On error, redirect to login
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isLoading, isAuthenticated };
} 