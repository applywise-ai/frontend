'use client';

import { FieldName } from '@/app/types/profile';
import { useProfile } from '@/app/contexts/ProfileContext';
import { Users, Check, X, Globe, Heart } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

export default function DemographicsDisplay() {
  const { profile } = useProfile();
  
  const race = profile[FieldName.RACE] as string[] || [];
  const sexuality = profile[FieldName.SEXUALITY] as string[] || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start">
          <Users className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Gender</p>
            {profile[FieldName.GENDER] ? (
              <p className="text-sm text-gray-500">{profile[FieldName.GENDER]}</p>
            ) : (
              <p className="text-sm text-yellow-500 font-normal italic">Not specified</p>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <Globe className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Race/Ethnicity</p>
            {race.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {race.map((item, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-yellow-500 font-normal italic">No race/ethnicity specified</p>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <Heart className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Sexual Orientation</p>
            {sexuality.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sexuality.map((item, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-yellow-500 font-normal italic">No sexual orientation specified</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-900 mb-3">Additional Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            {profile[FieldName.HISPANIC] ? (
              <Check className="h-5 w-5 text-teal-600 mr-2" />
            ) : (
              <X className="h-5 w-5 text-gray-300 mr-2" />
            )}
            <p className="text-sm text-gray-700">Hispanic or Latino</p>
          </div>

          <div className="flex items-center">
            {profile[FieldName.TRANS] ? (
              <Check className="h-5 w-5 text-teal-600 mr-2" />
            ) : (
              <X className="h-5 w-5 text-gray-300 mr-2" />
            )}
            <p className="text-sm text-gray-700">Transgender</p>
          </div>

          <div className="flex items-center">
            {profile[FieldName.VETERAN] ? (
              <Check className="h-5 w-5 text-teal-600 mr-2" />
            ) : (
              <X className="h-5 w-5 text-gray-300 mr-2" />
            )}
            <p className="text-sm text-gray-700">Protected Veteran</p>
          </div>

          <div className="flex items-center">
            {profile[FieldName.DISABILITY] ? (
              <Check className="h-5 w-5 text-teal-600 mr-2" />
            ) : (
              <X className="h-5 w-5 text-gray-300 mr-2" />
            )}
            <p className="text-sm text-gray-700">Person with a Disability</p>
          </div>
        </div>
      </div>
    </div>
  );
} 