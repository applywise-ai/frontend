'use client';

import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { PencilIcon, PlusIcon } from 'lucide-react';
import EditSectionModal from './EditSectionModal';
import { UserProfile, FieldName } from '@/app/types/profile';
import { validateEmployment, validateEducation, validateProject } from '@/app/utils/validation';
import { useNotification } from '@/app/contexts/NotificationContext';

type EditContentProps = {
  profile: Partial<UserProfile>;
  updateProfile: (data: Partial<UserProfile>) => void;
  errors?: Partial<Record<string, string>>;
  setErrors?: React.Dispatch<React.SetStateAction<Partial<Record<string, string>>>>;
};

interface ProfileSectionProps {
  id: string;
  title: string;
  icon: ReactNode;
  displayContent: ReactNode;
  editContent: React.ReactElement<EditContentProps>;
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
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({});
  
  // Global notification hook
  const { showSuccess } = useNotification();

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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the main profile with the temp profile changes
      updateProfile(tempProfile);
      setIsEditing(false);
      
      // Show success notification
      showSuccess(`${title} updated successfully!`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async () => {
    setIsSaving(true);
    try {
      // Define section-specific configurations
      const sectionConfig = {
        employment: {
          tempField: FieldName.TEMP_EMPLOYMENT,
          arrayField: FieldName.EMPLOYMENT,
          validator: validateEmployment,
        },
        education: {
          tempField: FieldName.TEMP_EDUCATION,
          arrayField: FieldName.EDUCATION,
          validator: validateEducation,
        },
        projects: {
          tempField: FieldName.TEMP_PROJECT,
          arrayField: FieldName.PROJECTS,
          validator: validateProject,
        }
      } as const;

      const config = sectionConfig[id as keyof typeof sectionConfig];
      
      if (config) {
        // Get the new entry from tempProfile
        const newEntry = tempProfile[config.tempField as keyof UserProfile] || {};
        
        // Validate the entry
        const errors = config.validator(newEntry);
        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          setIsSaving(false);
          return;
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Add the new entry to the array
        const existingArray = (profile[config.arrayField as keyof UserProfile] || []) as unknown[];
        const newArray = [...existingArray, newEntry];
        
        // Update the profile with the new array
        updateProfile({ [config.arrayField]: newArray });
        
        // Show success notification
        const itemName = id === 'employment' ? 'Employment' : id === 'education' ? 'Education' : 'Project';
        showSuccess(`${itemName} added successfully!`);
      }
      
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

  const isAddSection = id === FieldName.EMPLOYMENT || id === FieldName.EDUCATION || id === FieldName.PROJECTS;

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
            {isAddSection ? (
              <PlusIcon className="h-3.5 w-3.5" />
            ) : (
              <PencilIcon className="h-3.5 w-3.5" />
            )}
            <span>{isAddSection ? 'Add' : 'Edit'}</span>
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
        onAdd={handleAdd}
        title={`Edit ${title}`}
        isSaving={isSaving}
        sectionId={id}
      >
        {React.cloneElement(editContent as React.ReactElement<EditContentProps>, {
          profile: tempProfile,
          updateProfile: handleTempUpdate,
          errors: errors,
          setErrors: setErrors
        })}
      </EditSectionModal>
    </div>
  );
}