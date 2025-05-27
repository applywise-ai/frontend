'use client';

import { useState, useEffect } from 'react';
import { UserProfile, FieldName, Employment } from '@/app/types/profile';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { MonthPicker } from '@/app/components/ui/month-picker';
import { format, parse } from 'date-fns';
import { Building, CalendarIcon, Briefcase, MapPin, FileText } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface EmploymentFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  editingIndex?: number;
  errors?: Partial<Record<string, string>>;
  setErrors?: (errors: Partial<Record<string, string>>) => void;
}

export default function EmploymentForm({ 
  editingIndex,
  profile,
  updateProfile,
  errors,
  setErrors
}: EmploymentFormProps) {
  const emptyEmployment: Employment = {
    [FieldName.COMPANY]: '',
    [FieldName.POSITION]: '',
    [FieldName.EMPLOYMENT_FROM]: '',
    [FieldName.EMPLOYMENT_TO]: '',
    [FieldName.EMPLOYMENT_DESCRIPTION]: '',
    [FieldName.EMPLOYMENT_LOCATION]: '',
  };
  
  const [employment, setEmployment] = useState<Employment>(
    editingIndex !== undefined && profile[FieldName.EMPLOYMENT] ? profile[FieldName.EMPLOYMENT][editingIndex] : emptyEmployment
  );

  useEffect(() => {
    updateProfile({[FieldName.TEMP_EMPLOYMENT]: employment});
  }, []);

  const handleEmploymentChange = (field: keyof Employment, value: string) => {
    const updatedEmployment = {
      ...employment,
      [field]: value
    };
    setEmployment(updatedEmployment);

    // Clear error when field is updated
    if (errors?.[field] && setErrors) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    // Update temporary employment in profile
    const tempEmployment = {
      [FieldName.TEMP_EMPLOYMENT]: {
        [FieldName.COMPANY]: updatedEmployment[FieldName.COMPANY],
        [FieldName.POSITION]: updatedEmployment[FieldName.POSITION],
        [FieldName.EMPLOYMENT_FROM]: updatedEmployment[FieldName.EMPLOYMENT_FROM],
        [FieldName.EMPLOYMENT_TO]: updatedEmployment[FieldName.EMPLOYMENT_TO],
        [FieldName.EMPLOYMENT_DESCRIPTION]: updatedEmployment[FieldName.EMPLOYMENT_DESCRIPTION],
        [FieldName.EMPLOYMENT_LOCATION]: updatedEmployment[FieldName.EMPLOYMENT_LOCATION]
      }
    };
    updateProfile(tempEmployment);
  };

  const parseDate = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      return parse(dateStr, 'MM/yyyy', new Date());
    } catch {
      return undefined;
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return format(date, 'MM/yyyy');
  };
  const getFieldError = (field: keyof Employment) => errors?.[field];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <Building className="h-4 w-4 text-teal-500 mr-2" />
          {editingIndex !== undefined ? 'Edit your work experience' : 'Add your work experience to highlight your professional background.'}
        </p>
      </div>
      
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-full">
              <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                {/* Company */}
                <div className="sm:col-span-3">
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700 flex items-center">
                    <Building className="h-4 w-4 text-gray-400 mr-1.5" />
                    Company
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="company"
                      value={employment[FieldName.COMPANY]}
                      onChange={(e) => handleEmploymentChange(FieldName.COMPANY, e.target.value)}
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.COMPANY) ? 'border-red-500' : ''}`}
                      placeholder="Company name"
                    />
                    {getFieldError(FieldName.COMPANY) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.COMPANY)}</p>
                    )}
                  </div>
                </div>
                
                {/* Position */}
                <div className="sm:col-span-3">
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700 flex items-center">
                    <Briefcase className="h-4 w-4 text-gray-400 mr-1.5" />
                    Position
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="position"
                      value={employment[FieldName.POSITION]}
                      onChange={(e) => handleEmploymentChange(FieldName.POSITION, e.target.value)}
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.POSITION) ? 'border-red-500' : ''}`}
                      placeholder="Job title"
                    />
                    {getFieldError(FieldName.POSITION) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.POSITION)}</p>
                    )}
                  </div>
                </div>
                
                {/* From Date */}
                <div className="sm:col-span-3">
                  <Label htmlFor="employmentFrom" className="text-sm font-medium text-gray-700 flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                    From
                  </Label>
                  <div className="mt-1">
                    <MonthPicker
                      date={parseDate(employment[FieldName.EMPLOYMENT_FROM])}
                      setDate={(date) => handleEmploymentChange(FieldName.EMPLOYMENT_FROM, formatDate(date))}
                      placeholder="Select start month"
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.EMPLOYMENT_FROM) ? 'border-red-500' : ''}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter employment start month</p>
                    {getFieldError(FieldName.EMPLOYMENT_FROM) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.EMPLOYMENT_FROM)}</p>
                    )}
                  </div>
                </div>
                
                {/* To Date */}
                <div className="sm:col-span-3">
                  <Label htmlFor="employmentTo" className="text-sm font-medium text-gray-700 flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                    To
                  </Label>
                  <div className="mt-1">
                    <MonthPicker
                      date={parseDate(employment[FieldName.EMPLOYMENT_TO])}
                      setDate={(date) => handleEmploymentChange(FieldName.EMPLOYMENT_TO, formatDate(date))}
                      placeholder="Select end month"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty if this is your current position</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="sm:col-span-6">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1.5" />
                    Location
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="location"
                      type="text"
                      placeholder="City, Country or Remote"
                      value={employment[FieldName.EMPLOYMENT_LOCATION]}
                      onChange={(e) => handleEmploymentChange(FieldName.EMPLOYMENT_LOCATION, e.target.value)}
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.EMPLOYMENT_LOCATION) ? 'border-red-500' : ''}`}
                    />
                    {getFieldError(FieldName.EMPLOYMENT_LOCATION) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.EMPLOYMENT_LOCATION)}</p>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div className="sm:col-span-6">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-1.5" />
                    Description
                  </Label>
                  <div className="mt-1">
                    <Textarea
                      id="description"
                      value={employment[FieldName.EMPLOYMENT_DESCRIPTION]}
                      onChange={(e) => handleEmploymentChange(FieldName.EMPLOYMENT_DESCRIPTION, e.target.value)}
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.EMPLOYMENT_DESCRIPTION) ? 'border-red-500' : ''}`}
                      placeholder="Describe your responsibilities and achievements"
                      rows={3}
                    />
                    {getFieldError(FieldName.EMPLOYMENT_DESCRIPTION) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.EMPLOYMENT_DESCRIPTION)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 