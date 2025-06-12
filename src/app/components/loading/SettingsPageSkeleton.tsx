export function SettingsPageSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl animate-pulse">
      <div className="space-y-4">
        {/* Notification Preferences Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="p-6 space-y-6">
            {/* Switch items */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-72"></div>
                </div>
                <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Information Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
              <div className="h-6 bg-gray-200 rounded w-40"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="p-6 space-y-4">
            {/* Form fields */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <div className="h-10 bg-gray-200 rounded w-28"></div>
          </div>
        </div>

        {/* Password Security Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-36"></div>
          </div>
          <div className="p-6 space-y-4">
            {/* Password form fields */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Membership Panel Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
            </div>
          </div>
        </div>

        {/* Delete Account Skeleton */}
        <div className="bg-white rounded-lg border border-red-100 shadow-sm">
          <div className="p-6 border-b border-red-100">
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-red-200 rounded mr-2"></div>
              <div className="h-6 bg-red-200 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-80"></div>
          </div>
          <div className="px-6 py-4 flex justify-end">
            <div className="h-10 bg-red-200 rounded w-36"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 