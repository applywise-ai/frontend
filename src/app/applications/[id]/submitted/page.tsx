'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApplicationSubmittedContent from '@/app/components/applications/ApplicationSubmittedContent';

// Define a type for unwrapped params
type ParamsType = {
  id: string;
};

export default function ApplicationSubmittedPage({ params }: { params: ParamsType }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Use React.use() to unwrap params before accessing properties
  const unwrappedParams = React.use(params as unknown as Promise<ParamsType>);
  const applicationId = unwrappedParams.id;
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleViewApplications = () => {
    router.push('/applications');
  };

  const handleBrowseJobs = () => {
    router.push('/jobs');
  };
  
  if (isLoading) {
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
        applicationId={applicationId}
        jobTitle="Senior Software Engineer"
        companyName="TechNova Solutions"
        onViewApplications={handleViewApplications}
        onBrowseJobs={handleBrowseJobs}
        variant="card"
      />
    </div>
  );
} 