'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/utils/firebase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.isLoggedIn();
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      {children}
    </div>
  );
} 