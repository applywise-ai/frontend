import { Card, CardContent } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar skeleton */}
          <div className="md:w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content skeleton */}
          <div className="flex-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {[...Array(3)].map((_, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-4">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ))}
                      </div>
                      
                      {sectionIndex < 2 && <Skeleton className="h-px w-full mt-8" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 