'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { 
  Crown, 
  Zap, 
  Target, 
  FileText, 
  Calendar, 
  Bot, 
  Settings,
  CreditCard,
  X
} from 'lucide-react';
import SubscriptionModal from '@/app/components/SubscriptionModal';

interface MembershipPanelProps {
  isPro: boolean;
  className?: string;
}

export default function MembershipPanel({ isPro, className = '' }: MembershipPanelProps) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showManageSubscription, setShowManageSubscription] = useState(false);

  const proFeatures = [
    { icon: Zap, text: 'Unlimited AI Applications', highlight: true },
    { icon: Target, text: 'Advanced Job Matching', highlight: false },
    { icon: FileText, text: 'AI Cover Letter Generation', highlight: false },
    { icon: Calendar, text: 'Auto Apply While Offline', highlight: false },
    { icon: Bot, text: 'Priority Support', highlight: false },
  ];

  if (isPro) {
    return (
      <>
        <Card className={`bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200 shadow-lg ${className}`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-2">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-teal-900">Pro Member</CardTitle>
                  <p className="text-sm text-teal-700">Active subscription</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-teal-900 text-sm">Your Benefits:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {proFeatures.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <feature.icon className="h-4 w-4 text-teal-600" />
                    <span className="text-sm text-teal-800">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 border-t border-teal-200">
              <Button
                onClick={() => setShowManageSubscription(true)}
                variant="outline"
                className="w-full border-teal-300 text-teal-700 hover:bg-teal-100"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manage Subscription Dialog */}
        <Dialog open={showManageSubscription} onOpenChange={setShowManageSubscription}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-2">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                Manage Subscription
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-teal-900">Current Plan</span>
                  <Badge className="bg-teal-600 text-white">Pro Monthly</Badge>
                </div>
                <p className="text-sm text-teal-700">Next billing: January 15, 2024</p>
                <p className="text-sm text-teal-700">$19.99/month</p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    // Handle change plan
                    setShowManageSubscription(false);
                    setShowSubscriptionModal(true);
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Change Plan
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    // Handle cancel subscription
                    console.log('Cancel subscription');
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        />
      </>
    );
  }

  // Non-Pro Member Card
  return (
    <>
      <Card className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-2">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-blue-900">Free Member</CardTitle>
              <p className="text-sm text-blue-700">Upgrade to unlock premium features</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-900 text-sm">Pro Features:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {proFeatures.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <feature.icon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-4 border-t border-blue-200">
            <Button
              onClick={() => setShowSubscriptionModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
} 