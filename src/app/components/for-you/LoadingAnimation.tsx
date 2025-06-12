'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {/* Cool Loading Animation */}
      <div className="flex space-x-3 items-center justify-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-teal-500"
            animate={{
              y: ["0%", "-100%", "0%"],
              opacity: [1, 0.5, 1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <motion.div 
        className="mt-6 text-teal-600 font-semibold text-base flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Sparkles className="h-4 w-4 mr-2 text-teal-500" />
        Finding perfect matches for you...
      </motion.div>
    </div>
  );
} 