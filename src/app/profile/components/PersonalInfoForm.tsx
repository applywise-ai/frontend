'use client';

import { UserProfile, FieldName } from '@/app/types';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent } from '@/app/components/ui/card';
import { MapPin, Mail, Phone, User } from 'lucide-react';

interface PersonalInfoFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function PersonalInfoForm({ profile, updateProfile }: PersonalInfoFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProfile({ [name]: value });
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

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
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
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <MapPin className="h-4 w-4 text-teal-500 mr-2" />
            Address Information
          </h3>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Address Line 1 */}
            <div className="sm:col-span-6">
              <Label htmlFor={FieldName.ADDRESS_LINE1} className="text-sm font-medium text-gray-700">
                Street Address
              </Label>
              <div className="mt-1">
                <Input
                  type="text"
                  id={FieldName.ADDRESS_LINE1}
                  name={FieldName.ADDRESS_LINE1}
                  value={profile[FieldName.ADDRESS_LINE1] || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="123 Main St"
                />
              </div>
            </div>

            {/* City */}
            <div className="sm:col-span-2">
              <Label htmlFor={FieldName.CITY} className="text-sm font-medium text-gray-700">
                City
              </Label>
              <div className="mt-1">
                <Input
                  type="text"
                  id={FieldName.CITY}
                  name={FieldName.CITY}
                  value={profile[FieldName.CITY] || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="San Francisco"
                />
              </div>
            </div>

            {/* Province/State */}
            <div className="sm:col-span-2">
              <Label htmlFor={FieldName.PROVINCE} className="text-sm font-medium text-gray-700">
                Province/State
              </Label>
              <div className="mt-1">
                <Input
                  type="text"
                  id={FieldName.PROVINCE}
                  name={FieldName.PROVINCE}
                  value={profile[FieldName.PROVINCE] || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="CA"
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="sm:col-span-2">
              <Label htmlFor={FieldName.POSTAL_CODE} className="text-sm font-medium text-gray-700">
                Postal/ZIP Code
              </Label>
              <div className="mt-1">
                <Input
                  type="text"
                  id={FieldName.POSTAL_CODE}
                  name={FieldName.POSTAL_CODE}
                  value={profile[FieldName.POSTAL_CODE] || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="94103"
                />
              </div>
            </div>

            {/* Country */}
            <div className="sm:col-span-3">
              <Label htmlFor={FieldName.COUNTRY} className="text-sm font-medium text-gray-700">
                Country
              </Label>
              <div className="mt-1">
                <Input
                  type="text"
                  id={FieldName.COUNTRY}
                  name={FieldName.COUNTRY}
                  value={profile[FieldName.COUNTRY] || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 