'use client';

import { FieldName, Employment } from '@/app/types/profile';
import { useProfile } from '@/app/contexts/ProfileContext';
import { Calendar, Building, MapPin, PencilIcon, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';
import { validateEmployment } from '@/app/utils/validation';
import { useNotification } from '@/app/contexts/NotificationContext';

import EmploymentForm from './EmploymentForm';
import EditSectionModal from './EditSectionModal';

export default function EmploymentDisplay() {
  const { profile, updateProfile, saveProfile, refreshProfile } = useProfile();
  const { showSuccess } = useNotification();
  
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const employment = profile[FieldName.EMPLOYMENT] as Employment[] || [];
  
  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedEmployment = [...employment];
    updatedEmployment.splice(index, 1);
    updateProfile({ [FieldName.EMPLOYMENT]: updatedEmployment }, true);
    showSuccess('Employment entry deleted successfully!');
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate the employment entry being edited
      if (editingIndex !== undefined && employment[editingIndex]) {
        const employmentToValidate = employment[editingIndex];
        const validationErrors = validateEmployment(employmentToValidate);
        
        if (Object.keys(validationErrors).length > 0) {
          // Set validation errors to display in the form
          setErrors(validationErrors);
          return; // Don't save if there are validation errors
        }
      }
      
      // Clear any previous errors
      setErrors({});
      
      // Save the profile
      await saveProfile();

      showSuccess('Employment updated successfully!');
      setEditingIndex(undefined);
    } catch (error) {
      // Handle other errors (not validation errors)
      console.error('Error saving employment:', error);
      setErrors({ general: 'Failed to save employment. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    refreshProfile();
    setEditingIndex(undefined);
    setErrors({});
  };

  // Helper function to split description into lines and filter out empty ones
  const formatDescription = (description: string) => {
    return description.split('\n').filter(line => line.trim() !== '');
  };

  return (
    <>
    <div className="space-y-6">
      {employment.length > 0 ? (
        employment.map((job, index) => (
            <div key={index} className={`${index > 0 ? 'pt-6 border-t border-gray-100' : ''}`}>
              <div className="flex items-start justify-between group">
              <div className="flex items-start w-full">
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-2 rounded-lg mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                    <Building className="h-4 w-4 text-teal-600" />
                </div>
                <div className="w-full">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 tracking-tight">{job[FieldName.POSITION]}</h4>
                        <div className="text-sm font-medium text-teal-600 mt-0.5">{job[FieldName.COMPANY]}</div>
                    </div>
                  </div>
                  
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full">
                        <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                        <span className="font-medium">{job[FieldName.EMPLOYMENT_FROM]} - {job[FieldName.EMPLOYMENT_TO] || 'Present'}</span>
                      </div>
                    {job[FieldName.EMPLOYMENT_LOCATION] && (
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                          <span className="font-medium">{job[FieldName.EMPLOYMENT_LOCATION]}</span>
                      </div>
                    )}
                  </div>

                  {job[FieldName.EMPLOYMENT_DESCRIPTION] && (
                      <div className="space-y-1 w-full">
                      {formatDescription(job[FieldName.EMPLOYMENT_DESCRIPTION]).map((line, i) => (
                          <p key={i} className="text-sm text-gray-600 leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
                <div className="flex space-x-1 ml-3 flex-shrink-0 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-teal-600 hover:bg-teal-50 h-8 w-8 p-0"
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
          <span>No employment history added yet.</span>
        </div>
      )}
    </div>

      <EditSectionModal
        isOpen={editingIndex !== undefined}
        onClose={handleClose}
        onSave={handleSave}
        isSaving={isSaving}
        title="Edit Employment"
      >
        {editingIndex !== undefined && (
          <EmploymentForm
            editingIndex={editingIndex}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </EditSectionModal>
    </>
  );
} 