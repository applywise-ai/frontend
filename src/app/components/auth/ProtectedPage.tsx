'use client';

import { ReactNode } from 'react';
import { useAuthProtection } from '@/app/hooks/useAuthProtection';
import LoadingScreen from '@/app/components/loading/LoadingScreen';

interface ProtectedPageProps {
  children: ReactNode;
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const { isLoading, isAuthenticated } = useAuthProtection();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // This will be handled by the redirect in useAuthProtection
    return <LoadingScreen />;
  }

  return <>{children}</>;
} 