'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Image, FileText, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { ApplicationWithJob, useApplications } from '@/app/contexts/ApplicationsContext';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import { getStatusColor } from '@/app/types/application';
import { format } from 'date-fns';

// Define a type for unwrapped params
type ParamsType = {
  id: string;
};

function ApplicationViewPageContent({ params }: { params: ParamsType }) {
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationWithJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { fetchApplication } = useApplications();
  
  // Use React.use() to unwrap params before accessing properties
  const unwrappedParams = React.use(params as unknown as Promise<ParamsType>);
  const applicationId = unwrappedParams.id;
  
  // Load application data
  useEffect(() => {
    const loadApplicationData = async () => {
      if (!applicationId) return;
      try {
        setIsLoading(true);
        const appWithJob = await fetchApplication(applicationId);
        setApplication(appWithJob);
      } catch (error) {
        console.error('Error loading application:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadApplicationData();
  }, [applicationId, fetchApplication]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-6">The application you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button onClick={() => router.push('/applications')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  const { job } = application;
  const hasScreenshot = !!application.screenshot;
  const hasSubmittedScreenshot = !!application.submittedScreenshot;
  const isSuccess = application.status === 'Applied' || application.status === 'Interviewing' || application.status === 'Accepted';
  const isError = application.status === 'Failed' || application.status === 'Rejected' || application.status === 'Not Found';
  const isPending = application.status === 'Pending';



    return (
    <div className="fixed top-16 bottom-0 left-0 right-0 bg-gray-50">
      <div className="max-w-[1400px] mx-auto h-full px-6 py-6 flex flex-col">
        {/* Screenshots Comparison */}
        <div className="flex-1 overflow-hidden">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/applications" 
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <Image className="h-5 w-5 text-gray-500" />
                  </div>
                  <h2 className="text-lg font-semibold">Application Screenshots</h2>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {application.appliedDate ? format(new Date(application.appliedDate), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
                {job && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(job.jobUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Job
                  </Button>
                )}
              </div>
            </div>
            
            <div className="p-6 h-[calc(100%-4rem)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original Screenshot */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Image className="h-4 w-4" />
                    <span>Original Application</span>
                  </h3>
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                    {hasScreenshot ? (
                      <img
                        src={`${application.screenshot}?t=${Date.now()}`}
                        alt="Original application screenshot"
                        className="w-full h-auto object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-gray-50">
                        <div className="text-center">
                          <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">No screenshot available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submitted Screenshot */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Submitted Application</span>
                  </h3>
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                    {hasSubmittedScreenshot ? (
                      <img
                        src={`${application.submittedScreenshot}?t=${Date.now()}`}
                        alt="Submitted application screenshot"
                        className="w-full h-auto object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-gray-50">
                        <div className="text-center">
                          {isSuccess ? (
                            <>
                              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                              <p className="text-green-600 font-medium mb-1">Successfully Submitted</p>
                              <p className="text-gray-500 text-sm">Application was submitted to the company</p>
                            </>
                          ) : isError ? (
                            <>
                              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                              <p className="text-red-600 font-medium mb-1">Submission Failed</p>
                              <p className="text-gray-500 text-sm">There was an issue with the submission</p>
                            </>
                          ) : isPending ? (
                            <>
                              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                              <p className="text-yellow-600 font-medium mb-1">Processing</p>
                              <p className="text-gray-500 text-sm">Application is being processed</p>
                            </>
                          ) : (
                            <>
                              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">Not yet submitted</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default function ApplicationViewPage({ params }: { params: ParamsType }) {
  return (
    <ProtectedPage>
      <ApplicationViewPageContent params={params} />
    </ProtectedPage>
  );
} 