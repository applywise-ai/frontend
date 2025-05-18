'use client';

export default function NavbarSkeleton() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo skeleton */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-44 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Nav links skeleton - desktop */}
            <div className="hidden md:flex items-center ml-4 space-x-6">
              <div className="flex items-center py-2 px-3 rounded-md">
                <div className="h-5 w-5 bg-gray-200 rounded mr-2 animate-pulse"></div>
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center py-2 px-3 rounded-md">
                <div className="h-5 w-5 bg-gray-200 rounded mr-2 animate-pulse"></div>
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* User profile skeleton */}
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
} 