'use client';

import { FieldName } from '@/app/types/profile';
import { useProfile } from '@/app/contexts/ProfileContext';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent } from '@/app/components/ui/card';
import { Mail, Phone, User, Info } from 'lucide-react';
import LocationSearch from '@/app/components/profile/LocationSearch';

export default function PersonalInfoForm() {
  const { profile, updateProfile } = useProfile();
  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProfile({ [name]: value });
  };

  const handleLocationChange = (value: string) => {
    updateProfile({ [FieldName.CURRENT_LOCATION]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <User className="h-4 w-4 text-teal-500 mr-2" />
          This information will be used for job applications and communications.
        </p>
      </div>

      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 gap-y-8 gap-x-4 sm:grid-cols-6">
            {/* Full Name */}
            <div className="sm:col-span-6">
              <Label htmlFor={FieldName.FULL_NAME} className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <div className="mt-1">
                <Input
                  type="text"
                  id={FieldName.FULL_NAME}
                  name={FieldName.FULL_NAME}
                  value={profile[FieldName.FULL_NAME] || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-3">
              <Label htmlFor={FieldName.EMAIL} className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-1.5" />
                Email Address
              </Label>
              <div className="mt-1">
                <Input
                  type="email"
                  id={FieldName.EMAIL}
                  name={FieldName.EMAIL}
                  value={profile[FieldName.EMAIL] || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-3">
              <Label htmlFor={FieldName.PHONE_NUMBER} className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-1.5" />
                Phone Number
              </Label>
              <div className="mt-1">
                <Input
                  type="tel"
                  id={FieldName.PHONE_NUMBER}
                  name={FieldName.PHONE_NUMBER}
                  value={profile[FieldName.PHONE_NUMBER] || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            {/* Current Location */}
            <div className="sm:col-span-6 relative">
              <LocationSearch
                value={profile[FieldName.CURRENT_LOCATION] || ''}
                onChange={handleLocationChange}
                placeholder="City, State or Remote"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            Your personal information is crucial for employers to contact you about job opportunities.
            Remote or hybrid preferences can be specified in your location, which may expand your job options.
          </p>
        </div>
      </div>
    </div>
  );
} 