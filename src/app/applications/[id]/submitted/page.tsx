'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApplicationSubmittedContent from '@/app/components/applications/ApplicationSubmittedContent';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import { useApplications } from '@/app/contexts/ApplicationsContext';
import { useGetJob } from '@/app/hooks/useGetJob';
import { Application } from '@/app/types/application';

// Define a type for unwrapped params
type ParamsType = {
  id: string;
};

function ApplicationSubmittedPageContent({ params }: { params: ParamsType }) {
  const router = useRouter();
  
  // Use React.use() to unwrap params before accessing properties
  const unwrappedParams = React.use(params as unknown as Promise<ParamsType>);
  const applicationId = unwrappedParams.id;
  
  // Use hooks to fetch application and job details
  const { applications, isLoading: applicationsLoading } = useApplications();
  const [application, setApplication] = useState<Application | null>(null);
  
  // Use the job hook with the jobId
  const { job, loading: jobLoading } = useGetJob(application?.jobId || null);
  
  // Fetch application details to get jobId - only when user is authenticated
  useEffect(() => {
    const fetchApplicationJobId = async () => {
      if (!applicationId || applicationsLoading || !applications) return;
      
      try {
        const appData = applications.find(app => app && app.id === applicationId);
        if (appData) {
          setApplication(appData);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    };
    
    fetchApplicationJobId();
  }, [applicationId, applications, applicationsLoading]);


  
  const handleViewApplications = () => {
    router.push('/applications');
  };

  const handleBrowseJobs = () => {
    router.push('/jobs');
  };
  
  if (applicationsLoading || jobLoading || !application?.jobId) {
    return (
      <div className="container max-w-4xl mx-auto py-6 sm:py-8 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-10 sm:h-12 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
          <div className="h-52 sm:h-64 bg-gray-200 rounded-lg w-full"></div>
          <div className="h-8 sm:h-10 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <ApplicationSubmittedContent
        jobTitle={job?.title || 'Job Position'}
        companyName={job?.company || 'Company'}
        onViewApplications={handleViewApplications}
        submittedAt={application?.lastUpdated}
        onBrowseJobs={handleBrowseJobs}
        variant="card"
      />
    </div>
  );
}

export default function ApplicationSubmittedPage({ params }: { params: ParamsType }) {
  return (
    <ProtectedPage>
      <ApplicationSubmittedPageContent params={params} />
    </ProtectedPage>
  );
} 