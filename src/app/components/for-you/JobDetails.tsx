'use client';

import { DollarSign, MapPin, Briefcase, Clock, GraduationCap, Globe } from 'lucide-react';
import { Job, ROLE_LEVEL_OPTIONS } from '@/app/types/job';
import { formatJobPostedDate } from '@/app/utils/job';

interface JobDetailsProps {
  job: Job;
}

export default function JobDetails({ job }: JobDetailsProps) {
  // Get experience level label from ROLE_LEVEL_OPTIONS
  const getExperienceLevelLabel = (experienceLevel: string) => {
    const option = ROLE_LEVEL_OPTIONS.find(level => level.value === experienceLevel);
    return option?.label || experienceLevel;
  };

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg p-2 shadow-sm">
          <DollarSign className="h-4 w-4 text-teal-700" />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Salary Range</div>
          <div className="font-semibold text-sm text-gray-900">{job.salary}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-2 shadow-sm">
          <MapPin className="h-4 w-4 text-blue-700" />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Location</div>
          <div className="font-semibold text-sm text-gray-900">{job.location}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-2 shadow-sm">
          <Briefcase className="h-4 w-4 text-purple-700" />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Job Type</div>
          <div className="font-semibold text-sm text-gray-900">{job.jobType}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-2 shadow-sm">
          <Clock className="h-4 w-4 text-amber-700" />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Posted</div>
          <div className="font-semibold text-sm text-gray-900">{formatJobPostedDate(job.postedDate)}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2 shadow-sm">
          <GraduationCap className="h-4 w-4 text-green-700" />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Experience</div>
          <div className="font-semibold text-sm text-gray-900">
            {getExperienceLevelLabel(job.experienceLevel)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className={`bg-gradient-to-br ${job.providesSponsorship ? 'from-emerald-100 to-emerald-200' : 'from-gray-100 to-gray-200'} rounded-lg p-2 shadow-sm`}>
          <Globe className={`h-4 w-4 ${job.providesSponsorship ? 'text-emerald-700' : 'text-gray-700'}`} />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Visa Sponsorship</div>
          <div className="font-semibold text-sm text-gray-900">{job.providesSponsorship ? 'Available' : 'Not Available'}</div>
        </div>
      </div>
    </div>
  );
} 