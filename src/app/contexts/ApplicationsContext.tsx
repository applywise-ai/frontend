'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Application, FormQuestion } from '@/app/types/application';
import { Job } from '@/app/types/job';
import { applicationsService } from '@/app/services/firebase';
import jobsService from '@/app/services/api/jobs';
import apiApplicationsService from '@/app/services/api/applications';
import { useNotification } from '@/app/contexts/NotificationContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useJobs } from '@/app/contexts/JobsContext';

export interface ApplicationWithJob extends Application {
  job: Job | null;
}

interface ApplicationsContextType {
  applications: ApplicationWithJob[] | null;
  isLoading: boolean;
  error: string | null;
  // CRUD operations
  fetchApplication: (applicationId: string) => Promise<ApplicationWithJob>;
  deleteApplication: (applicationId: string) => Promise<boolean>;
  updateApplication: (applicationId: string, updates: Partial<Application>) => void;
  updateApplicationAnswer: (applicationId: string, questionId: string, answer: string | null | Partial<FormQuestion>) => Promise<Application>;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => Promise<Application>;
  // Job-specific operations
  unsaveJob: (jobId: string) => Promise<boolean>;
  isJobSaved: (jobId: string) => Promise<boolean>;
  toggleSave: (jobId: string, currentIsSaved: boolean) => Promise<void>;
  applyToJob: (jobId: string) => Promise<string>;
  submitApplication: (applicationId: string) => Promise<Application>;
  generateCoverLetter: (jobId: string, prompt: string) => Promise<{ application_id: string; cover_letter_url: string; message: string }>;
  generateCustomAnswer: (jobDescription: string, question: string, prompt: string) => Promise<{ answer: string; message: string }>;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

interface ApplicationsProviderProps {
  children: ReactNode;
}

export function ApplicationsProvider({ children }: ApplicationsProviderProps) {
  const [applications, setApplications] = useState<ApplicationWithJob[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { showSuccess } = useNotification();
  const { updateJobCache, getJob } = useJobs();

  // Reset applications when user changes
  useEffect(() => {
    if (!isAuthenticated) {
      setApplications(null);
      setIsLoading(false);
      setError(null);
    }
  }, [isAuthenticated]);

  // Load applications when user is available
  const loadApplications = useCallback(async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('ApplicationsProvider: Loading applications for user:', user.uid);
      const userApplications = await applicationsService.getUserApplications(user.uid);

      // Extract job IDs from applications
      const jobIds = userApplications.map(app => app.jobId);
      
      // Fetch job details for all applications
      let jobsData: (Job | null)[] = [];
      if (jobIds.length > 0) {
        console.log(`ApplicationsProvider: Fetching ${jobIds.length} job details`);
        jobsData = await jobsService.getJobs(jobIds);
      }
      
      // Combine applications with their job details
      const applicationsWithJobs: ApplicationWithJob[] = userApplications.map((app, index) => ({
        ...app,
        job: jobsData[index] || null
      }));

      setApplications(applicationsWithJobs);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user, loadApplications]);

  // Fetch a single application by ID
  const fetchApplication = useCallback(async (applicationId: string): Promise<ApplicationWithJob> => {
    console.log(`ApplicationsContext: fetchApplication(${applicationId})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // If not in local state, fetch from Firebase
      const application = await applicationsService.getApplication(user.uid, applicationId);
      
      if (!application) {
        throw new Error('Application not found');
      } else {
        console.log('ApplicationsContext: application', application);
      }

      // Fetch the job details
      const jobData = await jobsService.getJob(application?.jobId || '');
      
      // Create the application with job
      const applicationWithJob: ApplicationWithJob = {
        ...application || {},
        job: jobData
      };
      
      // Update local state to include this application
      setApplications(prev => {
        if (!prev) return [applicationWithJob];
        
        // Check if application already exists
        const existingIndex = prev.findIndex(app => app && app.id && app.id === applicationId);
        if (existingIndex >= 0) {
          // Update existing application
          const updated = [...prev];
          updated[existingIndex] = applicationWithJob;
          return updated;
        } else {
          // Add new application
          return [...prev, applicationWithJob];
        }
      });
      
      return applicationWithJob;
    } catch (err) {
      console.error('Error fetching application:', err);
      setError('Failed to fetch application');
      throw err;
    }
  }, [user]);

  // Delete an application
  const deleteApplication = useCallback(async (applicationId: string): Promise<boolean> => {
    console.log(`ApplicationsContext: deleteApplication(${applicationId})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const success = await applicationsService.deleteApplication(user.uid, applicationId);
      
      if (success) {
        // Get the application before removing to access job data
        const appToDelete = applications?.find(app => app && app.id && app.id === applicationId);
        
        // Remove from local state
        setApplications(prev => prev ? prev.filter(app => app.id !== applicationId) : null);
        
        // Add job back to jobs cache since application is deleted
        if (appToDelete?.job) {
          updateJobCache(appToDelete.job, true);
        }
      }
      
      return success;
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Failed to delete application');
      throw err;
    }
  }, [user, applications, updateJobCache]);

  // Update application status
  const updateApplicationStatus = useCallback(async (
    applicationId: string, 
    status: Application['status']
  ): Promise<Application> => {
    console.log(`ApplicationsContext: updateApplicationStatus(${applicationId}, ${status})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const updatedApplication = await applicationsService.updateApplicationStatus(
        user.uid, 
        applicationId, 
        status
      );
      
      // Update local state - preserve the job data
      setApplications(prev => 
        prev ? prev.map(app => 
          app.id === applicationId 
            ? { ...updatedApplication, job: app.job } as ApplicationWithJob
            : app
        ) : null
      );
      
      return updatedApplication;
    } catch (err) {
      console.error('Error updating application status:', err);
      setError('Failed to update application status');
      throw err;
    }
  }, [user]);

  // Update application
  const updateApplication = useCallback(async (
    applicationId: string, 
    updates: Partial<Application>
  ) => {
    console.log(`ApplicationsContext: updateApplication(${applicationId})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // If form questions are being updated, use the API save method
      if (updates.formQuestions) {
        await apiApplicationsService.save(applicationId, updates.formQuestions);
      }

      const updatedApplication = applications?.find(app => app && app.id && app.id === applicationId);
      const updatedApplicationWithUpdates = updatedApplication
        ? { ...updatedApplication, formQuestions: updates.formQuestions, job: updatedApplication.job }
        : null;

      // console.log(applications, updatedApplicationWithUpdates, applicationId, updatedApplication)
      // Update local state - preserve the job data
      setApplications(prev => 
        prev ? prev.map(app => 
          app && app.id && app.id === applicationId 
            ? updatedApplicationWithUpdates as ApplicationWithJob
            : app
        ) : null
      );
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Failed to update application');
      throw err;
    }
  }, [user]);

  // Update a specific answer in an application
  const updateApplicationAnswer = useCallback(async (
    applicationId: string,
    questionId: string,
    answer: string | null | Partial<FormQuestion>
  ): Promise<Application> => {
    console.log(`ApplicationsContext: updateApplicationAnswer(${applicationId}, ${questionId})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Find the current application
      const currentApp = applications?.find(app => app && app.id && app.id === applicationId);
      if (!currentApp) {
        throw new Error('Application not found');
      }

      // Update the specific question's answer
      const updatedFormQuestions = currentApp.formQuestions.map(question => 
        question.unique_label_id === questionId 
          ? { 
              ...question, 
              ...(typeof answer === 'string' || answer === null 
                ? { answer } 
                : answer)
            }
          : question
      );

      // Update the application with the new form questions
      const updatedApplication = await applicationsService.updateApplication(
        user.uid,
        applicationId,
        { formQuestions: updatedFormQuestions }
      );

      // Update local state - preserve the job data
      setApplications(prev => 
        prev ? prev.map(app => 
          app && app.id && app.id === applicationId 
            ? { ...updatedApplication, job: app.job } as ApplicationWithJob
            : app
        ) : null
      );

      return updatedApplication;
    } catch (err) {
      console.error('Error updating application answer:', err);
      setError('Failed to update application answer');
      throw err;
    }
  }, [user, applications]);

  // Save a job (create saved application) - internal helper function
  const saveJob = useCallback(async (jobId: string): Promise<string> => {
    console.log(`ApplicationsContext: saveJob(${jobId})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const applicationId = await applicationsService.saveJob(user.uid, jobId);
      
      // Fetch the job details for the new application
      const jobResult = await getJob(jobId, applications);
      const jobData = jobResult.job;
      
      // Create the new application object with job details
      const newApplication: ApplicationWithJob = {
        id: applicationId,
        userId: user.uid,
        jobId: jobId,
        status: 'Saved' as const,
        formQuestions: [],
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        job: jobData
      };
      
      setApplications(prev => prev ? [...prev, newApplication] : [newApplication]);
      
      // Remove job from jobs cache since it's now saved
      if (jobData) {
        updateJobCache(jobData, false);
      }
      
      showSuccess('Job saved. You can find it in the applications tab!');
      return applicationId;
    } catch (err) {
      console.error('Error saving job:', err);
      setError('Failed to save job');
      throw err;
    }
  }, [user, showSuccess, getJob, applications, updateJobCache]);

  // Submit an application
  const submitApplication = useCallback(async (applicationId: string): Promise<Application> => {
    console.log(`ApplicationsContext: submitApplication(${applicationId})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Use the new API service to submit the application
      await apiApplicationsService.submit(applicationId);
      
      // Then update the local application status
      const submittedApplication = await applicationsService.updateApplicationStatus(
        user.uid, 
        applicationId,
        'Applied'
      );
      
      // Get the application before updating to access job data
      const appToSubmit = applications?.find(app => app && app.id && app.id === applicationId);
      
      // Update local state - preserve the job data
      setApplications(prev => 
        prev ? prev.map(app => 
          app && app.id && app.id === applicationId 
            ? { ...submittedApplication, job: app.job } as ApplicationWithJob
            : app
        ) : null
      );
      
      // Remove job from jobs cache since application is now submitted
      if (appToSubmit?.job) {
        updateJobCache(appToSubmit.job, false);
      }
      
      return submittedApplication;
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application');
      throw err;
    }
  }, [user, applications, updateJobCache]);

  // Generate a cover letter
  const generateCoverLetter = useCallback(async (jobId: string, prompt: string): Promise<{ application_id: string; cover_letter_url: string; message: string }> => {
    console.log(`ApplicationsContext: generateCoverLetter(${jobId})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await apiApplicationsService.generateCoverLetter(jobId, prompt);
      return response;
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setError('Failed to generate cover letter');
      throw err;
    }
  }, [user]);

  // Generate a custom answer
  const generateCustomAnswer = useCallback(async (jobDescription: string, question: string, prompt: string): Promise<{ answer: string; message: string }> => {
    console.log(`ApplicationsContext: generateCustomAnswer(${jobDescription}, ${question})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await apiApplicationsService.generateCustomAnswer(jobDescription, question, prompt);
      return response;
    } catch (err) {
      console.error('Error generating custom answer:', err);
      setError('Failed to generate custom answer');
      throw err;
    }
  }, [user]);

  // Check if user has saved a job (using local state first)
  const isJobSaved = useCallback(async (jobId: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      // First check local state for better performance
      const localSavedJob = applications?.find(app => app.jobId === jobId && app.status === 'Saved');
      if (localSavedJob) {
        return true;
      }
      
      // If not found locally and applications are still loading, wait for them
      if (isLoading) {
        console.log(`ApplicationsContext: isJobSaved(${jobId})`);
        return await applicationsService.isJobSaved(user.uid, jobId);
      }
      
      // If applications are loaded and not found locally, it's not saved
      return false;
    } catch (err) {
      console.error('Error checking if job is saved:', err);
      return false;
    }
  }, [user, applications, isLoading]);

  // Unsave a job
  const unsaveJob = useCallback(async (jobId: string): Promise<boolean> => {
    console.log(`ApplicationsContext: unsaveJob(${jobId})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const success = await applicationsService.unsaveJob(user.uid, jobId);
      
      if (success) {
        // Get the job data before removing from applications
        const savedApp = applications?.find(app => app.jobId === jobId && app.status === 'Saved');
        
        // Remove the saved application from local state
        setApplications(prev => 
          prev ? prev.filter(app => !(app.jobId === jobId && app.status === 'Saved')) : null
        );
        
        // Add job back to jobs cache since it's no longer saved
        if (savedApp?.job) {
          updateJobCache(savedApp.job, true);
        }
        
        showSuccess('Job removed from saved jobs!');
      }
      
      return success;
    } catch (err) {
      console.error('Error unsaving job:', err);
      setError('Failed to unsave job');
      throw err;
    }
  }, [user, showSuccess, applications, updateJobCache]);

  // Apply to a job (create draft application or update saved to draft)
  const applyToJob = useCallback(async (jobId: string): Promise<string> => {
    console.log(`ApplicationsContext: applyToJob(${jobId})`);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Use the new API service to apply to the job
      const applicationId = await apiApplicationsService.apply(jobId);

      // Check if we updated an existing saved application or created a new one
      const existingSavedApp = applications?.find(app => app.jobId === jobId && app.status === 'Saved');
      
      if (existingSavedApp) {
        // Update the existing saved application to Draft status
        setApplications(prev => 
          prev ? prev.map(app => 
            app && app.id && app.id === applicationId 
              ? { ...app, status: 'Draft' as const, formQuestions: [], lastUpdated: new Date().toISOString() }
              : app
          ) : null
        );
        
        // Remove job from jobs cache since user is now applying
        if (existingSavedApp.job) {
          updateJobCache(existingSavedApp.job, false);
        }
      } else {
        // Fetch the job details for the new application
        const jobResult = await getJob(jobId, applications);
        const jobData = jobResult.job;
        
        // Create new draft application with job details
        const newApplication: ApplicationWithJob = {
          id: applicationId,
          userId: user.uid,
          jobId: jobId,
          status: 'Draft' as const,
          formQuestions: [],
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          job: jobData
        };
        
        setApplications(prev => prev ? [newApplication, ...prev] : [newApplication]);
        
        // Remove job from jobs cache since user is now applying
        if (jobData) {
          updateJobCache(jobData, false);
        }
      }
      
      return applicationId;
    } catch (err) {
      console.error('Error applying to job:', err);
      setError('Failed to apply to job');
      throw err;
    }
  }, [user, applications, getJob, updateJobCache]);

  // Toggle save status (save or unsave a job)
  const toggleSave = useCallback(async (jobId: string, currentIsSaved: boolean): Promise<void> => {
    console.log(`ApplicationsContext: toggleSave(${jobId}, ${currentIsSaved})`);
    if (currentIsSaved) {
      await unsaveJob(jobId);
    } else {
      await saveJob(jobId);
    }
  }, [saveJob, unsaveJob]);

  const value: ApplicationsContextType = {
    applications,
    isLoading,
    error,
    fetchApplication,
    deleteApplication,
    updateApplication,
    updateApplicationStatus,
    unsaveJob,
    isJobSaved,
    toggleSave,
    applyToJob,
    submitApplication,
    updateApplicationAnswer,
    generateCoverLetter,
    generateCustomAnswer,
  };

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications(): ApplicationsContextType {
  const context = useContext(ApplicationsContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
} 