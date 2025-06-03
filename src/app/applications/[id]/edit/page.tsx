'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, FileText } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import Link from 'next/link';
import { getBreakpoint } from '@/app/utils/breakpoints';

// Import our components
import { FormQuestion, FormSection, FileType } from '@/app/components/applications/QuestionInput';
import { FormSection as FormSectionComponent } from '@/app/components/applications/FormSection';
import { JobDetails } from '@/app/components/applications/JobDetails';
import { ApplicationPreview } from '@/app/components/applications/ApplicationPreview';
import { ActionButtons } from '@/app/components/applications/ActionButtons';
import { ApplicationPreviewHeader } from '@/app/components/applications/ApplicationPreviewHeader';
import { useNotification } from '@/app/contexts/NotificationContext';

// Define a type for unwrapped params
type ParamsType = {
  id: string;
};

export default function EditJobApplicationPage({ params }: { params: ParamsType }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [previewTab, setPreviewTab] = useState<"application" | "resume" | "coverLetter">("application");
  const [formChanged, setFormChanged] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const initialQuestionsRef = useRef<FormQuestion[]>([]);
  const fieldRefs = useRef<{[key: string]: React.RefObject<HTMLDivElement | null>}>({});
  
  // Global notification hook
  const { showSuccess } = useNotification();
  
  // Use React.use() to unwrap params before accessing properties
  const unwrappedParams = React.use(params as unknown as Promise<ParamsType>);
  const applicationId = unwrappedParams.id;
  
  // Job details for sidebar - now a state variable
  const [jobDetails, setJobDetails] = useState({
    title: "Senior Software Engineer",
    company: "TechNova Solutions",
    location: "San Francisco, CA (Remote)",
    salary: "$120K - $160K",
    status: "Draft",
    daysAgo: 14,
    jobType: "Full-time"
  });
  
  // Mock user premium status (replace with actual user data)
  const [isPremium] = useState(false); // This would come from user context/API
  
  // Load the preview when component mounts
  useEffect(() => {
    // Simulate loading the preview
    const timer = setTimeout(() => {
      setLoadingPreview(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format all form fields as questions
  // This would typically come from the backend API
  const [formQuestions, setFormQuestions] = useState<FormQuestion[]>([
    {
      id: 'fullName',
      question: 'What is your full name?',
      answer: 'John Doe',
      type: 'text',
      placeholder: 'Enter your full name',
      section: 'personal',
      required: true
    },
    {
      id: 'email',
      question: 'What is your email address?',
      answer: 'johndoe@example.com',
      type: 'email',
      placeholder: 'Enter your email address',
      section: 'personal',
      required: true
    },
    {
      id: 'phone',
      question: 'What is your phone number?',
      answer: '(555) 123-4567',
      type: 'phone',
      placeholder: 'Enter your phone number',
      section: 'personal',
      required: true
    },
    {
      id: 'currentCompany',
      question: 'Where do you currently work?',
      answer: 'Tech Solutions Inc.',
      type: 'text',
      placeholder: 'Enter your current company',
      section: 'personal',
      required: false
    },
    {
      id: 'currentRole',
      question: 'What is your current job title?',
      answer: 'Senior Software Engineer',
      type: 'text',
      placeholder: 'Enter your current role',
      section: 'personal',
      required: false
    },
    {
      id: 'yearsOfExperience',
      question: 'How many years of experience do you have?',
      answer: '5',
      type: 'text',
      placeholder: 'Enter years of experience',
      section: 'personal',
      required: true
    },
    {
      id: 'desiredSalary',
      question: 'What is your desired salary?',
      answer: '$120,000',
      type: 'text',
      placeholder: 'Enter desired salary',
      section: 'personal',
      required: true
    },
    {
      id: 'availableStartDate',
      question: 'When can you start?',
      answer: '2023-12-01',
      type: 'date',
      section: 'personal',
      required: true
    },
    {
      id: 'resume',
      question: 'Upload your resume',
      answer: 'john_doe_resume.pdf',
      type: 'file',
      placeholder: 'Upload PDF, DOCX, or TXT file',
      section: 'resume',
      fileType: 'resume',
      required: true
    },
    {
      id: 'coverLetter',
      question: 'Upload your cover letter',
      answer: 'john_doe_cover_letter.pdf',
      type: 'file',
      placeholder: 'Upload PDF, DOCX, or TXT file',
      section: 'coverLetter',
      fileType: 'coverLetter',
      required: false
    },
    {
      id: 'whyJoin',
      question: 'Why do you want to work at our company?',
      answer: "I have long admired your company's innovative approach to solving complex problems and your strong company culture. I believe my values align with your mission.",
      type: 'textarea',
      placeholder: 'Tell us why you want to join our team',
      section: 'screening',
      required: true
    },
    {
      id: 'challengingProject',
      question: 'Describe a challenging project you worked on.',
      answer: 'I led a team of 5 developers to rebuild our payment processing system that reduced transaction errors by 45% and improved processing speed by 30%. The project was completed on time and under budget.',
      type: 'textarea',
      placeholder: 'Describe your experience',
      section: 'screening',
      required: true
    },
    {
      id: 'workEnvironment',
      question: 'What is your preferred work environment?',
      answer: 'Hybrid',
      type: 'select',
      options: ['Remote', 'In-office', 'Hybrid'],
      section: 'custom',
      required: true
    },
    {
      id: 'referredBy',
      question: 'How did you hear about this position?',
      answer: 'LinkedIn',
      type: 'text',
      placeholder: 'LinkedIn, job board, referral, etc.',
      section: 'custom',
      required: false
    },
    {
      id: 'relocation',
      question: 'Are you willing to relocate?',
      answer: 'Yes',
      type: 'radio',
      options: ['Yes', 'No', 'Maybe'],
      section: 'custom',
      required: false
    },
    {
      id: 'salaryExpectations',
      question: 'What are your salary expectations?',
      answer: '$120,000 - $140,000',
      type: 'text',
      placeholder: 'Enter your salary range',
      section: 'custom',
      required: false
    }
  ]);

  // Store initial form state after first render
  useEffect(() => {
    initialQuestionsRef.current = JSON.parse(JSON.stringify(formQuestions));
  }, [formQuestions]);
  
  // Initialize refs for fields
  useEffect(() => {
    const refs: {[key: string]: React.RefObject<HTMLDivElement | null>} = {};
    formQuestions.forEach(q => {
      refs[q.id] = React.createRef<HTMLDivElement | null>();
    });
    fieldRefs.current = refs;
  }, []);

  // Handle input change for any question
  const handleQuestionChange = (id: string, value: string) => {
    if (isSaved) {
      // Check if form is being changed after it was saved
      setFormChanged(true);
      setIsSaved(false);
    }

    // Clear validation error for this field if it exists
    if (validationErrors.includes(id)) {
      setValidationErrors(prev => prev.filter(item => item !== id));
    }

    setFormQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, answer: value } : q)
    );
  };

  const validateForm = () => {
    // Check for required fields
    const missingFields = formQuestions
      .filter(q => q.required && !q.answer)
      .map(q => q.id);
    
    setValidationErrors(missingFields);
    
    if (missingFields.length > 0) {
      // Scroll to the first error field
      const firstErrorId = missingFields[0];
      const errorRef = fieldRefs.current[firstErrorId];
      
      if (errorRef && errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return false;
    }
    
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Prepare the state to send to the API
    const applicationData = {
      applicationId,
      formData: formQuestions
    };
    
    // Log the data being sent (for debugging)
    console.log('Saving application data:', applicationData);
    
    // Simulate API call
    setTimeout(() => {
      // Here you would normally send applicationData to your API
      setIsLoading(false);
      setIsSaved(true);
      setFormChanged(false);
      
      // Store the current state as the new baseline
      initialQuestionsRef.current = JSON.parse(JSON.stringify(formQuestions));
      
      // Show success notification
      showSuccess('Application saved successfully!');
      
      // Switch to preview tab in mobile view
      setActiveTab('preview');
    }, 1500);
  };

  const handleSubmit = () => {
    // Don't submit unless the form is saved first
    if (!isSaved && formChanged) {
      handleSave();
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Prepare the state to send to the API
    const applicationData = {
      applicationId,
      formData: formQuestions,
      status: "Applied"
    };
    
    // Log the data being sent (for debugging)
    console.log('Submitting application data:', applicationData);
    
    // Update status to Applied
    setJobDetails(prev => ({
      ...prev,
      status: "Applied"
    }));
    
    // Simulate API call
    setTimeout(() => {
      // Show success notification before redirecting
      showSuccess('Application submitted successfully!');
      
      // Wait a bit for the notification to show, then redirect
      setTimeout(() => {
        router.push(`/applications/${applicationId}/submitted`);
      }, 1000);
    }, 1500);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // Simulate API call to delete the application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success notification
      showSuccess('Application deleted successfully!');
      
      // Wait a bit for the notification to show, then redirect
      setTimeout(() => {
        router.push('/applications');
      }, 1000);
    } catch (err) {
      console.error('Error deleting application:', err);
      setIsDeleting(false);
    }
  };

  // Filter questions by section
  const personalQuestions = formQuestions.filter(q => q.section === 'personal');
  const resumeQuestions = formQuestions.filter(q => q.section === 'resume');
  const coverLetterQuestions = formQuestions.filter(q => q.section === 'coverLetter');
  const screeningQuestions = formQuestions.filter(q => q.section === 'screening');
  const customQuestions = formQuestions.filter(q => q.section === 'custom');
  
  // Get section title based on section name
  const getSectionTitle = (section: FormSection): string => {
    switch (section) {
      case 'personal': return 'Personal Information';
      case 'resume': return 'Resume';
      case 'coverLetter': return 'Cover Letter';
      case 'screening': return 'Screening Questions';
      case 'custom': return 'Additional Information';
      default: return 'Other Information';
    }
  };

  // Get badge styling based on status
  const getBadgeStyles = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Saved':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Interviewing':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'Rejected':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'Draft':
      default:
        return 'bg-amber-50 text-amber-600 border-amber-200';
    }
  };

  // Function to handle file preview requests
  const handleFilePreview = (fileType: FileType) => {
    if (fileType === 'resume' || fileType === 'coverLetter') {
      // Set appropriate preview tab
      setPreviewTab(fileType);
      
      // If on mobile, switch to preview tab
      if (window.innerWidth < getBreakpoint('lg')) {
        setActiveTab('preview');
      }
    }
  };

  // Form content component to avoid repetition
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
            className={getBadgeStyles(jobDetails.status)}
          >
            {jobDetails.status}
          </Badge>
        </div>
        <div className="px-6 py-5">
          <JobDetails {...jobDetails} />
        </div>
      </div>
      
      <div className="space-y-6">
        <FormSectionComponent 
          title={getSectionTitle('personal')} 
          questions={personalQuestions} 
          onQuestionChange={handleQuestionChange} 
          section="personal"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={fieldRefs.current}
          onSuccess={showSuccess}
          isPremium={isPremium}
        />
        <FormSectionComponent 
          title={getSectionTitle('resume')} 
          questions={resumeQuestions} 
          onQuestionChange={handleQuestionChange} 
          section="resume"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={fieldRefs.current}
          onSuccess={showSuccess}
          isPremium={isPremium}
        />
        <FormSectionComponent 
          title={getSectionTitle('coverLetter')} 
          questions={coverLetterQuestions} 
          onQuestionChange={handleQuestionChange} 
          section="coverLetter"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={fieldRefs.current}
          onSuccess={showSuccess}
          isPremium={isPremium}
        />
        <FormSectionComponent 
          title={getSectionTitle('screening')} 
          questions={screeningQuestions} 
          onQuestionChange={handleQuestionChange} 
          section="screening"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={fieldRefs.current}
          onSuccess={showSuccess}
          isPremium={isPremium}
        />
        <FormSectionComponent 
          title={getSectionTitle('custom')} 
          questions={customQuestions} 
          onQuestionChange={handleQuestionChange} 
          section="custom"
          onPreview={handleFilePreview}
          validationErrors={validationErrors}
          fieldRefs={fieldRefs.current}
          onSuccess={showSuccess}
          isPremium={isPremium}
        />
      </div>
    </div>
  );

  // Preview content component
  const PreviewContent = ({ showHeader = true }: { showHeader?: boolean }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col shadow-sm">
      <div className="flex-grow overflow-auto">
        <div className="flex-grow overflow-auto">
          {showHeader && (
            <ApplicationPreviewHeader
              activeTab={previewTab}
              onCancel={handleDelete}
              onSaveSubmit={isSaved && !formChanged ? handleSubmit : handleSave}
              isLoading={isLoading}
              isDeleting={isDeleting}
              isSaved={isSaved}
              formChanged={formChanged}
            />
          )}
          <ApplicationPreview 
            isLoading={loadingPreview}
            resumeFile={formQuestions.find(q => q.id === 'resume')?.answer || ''}
            coverLetterFile={formQuestions.find(q => q.id === 'coverLetter')?.answer || ''}
            activeTab={previewTab}
            setActiveTab={(tab) => setPreviewTab(tab as "application" | "resume" | "coverLetter")}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 bg-gray-50">
      <div className="max-w-[1400px] mx-auto h-full px-6 py-6 flex flex-col">
        {/* Header */}
        <div className="flex lg:hidden items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center">
            <Link href="/applications" className="text-gray-600 hover:text-gray-900 mr-3 sm:mr-4">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold">Edit Application</h1>
          </div>
          
          <ActionButtons
            onCancel={handleDelete}
            onSaveSubmit={isSaved && !formChanged ? handleSubmit : handleSave}
            isLoading={isLoading}
            isDeleting={isDeleting}
            isSaved={isSaved}
            formChanged={formChanged}
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
                <FormContent />
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
              <FormContent />
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