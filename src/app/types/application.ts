/**
 * Application interface representing a job application in the system
 */

// Form question types
export type QuestionType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'radio' | 'date' | 'file';
export type FormSectionType = 'personal' | 'coverLetter' | 'screening' | 'custom' | 'resume';
export type FileType = 'resume' | 'coverLetter' | 'other';
export type ApplicationStatus = 'Draft' | 'Applied' | 'Saved' | 'Rejected' | 'Interviewing' | 'Expired' | 'Accepted';

// Answer type
export type Answer = string | Record<string, string | number | boolean | null>;

// Form question structure
export interface FormQuestion {
  id: string;
  question: string;
  answer: Answer;
  type: QuestionType;
  placeholder?: string;
  options?: string[];
  section: FormSectionType;
  fileType?: FileType;
  required?: boolean;
}

// Main application interface
export interface Application {
  id: string;
  userId: string;
  jobId: string; // Reference to job ID
  status: ApplicationStatus;
  formQuestions: FormQuestion[];
  appliedDate?: string;
  lastUpdated: string;
  createdAt: string;
  // File references
  resumeUrl?: string;
  resumeFilename?: string;
  coverLetterUrl?: string;
  coverLetterFilename?: string;
}

// Firestore-specific application interface
export interface FirestoreApplication extends Omit<Application, 'createdAt' | 'lastUpdated' | 'appliedDate'> {
  createdAt: unknown; // Firestore Timestamp
  lastUpdated: unknown; // Firestore Timestamp
  appliedDate?: unknown; // Firestore Timestamp
}

/**
 * Helper functions for applications
 */
export const unmodifiable = (status: string): boolean => {
  return status === 'Draft' || status === 'Saved' || status === 'Expired';
};

export const isSubmitted = (status: string): boolean => {
  return ['Applied', 'Saved', 'Rejected', 'Interviewing', 'Expired', 'Accepted'].includes(status);
};

export const getStatusColor = (status: Application['status']): string => {
  switch (status) {
    case 'Applied':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'Saved':
      return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'Interviewing':
      return 'bg-green-50 text-green-600 border-green-200';
    case 'Accepted':
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'Rejected':
      return 'bg-red-50 text-red-600 border-red-200';
    case 'Expired':
      return 'bg-gray-50 text-gray-600 border-gray-200';
    case 'Draft':
    default:
      return 'bg-amber-50 text-amber-600 border-amber-200';
  }
};

export const getDefaultFormQuestions = (): FormQuestion[] => {
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
      id: 'resume',
      question: 'Upload your resume',
      answer: '',
      type: 'file',
      placeholder: 'Upload PDF, DOCX, or TXT file',
      section: 'resume',
      fileType: 'resume',
      required: true
    }
  ];
}; 