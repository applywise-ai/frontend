'use client';

import { use } from 'react';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, FileText } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import Link from 'next/link';
import { getBreakpoint } from '@/app/utils/breakpoints';

// Import our components
import { FormSectionType, FormQuestion } from '@/app/types/application';
import { FormSection as FormSectionComponent } from '@/app/components/applications/FormSection';
import { JobDetails } from '@/app/components/applications/JobDetails';
import { ApplicationPreview } from '@/app/components/applications/ApplicationPreview';
import { ActionButtons } from '@/app/components/applications/ActionButtons';
import { ApplicationPreviewHeader } from '@/app/components/applications/ApplicationPreviewHeader';
import { useNotification } from '@/app/contexts/NotificationContext';
import { ApplicationWithJob, useApplications } from '@/app/contexts/ApplicationsContext';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import { navigateAndForget } from '@/app/utils/navigation';
import { EditApplicationPageSkeleton } from '@/app/components/loading/EditApplicationPageSkeleton';


function EditJobApplicationPageContent({params}: {params: Promise<{ id: string }>}) {
  const router = useRouter();
  // UI-only state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [previewTab, setPreviewTab] = useState<FormSectionType | 'application'>("application");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formChanged, setFormChanged] = useState(false);
  // Remove localAnswers - let individual inputs manage their own state
  const fieldRefs = useRef<{[key: string]: React.RefObject<HTMLDivElement | null>}>({});
  const currentAnswers = useRef<Record<string, FormQuestion>>({});
  
  // Global notification hook
  const { showSuccess } = useNotification();
  const {
    fetchApplication,
    updateApplication,
    submitApplication 
  } = useApplications();
  
  const { id: applicationId } = use(params);
  
  // Application and job data from context
  const [application, setApplication] = useState<ApplicationWithJob | null>(null);
  
  // Load application data from context
  useEffect(() => {
    const loadApplicationData = async () => {
      if (!applicationId) return;
      try {
        const appWithJob = await fetchApplication(applicationId);
        setApplication(appWithJob);
        // Initialize current answers ref from application data
        const initialAnswers: Record<string, FormQuestion> = {};
        appWithJob.formQuestions.forEach(q => {
          initialAnswers[q.unique_label_id] = q;
        });
        console.log('EditJobApplicationPageContent: initialAnswers', initialAnswers);
        // Only initialize current answers if they haven't been set yet (first load)
        const hasExistingAnswers = Object.keys(currentAnswers.current).length > 0;
        if (!hasExistingAnswers) {
          currentAnswers.current = initialAnswers;
          setFormChanged(false);
        }
      } catch (error) {
        console.error('Error loading application:', error);
      }
    };
    loadApplicationData();
  }, [applicationId, fetchApplication]);

  // Load the preview when component mounts
  useEffect(() => {
    // Simulate loading the preview
    const timer = setTimeout(() => {
      setLoadingPreview(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Get form questions directly from application - memoized to prevent useEffect dependency issues
  const formQuestions = useMemo(() => {
    return application?.formQuestions || [];
  }, [application?.formQuestions]);

  // Initialize refs for fields
  useEffect(() => {
    if (formQuestions.length > 0) {
      const refs: {[key: string]: React.RefObject<HTMLDivElement | null>} = {};
      formQuestions.forEach(q => {
        refs[q.unique_label_id] = React.createRef<HTMLDivElement | null>();
      });
      fieldRefs.current = refs;
    }
  }, [formQuestions]);

  // Memoize fieldRefs.current to prevent new object creation on every render
  const memoizedFieldRefs = useMemo(() => fieldRefs.current, []);

  // Handle input change for any answer - update ref without causing re-render
  const handleAnswerChange = useCallback((id: string, value: string | Partial<FormQuestion>) => {
    // Clear validation error for this field if it exists
    setValidationErrors(prev => prev.includes(id) ? prev.filter(item => item !== id) : prev);

    // Update current answers ref (doesn't cause re-render)
    if (typeof value === 'string') {
      // For simple string values, update the answer field
      if (currentAnswers.current[id]) {
        currentAnswers.current[id] = {
          ...currentAnswers.current[id],
          answer: value
        };
      }
    } else {
      // For FormQuestion updates (like file uploads), merge the changes
      if (currentAnswers.current[id]) {
        currentAnswers.current[id] = {
          ...currentAnswers.current[id],
          ...value
        };
      }
    }
    setFormChanged(true);
  }, []);
  
  const validateForm = useCallback(() => {
    if (!formQuestions.length) return false;
    
    // Check for required fields using current answers ref
    const missingFields = formQuestions
      .filter(q => q.required && !currentAnswers.current[q.unique_label_id])
      .map(q => q.unique_label_id);
    
    setValidationErrors(missingFields);
    
    if (missingFields.length > 0) {
      // Scroll to the first error field
      const firstErrorId = missingFields[0];
      const errorRef = fieldRefs.current[firstErrorId];
    
      if (errorRef && errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Focus the element after scrolling
        setTimeout(() => {
          // Try to find and focus the first input/textarea/select within the ref
          const focusableElement = errorRef.current?.querySelector(
            'input, textarea, select, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          
          if (focusableElement) {
            focusableElement.focus();
          }
        }, 1000); // Wait for scroll animation to complete
      }
      
      return false;
    }
    
    return true;
  }, [formQuestions]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update the form questions with current answers from ref
      const updatedFormQuestions = formQuestions.map(q => {
        const currentAnswer = currentAnswers.current[q.unique_label_id];
        if (currentAnswer) {
          return {
            ...q,
            answer: currentAnswer.answer,
            file_path: currentAnswer.file_path,
            file_name: currentAnswer.file_name,
          };
        }
        return q;
      });
      
      // Update the application using context
      await updateApplication(applicationId, {
        formQuestions: updatedFormQuestions
      });
      
      setFormChanged(false);
      
      // Show success notification
      showSuccess('Application saved successfully!');
      
      // Switch to preview tab in mobile view
      setActiveTab('preview');
    } catch (error) {
      console.error('Error saving application:', error);
      showSuccess('Failed to save application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, formQuestions, updateApplication, applicationId, showSuccess]);

  const handleSubmit = useCallback(async () => {
    // Save first if there are unsaved changes
    if (formChanged) {
      await handleSave();
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Submit the application using context
      await submitApplication(applicationId);
      
      // Show success notification before redirecting
      showSuccess('Application submitted successfully!');
      
      // Use optimized navigation - don't wait since component will unmount
      navigateAndForget(router, `/applications/${applicationId}/submitted`);
    } catch (error) {
      console.error('Error submitting application:', error);
      showSuccess('Failed to submit application. Please try again.');
      // Only set loading to false on error since we stay on the same page
      setIsLoading(false);
    }
  }, [formChanged, handleSave, validateForm, submitApplication, applicationId, showSuccess, router]);


  // Use current answers ref for FormSection compatibility
  const answers = useMemo(() => {
    const answerMap: Record<string, FormQuestion> = {};
    formQuestions.forEach(q => {
      answerMap[q.unique_label_id] = currentAnswers.current[q.unique_label_id];
    });
    return answerMap;
  }, [formQuestions]);

  // Memoize question arrays to prevent re-creation on every render
  const personalQuestions = useMemo(() => {
    return formQuestions.filter(q => q.section === 'personal');
  }, [formQuestions]);
  
  const educationQuestions = useMemo(() => {
    return formQuestions.filter(q => q.section === 'education');
  }, [formQuestions]);
  
  const experienceQuestions = useMemo(() => {
    return formQuestions.filter(q => q.section === 'experience');
  }, [formQuestions]);
  
  const resumeQuestions = useMemo(() => {
    return formQuestions.filter(q => q.section === 'resume');
  }, [formQuestions]);
  
  const coverLetterQuestions = useMemo(() => {
    return formQuestions.filter(q => q.section === 'cover_letter');
  }, [formQuestions]);
  
  const additionalQuestions = useMemo(() => {
    return formQuestions.filter(q => q.section === 'additional');
  }, [formQuestions]);
  
  const demographicQuestions = useMemo(() => {
    return formQuestions.filter(q => q.section === 'demographic');
  }, [formQuestions]);

  // Get section title based on section name
  // Memoize getSectionTitle to prevent re-creation
  const getSectionTitle = useCallback((section: FormSectionType): string => {
    switch (section) {
      case 'personal': return 'Personal Information';
      case 'education': return 'Education';
      case 'experience': return 'Experience';
      case 'resume': return 'Resume';
      case 'cover_letter': return 'Cover Letter';
      case 'additional': return 'Additional Information';
      case 'demographic': return 'Demographics';
      default: return 'Other Information';
    }
  }, []);

  // Memoize getBadgeStyles to prevent re-creation
  const getBadgeStyles = useCallback((status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Saved':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Interviewing':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'Rejected':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'Not Found':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'Draft':
      default:
        return 'bg-amber-50 text-amber-600 border-amber-200';
    }
  }, []);

  // Memoize handleFilePreview to prevent re-creation
  const handleFilePreview = useCallback((section?: FormSectionType) => {
    if (section === 'resume') {
      // Set appropriate preview tab
      setPreviewTab('resume');
      
      // If on mobile, switch to preview tab
      if (window.innerWidth < getBreakpoint('lg')) {
        setActiveTab('preview');
      }
    } else if (section === 'cover_letter') {
      // Set appropriate preview tab
      setPreviewTab('cover_letter');
      
      // If on mobile, switch to preview tab
      if (window.innerWidth < getBreakpoint('lg')) {
        setActiveTab('preview');
      }
    }
  }, []);

  // Form content component
  const FormContent = () => (
    <div className="flex flex-col gap-6 pb-12">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
          <div className="flex items-center">
              <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <Briefcase className="h-5 w-5 text-gray-500" />
              </div>
              <h2 className="text-lg font-semibold">Job Details</h2>
          </div>
          <Badge 
            variant="outline" 
            className={getBadgeStyles(application?.status || 'Draft')}
          >
            {application?.status || 'Draft'}
          </Badge>
        </div>
        <div className="px-6 py-5">
          {application?.job && (
            <JobDetails 
              job={application.job}
              status={application?.status || 'Draft'}
            />
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        <FormSectionComponent 
          key="personal"
          title={getSectionTitle('personal')} 
          questions={personalQuestions} 
          onAnswerChange={handleAnswerChange} 
          answers={answers}
          section="personal"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={memoizedFieldRefs}
          onSuccess={showSuccess}
          applicationId={applicationId}
          jobId={application?.jobId}
        />
        <FormSectionComponent 
          key="education"
          title={getSectionTitle('education')} 
          questions={educationQuestions} 
          onAnswerChange={handleAnswerChange} 
          answers={answers}
          section="education"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={memoizedFieldRefs}
          onSuccess={showSuccess}
          applicationId={applicationId}
          jobId={application?.jobId}
        />
        <FormSectionComponent 
          key="experience"
          title={getSectionTitle('experience')} 
          questions={experienceQuestions} 
          onAnswerChange={handleAnswerChange} 
          answers={answers}
          section="experience"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={memoizedFieldRefs}
          onSuccess={showSuccess}
          applicationId={applicationId}
          jobId={application?.jobId}
        />
        <FormSectionComponent 
          key="resume"
          title={getSectionTitle('resume')} 
          questions={resumeQuestions} 
          onAnswerChange={handleAnswerChange} 
          answers={answers}
          section="resume"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={memoizedFieldRefs}
          onSuccess={showSuccess}
          applicationId={applicationId}
          jobId={application?.jobId}
        />
        <FormSectionComponent 
          key="cover_letter"
          title={getSectionTitle('cover_letter')} 
          questions={coverLetterQuestions} 
          onAnswerChange={handleAnswerChange} 
          answers={answers}
          section="cover_letter"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={memoizedFieldRefs}
          onSuccess={showSuccess}
          applicationId={applicationId}
          jobId={application?.jobId}
        />
        <FormSectionComponent 
          key="additional"
          title={getSectionTitle('additional')} 
          questions={additionalQuestions} 
          onAnswerChange={handleAnswerChange} 
          answers={answers}
          section="additional"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={memoizedFieldRefs}
          onSuccess={showSuccess}
          applicationId={applicationId}
          jobId={application?.jobId}
        />
        <FormSectionComponent 
          key="demographic"
          title={getSectionTitle('demographic')} 
          questions={demographicQuestions} 
          onAnswerChange={handleAnswerChange} 
          answers={answers}
          section="demographic"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={memoizedFieldRefs}
          onSuccess={showSuccess}
          applicationId={applicationId}
          jobId={application?.jobId}
        />
      </div>
    </div>
  );

  // Preview content component - memoized to prevent unnecessary re-renders
  const PreviewContent = useCallback(({ showHeader = true }: { showHeader?: boolean }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col shadow-sm">
      <div className="flex-grow overflow-auto">
        <div className="flex-grow overflow-auto">
          {showHeader && (
            <ApplicationPreviewHeader
              activeTab={previewTab}
              onSaveSubmit={!formChanged ? handleSubmit : handleSave}
              isLoading={isLoading}
              isSaved={!formChanged}
              formChanged={formChanged}
              answers={currentAnswers.current}
              applicationId={applicationId}
              jobTitle={application?.job?.title}
              companyName={application?.job?.company}
              screenshot={application?.screenshot}
            />
          )}
          <ApplicationPreview 
            isLoading={loadingPreview}
            answers={currentAnswers.current}
            activeTab={previewTab}
            setActiveTab={(tab) => setPreviewTab(tab as "application" | "resume" | "cover_letter")}
            screenshot={application?.screenshot}
          />
        </div>
      </div>
    </div>
  ), [previewTab, formChanged, handleSubmit, handleSave, isLoading, loadingPreview, answers]);

  // Show loading skeleton while application data is being fetched
  if (!application) {
    return <EditApplicationPageSkeleton />;
  }

  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 bg-gray-50">
      <div className="max-w-[1400px] mx-auto h-full px-6 py-6 flex flex-col">
        {/* Header */}
        <div className="flex lg:hidden items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center">
            <Link href="/applications" className="text-gray-600 hover:text-gray-900 mr-3 sm:mr-4">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold">
              <span className="sm:hidden">Edit</span>
              <span className="hidden sm:inline">Edit Application</span>
            </h1>
          </div>
          
          <ActionButtons
            onSaveSubmit={!formChanged ? handleSubmit : handleSave}
            isLoading={isLoading}
            isSaved={!formChanged}
            formChanged={formChanged}
            applicationId={applicationId}
            jobTitle={application?.job?.title}
            companyName={application?.job?.company}
          />
        </div>

        {/* Mobile/Tablet Tabs (visible on medium and below) */}
        <div className="lg:hidden flex-1 overflow-hidden">
          <div className="bg-white rounded-lg border border-gray-200 mb-5 shadow-sm sticky top-0 z-10">
            <div className="flex">
              <button 
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium relative flex items-center justify-center gap-1.5 sm:gap-2 ${
                  activeTab === 'form' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('form')}
              >
                <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Form
                {activeTab === 'form' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button 
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium relative flex items-center justify-center gap-1.5 sm:gap-2 ${
                  activeTab === 'preview' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Preview
                {activeTab === 'preview' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>
                )}
              </button>
            </div>
          </div>

          <div className="h-[calc(100%-3.5rem)] overflow-hidden">
            {activeTab === 'form' ? (
              <div className="h-full overflow-y-auto">
                {FormContent()}
              </div>
            ) : (
              <div className="h-[calc(100vh-10rem)] overflow-hidden">
                <PreviewContent showHeader={false} />
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout (visible on large screens) */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 flex-1">
          {/* Left column - form */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 6rem)" }}>
            <div className="pr-3">
              {FormContent()}
            </div>
          </div>
          
          {/* Right column - preview */}
          <div className="h-full overflow-hidden">
            <div className="sticky top-0 h-[calc(100vh-6rem)]">
              <PreviewContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditJobApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedPage>
      <EditJobApplicationPageContent params={params} />
    </ProtectedPage>
  );
}