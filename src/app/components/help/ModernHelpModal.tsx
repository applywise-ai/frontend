'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { 
  Bug, 
  Lightbulb, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Globe
} from 'lucide-react';
import { useNotification } from '@/app/contexts/NotificationContext';
import { helpService } from '@/app/utils/firebase';
import { useAuth } from '@/app/contexts/AuthContext';
import { CreateHelpSubmissionData } from '@/app/utils/firebase/help';

interface ModernHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'bug_report' | 'feature_suggestion';
}

export default function ModernHelpModal({ open, onOpenChange, type }: ModernHelpModalProps) {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess } = useNotification();
  const { user } = useAuth();

  const isBugReport = type === 'bug_report';
  const title = isBugReport ? 'Report a Bug' : 'Suggest a Feature';
  const icon = isBugReport ? Bug : Lightbulb;
  const IconComponent = icon;
  const accentColor = isBugReport ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('You must be logged in to submit feedback');
      }

      const submissionData: CreateHelpSubmissionData = {
        type,
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      await helpService.submitHelpRequest(user, submissionData);
      
      setIsSubmitted(true);
      showSuccess(isBugReport ? 'Bug report submitted successfully!' : 'Feature suggestion submitted successfully!');
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({ title: '', description: '' });
        setIsSubmitted(false);
        onOpenChange(false);
      }, 2000);

    } catch (err) {
      console.error('Error submitting help request:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ title: '', description: '' });
      setError(null);
      setIsSubmitted(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-full bg-white rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
        {/* Header */}
        <div className={`${accentColor} px-6 py-4 border-b relative`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className={`p-2 rounded-full ${isBugReport ? 'bg-red-100' : 'bg-yellow-100'}`}>
                <IconComponent className={`h-5 w-5 ${isBugReport ? 'text-red-600' : 'text-yellow-600'}`} />
              </div>
              {title}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {isSubmitted ? (
            // Success State
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isBugReport ? 'Bug Report Submitted!' : 'Feature Suggestion Submitted!'}
              </h3>
              <p className="text-gray-600 mb-4">
                Thank you for your feedback. We&apos;ll review it and get back to you if needed.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Globe className="h-4 w-4" />
                <span>Saved to help collection</span>
              </div>
            </div>
          ) : (
            // Form State
            <>
              {/* Description */}
              <div className="mb-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {isBugReport 
                    ? "Help us fix issues by providing detailed information about the problem you encountered."
                    : "Share your ideas to help us improve Applywise. We value your input and consider all suggestions."
                  }
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isBugReport ? 'Bug Summary' : 'Feature Title'} *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder={isBugReport 
                      ? "Brief description of the issue (e.g., 'Login button not working')"
                      : "Brief description of the feature (e.g., 'Dark mode toggle')"
                    }
                    className="rounded-lg"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isBugReport ? 'Detailed Description' : 'Feature Description'} *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={isBugReport 
                      ? "Please describe:\n• What you were trying to do\n• What happened instead\n• Steps to reproduce the issue\n• Any error messages you saw"
                      : "Please describe:\n• What the feature should do\n• How it would help you\n• Any specific requirements\n• Examples of similar features you've seen"
                    }
                    rows={6}
                    className="rounded-lg resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                    isBugReport 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {isBugReport ? 'Submit Bug Report' : 'Submit Feature Suggestion'}
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 