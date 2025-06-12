'use client';

import { useState, useEffect, useRef } from 'react';
import { Job } from '@/app/types/job';
import { useJobs } from '@/app/contexts/JobsContext';
import { useApplications } from '@/app/contexts/ApplicationsContext';

export function useGetJob(jobId: string | null) {
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const fetchedJobIdRef = useRef<string | null>(null);
  
  const { getJob } = useJobs();
  const { applications, isJobSaved } = useApplications();

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setJob(null);
        setError(null);
        setIsSaved(false);
        fetchedJobIdRef.current = null;
        return;
      }
      
      // Avoid refetching the same job
      if (fetchedJobIdRef.current === jobId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const result = await getJob(jobId, applications, isJobSaved);
        
        if (result.job) {
          setJob(result.job);
          setIsSaved(result.isSaved);
          fetchedJobIdRef.current = jobId;
        } else {
          setJob(null);
          setError(result.error || 'Job not found');
          setIsSaved(false);
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
        setJob(null);
        setIsSaved(false);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, getJob, applications, isJobSaved]);

  return {
    job,
    error,
    loading,
    isSaved
  };
} 