import NavbarSkeleton from './components/loading/NavbarSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="pt-16 w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/5 flex-shrink-0">
              <div className="h-24 bg-gray-200 rounded mb-6"></div>
              <div className="h-16 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div className="h-32 bg-gray-200 rounded" key={index}></div>
                ))}
              </div>
            </div>
            <div className="lg:w-3/5 mt-6 lg:mt-0">
              <div className="h-[calc(100vh-12rem)] bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 