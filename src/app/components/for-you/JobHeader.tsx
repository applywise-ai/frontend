'use client';

import { useState, useEffect } from 'react';
import { BadgeCheck, Bookmark } from 'lucide-react';
import { Job } from '@/app/types/job';
import { getAvatarColor } from '@/app/utils/avatar';
import { useApplications } from '@/app/contexts/ApplicationsContext';

interface JobHeaderProps {
  job: Job;
}

export default function JobHeader({ job }: JobHeaderProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isJobSaved, toggleSave } = useApplications();

  // Check if job is saved on mount
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const saved = await isJobSaved(job.id.toString());
        setIsSaved(saved);
      } catch (error) {
        console.error('Error checking if job is saved:', error);
      }
    };

    checkSavedStatus();
  }, [job.id, isJobSaved]);

  const handleSaveToggle = async () => {
    setIsLoading(true);
    try {
      await toggleSave(job.id.toString(), isSaved);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div className="flex items-start">
        <div className={`
          w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden border border-white shadow-md mr-4 transition-transform duration-200 hover:scale-105
          ${job.logo ? 'bg-gray-50' : getAvatarColor(job.company)}
        `}>
          {job.logo ? (
            <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
          ) : (
            <div className="text-lg font-bold text-white drop-shadow-sm">
              {job.company.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{job.title}</h2>
          <div className="flex items-center">
            <span className="text-base sm:text-lg text-gray-700 font-medium">{job.company}</span>
            {job.isVerified && (
              <BadgeCheck className="ml-2 h-5 w-5 text-teal-500" />
            )}
          </div>
        </div>
      </div>
      <button
        onClick={handleSaveToggle}
        disabled={isLoading}
        className="flex-shrink-0 text-gray-400 hover:text-teal-600 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isSaved ? "Unsave job" : "Save job"}
      >
        <Bookmark className={`h-6 w-6 ${isSaved ? 'fill-teal-600 text-teal-600' : 'fill-transparent'} ${isLoading ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  );
} 