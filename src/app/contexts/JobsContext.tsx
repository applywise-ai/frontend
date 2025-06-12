'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Job, JobFilters } from '@/app/types/job';
import { jobsService } from '@/app/utils/firebase';
import { ApplicationWithJob } from './ApplicationsContext';

interface JobsContextType {
  // Job fetching - checks allJobs cache first, then API
  getJob: (jobId: string, applications?: ApplicationWithJob[] | null, isJobSaved?: (jobId: string) => Promise<boolean>) => Promise<{ job: Job | null; error: string | null; isSaved: boolean }>;
  jobLoading: boolean;
  
  // All jobs with pagination functionality
  allJobs: Job[];
  isLoadingAllJobs: boolean;
  isLoadingMoreJobs: boolean;
  allJobsError: string | null;
  hasMoreJobs: boolean;
  totalJobs: number;
  filteredJobsCount: number;
  refetchAllJobs: (newFilters?: JobFilters, applications?: ApplicationWithJob[] | null) => void;
  fetchInitialJobs: (applications?: ApplicationWithJob[] | null) => Promise<void>;
  fetchMoreJobs: (applications?: ApplicationWithJob[] | null) => Promise<void>;
  setJobFilters: (filters?: JobFilters) => void;
  
  // Job cache management
  updateJobCache: (job: Job, add: boolean) => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  // All jobs state
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoadingAllJobs, setIsLoadingAllJobs] = useState(true);
  const [isLoadingMoreJobs, setIsLoadingMoreJobs] = useState(false);
  const [allJobsError, setAllJobsError] = useState<string | null>(null);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filteredJobsCount, setFilteredJobsCount] = useState(0);
  const [lastJobId, setLastJobId] = useState<string | undefined>(undefined);
  const [currentFilters, setCurrentFilters] = useState<JobFilters | undefined>(undefined);
  
  // Individual job loading state
  const [jobLoading, setJobLoading] = useState(false);

  // Job fetching - checks allJobs cache first, then applications, then API
  const getJob = useCallback(async (
    jobId: string, 
    applications?: ApplicationWithJob[] | null, 
    isJobSaved?: (jobId: string) => Promise<boolean>
  ): Promise<{ job: Job | null; error: string | null; isSaved: boolean }> => {
    if (!jobId) return { job: null, error: 'No job ID provided', isSaved: false };

    try {
      // First check if job exists in allJobs cache
      const cachedJob = allJobs.find(job => job.id.toString() === jobId);
      if (cachedJob) {
        console.log(`JobsContext: Found job ${jobId} in allJobs cache`);
        const savedStatus = isJobSaved ? await isJobSaved(jobId) : false;
        return { job: cachedJob, error: null, isSaved: savedStatus };
      }

      // Second check if job exists in applications
      const applicationWithJob = applications?.find((app: ApplicationWithJob) => app.jobId === jobId);
      if (applicationWithJob?.job) {
        console.log(`JobsContext: Found job ${jobId} in applications`);
        const savedStatus = isJobSaved ? await isJobSaved(jobId) : false;
        return { job: applicationWithJob.job, error: null, isSaved: savedStatus };
      }

      // If not in cache or applications, fetch from API
      console.log(`JobsContext: Job ${jobId} not found locally, fetching from API`);
      setJobLoading(true);
      
      const jobData = await jobsService.getJob(jobId);
      const savedStatus = isJobSaved ? await isJobSaved(jobId) : false;
      
      if (jobData) {
        return { job: jobData, error: null, isSaved: savedStatus };
      } else {
        return { job: null, error: 'Job not found', isSaved: false };
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      return { job: null, error: 'Failed to load job details', isSaved: false };
    } finally {
      setJobLoading(false);
    }
  }, [allJobs]);

  // All jobs functions
  const fetchInitialJobs = useCallback(async (applications?: ApplicationWithJob[] | null) => { 
    console.log('JobsContext: fetchInitialJobs()');   
    setIsLoadingAllJobs(true);
    setAllJobsError(null);

    try {
      // Use applications parameter instead of context
      let appliedJobIds = applications?.map((app: ApplicationWithJob) => app.jobId) || [];

      // Fetch job details for applied jobs and filter out expired ones
      if (appliedJobIds.length > 0) {
        const appliedJobsData = await jobsService.getJobs(appliedJobIds);
        
        // Clear and rebuild the set with only non-expired jobs
        appliedJobIds = appliedJobsData
            .map((job, index) => job && !job.expired ? appliedJobIds[index] : null)
            .filter(Boolean) as string[]
      }
      
      // Fetch initial jobs excluding applied jobs, and total count in parallel
      const [paginatedResult, filteredCount, totalCount] = await Promise.all([
        jobsService.getJobsPaginated(9, undefined, currentFilters, new Set(appliedJobIds)),
        jobsService.getFilteredJobsCount(currentFilters, appliedJobIds.length),
        jobsService.getTotalAvailableJobsCount(appliedJobIds.length)
      ]);
      
      // Update state
      setFilteredJobsCount(filteredCount);
      setTotalJobs(totalCount);
      setHasMoreJobs(paginatedResult.hasMore);
      setLastJobId(paginatedResult.lastJobId);
      
      setAllJobs(paginatedResult.jobs);
    } catch (err) {
      console.error('Error fetching initial jobs:', err);
      setAllJobsError('Failed to load jobs');
      setAllJobs([]);
      setTotalJobs(0);
      setHasMoreJobs(false);
    } finally {
      setIsLoadingAllJobs(false);
    }
  }, [currentFilters]);

  const fetchMoreJobs = useCallback(async (applications?: ApplicationWithJob[] | null) => {
    if (!hasMoreJobs || isLoadingMoreJobs || !lastJobId) {
      return;
    }

    setIsLoadingMoreJobs(true);
    setAllJobsError(null);

    try {
        console.log(`JobsContext: fetchMoreJobs(lastJobId: ${lastJobId})`);
      // Use applications parameter to exclude applied jobs
      const appliedJobIds = applications?.map((app: ApplicationWithJob) => app.jobId) || [];
      
      const paginatedResult = await jobsService.getJobsPaginated(9, lastJobId, currentFilters, new Set(appliedJobIds));
      
      // Add new jobs to state
      const newJobs = [...allJobs, ...paginatedResult.jobs];
      
      setAllJobs(newJobs);
      setHasMoreJobs(paginatedResult.hasMore);
      setLastJobId(paginatedResult.lastJobId);
    } catch (err) {
      console.error('Error fetching more jobs:', err);
      setAllJobsError('Failed to load more jobs');
    } finally {
      setIsLoadingMoreJobs(false);
    }
  }, [hasMoreJobs, isLoadingMoreJobs, lastJobId, allJobs, currentFilters]);

  // Set job filters function
  const setJobFilters = useCallback((filters?: JobFilters) => {
    console.log(`JobsContext: setJobFilters(${filters ? 'with filters' : 'no filters'})`);
    setCurrentFilters(filters);
  }, []);

  // Job cache management function
  const updateJobCache = useCallback((job: Job, add: boolean) => {
    console.log(`JobsContext: updateJobCache(${job.id}, ${add ? 'add' : 'remove'})`);
    let shouldUpdateCounts = false;
    
    setAllJobs(prevJobs => {
      if (add) {
        const existingJobIndex = prevJobs.findIndex(existingJob => existingJob.id === job.id);
        if (existingJobIndex === -1) {
          shouldUpdateCounts = true;
          return [...prevJobs, job];
        } else {
          // Update existing job (no count change)
          const updatedJobs = [...prevJobs];
          updatedJobs[existingJobIndex] = job;
          return updatedJobs;
        }
      } else {
        const jobExists = prevJobs.some(existingJob => existingJob.id === job.id);
        if (jobExists) {
          shouldUpdateCounts = true;
          return prevJobs.filter(existingJob => existingJob.id !== job.id);
        }
        return prevJobs;
      }
    });

    // Update count only if the job array actually changed
    if (shouldUpdateCounts) {
      if (add) {
        setTotalJobs(prevTotal => prevTotal + 1);
      } else {
        setTotalJobs(prevTotal => Math.max(0, prevTotal - 1));
      }
    }
  }, []);

  // Update filteredJobsCount when all jobs are loaded
  useEffect(() => {
    if (!hasMoreJobs && !isLoadingAllJobs && allJobs.length > 0) {
      // When all jobs are loaded, use the actual displayed count
      setFilteredJobsCount(allJobs.length);
    }
  }, [hasMoreJobs, isLoadingAllJobs, allJobs.length]);

  // Context value
  const contextValue: JobsContextType = {
    // Job fetching - checks allJobs cache first, then API
    getJob,
    jobLoading,
    
    // All jobs functionality
    allJobs,
    isLoadingAllJobs,
    isLoadingMoreJobs,
    allJobsError,
    hasMoreJobs,
    totalJobs,
    filteredJobsCount,
    refetchAllJobs: (newFilters?: JobFilters, applications?: ApplicationWithJob[] | null) => {
      console.log(`JobsContext: refetchAllJobs(${newFilters ? 'with filters' : 'no filters'})`);
      // Reset state and refetch
      setLastJobId(undefined);
      setHasMoreJobs(true);
      
      // Update filters if provided
      if (newFilters !== undefined) {
        setCurrentFilters(newFilters);
      } else {
        fetchInitialJobs(applications);
      }
    },
    fetchInitialJobs,
    fetchMoreJobs,
    setJobFilters,
    updateJobCache
  };

  return (
    <JobsContext.Provider value={contextValue}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
} 