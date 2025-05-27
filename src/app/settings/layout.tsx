'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/utils/firebase';
import LoadingScreen from '@/app/components/loading/LoadingScreen';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.isLoggedIn();
        if (!user) {
          router.push('/login');
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      {children}
    </div>
  );
} 