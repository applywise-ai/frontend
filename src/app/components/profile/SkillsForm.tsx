'use client';

import { UserProfile, FieldName } from '@/app/types/profile';
import { Lightbulb, Info, Tags } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import SkillSearch from '@/app/components/profile/SkillSearch';

interface SkillsFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function SkillsForm({ profile, updateProfile }: SkillsFormProps) {
  // Ensure skills array exists
  const skillsList = profile[FieldName.SKILLS] || [];
  
  const handleSkillsChange = (updatedSkills: string[]) => {
    updateProfile({ [FieldName.SKILLS]: updatedSkills });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <Lightbulb className="h-4 w-4 text-teal-500 mr-2" />
          Add your technical and professional skills to improve job matching.
        </p>
      </div>

      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Tags className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add Skills</h3>

              <div className="space-y-5">
                <SkillSearch 
                  value={skillsList}
                  onChange={handleSkillsChange}
                  placeholder="Search or enter a skill (e.g. JavaScript, Project Management)"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            Add skills that are relevant to the positions you&apos;re applying for. 
            These will be used to match you with appropriate job opportunities.
          </p>
        </div>
      </div>
    </div>
  );
} 