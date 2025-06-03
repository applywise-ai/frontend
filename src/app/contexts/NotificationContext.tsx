'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationState {
  message: string;
  isVisible: boolean;
}

interface NotificationContextType {
  notification: NotificationState;
  showSuccess: (message: string) => void;
  hideSuccess: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    isVisible: false,
  });

  const showSuccess = (message: string) => {
    setNotification({
      message,
      isVisible: true,
    });
  };

  const hideSuccess = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false,
    }));
  };

  return (
    <NotificationContext.Provider value={{ notification, showSuccess, hideSuccess }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 