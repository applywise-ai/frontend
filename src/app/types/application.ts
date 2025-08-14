/**
 * Application interface representing a job application in the system
 */

// Form question types
export type QuestionType = 'text' | 'textarea' | 'select' | 'multiselect' | 'date' | 'file' | 'checkbox' | 'number';
export type FormSectionType = 'personal' | 'education' | 'experience' | 'resume' | 'cover_letter' | 'additional' | 'demographic';
export type ApplicationStatus = 'Draft' | 'Applied' | 'Saved' | 'Rejected' | 'Interviewing' | 'Expired' | 'Accepted' | 'Pending' | 'Failed' | 'Not Found';

// Form question structure
export interface FormQuestion {
  unique_label_id: string;
  question: string;
  answer?: string | null;
  type: QuestionType;
  placeholder?: string;
  options?: string[];
  section: FormSectionType;
  file_url?: string;
  file_name?: string;
  required?: boolean;
  pruned?: boolean;
  ai_custom?: boolean; // New property for AI custom functionality
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
  screenshot?: string;
  submittedScreenshot?: string;
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
  return status === 'Draft' || status === 'Saved' || status === 'Expired' || status === 'Pending' || status === 'Failed' || status === 'Not Found';
};

export const isSubmitted = (status: string): boolean => {
  return ['Applied', 'Saved', 'Rejected', 'Interviewing', 'Expired', 'Accepted', 'Pending', 'Failed', 'Not Found'].includes(status);
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
    case 'Pending':
      return 'bg-orange-50 text-orange-600 border-orange-200';
    case 'Failed':
      return 'bg-red-50 text-red-600 border-red-200';
    case 'Not Found':
      return 'bg-gray-50 text-gray-600 border-gray-200';
    case 'Draft':
    default:
      return 'bg-amber-50 text-amber-600 border-amber-200';
  }
};