'use client';

import { UserProfile, FieldName } from '@/app/types/profile';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin
} from 'lucide-react';

interface PersonalInfoDisplayProps {
  profile: UserProfile;
}

export default function PersonalInfoDisplay({ profile }: PersonalInfoDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-start">
        <User className="h-5 w-5 text-gray-500 mr-3 mt-1" />
        <div>
          <p className="text-sm font-medium text-gray-900">Full Name</p>
          {profile[FieldName.FULL_NAME] ? (
            <p className="text-sm text-gray-500">{profile[FieldName.FULL_NAME]}</p>
          ) : (
            <p className="text-sm text-yellow-500 font-normal italic">No full name specified</p>
          )}
        </div>
      </div>

      <div className="flex items-start">
        <Mail className="h-5 w-5 text-gray-500 mr-3 mt-1" />
        <div>
          <p className="text-sm font-medium text-gray-900">Email</p>
          {profile[FieldName.EMAIL] ? (
            <p className="text-sm text-gray-500">{profile[FieldName.EMAIL]}</p>
          ) : (
            <p className="text-sm text-yellow-500 font-normal italic">No email specified</p>
          )}
        </div>
      </div>

      <div className="flex items-start">
        <Phone className="h-5 w-5 text-gray-500 mr-3 mt-1" />
        <div>
          <p className="text-sm font-medium text-gray-900">Phone</p>
          {profile[FieldName.PHONE_NUMBER] ? (
            <p className="text-sm text-gray-500">{profile[FieldName.PHONE_NUMBER]}</p>
          ) : (
            <p className="text-sm text-yellow-500 font-normal italic">No phone number specified</p>
          )}
        </div>
      </div>

      <div className="flex items-start">
        <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
        <div>
          <p className="text-sm font-medium text-gray-900">Current Location</p>
          {profile[FieldName.CURRENT_LOCATION] ? (
            <p className="text-sm text-gray-500">{profile[FieldName.CURRENT_LOCATION]}</p>
          ) : (
            <p className="text-sm text-yellow-500 font-normal italic">No location specified</p>
          )}
        </div>
      </div>
    </div>
  );
} 