'use client';

export default function JobCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        {/* Company Logo Skeleton */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-md" />
        </div>
        
        {/* Job Content Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              {/* Title Skeleton */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              {/* Company Skeleton */}
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            {/* Save Button Skeleton */}
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>
          
          {/* Tags Section Skeleton */}
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
            <div className="h-5 bg-gray-200 rounded-full w-24"></div>
            {!compact && <div className="h-5 bg-gray-200 rounded-full w-40"></div>}
          </div>
          
          {/* Job Details Skeleton */}
          {!compact && (
            <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-5 bg-gray-200 rounded w-28"></div>
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
          )}
          
          {/* Description Skeleton */}
          {!compact && (
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          )}
        </div>
        
        {/* Action Buttons Skeleton */}
        <div className="flex-shrink-0 ml-2 flex flex-col space-y-2">
          <div className="h-9 bg-gray-200 rounded w-20"></div>
          <div className="h-9 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
} 