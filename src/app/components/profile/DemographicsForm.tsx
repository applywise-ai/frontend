'use client';

import { UserProfile, FieldName, genderOptions, raceOptions, sexualityOptions } from '@/app/types/profile';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { InfoIcon, Users, Globe, Heart, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';

interface DemographicsFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function DemographicsForm({ profile, updateProfile }: DemographicsFormProps) {
  const handleSelectChange = (value: string) => {
    updateProfile({ [FieldName.GENDER]: value === 'prefer_not_to_say' ? '' : value });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateProfile({ [field]: checked });
  };

  const handleMultiSelectChange = (field: string, value: string) => {
    const currentValues = profile[field as keyof UserProfile] as string[] || [];
    let newValues: string[];

    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }

    updateProfile({ [field]: newValues });
  };

  // Ensure arrays exist
  const races = profile[FieldName.RACE] as string[] || [];
  const sexualities = profile[FieldName.SEXUALITY] as string[] || [];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <Users className="h-4 w-4 text-teal-500 mr-2" />
          This information is optional and will be used for diversity and inclusion initiatives.
        </p>
      </div>

      {/* Gender Section */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Gender</h3>
              <div>
                <Label htmlFor="gender" className="text-sm text-gray-700 mb-2 block">Gender Identity</Label>
                <Select
                  value={profile[FieldName.GENDER] || 'prefer_not_to_say'}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Prefer not to say" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    {genderOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Race/Ethnicity Section */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Globe className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Race/Ethnicity</h3>
              
              <p className="text-sm text-gray-500 mb-3">Select all that apply</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {raceOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`race-${option}`}
                      checked={races.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleMultiSelectChange(FieldName.RACE, option);
                        } else {
                          handleMultiSelectChange(FieldName.RACE, option);
                        }
                      }}
                      className="border-gray-300 text-teal-600"
                    />
                    <Label htmlFor={`race-${option}`} className="text-sm text-gray-700">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-start space-x-2">
                <Checkbox
                  id={FieldName.HISPANIC}
                  checked={profile[FieldName.HISPANIC] || false}
                  onCheckedChange={(checked) => handleCheckboxChange(FieldName.HISPANIC, checked as boolean)}
                  className="border-gray-300 text-teal-600 mt-1"
                />
                <div>
                  <Label htmlFor={FieldName.HISPANIC} className="text-sm text-gray-700 font-medium">
                    Hispanic or Latino
                  </Label>
                  <p className="text-xs text-gray-500">
                    A person of Cuban, Mexican, Puerto Rican, South or Central American, or other Spanish culture or origin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sexual Orientation Section */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Heart className="h-5 w-5 text-pink-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Sexual Orientation</h3>
              <p className="text-sm text-gray-500 mb-3">Select all that apply</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {sexualityOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sexuality-${option}`}
                      checked={sexualities.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleMultiSelectChange(FieldName.SEXUALITY, option);
                        } else {
                          handleMultiSelectChange(FieldName.SEXUALITY, option);
                        }
                      }}
                      className="border-gray-300 text-teal-600"
                    />
                    <Label htmlFor={`sexuality-${option}`} className="text-sm text-gray-700">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information Section */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 gap-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id={FieldName.TRANS}
                    checked={profile[FieldName.TRANS] || false}
                    onCheckedChange={(checked) => handleCheckboxChange(FieldName.TRANS, checked as boolean)}
                    className="border-gray-300 text-teal-600 mt-1"
                  />
                  <div>
                    <Label htmlFor={FieldName.TRANS} className="text-sm text-gray-700 font-medium">
                      I identify as transgender
                    </Label>
                    <p className="text-sm text-gray-500">
                      A person whose gender identity differs from the sex they were assigned at birth.
                    </p>
                  </div>
                </div>

                <Separator className="my-1" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                  <div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id={FieldName.VETERAN}
                        checked={profile[FieldName.VETERAN] || false}
                        onCheckedChange={(checked) => handleCheckboxChange(FieldName.VETERAN, checked as boolean)}
                        className="border-gray-300 text-teal-600 mt-1"
                      />
                      <div>
                        <Label htmlFor={FieldName.VETERAN} className="text-sm text-gray-700 font-medium">
                          Protected Veteran
                        </Label>
                        <p className="text-sm text-gray-500">
                          I identify as a protected veteran (U.S.).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id={FieldName.DISABILITY}
                        checked={profile[FieldName.DISABILITY] || false}
                        onCheckedChange={(checked) => handleCheckboxChange(FieldName.DISABILITY, checked as boolean)}
                        className="border-gray-300 text-teal-600 mt-1"
                      />
                      <div>
                        <Label htmlFor={FieldName.DISABILITY} className="text-sm text-gray-700 font-medium">
                          Person with a Disability
                        </Label>
                        <p className="text-sm text-gray-500">
                          I identify as a person with a disability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <InfoIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            This information is collected for diversity and inclusion purposes only and is kept confidential.
          </p>
        </div>
      </div>
    </div>
  );
} 