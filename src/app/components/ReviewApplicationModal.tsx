'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Pencil, Send, Info, CheckCircle2, AlertTriangle, Lock, Sparkles, Loader2, XCircle, AlertCircle, RefreshCw, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ApplicationSubmittedContent from './applications/ApplicationSubmittedContent';
import { useNotification } from '@/app/contexts/NotificationContext';
import { useApplications } from '@/app/contexts/ApplicationsContext';
import { useReviewApplicationModal } from '@/app/contexts/ReviewApplicationModalContext';
import { useGetJob } from '@/app/hooks/useGetJob';
import DeleteApplicationDialog from './applications/DeleteApplicationDialog';
import storageService from '@/app/services/firebase/storage';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRecommender } from '@/app/contexts/RecommenderContext';

interface ReviewApplicationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onEdit?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  className?: string;
  applicationId?: string;
  coverLetterUrl?: string;
  setApplicationId: (applicationId: string) => void;
  jobId?: string;
  status?: 'applying' | 'ready' | 'submitted' | 'cover_letter' | 'cover_letter_generated' | 'failed' | 'not_found';
}

export default function ReviewApplicationModal({
  open,
  setOpen,
  onEdit,
  onSubmit,
  onCancel,
  className = '',
  applicationId,
  coverLetterUrl: coverLetterUrlProp,
  setApplicationId,
  jobId,
  status = 'applying',
}: ReviewApplicationModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | null>(coverLetterUrlProp || null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const { showSuccess } = useNotification();
  const { submitApplication, applyToJob, generateCoverLetter, deleteApplication } = useApplications();
  const { updateStatus, applicationUpdate } = useReviewApplicationModal();
  const { user } = useAuth();
  const { removeJobFromRecommendations } = useRecommender();

  // Use the job hook to fetch job details
  const { job, loading: jobLoading } = useGetJob(jobId || null);

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    onCancel?.();
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/applications/${applicationId}/edit`, { scroll: false });
    }
    setOpen(false);
    setIsEditing(false);
  };

  useEffect(() => {
    setCoverLetterUrl(coverLetterUrlProp || null);
  }, [coverLetterUrlProp]);

  // Generate screenshot URL from path when applicationUpdate changes
  useEffect(() => {
    console.log(applicationUpdate)
    const loadScreenshotUrl = async () => {
      if (applicationUpdate?.details.screenshot_path) {
        const url = await storageService.generateUrlFromPath(applicationUpdate.details.screenshot_path);
        console.log(url)
        setScreenshotUrl(url);
      } else {
        setScreenshotUrl(null);
      }
    };

    loadScreenshotUrl();
  }, [applicationUpdate?.details.screenshot_path]);
  
  // Generate cover letter URL from path when it's a path (not already a URL)
  useEffect(() => {
    const loadCoverLetterUrl = async () => {
      if (coverLetterUrl && !coverLetterUrl.startsWith('http')) {
        const url = await storageService.generateUrlFromPath(coverLetterUrl);
        setCoverLetterUrl(url);
      }
    };

    loadCoverLetterUrl();
  }, [coverLetterUrl]);

  const handleSubmit = async () => {
    if (!applicationUpdate?.able_to_submit || !applicationId) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit the application (changes status from "draft" to "applied")
      await submitApplication(applicationId);
      
      setIsSubmitting(false);
      onSubmit?.();
      
      // Update modal status to show submitted screen
      updateStatus('submitted');
      
      // Show success notification
      showSuccess('Application submitted successfully!');
    } catch (err) {
      console.error('Error submitting application:', err);
      setIsSubmitting(false);
    }
  };

  const handleViewApplications = async () => {
    // Only navigate if we're not already on the applications page
    if (pathname !== '/applications') {
      await router.replace('/applications');
    }
    setOpen(false);
  };

  const handleBrowseJobs = async () => {
    // Only navigate if we're not already on the jobs page
    if (pathname !== '/jobs') {
      await router.replace('/jobs');
    }
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!applicationId) return;
    
    try {
      await deleteApplication(applicationId);
    setOpen(false);
    onCancel?.();
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const handleGenerate = async () => {
    if (!jobId) return;
    
    setIsGenerating(true);
    try {
      const response = await generateCoverLetter(jobId, prompt || '');
      setCoverLetterUrl(response.cover_letter_path);
      setApplicationId(response.application_id);
      updateStatus('cover_letter_generated');
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = async () => {
    // Delete the cover letter from storage if it exists
    if (coverLetterUrl && applicationId && user) {
      try {
        // Extract the file path from the URL to delete it
        const filePath = `cover-letters/${user.uid}/${applicationId}.pdf`;
        
        await storageService.deleteFile(filePath);
        console.log('Cover letter deleted from storage');
      } catch (error) {
        console.error('Error deleting cover letter from storage:', error);
        // Continue with the back action even if deletion fails
      }
    }
    
    setCoverLetterUrl(null);
    updateStatus('cover_letter');
  };

  const handleApply = async () => {
    if (!jobId) return;
    
    try {
      // Apply to the job using the generated cover letter
      const applicationId = await applyToJob(jobId);
      setApplicationId(applicationId);
      removeJobFromRecommendations(jobId);
      updateStatus('applying');
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  // Screen components
  const ApplyingScreen = () => {
    const { timerSeconds } = useReviewApplicationModal();
    const progressSteps = [
      'Analyzing Job Posting',
      'Preparing Your Resume & Profile', 
      'Filling out Application',
      'Reviewing & Validating Your Application',
      'Taking Screenshot of Final Application',
      'This is taking longer than usual, hold on tight we are almost finished.'
    ];
    
    // Calculate progress based on timer seconds (30 seconds total) with smoother granularity
    const progressPercentage = Math.min((timerSeconds / 30) * 100, 100);
    
    // Determine current step based on timer seconds (every 5 seconds)
    const getCurrentStep = () => {
      if (timerSeconds < 5) return progressSteps[0];
      if (timerSeconds < 10) return progressSteps[1];
      if (timerSeconds < 20) return progressSteps[2];
      if (timerSeconds < 25) return progressSteps[3];
      if (timerSeconds < 30) return progressSteps[4];
      return progressSteps[5]; // After 30 seconds, show the last step
    };
    
    const currentStep = getCurrentStep();
    
    return (
         <div className="flex items-center justify-center h-full overflow-auto">
          <div className="flex flex-col items-center text-center px-6 py-8">
            <div className="mb-6">
              <img 
                src="/images/logo_icon_dark.svg" 
                alt="ApplyWise Logo" 
                className="h-16 w-16 mx-auto"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Filling Out Your Application
            </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          We&apos;re automatically filling out your job application for{' '}
          <span className="font-medium text-gray-900">{job?.title || 'this position'}</span>
          {' '}based on your profile information.
        </p>
        <div className="w-full max-w-sm">
          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{currentStep}</p>
          

          </div>
        </div>
      </div>
    );
  };

  const ReviewScreen = () => (
    <>
      <DialogHeader className="border-b border-gray-100 pb-4">
        <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Send className="h-4 w-4 text-white" />
          </div>
          Review Your Application
        </DialogTitle>
        <p className="text-sm text-gray-600 mt-1">
          {jobLoading ? 'Loading job details...' : `Review the auto-filled application before submitting to ${job?.company || 'the company'}`}
        </p>
      </DialogHeader>

      <div className="flex-1 flex flex-col pb-3 w-full overflow-auto">
        {/* Success/Error Disclaimer */}
        <div className={`mb-4 p-3 rounded-lg border ${
          applicationUpdate?.able_to_submit 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-start gap-3">
            {applicationUpdate?.able_to_submit ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">
                {applicationUpdate?.able_to_submit ? 'Application Successfully Generated' : 'Application Needs Attention'}
              </h4>

              <p className="text-sm leading-relaxed">
                {applicationUpdate?.able_to_submit ? (
                  <>
                    {/* Mobile text */}
                    <span className="block sm:hidden">
                      All fields filled. Review & submit.
                    </span>
                    {/* Desktop text */}
                    <span className="hidden sm:block">
                      All required fields have been automatically filled based on your profile.
                      Review the application below and submit when ready.
                    </span>
                  </>
                ) : (
                  <>
                    {/* Mobile text */}
                    <span className="block sm:hidden">
                      Missing fields. Please complete & submit.
                    </span>
                    {/* Desktop text */}
                    <span className="hidden sm:block">
                      Some required fields could not be automatically filled. Please review and
                      edit the application to complete any missing information before submitting.
                    </span>
                  </>
                )}
              </p>

              {!applicationUpdate?.able_to_submit && (
                <div className="mt-2 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                  💡 Tip: Update your profile to improve auto-fill accuracy for future applications
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Application Preview */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Application Preview</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                applicationUpdate?.able_to_submit 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {applicationUpdate?.able_to_submit ? 'Ready to Submit' : 'Needs Review'}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-auto max-h-96">
              {screenshotUrl ? (
                <img
                  src={screenshotUrl}
                  alt="Filled Job Application Preview"
                  className="w-full object-contain min-h-full"
                  style={{ 
                    background: '#f9fafb', 
                    display: 'block',
                  }}
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Loading application preview...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="sticky bottom-0 bg-white pt-4 pb-4 border-t border-gray-100">
        <div className="w-full flex flex-col gap-4">
          {/* Terms and Conditions */}
          {applicationUpdate?.able_to_submit && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg px-4 py-3 flex items-start gap-3">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
              <span className="text-left leading-relaxed">
                By clicking submit, you agree for Applywise to submit this application on your behalf.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-row gap-3 justify-between">
            <DeleteApplicationDialog
              applicationId={applicationId || ''}
              jobTitle={job?.title}
              companyName={job?.company}
              onDelete={handleDelete}
              redirectTo="/jobs"
              size="sm"
            />

            <div className="flex gap-3 order-1 sm:order-2">
              <button
                className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-200 bg-gradient-to-r from-white to-gray-50 text-gray-700 hover:from-gray-50 hover:to-gray-100 hover:text-gray-800 font-medium transition-all duration-200 flex items-center justify-center text-xs sm:text-sm shadow-sm"
                onClick={handleEdit}
                disabled={isEditing}
              >
                {isEditing ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                    Opening Editor...
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    <span className="sm:hidden">Edit</span>
                    <span className="hidden sm:inline">Edit Application</span>
                  </>
                )}
              </button>

              <button
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border font-medium transition-all duration-200 flex items-center justify-center text-xs sm:text-sm shadow-lg ${
                  applicationUpdate?.able_to_submit && !isSubmitting
                    ? 'border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    : 'border-gray-300 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleSubmit}
                disabled={!applicationUpdate?.able_to_submit || isSubmitting}
                title={!applicationUpdate?.able_to_submit ? 'Complete all required fields before submitting' : ''}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Submitting...
                  </>
                ) : !applicationUpdate?.able_to_submit ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Complete Required Fields
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    <span className="sm:hidden">Submit</span>
                    <span className="hidden sm:inline">Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogFooter>
    </>
  );

  const SubmittedScreen = () => (
    <>
      <DialogHeader>
        <DialogTitle className="sr-only">Application Submitted</DialogTitle>
      </DialogHeader>
      <div className="flex-1 overflow-auto flex items-center justify-center">
        <ApplicationSubmittedContent 
          jobTitle={job?.title || 'Job'}
          companyName={job?.company || 'Company'}
          submittedAt={new Date().toISOString()}
          onViewApplications={handleViewApplications}
          onBrowseJobs={handleBrowseJobs}
          variant="plain"
        />
      </div>
    </>
  );

  const FailedScreen = () => (
    <>
      <DialogHeader className="border-b border-gray-100 pb-4">
        <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <XCircle className="h-4 w-4 text-white" />
          </div>
          Application Failed
        </DialogTitle>
        <p className="text-sm text-gray-600 mt-1">
          We encountered an issue while processing your application to <span className="font-semibold">{job?.company || 'this company'}</span>
        </p>
      </DialogHeader>

      <div className="flex-1 flex flex-col pb-3 w-full overflow-auto">
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <p className="text-gray-600 mb-6 max-w-md text-center leading-relaxed">
            We encountered an issue while processing your application. 
            This can happen due to technical issues or changes on the company&apos;s website.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 w-full max-w-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 text-sm mb-1">What happened?</h4>
                <p className="text-red-700 text-sm">
                  {applicationUpdate?.details?.message || 'The application could not be submitted due to a technical error.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100">
        <div className="w-full flex gap-3 justify-between">
          <button
            onClick={handleClose}
            className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 text-xs sm:text-sm"
          >
            Close
          </button>
          
          <button
            onClick={handleApply}
            className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-medium transition-all duration-200 flex items-center text-xs sm:text-sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </button>
        </div>
      </DialogFooter>
    </>
  );
  
  const NotFoundScreen = () => (
    <>
      <DialogHeader className="border-b border-gray-100 pb-4">
        <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <Search className="h-4 w-4 text-white" />
          </div>
          Job No Longer Available
        </DialogTitle>
        <p className="text-sm text-gray-600 mt-1">
          The job posting at <span className="font-semibold">{job?.company || 'this company'}</span> is no longer available
        </p>
      </DialogHeader>

      <div className="flex-1 flex flex-col pb-3 w-full overflow-auto">
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
            <Search className="h-8 w-8 text-amber-600" />
          </div>
          
          <p className="text-gray-600 mb-6 max-w-md text-center leading-relaxed">
            The job posting you were trying to apply to is no longer available. 
            This can happen when positions are filled or removed by the employer.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 w-full max-w-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 text-sm mb-1">What does this mean?</h4>
                <p className="text-amber-700 text-sm">
                  The job posting has been removed or is temporarily unavailable. Your application data is still saved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100">
        <div className="w-full flex gap-3 justify-between">
          <button
            onClick={handleClose}
            className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 text-xs sm:text-sm"
          >
            Close
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleViewApplications}
              className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 text-xs sm:text-sm"
            >
              <span className="sm:hidden">View Apps</span>
              <span className="hidden sm:inline">View Applications</span>
            </button>
            
            <button
              onClick={handleBrowseJobs}
              className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-medium transition-all duration-200 flex items-center text-xs sm:text-sm"
            >
              <Search className="mr-2 h-4 w-4" />
              Find Similar Jobs
            </button>
          </div>
        </div>
      </DialogFooter>
    </>
  );

    const CoverLetterScreen = () => {
      const [localPrompt, setLocalPrompt] = useState(prompt);

      useEffect(() => {
        setLocalPrompt(prompt); // sync with root prompt when it changes externally
      }, [prompt]);
      const isGenerated = status === 'cover_letter_generated' || coverLetterUrl;

      return (
      <>
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
              {isGenerated ? 'Cover Letter Generated' : 'Generate AI Cover Letter'}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
              {isGenerated 
                ? `Your cover letter for ${job?.title || 'this position'} at ${job?.company || 'the company'} has been generated`
                : `Create a personalized cover letter for ${job?.title || 'this position'} at ${job?.company || 'the company'}`
              }
          </p>
        </DialogHeader>

        <div className="flex-1 flex flex-col w-full overflow-auto items-center justify-center">
          {!isGenerated ? (
            <div className="space-y-6 pt-4 w-full">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Instructions (Optional)
                </label>
                <Textarea
                  value={localPrompt}
                  onChange={(e) => setLocalPrompt(e.target.value)}
                  onBlur={() => setPrompt(localPrompt)}
                  placeholder="e.g., Highlight my experience in React and TypeScript, mention my passion for clean code..."
                  className="w-full resize-none"
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to use default professional cover letter
                </p>
              </div>
            </div>
          ) : (
              <div className="space-y-4 pt-2 sm:pt-4 w-full px-2 sm:px-0">
                {/* Generated Cover Letter Preview */}
                <div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                            Cover Letter Generated Successfully!
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Your personalized cover letter is ready to use
                          </p>
                        </div>
                      </div>
                      {coverLetterUrl && (
                        <a
                          href={coverLetterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-green-200 rounded-lg text-green-700 hover:bg-green-50 hover:border-green-300 font-medium text-sm transition-all duration-200 shadow-sm w-full sm:w-auto"
                        >
                          <span className="text-green-600">→</span>
                          View Cover Letter
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Disclaimer Card */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                        Warning: Going back will remove your generated cover letter.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(newOpenState) => {
      if (!newOpenState) {
        handleClose();
      } else {
        setOpen(true);
      }
    }}>
      <DialogContent className={`max-w-3xl w-full ${
        status === 'failed' || status === 'not_found'
          ? 'h-[90vh] sm:h-[55vh]'
          : status === 'cover_letter' || status === 'cover_letter_generated' || status === 'applying'
          ? 'h-[90vh] sm:h-[45vh]' 
          : status === 'submitted'
          ? 'h-[90vh] sm:h-[70vh]' 
          : 'h-[90vh] sm:h-[85vh]'
      } flex flex-col bg-white ${className}`}>
        {status === 'cover_letter' || status === 'cover_letter_generated' ? (
          <>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="relative flex-1 overflow-hidden">
                <div className="absolute inset-0">
                  <CoverLetterScreen />
                </div>
              </div>
            </div>

            {/* Cover Letter Footer */}
            <DialogFooter className="bg-white pt-4 border-t border-gray-100">
              <div className="w-full flex gap-3 justify-between">
                {status === 'cover_letter' ? (
                  <>
                    <button
                      className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 text-xs sm:text-sm"
                      onClick={handleApply}
                    >
                      Skip Cover Letter
                    </button>
                    
                    <button
                      className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border font-medium transition-all duration-200 flex items-center text-xs sm:text-sm ${
                        isGenerating
                          ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                      }`}
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate
                        </>
                      )}
                    </button>
                  </>
                ) : status === 'cover_letter_generated' ? (
                  <>
                    <button
                      className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 text-xs sm:text-sm"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    
                    <button
                      className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-medium transition-all duration-200 flex items-center text-xs sm:text-sm"
                      onClick={handleApply}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Apply
                    </button>
                  </>
                ) : null}
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="relative flex-1 overflow-hidden">
            <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              status === 'applying' ? 'translate-x-0' : 
              status === 'ready' ? '-translate-x-full' : 
              status === 'submitted' ? '-translate-x-[200%]' :
              status === 'failed' ? '-translate-x-[300%]' :
              status === 'not_found' ? '-translate-x-[400%]' :
              'translate-x-full'
            }`}>
              <ApplyingScreen />
            </div>
            <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              status === 'applying' ? 'translate-x-full' : 
              status === 'ready' ? 'translate-x-0' : 
              status === 'submitted' ? '-translate-x-full' :
              status === 'failed' ? '-translate-x-[200%]' :
              status === 'not_found' ? '-translate-x-[300%]' :
              'translate-x-[200%]'
            }`}>
              <ReviewScreen />
            </div>
            <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              status === 'applying' ? 'translate-x-[200%]' : 
              status === 'ready' ? 'translate-x-full' : 
              status === 'submitted' ? 'translate-x-0' :
              status === 'failed' ? '-translate-x-full' :
              status === 'not_found' ? '-translate-x-[200%]' :
              'translate-x-[300%]'
            }`}>
              <SubmittedScreen />
            </div>
            <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              status === 'applying' ? 'translate-x-[300%]' : 
              status === 'ready' ? 'translate-x-[200%]' : 
              status === 'submitted' ? 'translate-x-full' :
              status === 'failed' ? 'translate-x-0' :
              status === 'not_found' ? '-translate-x-full' :
              'translate-x-[400%]'
            }`}>
              <FailedScreen />
            </div>
            <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              status === 'not_found' ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <NotFoundScreen />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}