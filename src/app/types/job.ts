/**
 * Job interface representing a job posting in the application
 */
export interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  salaryValue: number; // Numeric value for filtering
  jobType: string;
  postedDate: string;
  description: string;
  isVerified?: boolean;
  isSponsored?: boolean;
  providesSponsorship?: boolean;
  experienceLevel: string;
  responsibilities?: string[];
  requirements?: string[];
  jobUrl?: string;
}

/**
 * Map of experience level keys to display values
 */
export const experienceLevelMap: Record<string, string> = {
  'entry': 'Entry Level',
  'mid': 'Mid Level',
  'senior': 'Senior Level',
  'executive': 'Executive'
}; 