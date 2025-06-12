'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, CheckCircle2, LucideIcon, Sparkles } from 'lucide-react';
import { useReviewApplicationModal } from '@/app/contexts/ReviewApplicationModalContext';
import ProfileCompletionAlert, { ProfileCompletionState } from './profile/ProfileCompletionAlert';
import { useProfile } from '@/app/contexts/ProfileContext';
import { useApplications } from '@/app/contexts/ApplicationsContext';
import { FieldName, UserProfile } from '@/app/types/profile';
import { FormQuestion } from '@/app/types/application';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { getProfileCompletionState } from '@/app/utils/profile';

interface AnimatedApplyButtonProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  jobId?: string;
  buttonText?: string;
  icon?: LucideIcon;
}

// Mock function to get form questions for a job
const getMockFormQuestions = (): FormQuestion[] => {
  return [
    {
      id: 'fullName',
      question: 'What is your full name?',
      answer: '',
      type: 'text',
      placeholder: 'Enter your full name',
      section: 'personal',
      required: true
    },
    {
      id: 'email',
      question: 'What is your email address?',
      answer: '',
      type: 'email',
      placeholder: 'Enter your email address',
      section: 'personal',
      required: true
    },
    {
      id: 'phone',
      question: 'What is your phone number?',
      answer: '',
      type: 'phone',
      placeholder: 'Enter your phone number',
      section: 'personal',
      required: true
    },
    {
      id: 'currentCompany',
      question: 'Where do you currently work?',
      answer: '',
      type: 'text',
      placeholder: 'Enter your current company',
      section: 'personal',
      required: false
    },
    {
      id: 'currentRole',
      question: 'What is your current job title?',
      answer: '',
      type: 'text',
      placeholder: 'Enter your current role',
      section: 'personal',
      required: false
    },
    {
      id: 'yearsOfExperience',
      question: 'How many years of experience do you have?',
      answer: '',
      type: 'text',
      placeholder: 'Enter years of experience',
      section: 'personal',
      required: true
    },
    {
      id: 'desiredSalary',
      question: 'What is your desired salary?',
      answer: '',
      type: 'text',
      placeholder: 'Enter desired salary',
      section: 'personal',
      required: true
    },
    {
      id: 'availableStartDate',
      question: 'When can you start?',
      answer: '',
      type: 'date',
      section: 'personal',
      required: true
    },
    {
      id: 'resume',
      question: 'Upload your resume',
      answer: '',
      type: 'file',
      placeholder: 'Upload PDF, DOCX, or TXT file',
      section: 'resume',
      fileType: 'resume',
      required: true
    },
    {
      id: 'coverLetter',
      question: 'Upload your cover letter',
      answer: '',
      type: 'file',
      placeholder: 'Upload PDF, DOCX, or TXT file',
      section: 'coverLetter',
      fileType: 'coverLetter',
      required: false
    },
    {
      id: 'whyJoin',
      question: 'Why do you want to work at our company?',
      answer: '',
      type: 'textarea',
      placeholder: 'Tell us why you want to join our team',
      section: 'screening',
      required: true
    },
    {
      id: 'challengingProject',
      question: 'Describe a challenging project you worked on.',
      answer: '',
      type: 'textarea',
      placeholder: 'Describe your experience',
      section: 'screening',
      required: true
    },
    {
      id: 'workEnvironment',
      question: 'What is your preferred work environment?',
      answer: '',
      type: 'select',
      options: ['Remote', 'In-office', 'Hybrid'],
      section: 'custom',
      required: true
    },
    {
      id: 'referredBy',
      question: 'How did you hear about this position?',
      answer: '',
      type: 'text',
      placeholder: 'LinkedIn, job board, referral, etc.',
      section: 'custom',
      required: false
    },
    {
      id: 'relocation',
      question: 'Are you willing to relocate?',
      answer: '',
      type: 'radio',
      options: ['Yes', 'No', 'Maybe'],
      section: 'custom',
      required: false
    },
    {
      id: 'salaryExpectations',
      question: 'What are your salary expectations?',
      answer: '',
      type: 'text',
      placeholder: 'Enter your salary range',
      section: 'custom',
      required: false
    }
  ];
};

export default function AnimatedApplyButton({ 
  className = '', 
  size = 'md',
  fullWidth = false,
  jobId,
  buttonText,
  icon
}: AnimatedApplyButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'review'>('idle');
  const [profileAlertOpen, setProfileAlertOpen] = useState(false);
  const [profileState, setProfileState] = useState<ProfileCompletionState>('complete');
  const [createdApplicationId, setCreatedApplicationId] = useState<string | null>(null);
  
  const { profile, isLoading: profileLoading } = useProfile();
  const { applyToJob } = useApplications();
  const { openModal } = useReviewApplicationModal();
  
  // Determine if user is pro member
  const isProMember = profile?.[FieldName.IS_PRO_MEMBER] || false;
  
  // Set button text and icon based on pro status and props
  const finalButtonText = buttonText || (isProMember ? 'AI Apply' : 'Quick Apply');
  const FinalIcon = icon || (isProMember ? Sparkles : Zap);

  const checkProfileCompletion = async () => {
    return getProfileCompletionState(profile as UserProfile);
  };

  const handleClick = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
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
        // Check if user has chosen to ignore partial profile alerts
        const ignorePartialAlert = profile?.[FieldName.IGNORE_PARTIAL_PROFILE_ALERT] || false;
        
        if (!ignorePartialAlert) {
          setProfileAlertOpen(true);
          setState('idle');
          return;
        }
        // If ignoring partial alerts, continue with application creation
      }
      
      // If profile is complete, apply to job with form questions
      if (jobId) {
        const formQuestions = getMockFormQuestions();
        try {
          const applicationId = await applyToJob(jobId, formQuestions);
          setCreatedApplicationId(applicationId);
          
          setState('review');
          openModal({
            applicationId,
            jobId,
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
          onSubmit: () => setState('idle'),
        });
      }
    } catch (error) {
      console.error('Error in profile check:', error);
      setState('idle');
    }
  };

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
    setState('loading');
    
    try {
      // Apply to job even with incomplete profile
      if (jobId) {
        const formQuestions = getMockFormQuestions();
        try {
          const applicationId = await applyToJob(jobId, formQuestions);
          setCreatedApplicationId(applicationId);
          
          setState('review');
          openModal({
            applicationId,
            jobId,
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
    </>
  );
} 