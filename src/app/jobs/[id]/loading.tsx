import { ArrowLeft } from 'lucide-react';

export default function JobDetailsLoading() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="inline-flex items-center mb-6 text-teal-600">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        
        {/* Job details card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-28 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Action buttons for large screens - Loading state */}
              <div className="hidden lg:flex lg:items-center lg:space-x-3 lg:mt-0 lg:ml-4">
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-10 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-10 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Apply and Save Buttons - Mobile only */}
            <div className="block lg:hidden">
              <div className="flex space-x-3">
                <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
            </div>
            
            {/* Key Details */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Company Section */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
            
            {/* Description */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-36 mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              
              <div className="mt-8">
                <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                <div className="space-y-3 pl-5">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <div className="h-6 bg-gray-200 rounded w-36 mb-4 animate-pulse"></div>
                <div className="space-y-3 pl-5">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 