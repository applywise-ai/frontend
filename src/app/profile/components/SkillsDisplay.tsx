'use client';

import { UserProfile, FieldName } from '@/app/types';
import { Badge } from '@/app/components/ui/badge';

interface SkillsDisplayProps {
  profile: UserProfile;
}

export default function SkillsDisplay({ profile }: SkillsDisplayProps) {
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
          <p className="text-sm text-gray-500 italic">No skills added yet.</p>
        )}
      </div>
    </div>
  );
} 