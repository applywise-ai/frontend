'use client';

import { UserProfile, FieldName, Employment } from '@/app/types';
import { Calendar, Building, MapPin, PencilIcon, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface EmploymentDisplayProps {
  profile: UserProfile;
  onEdit?: (job: Employment, index: number) => void;
  onDelete?: (index: number) => void;
}

export default function EmploymentDisplay({ profile, onEdit, onDelete }: EmploymentDisplayProps) {
  const employment = profile[FieldName.EMPLOYMENT] as Employment[] || [];

  // Helper function to split description into lines and filter out empty ones
  const formatDescription = (description: string) => {
    return description.split('\n').filter(line => line.trim() !== '');
  };

  return (
    <div className="space-y-6">
      {employment.length > 0 ? (
        employment.map((job, index) => (
          <div key={index} className={`${index > 0 ? 'pt-6 border-t border-gray-200' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start w-full">
                <div className="bg-teal-50 p-2 rounded-full mr-3 flex-shrink-0 mt-0.5">
                  <Building className="h-5 w-5 text-teal-600" />
                </div>
                <div className="w-full">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                    <h4 className="text-base font-medium text-gray-900">{job[FieldName.POSITION]}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                      <span>{job[FieldName.EMPLOYMENT_FROM]} - {job[FieldName.EMPLOYMENT_TO] || 'Present'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                    <div className="sm:text-md text-gray-900">{job[FieldName.COMPANY]}</div>
                    {job[FieldName.EMPLOYMENT_LOCATION] && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1" />
                        <span>{job[FieldName.EMPLOYMENT_LOCATION]}</span>
                      </div>
                    )}
                  </div>
                  
                  {job[FieldName.EMPLOYMENT_DESCRIPTION] && (
                    <div className="mt-2 space-y-0.5 w-full">
                      {formatDescription(job[FieldName.EMPLOYMENT_DESCRIPTION]).map((line, i) => (
                        <p key={i} className="text-sm text-gray-600 w-full">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-1 ml-2 flex-shrink-0">
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
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-md px-3 py-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>No employment history added yet.</span>
        </div>
      )}
    </div>
  );
} 