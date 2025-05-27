'use client';

import { useState } from 'react';
import { UserProfile, FieldName } from '@/app/types/profile';
import { Eye, EyeOff, Shield, AtSign, Key, AlertTriangle, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';

interface AccountFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function AccountForm({ profile, updateProfile }: AccountFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProfile({ [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <Shield className="h-4 w-4 text-teal-500 mr-2" />
          Your account credentials for automated job application systems.
        </p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Security Note</h3>
            <div className="mt-1 text-sm text-yellow-700">
              <p>
                These credentials are used only for automated job applications through platforms like Workday.
                Store sensitive information only if you want to use the auto-fill feature.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Account Credentials</h3>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Workday Email */}
            <div className="sm:col-span-6">
              <Label htmlFor={FieldName.WORKDAY_EMAIL} className="text-sm font-medium text-gray-700 flex items-center">
                <AtSign className="h-4 w-4 text-gray-400 mr-1.5" />
                Workday Email
              </Label>
              <div className="mt-1">
                <Input
                  type="email"
                  id={FieldName.WORKDAY_EMAIL}
                  name={FieldName.WORKDAY_EMAIL}
                  value={profile[FieldName.WORKDAY_EMAIL] || ''}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  placeholder="email@example.com"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email used for Workday applications</p>
            </div>

            {/* Workday Password */}
            <div className="sm:col-span-6">
              <Label htmlFor={FieldName.WORKDAY_PASSWORD} className="text-sm font-medium text-gray-700 flex items-center">
                <Key className="h-4 w-4 text-gray-400 mr-1.5" />
                Workday Password
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id={FieldName.WORKDAY_PASSWORD}
                  name={FieldName.WORKDAY_PASSWORD}
                  value={profile[FieldName.WORKDAY_PASSWORD] || ''}
                  onChange={handleInputChange}
                  className="pr-10 shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Password used for Workday applications</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            Your password is encrypted and stored securely. We never share your credentials with third parties.
            You can remove this information at any time.
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-gray-900">Account Management</h3>
        <p className="text-xs text-gray-500 mb-2">Permanently delete your account and all associated data</p>
        <Button
          variant="destructive"
          size="sm"
          className="w-fit flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </div>
    </div>
  );
} 