'use client';

import { Tag } from 'lucide-react';

interface JobTagsProps {
  tags: string[];
}

export default function JobTags({ tags }: JobTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-base font-bold text-gray-900 mb-2">Skills & Technologies</h4>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <span 
            key={idx} 
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 border border-teal-200/50 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
} 