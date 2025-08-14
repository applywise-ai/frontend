'use client';

import { useState } from 'react';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import SubscriptionModal from '@/app/components/SubscriptionModal';
import { LoadingAnimation, JobCarousel } from '@/app/components/for-you';
import EmptyRecommendationsState from '@/app/components/for-you/EmptyRecommendationsState';
import IncompleteProfileState from '@/app/components/for-you/IncompleteProfileState';
import { useRecommender } from '@/app/contexts/RecommenderContext';
import { useProfile } from '@/app/contexts/ProfileContext';
import { hasEnoughProfileDetailsForRecommendations } from '@/app/utils/profile';

function ForYouPageContent() {
  const { recommendedJobs, isLoading: recommendationsLoading, fetchedJobs } = useRecommender();
  const { profile, isLoading: profileLoading } = useProfile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Check if profile has enough details for recommendations
  const hasEnoughProfileDetails = hasEnoughProfileDetailsForRecommendations(profile);
  
  // Handle index changes (navigation, indicators, etc.)
  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };
  
  // Determine what to render
  const renderContent = () => {
    // Show loading state while profile is loading
    if (profileLoading) {
      return <LoadingAnimation />;
    }
    
    // Show incomplete profile state if not enough details
    if (!hasEnoughProfileDetails) {
      return <IncompleteProfileState />;
    }
    
    if (recommendationsLoading) {
      return <LoadingAnimation />;
    }
    
    if (fetchedJobs && recommendedJobs.length === 0) {
      return <EmptyRecommendationsState />;
    }
    
    if (recommendedJobs.length > 0) {
      return (
        <JobCarousel
          jobs={recommendedJobs}
          currentIndex={currentIndex}
          onIndexChange={handleIndexChange}
          onShowSubscriptionModal={() => setShowSubscriptionModal(true)}
        />
      );
    }
    
    // Fallback loading state
    return <LoadingAnimation />;
  };
  
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/50 w-full pb-4 min-h-screen">
      <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 py-3">
        {/* Content */}
        <div className="relative mt-1">
          {renderContent()}
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