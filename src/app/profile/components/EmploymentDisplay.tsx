'use client';

import { UserProfile, FieldName, Employment } from '@/app/types';
import { Calendar, Building, MapPin, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface EmploymentDisplayProps {
  profile: UserProfile;
  onEdit?: (job: Employment, index: number) => void;
  onDelete?: (index: number) => void;
}

export default function EmploymentDisplay({ profile, onEdit, onDelete }: EmploymentDisplayProps) {
  const employment = profile[FieldName.EMPLOYMENT] as Employment[] || [];

  return (
    <div className="space-y-4">
      {employment.length > 0 ? (
        employment.map((job, index) => (
          <div key={index} className={`${index > 0 ? 'pt-4 border-t border-gray-200' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="bg-teal-50 p-2 rounded-full mr-3 flex-shrink-0">
                  <Building className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{job[FieldName.POSITION]}</p>
                  <p className="text-sm text-gray-600">{job[FieldName.COMPANY]}</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">
                      {job[FieldName.EMPLOYMENT_FROM]} - {job[FieldName.EMPLOYMENT_TO] || 'Present'}
                    </p>
                  </div>
                  {job[FieldName.EMPLOYMENT_LOCATION] && (
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      {job[FieldName.EMPLOYMENT_LOCATION]}
                    </div>
                  )}
                  {job[FieldName.EMPLOYMENT_DESCRIPTION] && (
                    <p className="text-sm text-gray-500 mt-2">
                      {job[FieldName.EMPLOYMENT_DESCRIPTION]}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-teal-600"
                    onClick={() => onEdit(job, index)}
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
        <p className="text-sm text-gray-500 italic">No employment history added yet.</p>
      )}
    </div>
  );
} 