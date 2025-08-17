'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, CreditCard, X, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';

interface NoCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function NoCreditsModal({ 
  isOpen, 
  onClose, 
  onUpgrade
}: NoCreditsModalProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      
      // Get the user's timezone offset in minutes
      const userTimezoneOffset = now.getTimezoneOffset();
      
      // EST is UTC-4 (240 minutes behind UTC)
      const estOffset = 240; // 4 hours * 60 minutes

      // Calculate the difference between user's timezone and EST
      const timezoneDifference = userTimezoneOffset - estOffset;
      
      // Get tomorrow at 12am EST in the user's local time
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      // Adjust for timezone difference to get when it will be 12am EST
      const tomorrowEST = new Date(tomorrow.getTime() + (timezoneDifference * 60 * 1000));

      const difference = tomorrowEST.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('00:00:00');
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              No AI Credits Left
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            You&apos;ve used all your AI credits for today. <strong>10</strong> credits refresh daily at 12am EST.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Credits Display */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  Credits Remaining
                </span>
              </div>
              <span className="text-lg font-bold text-amber-700">
                0
              </span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Next refresh in:
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-700 font-mono">
                {timeLeft}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Daily at 12:00 AM EST
              </p>
            </div>
          </div>

          {/* Upgrade Prompt */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-teal-100 rounded-lg p-2 flex-shrink-0">
                <CreditCard className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <h3 className="font-medium text-teal-900 mb-1">
                  Want more? Upgrade to Pro
                </h3>
                <p className="text-sm text-teal-700">
                  Get unlimited AI credits and never wait for daily resets
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            <Button
              onClick={onUpgrade}
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 