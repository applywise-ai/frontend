'use client';

import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useProfile } from '@/app/contexts/ProfileContext';
import { FieldName } from '@/app/types/profile';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';

interface SubscriptionCardProps {
  onUpgrade: () => void;
  jobId?: string;
  hasApplied?: boolean;
}

export default function SubscriptionCard({
  onUpgrade,
  jobId,
  hasApplied = false,
}: SubscriptionCardProps) {
  const { profile, isLoading } = useProfile();
  const aiCredits = profile?.[FieldName.AI_CREDITS] || 0;

  // Don't show the card if user is a pro member or while loading
  if (isLoading || profile?.[FieldName.IS_PRO_MEMBER]) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-100 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-teal-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {aiCredits === 0 ? 'Get 3.2x More Interviews' : `${aiCredits} AI Applications Left Today`}
              </h3>
              <p className="text-xs text-gray-600">
                {aiCredits === 0 
                  ? 'Pro members get significantly more interviews with AI-powered applications'
                  : 'AI autofills your entire application instantly'
                }
              </p>
              {aiCredits > 0 ? (
                <button
                  onClick={onUpgrade}
                  className="text-xs text-teal-600 hover:text-teal-700 underline font-medium transition-colors mt-1"
                >
                  Want more? Upgrade →
                </button>
              ) : (
                <button
                  onClick={onUpgrade}
                  className="text-xs text-teal-600 hover:text-teal-700 underline font-medium transition-colors mt-1"
                >
                  See how Pro members succeed →
                </button>
              )}
            </div>
          </div>
          
          {/* Button section on the right */}
          <div className="flex-shrink-0">
            {aiCredits > 0 && jobId ? (
              !hasApplied && (
                <AnimatedApplyButton 
                  jobId={jobId}
                  buttonText="AI Apply"
                  icon={Sparkles}
                  size="sm"
                />
              )
            ) : (
              <button
                onClick={onUpgrade}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                {aiCredits === 0 ? 'Unlock AI Applications' : 'Upgrade to Pro'}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 