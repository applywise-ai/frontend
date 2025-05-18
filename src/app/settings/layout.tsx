'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/app/utils/firebase/auth';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.isLoggedIn();
        
        // Redirect to login if not authenticated
        if (!user) {
          router.push('/login');
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      {children}
    </div>
  );
} 