export function ProfilePageSkeleton() {
  return (
    <div className="bg-gray-50 pt-16 fixed inset-0 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6 animate-pulse">
          {/* Left sidebar skeleton (desktop only) */}
          <div className="hidden md:flex md:flex-col md:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded border border-gray-200"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="flex-1 w-full">
            <div className="h-[calc(100vh-100px)] overflow-y-auto pr-4 -mr-4">
              {/* Mobile progress card skeleton */}
              <div className="md:hidden w-full mb-4">
                <div className="bg-white rounded-lg shadow border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>

              {/* Content sections skeleton */}
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow border border-gray-100 p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 