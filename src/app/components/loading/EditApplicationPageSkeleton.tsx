import { ArrowLeft, Briefcase, FileText } from 'lucide-react';

export function EditApplicationPageSkeleton() {
  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 bg-gray-50">
      <div className="max-w-[1400px] mx-auto h-full px-6 py-6 flex flex-col">
        {/* Mobile Header Skeleton */}
        <div className="flex lg:hidden items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded mr-3 sm:mr-4 animate-pulse"></div>
            <div className="h-6 sm:h-8 bg-gray-300 rounded w-32 sm:w-40 animate-pulse"></div>
          </div>
          
          <div className="flex gap-2">
            <div className="h-8 sm:h-10 bg-gray-300 rounded-lg w-16 sm:w-20 animate-pulse"></div>
            <div className="h-8 sm:h-10 bg-gray-300 rounded-lg w-20 sm:w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Mobile/Tablet Tabs Skeleton */}
        <div className="lg:hidden flex-1 overflow-hidden">
          <div className="bg-white rounded-lg border border-gray-200 mb-5 shadow-sm sticky top-0 z-10">
            <div className="flex">
              <div className="flex-1 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-1.5 sm:gap-2">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-8 sm:w-12 animate-pulse"></div>
              </div>
              <div className="flex-1 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-1.5 sm:gap-2">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-12 sm:w-16 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="h-[calc(100%-3.5rem)] overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="flex flex-col gap-6 pb-12">
                {/* Job Details Card Skeleton */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
                      <div className="h-5 bg-gray-300 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded-full w-16 animate-pulse"></div>
                  </div>
                  <div className="px-6 py-5 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Form Sections Skeleton */}
                <div className="space-y-6">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
                          <div className="h-5 bg-gray-300 rounded w-32 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="px-6 py-5 space-y-4">
                        {Array.from({ length: 2 }).map((_, j) => (
                          <div key={j} className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                            <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout Skeleton */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 flex-1">
          {/* Left column - form */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 6rem)" }}>
            <div className="pr-3">
              <div className="flex flex-col gap-6 pb-12">
                {/* Job Details Card Skeleton */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
                      <div className="h-5 bg-gray-300 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded-full w-16 animate-pulse"></div>
                  </div>
                  <div className="px-6 py-5 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Form Sections Skeleton */}
                <div className="space-y-6">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
                          <div className="h-5 bg-gray-300 rounded w-32 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="px-6 py-5 space-y-4">
                        {Array.from({ length: 2 }).map((_, j) => (
                          <div key={j} className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                            <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - preview */}
          <div className="h-full overflow-hidden">
            <div className="sticky top-0 h-[calc(100vh-6rem)]">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col shadow-sm">
                <div className="flex-grow overflow-auto">
                  <div className="flex-grow overflow-auto">
                    {/* Preview Header Skeleton */}
                    <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                          <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 bg-gray-300 rounded w-16 animate-pulse"></div>
                          <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Preview Content Skeleton */}
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse mt-6"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                      </div>
                    </div>
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