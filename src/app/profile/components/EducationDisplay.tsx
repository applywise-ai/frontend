'use client';

import { UserProfile, FieldName, Education } from '@/app/types';
import { Calendar, School, BookOpen } from 'lucide-react';

interface EducationDisplayProps {
  profile: UserProfile;
}

export default function EducationDisplay({ profile }: EducationDisplayProps) {
  const education = profile[FieldName.EDUCATION] as Education[] || [];

  return (
    <div className="space-y-4">
      {education.length > 0 ? (
        education.map((edu, index) => (
          <div key={index} className={`${index > 0 ? 'pt-4 border-t border-gray-200' : ''}`}>
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
          </div>
        ))
      ) : (
        <div className="flex items-start">
          <div className="bg-purple-50 p-2 rounded-full mr-3 flex-shrink-0">
            <School className="h-5 w-5 text-purple-400" />
          </div>
          <div className="flex items-center">
            <p className="text-sm text-gray-500 italic">No education information added yet.</p>
          </div>
        </div>
      )}
    </div>
  );
} 