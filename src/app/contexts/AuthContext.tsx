'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/app/utils/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      console.log('AuthProvider: Checking authentication status');
      const currentUser = await authService.isLoggedIn();
      setUser(currentUser);
      console.log('AuthProvider: User authenticated:', currentUser ? `${currentUser.uid} (${currentUser.email})` : 'No user');
    } catch (error) {
      console.error('AuthProvider: Error checking authentication:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Set up Firebase auth state listener
  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    const unsubscribe = authService.onAuthStateChanged((user) => {
      console.log('AuthProvider: Auth state changed:', user ? `${user.uid} (${user.email})` : 'No user');
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      
      if ('error' in result) {
        throw new Error(result.message);
      }
      
      const user = result.user;
      setUser(user);
      return user;
    } catch (error) {
      console.error('AuthProvider: Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await authService.logout();
      
      if (result && 'error' in result) {
        throw new Error(result.message);
      }
      
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('AuthProvider: Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Refresh auth state
  const refreshAuth = useCallback(async (): Promise<void> => {
    await checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 