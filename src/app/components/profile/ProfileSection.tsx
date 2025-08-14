'use client';

import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { PencilIcon, PlusIcon } from 'lucide-react';
import EditSectionModal from './EditSectionModal';
import { FieldName } from '@/app/types/profile';
import { validateEmployment, validateEducation, validateProject } from '@/app/utils/validation';
import { useNotification } from '@/app/contexts/NotificationContext';
import { useProfile } from '@/app/contexts/ProfileContext';

type EditContentProps = {
  errors?: Partial<Record<string, string>>;
  setErrors?: React.Dispatch<React.SetStateAction<Partial<Record<string, string>>>>;
};

interface ProfileSectionProps {
  id: string;
  title: string;
  icon: ReactNode;
  displayContent: ReactNode;
  editContent: React.ReactElement<EditContentProps>;
}

export default function ProfileSection({
  id,
  title,
  icon,
  displayContent,
  editContent
}: ProfileSectionProps) {
  const { saveProfile, refreshProfile, addInstance, profile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const isAddSection = id === FieldName.EMPLOYMENT || id === FieldName.EDUCATION || id === FieldName.PROJECT;
  
  // Global notification hook
  const { showSuccess } = useNotification();

  const handleEdit = () => {
    if (isAddSection) {
      addInstance(id);
    }
    setErrors({}); // Clear any previous errors
    setIsEditing(true);
  };

  const handleClose = () => {
    refreshProfile();
    setErrors({}); // Clear errors when closing
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate the data before saving based on the section type
      let validationErrors: Partial<Record<string, string>> = {};
      
      if (id === FieldName.EMPLOYMENT && profile.employment && profile.employment.length > 0) {
        // Validate the most recent employment entry
        const latestEmployment = profile.employment[profile.employment.length - 1];
        validationErrors = validateEmployment(latestEmployment);
      } else if (id === FieldName.EDUCATION && profile.education && profile.education.length > 0) {
        // Validate the most recent education entry
        const latestEducation = profile.education[profile.education.length - 1];
        validationErrors = validateEducation(latestEducation);
      } else if (id === FieldName.PROJECT && profile[FieldName.PROJECT] && profile[FieldName.PROJECT]!.length > 0) {
        // Validate the most recent project entry
        const latestProject = profile[FieldName.PROJECT]![profile[FieldName.PROJECT]!.length - 1];
        validationErrors = validateProject(latestProject);
      }
      
      // Check if there are validation errors
      if (Object.keys(validationErrors).length > 0) {
        // Set validation errors to display in the form
        setErrors(validationErrors);
        return; // Don't save if there are validation errors
      }
      
      // Clear any previous errors
      setErrors({});
      
      // Update the db profile with the profile changes
      await saveProfile();
      setIsEditing(false);
      
      // Show success notification
      showSuccess(`${title} ${isAddSection ? "added" : "updated"} successfully!`);
    } catch (error) {
      // Handle other errors (not validation errors)
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
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
        title={`${isAddSection ? "Add" : "Edit"} ${title}`}
        isSaving={isSaving}
        isAddSection={isAddSection}
      >
        {React.cloneElement(editContent as React.ReactElement<EditContentProps>, {
          errors,
          setErrors
        })}
      </EditSectionModal>
    </div>
  );
}