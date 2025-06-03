'use client';

import { UserProfile, FieldName, Education } from '@/app/types/profile';
import { DEGREE_OPTIONS } from '@/app/types/job';
import { Calendar, School, PencilIcon, Trash2, AlertCircle, Award } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';
import { validateEducation } from '@/app/utils/validation';
import { useNotification } from '@/app/contexts/NotificationContext';

import EducationForm from './EducationForm';
import EditSectionModal from './EditSectionModal';
import { getLabelFromValue } from '@/app/utils/profile';

interface EducationDisplayProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function EducationDisplay({ profile, updateProfile }: EducationDisplayProps) {
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const education = profile[FieldName.EDUCATION] as Education[] || [];
  const { showSuccess } = useNotification();

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    updateProfile({ [FieldName.EDUCATION]: updatedEducation });
    showSuccess('Education entry deleted successfully!');
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get the new entry from profile
      const newEntry = profile[FieldName.TEMP_EDUCATION] as Education;
          
      const e = validateEducation(newEntry);
      if (Object.keys(e).length > 0) {
        setErrors(e);
        setIsSaving(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedEducation = [...(profile[FieldName.EDUCATION] || [])];
      if (editingIndex !== undefined) {
        // If editing, replace the specific education entry
        updatedEducation[editingIndex] = newEntry;
      }
    
      // Update the profile with the updated education array
      updateProfile({ [FieldName.EDUCATION]: updatedEducation });
      showSuccess('Education updated successfully!');
      setEditingIndex(undefined);
      setErrors({});
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    updateProfile({ [FieldName.TEMP_EDUCATION]: {} as Education });
    setEditingIndex(undefined);
    setErrors({});
  };

  return (
    <>
    <div className="space-y-6">
      {education.length > 0 ? (
        education.map((edu, index) => (
            <div key={index} className={`${index > 0 ? 'pt-6 border-t border-gray-100' : ''}`}>
              <div className="flex items-start justify-between group">
                <div className="flex items-start w-full">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-2 rounded-lg mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                    <School className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="w-full">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 tracking-tight">{edu[FieldName.SCHOOL]}</h4>
                        <div className="text-sm font-medium text-purple-600 mt-0.5">{getLabelFromValue(edu[FieldName.DEGREE], DEGREE_OPTIONS)} in {edu[FieldName.FIELD_OF_STUDY]}</div>
                    </div>
                  </div>
                  
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full">
                        <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                        <span className="font-medium">{edu[FieldName.EDUCATION_FROM]} - {edu[FieldName.EDUCATION_TO] || 'Present'}</span>
                      </div>
                      {edu[FieldName.EDUCATION_GPA] && (
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full">
                          <Award className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                          <span className="font-medium">GPA: {edu[FieldName.EDUCATION_GPA]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1 ml-3 flex-shrink-0 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-purple-600 hover:bg-purple-50 h-8 w-8 p-0"
                    onClick={() => handleEdit(index)}
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg px-3 py-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>No education history added yet.</span>
        </div>
      )}
    </div>

      <EditSectionModal
        isOpen={editingIndex !== undefined}
        onClose={handleClose}
        onSave={handleSave}
        isSaving={isSaving}
        title="Edit Education"
      >
        {editingIndex !== undefined && (
          <EducationForm
            profile={profile}
            updateProfile={updateProfile}
            editingIndex={editingIndex}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </EditSectionModal>
    </>
  );
} 