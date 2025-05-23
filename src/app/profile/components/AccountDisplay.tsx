'use client';

import { UserProfile, FieldName } from '@/app/types';
import { Key, AtSign } from 'lucide-react';

interface AccountDisplayProps {
  profile: UserProfile;
}

export default function AccountDisplay({ profile }: AccountDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profile[FieldName.WORKDAY_EMAIL] && (
        <div className="flex items-start">
          <AtSign className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Workday Email</p>
            <p className="text-sm text-gray-500">{profile[FieldName.WORKDAY_EMAIL]}</p>
          </div>
        </div>
      )}

      {profile[FieldName.WORKDAY_PASSWORD] && (
        <div className="flex items-start">
          <Key className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Workday Password</p>
            <p className="text-sm text-gray-500">••••••••••</p>
          </div>
        </div>
      )}

      {!profile[FieldName.WORKDAY_EMAIL] && !profile[FieldName.WORKDAY_PASSWORD] && (
        <p className="text-sm text-yellow-800 font-normal italic col-span-full">No account information added yet.</p>
      )}
    </div>
  );
} 