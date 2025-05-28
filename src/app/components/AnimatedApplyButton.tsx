'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, CheckCircle2 } from 'lucide-react';
import ReviewApplicationModal from './ReviewApplicationModal';
import ProfileCompletionAlert, { ProfileCompletionState } from './ProfileCompletionAlert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
// import { getProfileCompletionState } from '@/app/utils/profile';

interface AnimatedApplyButtonProps {
  onClick?: () => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  applicationId?: string;
  buttonText?: string;
}

export default function AnimatedApplyButton({ 
  onClick, 
  className = '', 
  size = 'md',
  fullWidth = false,
  applicationId = 'temp-123',
  buttonText = 'Quick Apply'
}: AnimatedApplyButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'review'>('idle');
  const [open, setOpen] = useState(false);
  const [profileAlertOpen, setProfileAlertOpen] = useState(false);
  const [profileState, setProfileState] = useState<ProfileCompletionState>('complete');

  const checkProfileCompletion = async () => {
    // Simulate API delay
    // await new Promise(resolve => setTimeout(resolve, 500));
    // return getProfileCompletionState(profile);
    return 'complete'
  };

  const handleClick = async () => {
    if (state !== 'idle') return;
    setState('loading');
    
    try {
      const profileState = await checkProfileCompletion();
      setProfileState(profileState as ProfileCompletionState);
      
      if (profileState === 'incomplete') {
        setProfileAlertOpen(true);
        setState('idle');
        return;
      }
      
      if (profileState === 'partial') {
        setProfileAlertOpen(true);
        setState('idle');
        return;
      }
      
      // If profile is complete, proceed with application
      await new Promise(resolve => setTimeout(resolve, 1500));
      setState('review');
      setOpen(true);
      onClick?.();
    } catch (error) {
      console.error('Error checking profile completion:', error);
      setState('idle');
    }
  };

  const handleReviewClick = () => {
    setOpen(true);
  };

  const handleContinueAnyway = () => {
    setProfileAlertOpen(false);
    setState('review');
    setOpen(true);
    onClick?.();
  };

  const sizeClasses = {
    xs: 'h-8 px-3 text-sm',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <>
      <motion.button
        onClick={state === 'review' ? handleReviewClick : handleClick}
        className={`
          inline-flex items-center justify-center
          border border-transparent font-medium rounded-lg shadow-lg
          text-white bg-gradient-to-r from-teal-600 to-teal-700 
          hover:from-teal-700 hover:to-teal-800 hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
          transition-all duration-200 transform hover:-translate-y-0.5
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        whileTap={{ scale: 0.98 }}
        disabled={state === 'loading'}
        style={{ minHeight: undefined }}
      >
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="apply"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center"
            >
              <Zap className="mr-2 h-4 w-4" />
              {buttonText}
            </motion.div>
          )}

          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying...
            </motion.div>
          )}

          {state === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Review
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <ReviewApplicationModal
        open={open}
        setOpen={setOpen}
        onCancel={() => setState('idle')}
        onSubmit={() => setState('idle')}
        applicationId={applicationId}
      />

      <Dialog open={profileAlertOpen} onOpenChange={setProfileAlertOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-lg border border-gray-100">
          <DialogHeader className="space-y-3 pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">Profile Status</DialogTitle>
          </DialogHeader>
          <div className="px-1">
            <ProfileCompletionAlert
              state={profileState}
              onContinue={handleContinueAnyway}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 