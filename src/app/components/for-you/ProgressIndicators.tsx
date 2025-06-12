'use client';

interface ProgressIndicatorsProps {
  totalJobs: number;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function ProgressIndicators({
  totalJobs,
  currentIndex,
  onIndexChange
}: ProgressIndicatorsProps) {
  const handleIndicatorClick = (index: number) => {
    onIndexChange(index);
  };

  return (
    <div className="flex justify-center mt-3 space-x-2">
      {Array.from({ length: totalJobs }, (_, i) => (
        <button
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === currentIndex 
              ? 'w-8 bg-gradient-to-r from-teal-500 to-blue-500 shadow-md' 
              : 'w-2 bg-gray-300 hover:bg-gray-400'
          }`}
          onClick={() => handleIndicatorClick(i)}
          aria-label={`Go to job ${i + 1}`}
        />
      ))}
    </div>
  );
} 