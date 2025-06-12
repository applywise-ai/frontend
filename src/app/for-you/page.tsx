'use client';

import { useState, useEffect } from 'react';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import SubscriptionModal from '@/app/components/SubscriptionModal';
import { LoadingAnimation, JobCarousel } from '@/app/components/for-you';
import { useRecommender } from '@/app/contexts/RecommenderContext';

function ForYouPageContent() {
  const { recommendedJobs, isLoading: recommendationsLoading, refreshRecommendations } = useRecommender();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Initialize recommendations on component mount
  useEffect(() => {
    if (recommendedJobs.length === 0) {
      refreshRecommendations();
    }
  }, [recommendedJobs.length, refreshRecommendations]);
  console.log('Recommended Jobs with Inflated Scores (sorted by highest):', recommendedJobs.map((jobWithScore, index) => ({
    rank: index + 1,
    title: jobWithScore.job.title,
    company: jobWithScore.job.company,
    inflatedScore: jobWithScore.score
  })));
  // Handle index changes (navigation, indicators, etc.)
  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };
  
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/50 w-full pb-4 min-h-screen">
      <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 py-3">
        {/* Loading Animation or Carousel */}
        <div className="relative mt-1">
          {recommendationsLoading || recommendedJobs.length === 0 ? (
            <LoadingAnimation />
          ) : (
            <JobCarousel
              jobs={recommendedJobs}
              currentIndex={currentIndex}
              onIndexChange={handleIndexChange}
              onShowSubscriptionModal={() => setShowSubscriptionModal(true)}
            />
          )}
        </div>
      </div>
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
}

export default function ForYou() {
  return (
    <ProtectedPage>
      <ForYouPageContent />
    </ProtectedPage>
  );
} 