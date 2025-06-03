'use client';

import React from 'react';
import { Sparkles, CreditCard, Zap, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface AiCreditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onUpgrade: () => void;
  creditsRemaining: number;
}

export function AiCreditDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onUpgrade, 
  creditsRemaining 
}: AiCreditDialogProps) {
  if (!isOpen) return null;

  const hasCredits = creditsRemaining > 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-auto transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="relative p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                AI Response Generation
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {hasCredits ? (
              <>
                <p className="text-gray-600 mb-4">
                  Are you sure you would like to generate an AI response? This will use one of your AI credits.
                </p>
                
                {/* Credits Display */}
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-lg p-4 mb-6">
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
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
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
                <p className="text-gray-600 mb-4">
                  You have no AI credits remaining. Upgrade your plan to continue using AI-powered features.
                </p>
                
                {/* No Credits Display */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
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
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
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
        </div>
      </div>
    </>
  );
} 