'use client';

import React, { useState } from 'react';
import { Dialog, DialogContentWithoutCloseButton, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/app/contexts/ProfileContext';
import { FieldName } from '@/app/types/profile';
import { Sparkles, ArrowRight, Play, Clock, Users, TrendingUp } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'welcome' | 'demo';
}

export default function WelcomeModal({ isOpen, onClose, mode = 'welcome' }: WelcomeModalProps) {
  const router = useRouter();
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Get profile data
  const { profile } = useProfile();
  
  // Get user's first name from profile
  const displayName = profile?.[FieldName.FULL_NAME] || 'there';
  const firstName = displayName.split(' ')[0] || 'there';

  const handleGetStarted = () => {
    setIsNavigating(true);
    // Don't close the modal immediately - let the loading state show
    // The modal will close when the route changes
    router.push('/profile');
  };

  const handleVideoClick = () => {
    setVideoPlaying(true);
    // Here you would actually start playing the video
    // For now, we'll just show the playing state
  };

  const isDemoMode = mode === 'demo';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContentWithoutCloseButton className="max-w-6xl w-[95vw] max-h-[95vh] bg-white rounded-2xl p-0 overflow-hidden border-0 shadow-2xl flex flex-col">
        {/* Hidden DialogTitle for accessibility */}
        <DialogTitle className="sr-only">
          Welcome to Applywise - Get Started with Your Job Search
        </DialogTitle>
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 px-6 sm:px-8 py-4 sm:py-5 text-white text-center relative overflow-hidden flex-shrink-0">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <Sparkles className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-3 sm:mb-4">
              {isDemoMode ? (
                <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              ) : (
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {isDemoMode ? (
                'See How ApplyWise Works'
              ) : (
                `Welcome to Applywise, ${firstName}! 🎉`
              )}
            </h1>
            <p className="text-blue-100 text-base sm:text-lg">
              {isDemoMode ? (
                'Watch our 2-minute demo to discover how AI can transform your job search'
              ) : (
                "You're all set to supercharge your job search journey"
              )}
            </p>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-4 sm:py-6">
          {/* Video Section */}
          <div className="mb-4">
            <div 
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden aspect-[16/9] group cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-all duration-300 border border-gray-200"
              onClick={handleVideoClick}
            >
              {!videoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full mb-3 group-hover:bg-blue-700 transition-colors shadow-lg group-hover:scale-105 transform duration-200">
                      <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white ml-1" />
                    </div>
                    <p className="text-gray-700 font-semibold text-base sm:text-lg mb-1">How Applywise Works</p>
                    <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>2 min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>10K+ views</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="text-white text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Loading video...</p>
                  </div>
                </div>
              )}
              
              {/* Video thumbnail overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Actual video element - uncomment and replace src when you have the video */}
              {/* 
              <video 
                className="w-full h-full object-cover"
                poster="/images/video-thumbnail.jpg"
                controls={videoPlaying}
                autoPlay={videoPlaying}
              >
                <source src="/videos/welcome-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              */}
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
              <div className="w-10 h-10 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Complete Your Profile</h3>
              <p className="text-sm text-gray-600">Add your experience, skills, and preferences</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors duration-200">
              <div className="w-10 h-10 bg-green-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Find Perfect Jobs</h3>
              <p className="text-sm text-gray-600">Browse thousands of opportunities</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors duration-200">
              <div className="w-10 h-10 bg-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Apply with AI</h3>
              <p className="text-sm text-gray-600">Let AI help you craft perfect applications</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="font-bold text-lg">New</span>
              </div>
              <p className="text-xs text-gray-600">Platform</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <Users className="h-4 w-4" />
                <span className="font-bold text-lg">10K+</span>
              </div>
              <p className="text-xs text-gray-600">Up to Date Jobs</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="font-bold text-lg">AI</span>
              </div>
              <p className="text-xs text-gray-600">Powered</p>
            </div>
          </div>

          {/* Encouragement Message */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-teal-900 mb-1">Be among the first!</h3>
                <p className="text-sm text-teal-700">
                  You&apos;re joining Applywise in its early stages. Help us build the future of job searching together.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-50 px-6 sm:px-8 py-4 sm:py-6 border-t border-gray-100 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              {isDemoMode ? 'Close Demo' : "I'll fill it later"}
            </Button>
            <Button
              onClick={isDemoMode ? () => window.open('/signup', '_blank') : handleGetStarted}
              disabled={!isDemoMode && isNavigating}
              className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isDemoMode ? (
                <>
                  Get Started Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : isNavigating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {isDemoMode ? 'Taking you to signup...' : 'Setting up your profile...'}
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-4">
            {isDemoMode ? (
              'Ready to transform your job search? Sign up and start applying with AI today!'
            ) : (
              'Complete your profile to unlock AI-powered quick applications'
            )}
          </p>
        </div>
      </DialogContentWithoutCloseButton>
    </Dialog>
  );
} 