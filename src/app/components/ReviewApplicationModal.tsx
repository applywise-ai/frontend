'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Pencil, Send, Info, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ApplicationSubmittedContent from './applications/ApplicationSubmittedContent';
import { useNotification } from '@/app/contexts/NotificationContext';
import { useApplications } from '@/app/contexts/ApplicationsContext';
import { useGetJob } from '@/app/hooks/useGetJob';
import DeleteApplicationDialog from './applications/DeleteApplicationDialog';

interface ReviewApplicationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onEdit?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  className?: string;
  applicationId?: string;
  success?: boolean;
  jobId?: string;
}

export default function ReviewApplicationModal({
  open,
  setOpen,
  onEdit,
  onSubmit,
  onCancel,
  className = '',
  applicationId,
  success = true,
  jobId,
}: ReviewApplicationModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showSuccess } = useNotification();
  const { submitApplication } = useApplications();
  
  // Use the job hook to fetch job details
  const { job, loading: jobLoading } = useGetJob(jobId || null);

  const handleClose = () => {
    setOpen(false);
    onCancel?.();
    // Reset state when modal is closed
    setIsSubmitted(false);
  };



  const handleEdit = () => {
    setIsEditing(true)
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/applications/${applicationId}/edit`, { scroll: false });
    }
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!success || !applicationId) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit the application (changes status from "draft" to "applied")
      await submitApplication(applicationId);
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmit?.();
      
      // Show success notification
      showSuccess('Application submitted successfully!');
    } catch (err) {
      console.error('Error submitting application:', err);
      setIsSubmitting(false);
      // Could add error notification here if needed
    }
  };

  const handleViewApplications = async () => {
    setIsSubmitted(false);
    
    // Only navigate if we're not already on the applications page
    if (pathname !== '/applications') {
      await router.replace('/applications');
    }
    setOpen(false);
  };

  const handleBrowseJobs = async () => {
    setIsSubmitted(false);
    
    // Only navigate if we're not already on the jobs page
    if (pathname !== '/jobs') {
      await router.replace('/jobs');
    }
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);
    onCancel?.();
  };

  return (
    <Dialog open={open} onOpenChange={(newOpenState) => {
      if (!newOpenState) {
        handleClose();
      } else {
        setOpen(true);
      }
    }}>
      <DialogContent className={`max-w-3xl w-full ${isSubmitted ? 'max-h-[90vh]' : 'h-[100vh] sm:h-[85vh]'} overflow-y-auto flex flex-col bg-white ${className}`}>
        {!isSubmitted ? (
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
                success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-start gap-3">
                  {success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                      {success ? 'Application Successfully Generated' : 'Application Needs Attention'}
                    </h4>
                    <p className="text-sm leading-relaxed">
                      {success 
                        ? 'All required fields have been automatically filled based on your profile. Review the application below and submit when ready.'
                        : 'Some required fields could not be automatically filled. Please review and edit the application to complete any missing information before submitting.'
                      }
                    </p>
                    {!success && (
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
                      success 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {success ? 'Ready to Submit' : 'Needs Review'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <img
                      src="/images/sample_job_app_ss.png"
                      alt="Filled Job Application Preview"
                      className="w-full object-contain"
                      style={{ background: '#f9fafb', display: 'block' }}
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-white pt-4 pb-4 border-t border-gray-100">
              <div className="w-full flex flex-col gap-4">
                {/* Terms and Conditions */}
                {success && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg px-4 py-3 flex items-start gap-3">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span className="text-left leading-relaxed">
                      By clicking submit, you agree for Applywise to submit this application on your behalf.
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <DeleteApplicationDialog
                    applicationId={applicationId || ''}
                    jobTitle={job?.title}
                    companyName={job?.company}
                    onDelete={handleDelete}
                    redirectTo="/jobs"
                    size="md"
                  />

                  <div className="flex gap-3 order-1 sm:order-2">
                    <button
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-200 bg-gradient-to-r from-white to-gray-50 text-gray-700 hover:from-gray-50 hover:to-gray-100 hover:text-gray-800 font-medium transition-all duration-200 flex items-center justify-center text-sm shadow-sm"
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
                          Edit Application
                        </>
                      )}
                    </button>

                    <button
                      className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg border font-medium transition-all duration-200 flex items-center justify-center text-sm shadow-lg ${
                        success && !isSubmitting
                          ? 'border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                          : 'border-gray-300 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={handleSubmit}
                      disabled={!success || isSubmitting}
                      title={!success ? 'Complete all required fields before submitting' : ''}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Submitting...
                        </>
                      ) : !success ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Complete Required Fields
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="sr-only">Application Submitted</DialogTitle>
            </DialogHeader>
            <ApplicationSubmittedContent 
              jobTitle={job?.title || 'Job'}
              companyName={job?.company || 'Company'}
              submittedAt={new Date().toISOString()}
              onViewApplications={handleViewApplications}
              onBrowseJobs={handleBrowseJobs}
              variant="plain"
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 