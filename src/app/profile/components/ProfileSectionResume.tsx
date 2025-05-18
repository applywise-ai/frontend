'use client';

import { UserProfile } from '@/app/types';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import ResumeDisplay from './ResumeDisplay';

interface ProfileSectionResumeProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function ProfileSectionResume({
  profile,
  updateProfile
}: ProfileSectionResumeProps) {
  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <div className="mr-2 text-teal-600">
              <FileText size={24} />
            </div>
            <CardTitle className="text-xl">Resume</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ResumeDisplay profile={profile} updateProfile={updateProfile} />
        </CardContent>
      </Card>
    </div>
  );
}