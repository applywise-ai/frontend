'use client';

import { FieldName } from '@/app/types/profile';
import { useProfile } from '@/app/contexts/ProfileContext';
import { Badge } from '@/app/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export default function SkillsDisplay() {
  const { profile } = useProfile();
  
  
  const skills = profile[FieldName.SKILLS] as string[] || [];

  return (
    <div className="space-y-4">
      <div>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-md px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>No skills added yet.</span>
          </div>
        )}
      </div>
    </div>
  );
} 