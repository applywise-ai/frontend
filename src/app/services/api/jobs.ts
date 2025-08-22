import { Job, JobFilters } from '@/app/types/job';
import { convertApiJobToJob } from '@/app/utils/job';
import apiService from './api';

// API response interface
export interface ApiJobResponse {
  id: string;
  title: string;
  company: string;
  logo?: string;
  company_description?: string;
  company_url?: string;
  location?: string;
  salary_currency?: string;
  salary_min_range?: number;
  salary_max_range?: number;
  job_type?: string;
  posted_date?: string;
  created_at?: string;
  description: string;
  is_verified?: boolean;
  is_sponsored?: boolean;
  provides_sponsorship?: boolean;
  experience_level?: string;
  specialization?: string;
  responsibilities?: string[];
  requirements?: string[];
  job_url?: string;
  skills?: string[];
  short_responsibilities?: string;
  short_qualifications?: string;
  expired?: boolean;
  is_remote?: boolean;
}

class JobsService {
  /**
   * Get paginated jobs from API with filters, excluding specified job IDs
   */
  async getJobsPaginated(
    pageSize: number = 9, 
    offset: number = 0, 
    filters?: JobFilters,
    excludedJobIds?: Set<string>
  ): Promise<{
    jobs: Job[];
    hasMore: boolean;
    totalCount: number;
  }> {
    try {
      const params = new URLSearchParams();
      
      // Pagination
      params.append('limit', pageSize.toString());
      params.append('offset', offset.toString());
      console.log(filters);
      // Search query
      if (filters?.query) {
        params.append('q', filters.query);
      }
      
      // Location filter
      if (filters?.locations && filters.locations.length > 0) {
        params.append('location', filters.locations.join(','));
      }
      
      // Specialization filter
      if (filters?.specializations && filters.specializations.length > 0) {
        params.append('specialization', filters.specializations.join(','));
      }
      
      // Experience level filter
      if (filters?.experienceLevels && filters.experienceLevels.length > 0) {
        params.append('experience_level', filters.experienceLevels.join(','));
      }
      
      // Salary filter
      if (filters?.minSalary && filters.minSalary > 0) {
        params.append('salary_min', filters.minSalary.toString());
      }
      
      // Sponsorship filter
      if (filters?.sponsorship && filters.sponsorship !== 'any') {
        params.append('provides_sponsorship', filters.sponsorship === 'yes' ? 'true' : 'false');
      }
      
      // Sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'salary-high':
            params.append('sort_by', 'salary_max_range');
            params.append('sort_order', 'desc');
            break;
          case 'salary-low':
            params.append('sort_by', 'salary_min_range');
            params.append('sort_order', 'asc');
            break;
          case 'recent':
            params.append('sort_by', 'created_at');
            params.append('sort_order', 'desc');
            break;
        }
      }
      
      // Exclude job IDs
      if (excludedJobIds && excludedJobIds.size > 0) {
        params.append('excluded_job_ids', Array.from(excludedJobIds).join(','));
      }
      
      const data = await apiService.get(`/jobs/paginated?${params.toString()}`) as { jobs: ApiJobResponse[]; has_more: boolean; total_count: number };
      
      // Transform API response to match our Job interface
      const jobs: Job[] = data.jobs.map((apiJob: ApiJobResponse) => convertApiJobToJob(apiJob));
      
