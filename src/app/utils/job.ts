import { Timestamp } from 'firebase/firestore';
import { Job, JOB_TYPE_OPTIONS, ROLE_LEVEL_OPTIONS, LOCATION_TYPE_OPTIONS } from '@/app/types/job';
import { ApiJobResponse } from '@/app/services/jobs';

/**
 * Converts a Firestore Timestamp to a relative time string
 * Examples: "Now", "5 minutes ago", "3 hours ago", "2 days ago"
 */
export function formatRelativeTime(timestamp: Timestamp | Date | string): string {
  let date: Date;

  // Handle different input types
  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string') {
    // If it's already a relative string, return as-is for backward compatibility
    if (timestamp.includes('ago') || timestamp.toLowerCase() === 'now') {
      return timestamp;
    }
    date = new Date(timestamp);
  } else {
    console.warn('Invalid timestamp format:', timestamp);
    return 'Unknown';
  }

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  // Handle future dates (shouldn't happen, but just in case)
  if (diffInMs < 0) {
    return 'Now';
  }

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 60) {
    return 'Now';
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  } else if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
  } else if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  } else {
    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
  }
}

/**
 * Formats a job's posted date for display
 * Convenience wrapper around formatRelativeTime specifically for job posted dates
 */
export function formatJobPostedDate(postedDate: string | Timestamp): string {
  return formatRelativeTime(postedDate);
} 

/**
 * Convert API job response to Job interface
 * Maps snake_case API fields to camelCase Job interface
 */
export function convertApiJobToJob(apiJob: ApiJobResponse): Job {
  return {
    id: apiJob.id || '',
    title: apiJob.title,
    company: apiJob.company,
    logo: apiJob.logo,
    companyDescription: apiJob.company_description,
    companyUrl: apiJob.company_url,
    location: apiJob.location,
    salaryMinRange: apiJob.salary_min_range,
    salaryMaxRange: apiJob.salary_max_range,
    salaryCurrency: apiJob.salary_currency,
    jobType: apiJob.job_type || 'fulltime',
    description: apiJob.description || '',
    postedDate: apiJob.posted_date || apiJob.created_at || '',
    experienceLevel: apiJob.experience_level || '',
    specialization: apiJob.specialization,
    responsibilities: apiJob.responsibilities || [],
    requirements: apiJob.requirements || [],
    jobUrl: apiJob.job_url,
    skills: apiJob.skills || [],
    shortResponsibilities: apiJob.short_responsibilities,
    shortQualifications: apiJob.short_qualifications,
    isRemote: apiJob.is_remote || false,
    isVerified: apiJob.is_verified || false,
    isSponsored: apiJob.is_sponsored || false,
    providesSponsorship: apiJob.provides_sponsorship || false,
    expired: apiJob.expired || false
  };
}

/**
 * Format salary range for display
 */
export function formatSalaryRange(job: Job): string {
  if (job.salaryMinRange && job.salaryMaxRange) {
    const currency = job.salaryCurrency || '$';
    return `${job.salaryMinRange.toLocaleString()} - ${job.salaryMaxRange.toLocaleString()} ${currency}`;
  }
  return 'Not specified';
}

/**
 * Get job type label from value
 */
export function getJobTypeLabel(jobType?: string): string {
  if (!jobType) return 'Not specified';
  const option = JOB_TYPE_OPTIONS.find(type => type.value === jobType);
  return option?.label || jobType;
}

/**
 * Get experience level label from value
 */
export function getExperienceLevelLabel(experienceLevel?: string): string {
  if (!experienceLevel) return 'Not specified';
  const option = ROLE_LEVEL_OPTIONS.find(level => level.value === experienceLevel);
  return option?.label || ROLE_LEVEL_OPTIONS.find(level => level.value === 'junior')?.label || 'Not specified';
}

/**
 * Get location label from value
 */
export function getLocationLabel(location?: string): string {
  if (!location) return 'Not specified';
  const option = LOCATION_TYPE_OPTIONS.find(loc => loc.value === location);
  return option?.label || location;
}

/**
 * Get location label from job object
 * Priority: Remote (if isRemote) > Location > Not specified
 */
export function getLocationLabelFromJob(job: Job): string {
  if (job.isRemote) return 'Remote';
  if (job.location) {
    const option = LOCATION_TYPE_OPTIONS.find(loc => loc.value === job.location);
    return option?.label || job.location;
  }
  return 'Not specified';
}