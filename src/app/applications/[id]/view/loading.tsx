import { Skeleton } from '@/app/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';

export default function Loading() {
  return (
    <div className="fixed top-16 bottom-0 left-0 right-0 bg-gray-50">
      <div className="max-w-[1400px] mx-auto h-full px-6 py-6 flex flex-col">
        {/* Screenshots Comparison Skeleton */}
        <div className="flex-1 overflow-hidden">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <Skeleton className="h-5 w-5" />
                  </div>
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
            
            <div className="p-6 h-[calc(100%-4rem)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original Screenshot Skeleton */}
                <div>
                  <Skeleton className="h-5 w-36 mb-4" />
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                    <Skeleton className="h-64 w-full" />
                  </div>
                </div>

                {/* Submitted Screenshot Skeleton */}
                <div>
                  <Skeleton className="h-5 w-40 mb-4" />
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                    <Skeleton className="h-64 w-full" />
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