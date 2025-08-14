'use client';

import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { Search, Briefcase, MapPin, Settings } from 'lucide-react';

export default function EmptyRecommendationsState() {
  const router = useRouter();

  const handleGoToJobs = () => {
    router.push('/jobs');
  };

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-blue-600" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        No jobs match your preferences right now
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-8 max-w-md">
        We couldn't find any jobs that match your current preferences. 
        Try expanding your search or updating your profile to see more opportunities.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Button 
          onClick={handleGoToJobs}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Briefcase className="w-4 h-4" />
          Browse All Jobs
        </Button>
        
        <Button 
          onClick={handleGoToProfile}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Update Preferences
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md">
        <h3 className="font-medium text-gray-900 mb-2">Quick Tips:</h3>
        <ul className="text-sm text-gray-600 space-y-1 text-left">
          <li className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <span>Try different locations or remote options</span>
          </li>
          <li className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <span>Expand your job type preferences</span>
          </li>
          <li className="flex items-start gap-2">
            <Settings className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <span>Add more skills to your profile</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 