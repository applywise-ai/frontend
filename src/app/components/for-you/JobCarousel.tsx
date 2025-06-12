'use client';

import { useRef } from 'react';
import { JobWithScore } from '@/app/contexts/RecommenderContext';
import NavigationControls from './NavigationControls';
import JobCard from './JobCard';
import ProgressIndicators from './ProgressIndicators';

interface JobCarouselProps {
  jobs: JobWithScore[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onShowSubscriptionModal: () => void;
}

export default function JobCarousel({
  jobs,
  currentIndex,
  onIndexChange,
  onShowSubscriptionModal
}: JobCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle auto advance after job feedback
  const handleAutoAdvance = () => {
    if (currentIndex < jobs.length - 1) {
      setTimeout(() => onIndexChange(currentIndex + 1), 500);
    }
  };

  return (
    <div className="relative">
      {/* Navigation Controls */}
      <NavigationControls
        currentIndex={currentIndex}
        totalJobs={jobs.length}
        onIndexChange={onIndexChange}
      />
      
      {/* Job Carousel */}
      <div className="relative overflow-hidden" ref={carouselRef}>
        <div 
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="flex">
            {jobs.map((jobWithScore, index) => (
              <JobCard
                key={jobWithScore.job.id}
                job={jobWithScore.job}
                score={jobWithScore.score}
                index={index}
                totalJobs={jobs.length}
                onShowSubscriptionModal={onShowSubscriptionModal}
                onAutoAdvance={handleAutoAdvance}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Progress Indicators */}
      <ProgressIndicators
        totalJobs={jobs.length}
        currentIndex={currentIndex}
        onIndexChange={onIndexChange}
      />
    </div>
  );
} 