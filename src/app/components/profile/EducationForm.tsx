'use client';

import { useState, useEffect } from 'react';
import { UserProfile, FieldName, Education, DEGREE_OPTIONS } from '@/app/types/profile';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { MonthPicker } from '@/app/components/ui/month-picker';
import { format, parse } from 'date-fns';
import { GraduationCap, CalendarIcon, BookOpen, Award } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface EducationFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  editingIndex?: number;
  errors?: Partial<Record<string, string>>;
  setErrors?: (errors: Partial<Record<string, string>>) => void;
}

export default function EducationForm({ 
  editingIndex,
  profile,
  updateProfile,
  errors,
  setErrors
}: EducationFormProps) {
  const emptyEducation: Education = {
    [FieldName.SCHOOL]: '',
    [FieldName.DEGREE]: '',
    [FieldName.FIELD_OF_STUDY]: '',
    [FieldName.EDUCATION_FROM]: '',
    [FieldName.EDUCATION_TO]: '',
    [FieldName.EDUCATION_GPA]: '',
  };
  
  const [education, setEducation] = useState<Education>(
    editingIndex !== undefined && profile[FieldName.EDUCATION] ? profile[FieldName.EDUCATION][editingIndex] : emptyEducation
  );

  useEffect(() => {
    updateProfile({[FieldName.TEMP_EDUCATION]: education});
  }, []);

  const handleEducationChange = (field: keyof Education, value: string) => {
    const updatedEducation = {
      ...education,
      [field]: value
    };
    setEducation(updatedEducation);

    // Clear error when field is updated
    if (errors?.[field] && setErrors) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    // Update temporary education in profile
    const tempEducation = {
      [FieldName.TEMP_EDUCATION]: {
        [FieldName.SCHOOL]: updatedEducation[FieldName.SCHOOL],
        [FieldName.DEGREE]: updatedEducation[FieldName.DEGREE],
        [FieldName.FIELD_OF_STUDY]: updatedEducation[FieldName.FIELD_OF_STUDY],
        [FieldName.EDUCATION_FROM]: updatedEducation[FieldName.EDUCATION_FROM],
        [FieldName.EDUCATION_TO]: updatedEducation[FieldName.EDUCATION_TO],
        [FieldName.EDUCATION_GPA]: updatedEducation[FieldName.EDUCATION_GPA]
      }
    };
    updateProfile(tempEducation);
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

  const getFieldError = (field: keyof Education) => errors?.[field];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <GraduationCap className="h-4 w-4 text-teal-500 mr-2" />
          {editingIndex !== undefined ? 'Edit your education' : 'Add your education to showcase your academic background.'}
        </p>
      </div>
      
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-full">
              <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                {/* School */}
                <div className="sm:col-span-3">
                  <Label htmlFor="school" className="text-sm font-medium text-gray-700 flex items-center">
                    <GraduationCap className="h-4 w-4 text-gray-400 mr-1.5" />
                    School
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="school"
                      value={education[FieldName.SCHOOL]}
                      onChange={(e) => handleEducationChange(FieldName.SCHOOL, e.target.value)}
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.SCHOOL) ? 'border-red-500' : ''}`}
                      placeholder="School name"
        />
                    {getFieldError(FieldName.SCHOOL) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.SCHOOL)}</p>
        )}
                  </div>
                </div>

                {/* Degree */}
                <div className="sm:col-span-3">
                  <Label htmlFor="degree" className="text-sm font-medium text-gray-700 flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-1.5" />
                    Degree
                  </Label>
                  <div className="mt-1">
                    <Select
                      value={education[FieldName.DEGREE]}
                      onValueChange={(value) => handleEducationChange(FieldName.DEGREE, value)}
                    >
                      <SelectTrigger 
                        className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.DEGREE) ? 'border-red-500' : ''}`}
                      >
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEGREE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getFieldError(FieldName.DEGREE) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.DEGREE)}</p>
        )}
                  </div>
                </div>

                {/* Field of Study */}
                <div className="sm:col-span-6">
                  <Label htmlFor="fieldOfStudy" className="text-sm font-medium text-gray-700 flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-1.5" />
                    Field of Study
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="fieldOfStudy"
                      value={education[FieldName.FIELD_OF_STUDY]}
                      onChange={(e) => handleEducationChange(FieldName.FIELD_OF_STUDY, e.target.value)}
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.FIELD_OF_STUDY) ? 'border-red-500' : ''}`}
                      placeholder="e.g., Computer Science"
        />
                    {getFieldError(FieldName.FIELD_OF_STUDY) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.FIELD_OF_STUDY)}</p>
        )}
                  </div>
                </div>

                {/* From Date */}
                <div className="sm:col-span-3">
                  <Label htmlFor="educationFrom" className="text-sm font-medium text-gray-700 flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                    From
                  </Label>
                  <div className="mt-1">
          <MonthPicker
                      date={parseDate(education[FieldName.EDUCATION_FROM])}
                      setDate={(date) => handleEducationChange(FieldName.EDUCATION_FROM, formatDate(date))}
            placeholder="Select start month"
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.EDUCATION_FROM) ? 'border-red-500' : ''}`}
          />
                    <p className="text-xs text-gray-500 mt-1">Enter education start month</p>
                    {getFieldError(FieldName.EDUCATION_FROM) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.EDUCATION_FROM)}</p>
          )}
                  </div>
                </div>

                {/* To Date */}
                <div className="sm:col-span-3">
                  <Label htmlFor="educationTo" className="text-sm font-medium text-gray-700 flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                    To
                  </Label>
                  <div className="mt-1">
          <MonthPicker
                      date={parseDate(education[FieldName.EDUCATION_TO])}
                      setDate={(date) => handleEducationChange(FieldName.EDUCATION_TO, formatDate(date))}
            placeholder="Select end month"
          />
                    <p className="text-xs text-gray-500 mt-1">Leave empty if you&apos;re currently studying</p>
                  </div>
                </div>

                {/* GPA */}
                <div className="sm:col-span-3">
                  <Label htmlFor="gpa" className="text-sm font-medium text-gray-700 flex items-center">
                    <Award className="h-4 w-4 text-gray-400 mr-1.5" />
                    GPA
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="gpa"
                      value={education[FieldName.EDUCATION_GPA] || ''}
                      onChange={(e) => handleEducationChange(FieldName.EDUCATION_GPA, e.target.value)}
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.EDUCATION_GPA) ? 'border-red-500' : ''}`}
                      placeholder="e.g., 3.8"
                    />
                    {getFieldError(FieldName.EDUCATION_GPA) ? (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.EDUCATION_GPA)}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Enter your GPA on a 4.0 scale (optional)</p>
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