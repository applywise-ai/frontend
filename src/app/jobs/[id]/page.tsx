'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import JobDetailsPanel from '@/app/components/jobs/JobDetailsPanel';
import Link from 'next/link';
import { useApplications } from '@/app/contexts/ApplicationsContext';
import { useGetJob } from '@/app/hooks/useGetJob';

function JobDetailPageContent() {
  const params = useParams();
  const jobId = params.id as string;
  
  // Use our hooks
  const { job, error: jobError, loading: jobLoading } = useGetJob(jobId);
  const { applications } = useApplications();

  // Function to check if user has applied to this job (any status except "Saved")
  const hasApplied = (): boolean => {
    if (!applications || !jobId) return false;
    return applications.some(app => app.jobId === jobId && app.status !== 'Saved');
  };
  
  if ((!job && !jobLoading) || jobError) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-8">
            {jobError || "The job you're looking for doesn't exist or has been removed."}
          </p>
          <Link 
            href="/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }
  
  // Show "job doesn't exist" for expired jobs
  if (job?.expired && !jobLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-8">The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Job details using JobDetailsPanel component */}
        <div className="max-w-9xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <JobDetailsPanel 
              job={job} 
              isLoading={jobLoading}
              fullPage={true}
              hasApplied={hasApplied()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <ProtectedPage>
      <JobDetailPageContent />
    </ProtectedPage>
  );
} 