import { Timestamp } from 'firebase/firestore';

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