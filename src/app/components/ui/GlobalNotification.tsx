'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useNotification } from '@/app/contexts/NotificationContext';

export function GlobalNotification() {
  const { notification, hideSuccess } = useNotification();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (notification.isVisible) {
      setIsAnimating(true);
      
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to complete before calling hideSuccess
    setTimeout(() => {
      hideSuccess();
    }, 300);
  };

  if (!notification.isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-[99999] flex justify-center pt-4 px-4 pointer-events-none">
      <div
        className={`
          bg-teal-600 text-white rounded-lg shadow-xl border border-teal-500
          max-w-sm w-full mx-auto px-3 py-2.5 flex items-center gap-2.5
          transform transition-all duration-300 ease-out pointer-events-auto
          ${isAnimating 
            ? 'translate-y-0 opacity-100 scale-100' 
            : '-translate-y-full opacity-0 scale-95'
          }
        `}
      >
        {/* Success Icon */}
        <div className="flex-shrink-0">
          <CheckCircle className="h-4 w-4 text-teal-100" />
        </div>
        
        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white leading-relaxed truncate">
            {notification.message}
          </p>
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 h-6 w-6 p-0 hover:bg-teal-700 text-teal-100 hover:text-white rounded-sm transition-colors flex items-center justify-center"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
} 