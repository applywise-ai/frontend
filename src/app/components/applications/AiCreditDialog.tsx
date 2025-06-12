'use client';

import React from 'react';
import { Sparkles, CreditCard, Zap, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { useProfile } from '@/app/contexts/ProfileContext';
import { FieldName } from '@/app/types/profile';

interface AiCreditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onUpgrade: () => void;
}

export function AiCreditDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onUpgrade
}: AiCreditDialogProps) {
  const { profile } = useProfile();
  const creditsRemaining = profile?.[FieldName.AI_CREDITS] || 0;
  const hasCredits = creditsRemaining > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              AI Response Generation
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            {hasCredits 
              ? "Are you sure you would like to generate an AI response? This will use one of your AI credits."
              : "You have no AI credits remaining. Upgrade your plan to continue using AI-powered features."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {hasCredits ? (
            <>
              {/* Credits Display */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-teal-600" />
                    <span className="text-sm font-medium text-teal-800">
                      Credits Remaining
                    </span>
                  </div>
                  <span className="text-lg font-bold text-teal-700">
                    {creditsRemaining}
                  </span>
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
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* No Credits Display */}
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

              {/* Upgrade Prompt */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">
                      Upgrade to Pro
                    </h3>
                    <p className="text-sm text-blue-700">
                      Get unlimited AI credits and premium features
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
                  Cancel
                </Button>
                <Button
                  onClick={onUpgrade}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 