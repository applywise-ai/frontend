import { doc, getDoc, getDocs, query, collection, where, documentId, limit, startAfter, getCountFromServer, orderBy } from 'firebase/firestore';
import { db } from './config';
import { Job, JobFilters } from '@/app/types/job';

class JobsService {
  /**
   * Get reference to a specific job document
   */
  private getJobRef(jobId: string) {
    return doc(db, 'jobs', jobId);
  }

  /**
   * Get paginated jobs from Firestore with filters, excluding specified job IDs
   * Simplified version - fetches one batch and returns what's available
   */
  async getJobsPaginated(
    pageSize: number = 9, 
    lastJobId?: string, 
    filters?: JobFilters,
    excludedJobIds?: Set<string>
  ): Promise<{
    jobs: Job[];
    hasMore: boolean;
    lastJobId?: string;
  }> {
    try {
      // Fetch more than needed to account for excluded jobs, but don't retry
      const fetchSize = Math.min(50, pageSize * 2); // Fetch 2x what we need, max 50
      
      // Build the base query
      const constraints: Parameters<typeof query>[1][] = [];
      
      // Apply filters
      if (filters) {
        // Specialization filter
        if (filters.specializations && filters.specializations.length > 0) {
          constraints.push(where('specialization', 'in', filters.specializations));
        }
        
        // Experience level filter
        if (filters.experienceLevels && filters.experienceLevels.length > 0) {
          constraints.push(where('experienceLevel', 'in', filters.experienceLevels));
        }
        
        // Minimum salary filter
        if (filters.minSalary && filters.minSalary > 0) {
          constraints.push(where('salaryValue', '>=', filters.minSalary));
        }
        
        // Sponsorship filter
        if (filters.sponsorship && filters.sponsorship !== 'any') {
          const providesSponsor = filters.sponsorship === 'yes';
          constraints.push(where('providesSponsorship', '==', providesSponsor));
        }
        
        // Sorting
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'salary-high':
              constraints.push(orderBy('salaryValue', 'desc'));
              break;
            case 'salary-low':
              constraints.push(orderBy('salaryValue', 'asc'));
              break;
            case 'recent':
              constraints.push(orderBy('postedDate', 'desc'));
              break;
          }
        }
      }
      
      // Always exclude expired jobs from jobs page
      constraints.push(where('expired', '!=', true));
      
      // Add default sorting by postedDate timestamp
      if (!filters?.sortBy) {
        constraints.push(orderBy('postedDate', 'desc')); // Most recent first
      }
      
      // Add pagination
      constraints.push(limit(fetchSize + 1)); // Get one extra to check if there are more
      
      // If we have a lastJobId, start after that document
      if (lastJobId) {
        const lastJobRef = doc(db, 'jobs', lastJobId);
        const lastJobSnap = await getDoc(lastJobRef);
        if (lastJobSnap.exists()) {
          constraints.push(startAfter(lastJobSnap));
        }
      }
      
      // Build the final query
      const q = query(collection(db, 'jobs'), ...constraints);
      
      const querySnapshot = await getDocs(q);
      
