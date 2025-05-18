'use client';

export default function JobSearchBarSkeleton({ detailsOpen = false }: { detailsOpen?: boolean }) {
  return (
    <div className="animate-pulse">
      {/* Search Input Skeleton */}
      <div className="mb-6">
        <div className="h-10 bg-gray-200 rounded-md w-full"></div>
      </div>
      
      {/* Filters Grid Skeleton */}
      <div className={`grid ${detailsOpen ? 'grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-4`}>
        {/* Minimum Salary Filter Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
        
        {/* Location Filter Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
        
        {/* Experience Level Filter Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
        
        {/* Visa Sponsorship Filter Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-md w-full"></div>
        </div>
      </div>
    </div>
  );
} 