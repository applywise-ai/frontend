'use client';

import { Heart } from 'lucide-react';
import { Job } from '@/app/types/job';
import { useRecommender } from '@/app/contexts/RecommenderContext';
import { useProfile } from '@/app/contexts/ProfileContext';

interface JobRecommendationReasonProps {
  job: Job;
}

export default function JobRecommendationReason({ job }: JobRecommendationReasonProps) {
  const { generateRecommendationReasons } = useRecommender();
  const { profile } = useProfile();
  
  const reasons = profile ? generateRecommendationReasons(job, profile) : [
    'Matches your experience level',
    'Aligns with your location preferences',
    'Matches your skill set'
  ];

  return (
    <div className="mt-4 bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-lg border border-rose-100 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center">
        <Heart className="h-4 w-4 mr-2 text-rose-500" />
        Why we recommended this
      </h3>
      <ul className="text-gray-700 space-y-1">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start text-sm">
            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
} 