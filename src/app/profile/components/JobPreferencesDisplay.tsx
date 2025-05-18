'use client';

import { UserProfile, FieldName } from '@/app/types';
import { DollarSign, Clock, Info, Briefcase, MapPin } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { useEffect, useState } from 'react';

interface JobPreferencesDisplayProps {
  profile: UserProfile;
}

export default function JobPreferencesDisplay({ profile }: JobPreferencesDisplayProps) {
  // Initialize state for job types and location preferences
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [locationPrefs, setLocationPrefs] = useState<string[]>([]);

  // Effect to ensure default values are set if not present
  useEffect(() => {
    // Get job types from profile or use defaults
    const types = profile[FieldName.JOB_TYPES] as string[];
    setJobTypes(types && types.length > 0 ? types : ['Full-time']);

    // Get location preferences from profile or use defaults
    const locations = profile[FieldName.LOCATION_PREFERENCES] as string[];
    setLocationPrefs(locations && locations.length > 0 ? locations : ['Remote']);
  }, [profile]);

  // Format salary with commas
  const formatSalary = (salary: number) => {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profile[FieldName.EXPECTED_SALARY] && (
        <div className="flex items-start">
          <DollarSign className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Expected Annual Salary</p>
            <p className="text-sm text-gray-500">
              ${formatSalary(profile[FieldName.EXPECTED_SALARY])} USD
            </p>
          </div>
        </div>
      )}

      {profile[FieldName.NOTICE_PERIOD] && (
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Notice Period</p>
            <p className="text-sm text-gray-500">{profile[FieldName.NOTICE_PERIOD]}</p>
          </div>
        </div>
      )}

      {/* Always show job types section with at least default values */}
      <div className="flex items-start">
        <Briefcase className="h-5 w-5 text-gray-500 mr-3 mt-1" />
        <div>
          <p className="text-sm font-medium text-gray-900">Job Types</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {jobTypes.map((type, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Always show location preferences section with at least default values */}
      <div className="flex items-start">
        <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
        <div>
          <p className="text-sm font-medium text-gray-900">Location Preferences</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {locationPrefs.map((location, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                {location}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {profile[FieldName.SOURCE] && (
        <div className="flex items-start md:col-span-2">
          <Info className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">How did you hear about us?</p>
            <p className="text-sm text-gray-500">{profile[FieldName.SOURCE]}</p>
          </div>
        </div>
      )}
    </div>
  );
} 