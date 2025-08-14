'use client';

import { Heart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Job } from '@/app/types/job';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';

import JobHeader from './JobHeader';
import JobDetails from './JobDetails';
import JobTags from './JobTags';
import JobResponsibilitiesQualifications from './JobResponsibilitiesQualifications';
import JobRecommendationReason from './JobRecommendationReason';
import JobFeedback from './JobFeedback';

interface JobCardProps {
  job: Job;
  score: number;
  index: number;
  totalJobs: number;
  onAutoAdvance?: () => void;
  onShowSubscriptionModal: () => void;
}

export default function JobCard({
  job,
  score,
  index,
  totalJobs,
  onAutoAdvance,
  onShowSubscriptionModal
}: JobCardProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  // View job details
  const viewJobDetails = (jobId: number | string) => {
    setIsNavigating(true);
    router.push(`/jobs/${jobId}`);
  };
  return (
    <div className="w-full flex-shrink-0">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden mx-auto max-w-7xl border border-white/20 hover:shadow-2xl transition-all duration-300"
        >
          {/* Match Percentage */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-3 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="flex items-center relative z-10">
              <Heart className="h-4 w-4 mr-2 fill-white drop-shadow-sm" />
              <span className="font-bold text-base">{score}% Match</span>
            </div>
            <div className="text-sm font-medium relative z-10">
              Job {index + 1} of {totalJobs}
            </div>
          </div>
          
          {/* Job Content */}
          <div className="p-5">
            {/* Header */}
            <JobHeader job={job} />
            
            {/* Job Details */}
            <JobDetails job={job} />
            
            {/* Description */}
            <div className="mt-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Job Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{job.description}</p>
            </div>
            
            {/* Tags, Responsibilities, and Qualifications */}
            <div className="mt-4 grid grid-cols-1 gap-3">
              {/* Skills */}
              <JobTags tags={job.skills || []} />
              
              {/* Responsibilities and Qualifications */}
              <JobResponsibilitiesQualifications 
                shortResponsibilities={job.shortResponsibilities}
                shortQualifications={job.shortQualifications}
              />
            </div>
            
            {/* Why We Recommended */}
            <JobRecommendationReason job={job} />
            

            
            {/* Action Buttons */}
            <div className="mt-5 flex space-x-3">
              <button
                onClick={() => viewJobDetails(job.id)}
                disabled={isNavigating}
                className={`flex-1 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-sm flex items-center justify-center gap-2 ${
                  isNavigating 
                    ? 'cursor-not-allowed opacity-70' 
                    : 'hover:border-gray-300 hover:bg-white hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {isNavigating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'View Full Details'
                )}
              </button>
              <AnimatedApplyButton 
                className="flex-1"
                jobId={job.id.toString()}
                onShowSubscriptionModal={onShowSubscriptionModal}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Job Feedback Section */}
      <JobFeedback jobId={job.id} onAutoAdvance={onAutoAdvance} />
    </div>
  );
} 