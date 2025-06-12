'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile } from '@/app/contexts/ProfileContext';

interface JobFeedbackProps {
  jobId: number | string;
  onAutoAdvance?: () => void;
}

export default function JobFeedback({ jobId, onAutoAdvance }: JobFeedbackProps) {
  const { updateJobFeedback, getJobFeedback } = useProfile();
  const feedback = getJobFeedback(jobId.toString());

  const handleFeedback = async (liked: boolean) => {
    try {
      // If already selected the same option, do nothing
      if (feedback === liked) return;
      
      // Store previous feedback state to check if this is a new selection
      const wasNewSelection = feedback === null;
      
      // Update job feedback in profile
      await updateJobFeedback(jobId.toString(), liked);
      
      // Auto-advance if this is a new selection and callback is provided
      if (wasNewSelection && onAutoAdvance) {
        setTimeout(() => onAutoAdvance(), 500);
      }
    } catch (error) {
      console.error('Failed to update job feedback:', error);
    }
  };

  return (
    <div className="mt-4 mb-3 flex flex-col items-center">
      <p className="text-gray-700 font-semibold mb-3 text-base">Would you like to see more jobs like this?</p>
      <div className="flex space-x-4">
        <button
          onClick={() => handleFeedback(true)}
          className={`flex items-center px-6 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
            feedback === true 
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg border-2 border-teal-500 transform scale-105' 
              : 'bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:border-teal-300 hover:bg-white hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 mr-2 ${feedback === true ? 'text-white' : 'text-gray-500'}`} />
          Yes, more like this
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className={`flex items-center px-6 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
            feedback === false 
              ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg border-2 border-gray-500 transform scale-105' 
              : 'bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:border-gray-400 hover:bg-white hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          <ThumbsDown className={`h-4 w-4 mr-2 ${feedback === false ? 'text-white' : 'text-gray-500'}`} />
          Not interested
        </button>
      </div>
      {feedback !== undefined && feedback !== null && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-600 mt-2 font-medium"
        >
          {feedback 
            ? "✨ Thanks! We'll show you more jobs like this." 
            : "👍 Thanks! We'll refine your recommendations."}
        </motion.p>
      )}
    </div>
  );
} 