      return {
        jobs,
        hasMore: data.has_more,
        totalCount: data.total_count
      };
    } catch (error) {
      console.error('Error in getJobsPaginated:', error);
      return {
        jobs: [],
        hasMore: false,
        totalCount: 0
      };
    }
  }

  /**
   * Get total count of jobs available to the user (excludes saved jobs)
   */
  async getTotalAvailableJobsCount(excludedJobIds?: Set<string>): Promise<number> {
    try {
      const params = new URLSearchParams();
      // Exclude job IDs
      if (excludedJobIds && excludedJobIds.size > 0) {
        params.append('excluded_job_ids', Array.from(excludedJobIds).join(','));
      }
      
      const count = await apiService.get(`/jobs/total-available-count?${params.toString()}`) as number;
      return count;
    } catch (error) {
      console.error('Error getting total available jobs count:', error);
      return 0;
    }
  }

  /**
   * Get job details by ID from API
   */
  async getJob(jobId: string): Promise<Job | null> {
    try {
      const apiJob = await apiService.get<ApiJobResponse>(`/jobs/${jobId}`);
      
      // Transform API response to match our Job interface
      const job: Job = convertApiJobToJob(apiJob);
      
      return job;
    } catch (error) {
      console.error('Error fetching job from API:', error);
      return null;
    }
  }

  /**
   * Optimized batch fetch of multiple jobs from API
   */
  async getJobs(jobIds: string[]): Promise<(Job | null)[]> {
    if (jobIds.length === 0) return [];

    try {
      // Remove duplicates while preserving order
      const uniqueJobIds = [...new Set(jobIds)];
      
      const params = new URLSearchParams();
      params.append('job_ids', uniqueJobIds.join(','));
      
      const apiJobs = await apiService.get<ApiJobResponse[]>(`/jobs/bulk?${params.toString()}`);
      
      // Create a map for quick lookup
      const jobMap = new Map<string, Job>();
      
      apiJobs.forEach((apiJob: ApiJobResponse) => {
        if (apiJob) {
          const job: Job = convertApiJobToJob(apiJob);
          jobMap.set(apiJob.id, job);
        }
      });
      
      // Map results back to original order, including missing jobs
      const results: (Job | null)[] = jobIds.map((jobId) => {
        return jobMap.get(jobId) || null;
      });

      return results;
      
    } catch (error) {
      console.error('Error in batch job fetch:', error);
      // Fallback to individual requests
      return this.getJobsFallback(jobIds);
    }
  }

  /**
   * Fallback method using individual requests
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
   * Get recommended jobs for the user
   */
  async getRecommendedJobs(
    experienceLevels?: string[],
    specializations?: string[],
    requiresSponsorship?: boolean,
    excludedJobIds?: string[]
  ): Promise<Job[]> {
    try {
      const params = new URLSearchParams();
      
      // Add experience levels if provided
      if (experienceLevels && experienceLevels.length > 0) {
        params.append('experience_level', experienceLevels.join(','));
      }
      
      // Add specializations if provided
      if (specializations && specializations.length > 0) {
        params.append('specializations', specializations.join(','));
      }
      
      // Add sponsorship requirement if provided
      if (requiresSponsorship !== undefined) {
        params.append('requires_sponsorship', requiresSponsorship.toString());
      }
      
      // Add excluded job IDs if provided
      if (excludedJobIds && excludedJobIds.length > 0) {
        params.append('excluded_job_ids', excludedJobIds.join(','));
      }
      
      const apiJobs = await apiService.get<ApiJobResponse[]>(`/jobs/recommended?${params.toString()}`);
      
      // Transform API response to match our Job interface
      const jobs: Job[] = apiJobs.map((apiJob: ApiJobResponse) => convertApiJobToJob(apiJob));
      
      return jobs;
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      return [];
    }
  }

  /**
   * Get count of jobs that match current filters (excludes saved jobs)
   */
  async getFilteredJobsCount(filters?: JobFilters, excludedJobIds?: string[]): Promise<number> {
    try {
      const params = new URLSearchParams();
      
      // Apply the same filters as getJobsPaginated
      if (filters?.query) {
        params.append('q', filters.query);
      }
      
      if (filters?.locations && filters.locations.length > 0) {
        params.append('location', filters.locations.join(','));
      }
      
      if (filters?.specializations && filters.specializations.length > 0) {
        params.append('specialization', filters.specializations.join(','));
      }
      
      if (filters?.experienceLevels && filters.experienceLevels.length > 0) {
        params.append('experience_level', filters.experienceLevels.join(','));
      }
      
      if (filters?.minSalary && filters.minSalary > 0) {
        params.append('salary_min', filters.minSalary.toString());
      }
      
      if (filters?.sponsorship && filters.sponsorship !== 'any') {
        params.append('provides_sponsorship', filters.sponsorship === 'yes' ? 'true' : 'false');
      }
      
      // Add excluded job IDs if provided
      if (excludedJobIds && excludedJobIds.length > 0) {
        params.append('excluded_job_ids', excludedJobIds.join(','));
      }
      
      const count = await apiService.get(`/jobs/filtered-count?${params.toString()}`) as number;
      return count;
    } catch (error) {
      console.error('Error getting filtered jobs count:', error);
      return 0;
    }
  }
}

const jobsService = new JobsService();
export default jobsService; 