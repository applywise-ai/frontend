export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen w-full pb-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Main content layout */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          
          {/* Job Listing Header */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                  
                  {/* Job Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                      </div>
                      <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Tags Section */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                    
                    {/* Job Details */}
                    <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4">
                      <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-28 animate-pulse"></div>
                    </div>
                    
                    {/* Description */}
                    <div className="mt-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-3">
                      <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 