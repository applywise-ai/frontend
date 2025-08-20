'use client';

import React, { useState, useEffect } from 'react';
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
  X,
  Loader2
} from 'lucide-react';
import SubscriptionModal from '@/app/components/SubscriptionModal';
import { useProfile } from '@/app/contexts/ProfileContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useNotification } from '@/app/contexts/NotificationContext';
import { subscriptionService } from '@/app/services/api';
import { FieldName } from '@/app/types/profile';
import type { GetSubscriptionInfoResponse } from '@/app/services/api/subscription';

interface MembershipPanelProps {
  className?: string;
}

export default function MembershipPanel({ className = '' }: MembershipPanelProps) {
  const { profile } = useProfile();
  const { user } = useAuth();
  const { showSuccess } = useNotification();
  const isPro = profile?.[FieldName.IS_PRO_MEMBER] || false;
  
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showManageSubscription, setShowManageSubscription] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<GetSubscriptionInfoResponse | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewError, setRenewError] = useState<string | null>(null);

  const proFeatures = [
    { icon: Zap, text: 'Unlimited AI Applications', highlight: true },
    { icon: Target, text: 'Advanced Job Matching', highlight: false },
    { icon: FileText, text: 'AI Cover Letter Generation', highlight: false },
    { icon: Calendar, text: 'Auto Apply While Offline', highlight: false },
    { icon: Bot, text: 'Priority Support', highlight: false },
  ];

  // Fetch subscription info when user is pro
  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!isPro) return;
      
      setIsLoadingSubscription(true);
      try {
        const info = await subscriptionService.getSubscriptionInfo();
        setSubscriptionInfo(info);
      } catch (error) {
        console.error('Error fetching subscription info:', error);
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    fetchSubscriptionInfo();
  }, [isPro]);

  const handleCloseSubscriptionModal = async () => {
    try {
      const updatedInfo = await subscriptionService.getSubscriptionInfo();
      setSubscriptionInfo(updatedInfo);
    } catch (error) {
      console.error('Error fetching subscription info:', error);
    } finally {
      setShowSubscriptionModal(false);
    }
  };

  const handleCancelClick = () => {
    setCancelError(null); // Clear any previous errors
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    if (!user?.uid) return;
    
    setIsCanceling(true);
    setCancelError(null); // Clear any previous errors
    
    try {
      const response = await subscriptionService.cancelSubscription(user.uid);
      // Refresh subscription info to show updated status
      const updatedInfo = await subscriptionService.getSubscriptionInfo();
      setSubscriptionInfo(updatedInfo);
      
      // Close all modals
      setShowCancelConfirmation(false);
      setShowManageSubscription(false);
      
      // Show success notification
      showSuccess(`Subscription canceled successfully. You'll have access until ${response.canceled_at}`);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      // Display the error message from the API
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel subscription';
      setCancelError(errorMessage);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleCancelConfirmationClose = () => {
    setCancelError(null); // Clear any errors when closing
    setShowCancelConfirmation(false);
  };

  const handleRenewSubscription = async () => {
    if (!user?.uid) return;
    
    setIsRenewing(true);
    setRenewError(null);
    
    try {
      const response = await subscriptionService.renewSubscription(user.uid);
      // Refresh subscription info to show updated status
      const updatedInfo = await subscriptionService.getSubscriptionInfo();
      setSubscriptionInfo(updatedInfo);
      
      // Show success notification
      showSuccess(`Subscription renewed successfully! ${response.message}`);
    } catch (error) {
      console.error('Error renewing subscription:', error);
      // Display the error message from the API
      const errorMessage = 'Failed to renew subscription';
      setRenewError(errorMessage);
    } finally {
      setIsRenewing(false);
    }
  };

  const handleChangePlan = () => {
    // Close manage dialog and open subscription modal to change plan
    setShowManageSubscription(false);
    setShowSubscriptionModal(true);
  };

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
              <Badge className={`${
                subscriptionInfo?.cancel_at_period_end 
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700' 
                  : 'bg-gradient-to-r from-teal-600 to-teal-700'
              } text-white`}>
                {subscriptionInfo?.cancel_at_period_end ? 'Ending Soon' : 'Active'}
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
        <Dialog open={showManageSubscription} onOpenChange={(open) => {
          if (open) {
            setRenewError(null); // Clear any previous renew errors
          }
          setShowManageSubscription(open);
        }}>
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
                  <Badge className="bg-teal-600 text-white">
                    {subscriptionInfo?.plan_name || 'Pro'}
                  </Badge>
                </div>
                {isLoadingSubscription ? (
                  <div className="space-y-1">
                    <div className="h-4 bg-teal-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-teal-200 rounded animate-pulse w-3/4"></div>
                  </div>
                ) : subscriptionInfo ? (
                  <>
                    <p className="text-sm text-teal-700">
                      {subscriptionInfo.cancel_at_period_end ? 'Ends on: ' : 'Next billing: '} 
                      {subscriptionInfo.renewal_date}
                    </p>
                    <p className="text-sm text-teal-700">
                      ${subscriptionInfo.price.toFixed(2)}/{subscriptionInfo.currency}
                    </p>
                    {subscriptionInfo.cancel_at_period_end && (
                      <p className="text-sm text-amber-700 font-medium mt-2">
                        Your subscription will end on {subscriptionInfo.renewal_date}. You&apos;ll keep access until then.
                      </p>
                    )}
                    {subscriptionInfo.has_pending_update && subscriptionInfo.pending_update && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium mb-1">
                          Plan Update Scheduled
                        </p>
                        <p className="text-sm text-blue-700">
                          Switching to <strong>{subscriptionInfo.pending_update.new_plan_name}</strong> 
                          {' '}(${subscriptionInfo.pending_update.new_price.toFixed(2)}/{subscriptionInfo.pending_update.currency})
                        </p>
                        <p className="text-sm text-blue-700">
                          Effective: {subscriptionInfo.pending_update.effective_date}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-teal-700">Loading subscription details...</p>
                )}
              </div>

              {/* Error display for renew */}
              {renewError && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium">
                    {renewError}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleChangePlan}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Change Plan
                </Button>
                
                {subscriptionInfo?.cancel_at_period_end ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start border-green-200 text-green-600 hover:bg-green-50"
                    onClick={handleRenewSubscription}
                    disabled={isRenewing}
                  >
                    {isRenewing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Renewing...
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Renew Subscription
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleCancelClick}
                    disabled={isCanceling}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelConfirmation} onOpenChange={handleCancelConfirmationClose}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-red-900">
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-2">
                  <X className="h-5 w-5 text-white" />
                </div>
                Cancel Subscription?
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Error display */}
              {cancelError && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium">
                    {cancelError}
                  </p>
                </div>
              )}
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 mb-2">
                  Are you sure you want to cancel your subscription?
                </p>
                {subscriptionInfo && (
                  <p className="text-sm text-red-700 font-medium">
                    You&apos;ll have access to Pro features until {subscriptionInfo.renewal_date}.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelConfirmationClose}
                  disabled={isCanceling}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleConfirmCancel}
                  disabled={isCanceling}
                >
                  {isCanceling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    'Yes, Cancel'
                  )}
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
        onClose={handleCloseSubscriptionModal}
      />
    </>
  );
} 