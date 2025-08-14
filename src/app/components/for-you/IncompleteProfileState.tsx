'use client';

import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { User, Settings, Briefcase, MapPin, Star } from 'lucide-react';

export default function IncompleteProfileState() {
  const router = useRouter();

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-amber-600" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        Complete your profile for personalized recommendations
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-8 max-w-md">
        We need more information about your preferences to provide you with 
        personalized job recommendations. Please fill out your profile details.
      </p>

      {/* Action Button */}
      <div className="mb-8">
        <Button 
          onClick={handleGoToProfile}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
        >
          <Settings className="w-4 h-4" />
          Complete Profile
        </Button>
      </div>

      {/* Required Fields */}
      <div className="p-4 bg-amber-50 rounded-lg max-w-md border border-amber-200">
        <h3 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Required for recommendations:
        </h3>
        <ul className="text-sm text-amber-800 space-y-2 text-left">
          <li className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
            <span>Experience level & job type preferences</span>
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
            <span>Location preferences</span>
          </li>
          <li className="flex items-start gap-2">
            <Star className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
            <span>Industry specializations</span>
          </li>
          <li className="flex items-start gap-2">
            <User className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
            <span>Skills & qualifications</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 