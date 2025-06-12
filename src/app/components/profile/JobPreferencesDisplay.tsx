'use client';

import {
  UserProfile,
  FieldName,
  JOB_TYPE_OPTIONS, 
  LOCATION_TYPE_OPTIONS, 
  ROLE_LEVEL_OPTIONS, 
  INDUSTRY_SPECIALIZATION_OPTIONS, 
  COMPANY_SIZE_OPTIONS
} from '@/app/types/profile';
import { DollarSign, Clock, Info, Briefcase, MapPin, Layers, Building, Users } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { getLabelFromValue } from '@/app/utils/profile';

interface JobPreferencesDisplayProps {
  profile: UserProfile;
}

export default function JobPreferencesDisplay({ profile }: JobPreferencesDisplayProps) {
  // Format salary with commas
  const formatSalary = (salary: number) => {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Level - Always show */}
        <div className="flex items-start">
          <Layers className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Role Level</p>
            {profile[FieldName.ROLE_LEVEL] ? (
              <p className="text-sm text-gray-500">
                {getLabelFromValue(profile[FieldName.ROLE_LEVEL], ROLE_LEVEL_OPTIONS)}
              </p>
            ) : (
              <p className="text-sm text-yellow-500 font-normal italic">Not specified</p>
            )}
          </div>
        </div>
        
        {/* Expected Annual Salary - Always show */}
        {profile[FieldName.EXPECTED_SALARY] ? (
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-gray-500 mr-3 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">Expected Annual Salary</p>
              <p className="text-sm text-gray-500">
                ${formatSalary(profile[FieldName.EXPECTED_SALARY])} USD
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-gray-500 mr-3 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">Expected Annual Salary</p>
              <p className="text-sm text-yellow-500 font-normal italic">Not specified</p>
            </div>
          </div>
        )}
        
        {/* Industry Specializations - Always show */}
        <div className="flex items-start">
          <Building className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Industry Specializations</p>
            {profile[FieldName.INDUSTRY_SPECIALIZATIONS]?.length ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile[FieldName.INDUSTRY_SPECIALIZATIONS].map((spec, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {getLabelFromValue(spec, INDUSTRY_SPECIALIZATION_OPTIONS)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-yellow-500 font-normal italic">No specializations selected</p>
            )}
          </div>
        </div>
        
        {/* Company Size - Always show */}
        <div className="flex items-start">
          <Users className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Preferred Company Size</p>
            {profile[FieldName.COMPANY_SIZE]?.length ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile[FieldName.COMPANY_SIZE].map((size, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {getLabelFromValue(size, COMPANY_SIZE_OPTIONS)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-yellow-500 font-normal italic">No company sizes specified</p>
            )}
          </div>
        </div>

        {/* Job Types - Always show */}
        <div className="flex items-start">
          <Briefcase className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Job Types</p>
            {profile[FieldName.JOB_TYPES]?.length ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile[FieldName.JOB_TYPES].map((type, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {getLabelFromValue(type, JOB_TYPE_OPTIONS)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-yellow-500 font-normal italic">No job types specified</p>
            )}
          </div>
        </div>

        {/* Location Preferences - Always show */}
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Location Preferences</p>
            {profile[FieldName.LOCATION_PREFERENCES]?.length ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile[FieldName.LOCATION_PREFERENCES].map((location, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {getLabelFromValue(location, LOCATION_TYPE_OPTIONS)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-yellow-500 font-normal italic">No location preferences specified</p>
            )}
          </div>
        </div>
        
        {/* Notice Period - Always show */}
        {profile[FieldName.NOTICE_PERIOD] ? (
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-500 mr-3 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">Notice Period</p>
              <p className="text-sm text-gray-500">{profile[FieldName.NOTICE_PERIOD]}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-500 mr-3 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">Notice Period</p>
              <p className="text-sm text-yellow-500 font-normal italic">Not specified</p>
            </div>
          </div>
        )}
        
        {/* Source (How did you hear about us) */}
        {profile[FieldName.SOURCE] && (
          <div className="flex items-start">
            <Info className="h-5 w-5 text-gray-500 mr-3 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">How did you hear about us?</p>
              <p className="text-sm text-gray-500">{profile[FieldName.SOURCE]}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 