      let jobs: Job[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const job: Job = {
          id: parseInt(doc.id),
          ...data
        } as Job;
        jobs.push(job);
      });

      // Apply client-side filters for text search and location
      if (filters) {
        // Text search filter
        if (filters.query) {
          const searchTerms = filters.query.toLowerCase();
          jobs = jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerms) || 
            job.company.toLowerCase().includes(searchTerms) || 
            job.description.toLowerCase().includes(searchTerms)
          );
        }
        
        // Location filter
        if (filters.locations && filters.locations.length > 0) {
          jobs = jobs.filter(job => {
            const jobLocation = job.location.toLowerCase();
            return filters.locations!.some(loc => {
              if (loc === 'remote') {
                return jobLocation.includes('remote');
              } else if (loc === 'hybrid') {
                return jobLocation.includes('hybrid');
              } else {
                // For city locations, check if the job location contains the city name
                const cityName = loc.split('-')[0].replace(/-/g, ' '); // Convert 'new-york-ny' to 'new york'
                return jobLocation.includes(cityName);
              }
            });
          });
        }
      }

      // Check if there are more jobs available
      const hasMore = jobs.length > fetchSize;
      if (hasMore) {
        jobs.pop(); // Remove the extra job we fetched for pagination check
      }
      
      // Filter out excluded jobs (saved jobs)
      const availableJobs = excludedJobIds 
        ? jobs.filter(job => !excludedJobIds.has(job.id.toString()))
        : jobs;
      
      // Take only the requested page size
      const finalJobs = availableJobs.slice(0, pageSize);
      
      // Fix: Use the last job from finalJobs, not from the full fetched batch
      const lastJobIdForNext = finalJobs.length > 0 ? finalJobs[finalJobs.length - 1].id.toString() : undefined;

      const result = {
        jobs: finalJobs,
        hasMore: hasMore || availableJobs.length > pageSize,
        lastJobId: lastJobIdForNext // This should be the last displayed job
      };

      return result;
    } catch (error) {
      console.error('Error in getJobsPaginated:', error);
      return {
        jobs: [],
        hasMore: false
      };
    }
  }

  /**
   * Get total count of jobs in Firestore
   */
  async getTotalJobsCount(): Promise<number> {
    try {
      const q = query(collection(db, 'jobs'), where('expired', '!=', true));
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      
      return count;
    } catch (error) {
      console.error('Error getting jobs count from Firestore:', error);
      return 0;
    }
  }

  /**
   * Get total count of jobs available to the user (excludes saved jobs)
   * Ignores all filters and returns total jobs in collection minus excluded jobs
   */
  async getTotalAvailableJobsCount(excludedJobIdsCount?: number): Promise<number> {
    try {
      const totalCount = await this.getTotalJobsCount();
      
      // Subtract excluded jobs from total count
      const finalCount = excludedJobIdsCount ? Math.max(0, totalCount - excludedJobIdsCount) : totalCount;
      
      return finalCount;
    } catch (error) {
      console.error('Error getting total available jobs count:', error);
      return 0;
    }
  }

  /**
   * Get job details by ID from Firestore
   */
  async getJob(jobId: string): Promise<Job | null> {
    try {
      const jobRef = this.getJobRef(jobId);
      const jobSnap = await getDoc(jobRef);
      
      if (jobSnap.exists()) {
        const data = jobSnap.data();
        return {
          id: parseInt(jobId),
          ...data
        } as Job;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching job from Firestore:', error);
      return null;
    }
  }

  /**
   * Optimized batch fetch of multiple jobs from Firestore
   * Uses Firestore's 'in' query with chunking for the 10-item limit
   */
  async getJobs(jobIds: string[]): Promise<(Job | null)[]> {
    if (jobIds.length === 0) return [];

    try {
      // Remove duplicates while preserving order
      const uniqueJobIds = [...new Set(jobIds)];
      
      // Firestore 'in' queries are limited to 10 items, so we need to chunk
      const chunks = this.chunkArray(uniqueJobIds, 10);
      const allJobs = new Map<string, Job>();
      
      // Fetch all chunks in parallel
      const chunkPromises = chunks.map(async (chunk) => {
        try {
          const q = query(
            collection(db, 'jobs'),
            where(documentId(), 'in', chunk)
          );
          
          const querySnapshot = await getDocs(q);
          const jobs: Job[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const job: Job = {
              id: parseInt(doc.id),
              ...data
            } as Job;
            jobs.push(job);
            allJobs.set(doc.id, job);
          });
          
          return jobs;
        } catch (error) {
          console.error('Error fetching job chunk:', error);
          return [];
        }
      });

      // Wait for all chunks to complete
      await Promise.all(chunkPromises);
      
      // Map results back to original order, including missing jobs
      const results: (Job | null)[] = jobIds.map((jobId) => {
        const firestoreJob = allJobs.get(jobId);
        if (firestoreJob) {
          return firestoreJob;
        }
        
        return null;
      });

      return results;
      
    } catch (error) {
      console.error('Error in batch job fetch:', error);
      // Fallback to individual requests
      return this.getJobsFallback(jobIds);
    }
  }

  /**
   * Fallback method using individual requests (original implementation)
   */
  private async getJobsFallback(jobIds: string[]): Promise<(Job | null)[]> {
    try {
      const jobPromises = jobIds.map(jobId => this.getJob(jobId));
      return await Promise.all(jobPromises);
    } catch (error) {
      console.error('Error fetching multiple jobs (fallback):', error);
      return jobIds.map(() => null);
    }
  }

  /**
   * Utility function to chunk arrays
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Get count of jobs that match current filters (excludes saved jobs)
   */
  async getFilteredJobsCount(filters?: JobFilters, excludedJobIdsCount?: number): Promise<number> {
    try {
      if (!filters || Object.keys(filters).length === 0) {
        // No filters, return total available count
        return this.getTotalAvailableJobsCount(excludedJobIdsCount);
      }
      
      // Build query constraints (same as in getJobsPaginated but without pagination)
      const constraints: Parameters<typeof query>[1][] = [];
      
      if (filters.specializations && filters.specializations.length > 0) {
        constraints.push(where('specialization', 'in', filters.specializations));
      }
      
      if (filters.experienceLevels && filters.experienceLevels.length > 0) {
        constraints.push(where('experienceLevel', 'in', filters.experienceLevels));
      }
      
      if (filters.minSalary && filters.minSalary > 0) {
        constraints.push(where('salaryValue', '>=', filters.minSalary));
      }
      
      if (filters.sponsorship && filters.sponsorship !== 'any') {
        const providesSponsor = filters.sponsorship === 'yes';
        constraints.push(where('providesSponsorship', '==', providesSponsor));
      }
      
      // Always exclude expired jobs
      constraints.push(where('expired', '!=', true));
      
      const q = query(collection(db, 'jobs'), ...constraints);
      const snapshot = await getCountFromServer(q);
      let count = snapshot.data().count;
      
      // Note: This doesn't account for client-side filters (text search, location)
      // For a more accurate count, we'd need to fetch and filter all matching jobs
      
      // Subtract excluded jobs
      if (excludedJobIdsCount && excludedJobIdsCount > 0) {
        count = Math.max(0, count - excludedJobIdsCount);
      }
      
      return count;
    } catch (error) {
      console.error('Error getting filtered jobs count:', error);
      return 0;
    }
  }
}

const jobsService = new JobsService();
export default jobsService; 