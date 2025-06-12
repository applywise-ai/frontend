'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationControlsProps {
  currentIndex: number;
  totalJobs: number;
  onIndexChange: (newIndex: number) => void;
}

export default function NavigationControls({
  currentIndex,
  totalJobs,
  onIndexChange
}: NavigationControlsProps) {
  const goToPrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < totalJobs - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  return (
    <>
      {/* Previous Button */}
      <div className="absolute left-0 top-[45%] transform -translate-y-1/2 z-20 ml-[-8px] sm:ml-0">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={`bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-white/20 transition-all duration-200 ${
            currentIndex === 0 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-700 hover:text-teal-600 hover:bg-white hover:shadow-xl hover:scale-105'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      
      {/* Next Button */}
      <div className="absolute right-0 top-[45%] transform -translate-y-1/2 z-20 mr-[-8px] sm:mr-0">
        <button
          onClick={goToNext}
          disabled={currentIndex === totalJobs - 1}
          className={`bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-white/20 transition-all duration-200 ${
            currentIndex === totalJobs - 1 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-700 hover:text-teal-600 hover:bg-white hover:shadow-xl hover:scale-105'
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </>
  );
} 