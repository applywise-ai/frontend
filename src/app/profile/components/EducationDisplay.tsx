'use client';

import { UserProfile, FieldName, Education } from '@/app/types';
import { Calendar, School, PencilIcon, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface EducationDisplayProps {
  profile: UserProfile;
  onEdit?: (edu: Education, index: number) => void;
  onDelete?: (index: number) => void;
}

export default function EducationDisplay({ profile, onEdit, onDelete }: EducationDisplayProps) {
  const education = profile[FieldName.EDUCATION] as Education[] || [];

  return (
    <div className="space-y-4">
      {education.length > 0 ? (
        education.map((edu, index) => (
          <div key={index} className={`${index > 0 ? 'pt-4 border-t border-gray-200' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="bg-purple-50 p-2 rounded-full mr-3 flex-shrink-0">
                  <School className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{edu[FieldName.SCHOOL]}</p>
                  <p className="text-sm text-gray-500">{edu[FieldName.DEGREE]} in {edu[FieldName.FIELD_OF_STUDY]}</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">
                      {edu[FieldName.EDUCATION_FROM]} - {edu[FieldName.EDUCATION_TO] || 'Present'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-purple-600"
                    onClick={() => onEdit(edu, index)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => onDelete(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-md px-3 py-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>No education information added yet.</span>
        </div>
      )}
    </div>
  );
} 