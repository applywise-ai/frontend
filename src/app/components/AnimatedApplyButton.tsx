'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, CheckCircle2 } from 'lucide-react';
import ReviewApplicationModal from './ReviewApplicationModal';

interface AnimatedApplyButtonProps {
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function AnimatedApplyButton({ 
  onClick, 
  className = '', 
  size = 'md',
  fullWidth = false 
}: AnimatedApplyButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'review'>('idle');
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    if (state !== 'idle') return;
    setState('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setState('review');
    setOpen(true);
    onClick?.();
  };

  const handleReviewClick = () => {
    setOpen(true);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <>
      <motion.button
        onClick={state === 'review' ? handleReviewClick : handleClick}
        className={`
          inline-flex items-center justify-center
          border border-transparent font-medium rounded-md shadow-sm
          text-white bg-teal-600 hover:bg-teal-700
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
          transition-colors
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        whileTap={{ scale: 0.98 }}
        disabled={state === 'loading'}
        style={{ minHeight: undefined }}
      >
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="apply"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center"
            >
              <Zap className="mr-2 h-5 w-5" />
              Quick Apply
            </motion.div>
          )}

          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center"
            >
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Applying...
            </motion.div>
          )}

          {state === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center"
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Review
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <ReviewApplicationModal
        open={open}
        setOpen={setOpen}
        onCancel={() => setState('idle')}
        onEdit={() => setState('idle')}
        onSubmit={() => setState('idle')}
      />
    </>
  );
} 