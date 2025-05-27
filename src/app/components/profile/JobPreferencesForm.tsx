'use client';

import { 
  UserProfile, 
  FieldName, 
  noticePeriodOptions, 
  sourceOptions,
  JOB_TYPE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  ROLE_LEVEL_OPTIONS,
  INDUSTRY_SPECIALIZATION_OPTIONS,
  COMPANY_SIZE_OPTIONS
} from '@/app/types/profile';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { InfoIcon, Briefcase, DollarSign, Clock, MapPin, HelpCircle, Building, Layers, Users } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface JobPreferencesFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function JobPreferencesForm({ profile, updateProfile }: JobPreferencesFormProps) {
  // Ensure arrays exist
  const jobTypes = profile[FieldName.JOB_TYPES] as string[] || [];
  const locationPreferences = profile[FieldName.LOCATION_PREFERENCES] as string[] || [];
  const industrySpecializations = profile[FieldName.INDUSTRY_SPECIALIZATIONS] as string[] || [];
  const companySizes = profile[FieldName.COMPANY_SIZE] as string[] || [];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProfile({ [name]: name === FieldName.EXPECTED_SALARY ? Number(value) : value });
  };
  
  const handleSelectChange = (field: string, value: string) => {
    updateProfile({ [field]: value === 'none' ? null : value });
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

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <Briefcase className="h-4 w-4 text-teal-500 mr-2" />
          Specify your job preferences to get more relevant job recommendations.
        </p>
      </div>

      {/* Role Level Selection */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Layers className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Role Level</h3>
              <div>
                <Select
                  value={profile[FieldName.ROLE_LEVEL] || 'none'}
                  onValueChange={(value) => handleSelectChange(FieldName.ROLE_LEVEL, value)}
                >
                  <SelectTrigger id="role-level" className="shadow-sm">
                    <SelectValue placeholder="Select role level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select role level</SelectItem>
                    {ROLE_LEVEL_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-gray-500">
                  Choose the career level that best matches your experience
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry & Specialization */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Building className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Industry & Specialization</h3>
              <p className="text-sm text-gray-500 mb-3">Select the areas you specialize in or are interested in</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {INDUSTRY_SPECIALIZATION_OPTIONS.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialization-${option.value}`}
                      checked={industrySpecializations.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleMultiSelectChange(FieldName.INDUSTRY_SPECIALIZATIONS, option.value);
                        } else {
                          handleMultiSelectChange(FieldName.INDUSTRY_SPECIALIZATIONS, option.value);
                        }
                      }}
                      className="border-gray-300 text-teal-600"
                    />
                    <Label htmlFor={`specialization-${option.value}`} className="text-sm text-gray-700">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Size */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Ideal Company Size</h3>
              <p className="text-sm text-gray-500 mb-3">Select all company sizes you&apos;re interested in</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {COMPANY_SIZE_OPTIONS.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`companySize-${option.value}`}
                      checked={companySizes.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleMultiSelectChange(FieldName.COMPANY_SIZE, option.value);
                        } else {
                          handleMultiSelectChange(FieldName.COMPANY_SIZE, option.value);
                        }
                      }}
                      className="border-gray-300 text-teal-600"
                    />
                    <Label htmlFor={`companySize-${option.value}`} className="text-sm text-gray-700">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary and Notice Period */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <DollarSign className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Compensation & Availability</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Expected Salary */}
                <div>
                  <Label htmlFor={FieldName.EXPECTED_SALARY} className="text-sm font-medium text-gray-700 mb-2 block">
                    Expected Annual Salary (USD)
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      type="number"
                      id={FieldName.EXPECTED_SALARY}
                      name={FieldName.EXPECTED_SALARY}
                      value={profile[FieldName.EXPECTED_SALARY] || ''}
                      onChange={handleInputChange}
                      className="pl-7 pr-12 shadow-sm"
                      placeholder="0.00"
                      min="0"
                      step="1000"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Your desired annual compensation
                  </p>
                </div>

                {/* Notice Period */}
                <div>
                  <Label htmlFor="notice-period" className="text-sm font-medium text-gray-700 mb-2 block">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1.5" />
                      Notice Period
                    </div>
                  </Label>
                  <div>
                    <Select
                      value={profile[FieldName.NOTICE_PERIOD] || 'none'}
                      onValueChange={(value) => handleSelectChange(FieldName.NOTICE_PERIOD, value)}
                    >
                      <SelectTrigger id="notice-period" className="shadow-sm">
                        <SelectValue placeholder="Select notice period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select notice period</SelectItem>
                        {noticePeriodOptions.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">How soon can you start a new position?</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Type Preferences */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Briefcase className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Job Types</h3>
              <p className="text-sm text-gray-500 mb-3">Select all types of employment you&apos;re interested in</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {JOB_TYPE_OPTIONS.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`jobType-${option.value}`}
                      checked={jobTypes.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleMultiSelectChange(FieldName.JOB_TYPES, option.value);
                        } else {
                          handleMultiSelectChange(FieldName.JOB_TYPES, option.value);
                        }
                      }}
                      className="border-gray-300 text-teal-600"
                    />
                    <Label htmlFor={`jobType-${option.value}`} className="text-sm text-gray-700">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Preferences */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Location Preferences</h3>
              <p className="text-sm text-gray-500 mb-3">Select your preferred work environments</p>
              <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                {LOCATION_TYPE_OPTIONS.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${option.value}`}
                      checked={locationPreferences.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleMultiSelectChange(FieldName.LOCATION_PREFERENCES, option.value);
                        } else {
                          handleMultiSelectChange(FieldName.LOCATION_PREFERENCES, option.value);
                        }
                      }}
                      className="border-gray-300 text-teal-600"
                    />
                    <Label htmlFor={`location-${option.value}`} className="text-sm text-gray-700">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Source */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <HelpCircle className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Additional Information</h3>
              <Label htmlFor="source" className="text-sm font-medium text-gray-700 mb-2 block">
                How did you hear about us?
              </Label>
              <div>
                <Select
                  value={profile[FieldName.SOURCE] || 'none'}
                  onValueChange={(value) => handleSelectChange(FieldName.SOURCE, value)}
                >
                  <SelectTrigger id="source" className="shadow-sm">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select source</SelectItem>
                    {sourceOptions.map(option => (
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

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <InfoIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            Your job preferences help us tailor job recommendations to your needs and expectations.
          </p>
        </div>
      </div>
    </div>
  );
} 