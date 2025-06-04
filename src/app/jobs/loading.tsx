import JobCardSkeleton from '@/app/components/loading/JobCardSkeleton';
import JobDetailsPanelSkeleton from '@/app/components/loading/JobDetailsPanelSkeleton';
import JobSearchBarSkeleton from '@/app/components/loading/JobSearchBarSkeleton';

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen w-full pb-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Main content layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: Search, filters, and job listings */}
          <div className="lg:w-2/5 flex-shrink-0">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
              <JobSearchBarSkeleton />
            </div>
            
            {/* Job Listing Header */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-8 bg-gray-200 rounded w-44"></div>
              </div>
            </div>
            
            {/* Job Listings */}
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          </div>
          
          {/* Right column: Job Details Panel */}
          <div className="lg:w-3/5 lg:sticky lg:top-[5.5rem] lg:h-[calc(100vh-7rem)] self-start">
            <JobDetailsPanelSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
} 