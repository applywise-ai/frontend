'use client';

import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { PencilIcon } from 'lucide-react';
import EditSectionModal from './EditSectionModal';
import { UserProfile } from '@/app/types';

interface ProfileSectionProps {
  id: string;
  title: string;
  icon: ReactNode;
  displayContent: ReactNode;
  editContent: ReactNode;
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function ProfileSection({
  id,
  title,
  icon,
  displayContent,
  editContent,
  profile,
  updateProfile
}: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({});

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setTempProfile({});
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update the main profile with the temp profile changes
      updateProfile(tempProfile);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTempUpdate = (data: Partial<UserProfile>) => {
    setTempProfile(prev => ({
      ...prev,
      ...data
    }));
  };

  return (
    <div id={id}>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <div className="mr-2 text-teal-600">
              {icon}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1" 
            onClick={handleEdit}
          >
            <PencilIcon className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Button>
        </CardHeader>
        <CardContent>
          {displayContent}
        </CardContent>
      </Card>

      <EditSectionModal
        isOpen={isEditing}
        onClose={handleClose}
        onSave={handleSave}
        title={`Edit ${title}`}
        isSaving={isSaving}
      >
        {React.cloneElement(editContent as React.ReactElement, { 
          profile: tempProfile, 
          updateProfile: handleTempUpdate 
        })}
      </EditSectionModal>
    </div>
  );
} 