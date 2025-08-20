'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import JobSearchBar from '@/app/components/jobs/JobSearchBar';
import JobCard from '@/app/components/jobs/JobCard';
import JobDetailsPanel from '@/app/components/jobs/JobDetailsPanel';
import WelcomeModal from '@/app/components/WelcomeModal';
import WelcomeToProModal from '@/app/components/WelcomeToProModal';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Job } from '@/app/types/job';
import { getBreakpoint } from '@/app/utils/breakpoints';
import { useJobs } from '@/app/contexts/JobsContext';
import { useApplications } from '@/app/contexts/ApplicationsContext';
import { useJobFilters } from '@/app/hooks/useJobFilters';
import { stripeService } from '@/app/services/api';
import JobCardSkeleton from '../components/loading/JobCardSkeleton';


function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState('recent');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingJobs] = useState<Set<string>>(new Set());
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showWelcomeToProModal, setShowWelcomeToProModal] = useState(false);
  const lastJobRef = useRef<HTMLDivElement>(null);
  
  // Check for session_id parameter and show welcome modal if payment succeeded
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Check session payment status
      const checkSessionStatus = async () => {
        try {
          const sessionInfo = await stripeService.getSessionInfo(sessionId);
          if (sessionInfo.is_paid) {
            setShowWelcomeToProModal(true);
          }
          // Clean up URL by removing the session_id parameter
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('session_id');
          router.replace(newUrl.pathname + newUrl.search);
        } catch (error) {
          console.error('Error checking session status:', error);
          // Clean up URL even if there was an error
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('session_id');
          router.replace(newUrl.pathname + newUrl.search);
        }
      };
      
      checkSessionStatus();
    }
  }, [searchParams, router]);
  
  // Get filters from URL parameters
  const { filters: urlFilters } = useJobFilters();
  
  // Combine URL filters with sort option
  const filters = useMemo(() => ({
    ...urlFilters,
    sortBy: sortOption as 'recent' | 'salary-high' | 'salary-low'
  }), [urlFilters, sortOption]);
  
  // Get contexts
  const { applications } = useApplications();
  const { 
    allJobs, 
    isLoadingAllJobs: isLoading, 
    isLoadingMoreJobs: hookIsLoadingMore,
    allJobsError: error, 
    hasMoreJobs: hookHasMore,
    fetchMoreJobs: fetchMore,
    filteredJobsCount,
    totalJobs,
    setJobFilters,
    fetchInitialJobs
  } = useJobs();
  
  // Set filters when they change and fetch jobs when applications are loaded
  const hasInitiallyLoaded = useRef(false);
  
  useEffect(() => {
    setJobFilters(filters);
  }, [filters, setJobFilters]);

  // Fetch initial jobs when applications are loaded and filters are set
  useEffect(() => {
    // Only fetch when applications are loaded and we haven't fetched yet, or when filters change
    if (applications !== null) {
      if (!hasInitiallyLoaded.current) {
        console.log('JobsPage: Initial load - fetching jobs with applications:', applications.length);
        hasInitiallyLoaded.current = true;
        fetchInitialJobs(applications);
      } else if (filters) {
        // If filters change after initial load, refetch with new filters
        console.log('JobsPage: Filters changed - refetching jobs with applications:', applications.length);
        fetchInitialJobs(applications);
      }
    }
  }, [applications !== null, filters, fetchInitialJobs]); // Depend on applications being loaded and filters

  // Use all jobs from server-side pagination
  const currentJobs = allJobs;
  const isDetailsPanelOpen = !!selectedJob
  
  // Handle loading more jobs - always use server-side pagination now
  const handleLoadMore = async () => {
    if (hookIsLoadingMore || !hookHasMore) return;
    await fetchMore(applications);
  };

  // Infinite scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const lastJob = entries[0];
        const shouldLoadMore = hookHasMore && !hookIsLoadingMore && !isLoading;
        
        if (lastJob.isIntersecting && shouldLoadMore) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px', // Start loading when 100px away from the last job
      }
    );

    if (lastJobRef.current) {
      observer.observe(lastJobRef.current);
    }

    return () => {
      if (lastJobRef.current) {
        observer.unobserve(lastJobRef.current);
      }
    };
  }, [hookHasMore, hookIsLoadingMore, isLoading]);

  // Close details panel on large viewport or smaller
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < getBreakpoint('lg') && isDetailsPanelOpen) { 
        setSelectedJob(null); // Close details panel on large viewport
      }
      setIsMobile(
        window.innerWidth < getBreakpoint('sm') ||
        (isDetailsPanelOpen && window.innerWidth < getBreakpoint('2xl'))
      ); // Set mobile viewport for jobs page
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [isDetailsPanelOpen]);

  // Filters are automatically handled by the JobsContext
  
  // Handle sort option change
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };
  
  // Handle job selection for details
  const handleViewDetails = (job: Job) => {
    if (job.id === selectedJob?.id) {
      setSelectedJob(null);
      return;
    }
    
    setIsLoadingDetails(true);
    setSelectedJob(job);
    setIsLoadingDetails(false);
  };


  
  // Check for welcome parameters on component mount
  useEffect(() => {
    const welcome = searchParams.get('welcome');
    
    if (welcome === 'true') {
      // Add a small delay to let the page load and give users a moment to see the jobs page
      setTimeout(() => {
        setShowWelcomeModal(true);
      }, 800);
      
      // Clean up URL parameters after showing modal
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('welcome');
      newUrl.searchParams.delete('firstName');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
  };

  // Show error state if there's an error fetching jobs
  if (error && allJobs && allJobs.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 h-screen w-full flex items-center justify-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Failed to load jobs</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We encountered an error while loading job listings. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 h-screen w-full overflow-hidden flex flex-col">
      {/* Sticky Search and Filters Header */}
      <div className={`${isDetailsPanelOpen && 'z-[60]'} flex-shrink-0 pt-2 bg-white backdrop-blur-sm border-t border-b border-gray-200/60 shadow-sm relative ${selectedJob ? 'lg:w-2/5' : 'w-full'}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-4">
            {/* Title and results/sort section */}
            <div className="flex flex-col gap-3">
              {/* Title row */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">{isMobile ? 'Jobs' : 'Find Your Next Opportunity'}</h1>
                
                {/* Results count and sort - desktop only */}
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                    <div className="text-gray-600">
                      {isLoading ? (
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      ) : (
                        <p className="text-sm font-medium">Showing {filteredJobsCount} of {totalJobs} jobs</p>
                      )}
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 relative ${isDetailsPanelOpen && 'z-[80]'}`}>
                    <span className="text-xs text-gray-500">Sort:</span>
                    <Select 
                      value={sortOption}
                      onValueChange={handleSortChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-[140px] h-8 bg-white/80 border-gray-200/60 hover:border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={`bg-white/95 backdrop-blur-sm border-gray-200/60 ${isDetailsPanelOpen && 'z-[80]'}`}>
                        <SelectItem value="recent" className="text-sm">Recent</SelectItem>
                        <SelectItem value="salary-high" className="text-sm">Salary ↓</SelectItem>
                        <SelectItem value="salary-low" className="text-sm">Salary ↑</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Results count and sort - mobile only */}
              <div className="flex sm:hidden items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                  <div className="text-gray-600">
                    {isLoading ? (
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    ) : (
                      <p className="text-sm font-medium">Showing {filteredJobsCount} of {totalJobs} jobs</p>
                    )}
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 relative ${isDetailsPanelOpen && 'z-[80]'}`}>
                  <span className="text-xs text-gray-500">Sort:</span>
                  <Select 
                    value={sortOption}
                    onValueChange={handleSortChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[140px] h-8 bg-white/80 border-gray-200/60 hover:border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`bg-white/95 backdrop-blur-sm border-gray-200/60 ${isDetailsPanelOpen && 'z-[80]'}`}>
                      <SelectItem value="recent" className="text-sm">Recent</SelectItem>
                      <SelectItem value="salary-high" className="text-sm">Salary ↓</SelectItem>
                      <SelectItem value="salary-low" className="text-sm">Salary ↑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Bottom row: Search and filters */}
            <div className="w-full">
              <JobSearchBar 
                detailsOpen={!!selectedJob} 
                isLoading={false}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left column: Job listings */}
          <div className={`${selectedJob ? 'lg:w-2/5 lg:-ml-5' : 'w-full'} flex-shrink-0 h-full overflow-hidden flex flex-col`}>
            {/* Job Listings */}
            <div className={`flex-1 overflow-y-auto space-y-4 pb-8 ${isLoading ? 'animate-pulse' : ''}`}>
              {isLoading || currentJobs === null ? (
                // Show skeleton cards when loading or when no jobs are available yet
                [...Array(5)].map((_, index) => (
                  <JobCardSkeleton key={index} />
                ))
              ) : currentJobs && currentJobs.length > 0 ? (
                <>
                  {currentJobs.map((job, index) => (
                    <div
                      key={job.id}
                      ref={index === currentJobs.length - 1 ? lastJobRef : null}
                    >
                      <JobCard
                        job={job}
                        onViewDetails={() => handleViewDetails(job)}
                        isSelected={selectedJob?.id === job.id}
                        isAnySelected={!!selectedJob}
                        isLoading={loadingJobs.has(job.id)}
                      />
                    </div>
                  ))}
                  
                  {/* Loading indicator when loading more jobs */}
                  {hookIsLoadingMore && (
                    <div className="mt-8 pb-8 flex justify-center">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
                        <div className="w-5 h-5 border-2 border-teal-600/30 border-t-teal-600 rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600 font-medium">Loading more jobs...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Show total count when all jobs are loaded */}
                  {!hookHasMore && filteredJobsCount > 0 && (
                    <div className="mt-8 pb-8 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
                        <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"></div>
                        <span className="text-sm text-gray-600 font-medium">
                          Showing all {filteredJobsCount} available jobs
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Modern Empty State
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No jobs found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    We couldn&apos;t find any jobs matching your criteria. Try adjusting your search filters or exploring different roles.
                  </p>
                  <button 
                    onClick={() => router.replace("/jobs")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column: Job Details Panel */}
          {(selectedJob || isLoadingDetails) && (
            <div className="lg:w-3/5 lg:fixed lg:right-0 lg:top-16 lg:overflow-hidden self-start" style={{ height: 'calc(100vh - 4rem)' }}>
              <JobDetailsPanel 
                job={selectedJob} 
                onClose={() => setSelectedJob(null)} 
                isLoading={isLoadingDetails}
              />
            </div>
          )}
        </div>
      </div>

      {showWelcomeModal && (
        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={handleWelcomeModalClose}
        />
      )}

      <WelcomeToProModal
        isOpen={showWelcomeToProModal}
        onClose={() => setShowWelcomeToProModal(false)}
      />
    </div>
  );
}

export default function JobsPage() {
  return (
    <ProtectedPage>
      <JobsPageContent />
    </ProtectedPage>
  );
}