'use client';

import { useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';
import SubscriptionModal from '@/app/components/SubscriptionModal';

interface SubscriptionCardProps {
  aiAppliesLeft: number;
  onAIApplyClick?: () => void;
  applicationId?: string;
}

export default function SubscriptionCard({ 
  aiAppliesLeft, 
  onAIApplyClick,
  applicationId 
}: SubscriptionCardProps) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  return (
    <>
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-2 shadow-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {aiAppliesLeft} AI Applies Left
                  </span>
                  <Zap className="h-4 w-4 text-teal-600" />
                </div>
                <p className="text-xs text-gray-600">
                  AI autofills your entire application instantly
                </p>
                <p className="text-xs text-gray-600">
                  Want more?{' '}
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="text-teal-600 hover:text-teal-700 underline font-medium transition-colors"
                  >
                    Upgrade to Pro →
                  </button>
                </p>
              </div>
            </div>
            <AnimatedApplyButton
              size="sm"
              buttonText="AI Apply"
              icon={Sparkles}
              onClick={onAIApplyClick}
              applicationId={applicationId}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
} 