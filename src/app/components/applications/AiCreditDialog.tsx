'use client';

import React from 'react';
import { Crown, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';

interface ProFeatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function ProFeatureDialog({ 
  isOpen, 
  onClose, 
  onUpgrade
}: ProFeatureDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg p-2">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Pro Feature
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            Unlock the power of AI-generated responses that increase your application success rate by 3x!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Pro Benefits */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-teal-100 rounded-lg p-2 flex-shrink-0">
                <Crown className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <h3 className="font-medium text-teal-900 mb-1">
                  Unlock Pro AI Features
                </h3>
                <p className="text-sm text-teal-700 mb-2">
                  Join with other successful applicants using AI-powered applications
                </p>
                <ul className="text-xs text-teal-600 space-y-1">
                  <li>• Unlimited AI-applies</li>
                  <li>• More accurate and personalized applications</li>
                  <li>• Custom AI-generated responses</li>
                  <li>• Cover letter generation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Success Stats */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">
                  Pro Member Results
                </span>
              </div>
              <p className="text-xs text-green-600">
                Pro members get <span className="font-semibold">3x more interviews</span> with AI-generated responses
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={onUpgrade}
              className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 