/**
 * Application interface representing a job application in the system
 */
export interface Application {
  id: string;
  jobId: number;
  jobTitle: string;
  company: string;
  logo: string;
  status: 'Draft' | 'Applied' | 'Saved' | 'Rejected' | 'Interviewing';
  appliedDate: string;
  lastUpdated: string;
}

/**
 * Helper functions for applications
 */
export const isDraft = (status: string): boolean => {
  return status === 'Draft';
};

export const isSubmitted = (status: string): boolean => {
  return ['Applied', 'Saved', 'Rejected', 'Interviewing'].includes(status);
}; 