'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { XCircle, Pencil, Send, Info } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ApplicationSubmittedContent from './applications/ApplicationSubmittedContent';

interface ReviewApplicationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onEdit?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  className?: string;
  applicationId?: string;
  jobTitle?: string;
  companyName?: string;
}

export default function ReviewApplicationModal({
  open,
  setOpen,
  onEdit,
  onSubmit,
  onCancel,
  className = '',
  applicationId = '123',
  jobTitle = 'Senior Software Engineer',
  companyName = 'TechNova Solutions',
}: ReviewApplicationModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
      router.push(`/applications/${applicationId}/edit`);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmit?.();
    }, 1500);
  };

  const handleViewApplications = () => {
    setOpen(false);
    router.push('/applications');
    setIsSubmitted(false);
  };

  const handleBrowseJobs = () => {
    setOpen(false);
    router.push('/jobs');
    setIsSubmitted(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpenState) => {
      if (!newOpenState) {
        handleClose();
      } else {
        setOpen(true);
      }
    }}>
      <DialogContent className={`max-w-2xl w-full h-[100vh] sm:h-[80vh] overflow-y-auto flex flex-col bg-white ${className}`}>
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle>Review Your Application</DialogTitle>
            </DialogHeader>
            <div className="flex-1 flex flex-col items-center justify-center py-4 w-full overflow-auto">
              {/* Wide, scrollable image */}
              <div className="w-full overflow-auto">
                <img
                  src="/images/sample_job_app_ss.png"
                  alt="Filled Job Application Preview"
                  className="w-full object-contain rounded-lg border shadow mb-6"
                  style={{ background: '#f9fafb', display: 'block' }}
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
              </div>
            </div>
            <DialogFooter className="sticky bottom-0 bg-white pt-1 pb-1 border-t flex flex-row gap-3 justify-end">
              <div className="w-full flex flex-col">
                <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-md px-3 py-2 flex items-start gap-2 mt-2 mb-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-left">By clicking submit, you agree for Applywise to submit this application on your behalf.</span>
                </div>
                <div className="flex flex-row gap-3 justify-end mt-2 mb-0">
                  <div className="flex-1 flex justify-start">
                    <button
                      className="px-4 py-2 rounded-md border border-red-500 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 font-medium transition-colors flex items-center text-sm"
                      onClick={handleClose}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                  <button
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-colors flex items-center text-sm"
                    onClick={handleEdit}
                    disabled={isEditing}
                  >
                    {isEditing ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Editing...
                      </>
                    ) : (
                      <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </button>
                  <button
                    className="px-4 py-2 rounded-md border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors flex items-center text-sm"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            </DialogFooter>
          </>
        ) : (
          <ApplicationSubmittedContent 
            jobTitle={jobTitle}
            companyName={companyName}
            applicationId={applicationId}
            onViewApplications={handleViewApplications}
            onBrowseJobs={handleBrowseJobs}
            variant="plain"
          />
        )}
      </DialogContent>
    </Dialog>
  );
} 