'use client';

import { UserProfile, FieldName } from '@/app/types';
import { 
  User, 
  Mail, 
  Phone, 
  Home
} from 'lucide-react';

interface PersonalInfoDisplayProps {
  profile: UserProfile;
}

export default function PersonalInfoDisplay({ profile }: PersonalInfoDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profile[FieldName.FULL_NAME] && (
        <div className="flex items-start">
          <User className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Full Name</p>
            <p className="text-sm text-gray-500">{profile[FieldName.FULL_NAME]}</p>
          </div>
        </div>
      )}

      {profile[FieldName.EMAIL] && (
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Email</p>
            <p className="text-sm text-gray-500">{profile[FieldName.EMAIL]}</p>
          </div>
        </div>
      )}

      {profile[FieldName.PHONE_NUMBER] && (
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Phone</p>
            <p className="text-sm text-gray-500">{profile[FieldName.PHONE_NUMBER]}</p>
          </div>
        </div>
      )}

      {profile[FieldName.ADDRESS_LINE1] && (
        <div className="flex items-start md:col-span-2 lg:col-span-1">
          <Home className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div className="max-w-xs lg:max-w-md">
            <p className="text-sm font-medium text-gray-900">Address</p>
            <p className="text-sm text-gray-500">
              {profile[FieldName.ADDRESS_LINE1]}, {profile[FieldName.CITY]}<br />
              {profile[FieldName.PROVINCE]}, {profile[FieldName.COUNTRY]} {profile[FieldName.POSTAL_CODE]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 