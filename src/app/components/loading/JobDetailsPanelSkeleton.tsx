'use client';

export default function JobDetailsPanelSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden h-full flex flex-col animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
      </div>
      
      {/* Content - scrollable */}
      <div className="p-6 space-y-6 overflow-y-auto flex-grow">
        {/* Apply and Save Buttons Skeleton */}
        <div className="flex space-x-3">
          <div className="flex-1 h-12 bg-gray-200 rounded-md"></div>
          <div className="h-12 w-12 bg-gray-200 rounded-md"></div>
          <div className="h-12 w-12 bg-gray-200 rounded-md"></div>
        </div>
        
        {/* Key Details Skeleton */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-28"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="bg-gray-200 rounded-full p-2 w-9 h-9"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Company Section Skeleton */}
        <div>
          <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        
        {/* Description Skeleton */}
        <div>
          <div className="h-5 bg-gray-200 rounded w-36 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          {/* Responsibilities Skeleton */}
          <div className="mt-8">
            <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="pl-5 space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-2 w-2 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Requirements Skeleton */}
          <div className="mt-8">
            <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="pl-5 space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-2 w-2 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 