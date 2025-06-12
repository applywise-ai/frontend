'use client';

import { Heart } from 'lucide-react';
import { Job } from '@/app/types/job';

interface JobRecommendationReasonProps {
  job: Job;
}

export default function JobRecommendationReason({ job }: JobRecommendationReasonProps) {
  return (
    <div className="mt-4 bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-lg border border-rose-100 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center">
        <Heart className="h-4 w-4 mr-2 text-rose-500" />
        Why we recommended this
      </h3>
      <ul className="text-gray-700 space-y-1">
        <li className="flex items-start text-sm">
          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
          Matches your experience in {job.experienceLevel === 'senior' ? 'senior-level positions' : job.experienceLevel === 'mid' ? 'mid-level roles' : 'entry-level positions'}
        </li>
        <li className="flex items-start text-sm">
          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
          Aligns with your preferred {job.location.toLowerCase().includes('remote') ? 'remote work style' : 'location preferences'}
        </li>
        <li className="flex items-start text-sm">
          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
          Matches your skill set in {job.title.split(' ')[0]} development
        </li>
      </ul>
    </div>
  );
} 