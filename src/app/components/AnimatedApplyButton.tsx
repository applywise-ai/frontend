'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, LucideIcon, Sparkles } from 'lucide-react';
import { useReviewApplicationModal } from '@/app/contexts/ReviewApplicationModalContext';
import ProfileCompletionAlert, { ProfileCompletionState } from './profile/ProfileCompletionAlert';
import { useProfile } from '@/app/contexts/ProfileContext';
import { useApplications } from '@/app/contexts/ApplicationsContext';
import { FieldName, UserProfile } from '@/app/types/profile';
import { NoCreditsModal } from '@/app/components/applications/NoCreditsModal';
import storageService from '@/app/services/firebase/storage';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { getProfileCompletionState } from '@/app/utils/profile';
import { useRecommender } from '@/app/contexts/RecommenderContext';

interface AnimatedApplyButtonProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  jobId?: string;
  applicationId?: string;
  buttonText?: string;
  icon?: LucideIcon;
  onShowSubscriptionModal?: () => void;
}

export default function AnimatedApplyButton({ 
  className = '', 
  size = 'md',
  fullWidth = false,
  jobId,
  applicationId,
  buttonText,
  icon,
  onShowSubscriptionModal
}: AnimatedApplyButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'review'>('idle');
  const [profileAlertOpen, setProfileAlertOpen] = useState(false);
  const [noCreditsModalOpen, setNoCreditsModalOpen] = useState(false);
  const [profileState, setProfileState] = useState<ProfileCompletionState>('complete');
  const [createdApplicationId, setCreatedApplicationId] = useState<string | null>(applicationId || null);
  
  const { profile, isLoading: profileLoading } = useProfile();
  const { applyToJob } = useApplications();
  const { openModal } = useReviewApplicationModal();
  const { user } = useAuth();
  const { removeJobFromRecommendations } = useRecommender();

  // Get AI credits
  const aiCredits = profile?.[FieldName.AI_CREDITS] || 0;
  const isProMember = profile?.[FieldName.IS_PRO_MEMBER] || false;
  
  // Always show AI Apply, but check credits
  const finalButtonText = buttonText || 'AI Apply';
  const FinalIcon = icon || Sparkles;

  const checkProfileCompletion = async () => {
    return getProfileCompletionState(profile as UserProfile);
  };

  const handleClick = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (state !== 'idle') return;
    
    // Check if user has AI credits (unless they're a pro member)
    if (!isProMember && aiCredits === 0) {
      setNoCreditsModalOpen(true);
      return;
    }
    
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
        // Check if user has chosen to ignore partial profile alerts
        const ignorePartialAlert = profile?.[FieldName.IGNORE_PARTIAL_PROFILE_ALERT] || false;
        
        if (!ignorePartialAlert) {
          setProfileAlertOpen(true);
          setState('idle');
          return;
        }
        // If ignoring partial alerts, continue with application creation
      }

      // For pro members, show cover letter generation first
      if (isProMember && jobId) {
        setState('review');
        
        // Check if a cover letter already exists for this application
        let coverLetterUrl: string | null = null;
        
        if (createdApplicationId && user) {
          try {
            coverLetterUrl = await storageService.getDownloadUrl('cover-letters', user.uid, createdApplicationId);
          } catch (error) {
            console.error('Error checking cover letter existence:', error);
            // Continue with cover letter generation if check fails
          }
        }
        
        openModal({
          applicationId: createdApplicationId || undefined,
          jobId,
          status: coverLetterUrl ? 'cover_letter_generated' : 'cover_letter',
          coverLetterUrl: coverLetterUrl || undefined,
          onSubmit: () => setState('idle'),
        });
        return;
      }
      
      // If profile is complete, apply to job with form questions
      if (jobId) {
        try {
          const appliedId = await handleApply(jobId);
          
          setState('review');
          openModal({
            applicationId: appliedId,
            jobId,
            status: 'applying',
            onSubmit: () => setState('idle'),
          });
        } catch (applyError) {
          console.error('Error applying to job:', applyError);
          setState('idle');
          return;
        }
      } else {
        setState('review');
        openModal({
          applicationId: createdApplicationId || undefined,
          jobId,
          status: 'applying',
          onSubmit: () => setState('idle'),
        });
      }
    } catch (error) {
      console.error('Error in profile check:', error);
      setState('idle');
    }
  };

  const handleApply = async (jobId: string | undefined) => {
    if (!jobId) return;
    
    setState('loading');
    try {
      const applicationId = await applyToJob(jobId);
      setCreatedApplicationId(applicationId);
      removeJobFromRecommendations(jobId);
      return applicationId;
    } catch (error) {
      console.error('Error in apply:', error);
      setState('idle');
    }
  }

  const handleReviewClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    openModal({
      applicationId: createdApplicationId || undefined,
      jobId,
      onSubmit: () => setState('idle'),
    });
  };

  const handleContinueAnyway = async () => {
    setProfileAlertOpen(false);
    
    try {
      // Apply to job even with incomplete profile
      if (jobId) {
        try {
          const applicationId = await handleApply(jobId);
          
          setState('review');
          openModal({
            applicationId,
            jobId,
            status: 'applying',
            onSubmit: () => setState('idle'),
          });
        } catch (applyError) {
          console.error('Error applying to job (incomplete profile):', applyError);
          setState('idle');
          return;
        }
      } else {
        setState('review');
        openModal({
          applicationId: createdApplicationId || undefined,
          jobId,
          status: 'applying',
          onSubmit: () => setState('idle'),
        });
      }
    } catch (error) {
      console.error('Error in handleContinueAnyway:', error);
      setState('idle');
    }
  };

  const sizeClasses = {
    xs: 'h-8 px-3 text-sm',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  // Show loading state while profile is loading
  if (profileLoading) {
    return (
      <button
        disabled
        className={`
          inline-flex items-center justify-center
          border border-transparent font-medium rounded-lg shadow-lg
          text-white bg-gradient-to-r from-gray-400 to-gray-500
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </button>
    );
  }
  
  return (
    <>
      <motion.button
        onClick={(e) => state === 'review' ? handleReviewClick(e) : handleClick(e)}
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
              <FinalIcon className="mr-2 h-4 w-4" />
              {finalButtonText}
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

      <NoCreditsModal
        isOpen={noCreditsModalOpen}
        onClose={() => setNoCreditsModalOpen(false)}
        onUpgrade={() => {
          setNoCreditsModalOpen(false);
          onShowSubscriptionModal?.();
        }}
      />
    </>
  );
} 