'use client';

import { useState } from 'react';
import { UserProfile, FieldName, Education, degreeOptions } from '@/app/types';
import { PlusCircle, Trash2, GraduationCap, School, BookOpen, Calendar, BookText, Info, CheckIcon, X, PencilIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';
import { Badge } from '@/app/components/ui/badge';
import EducationDisplay from './EducationDisplay';

interface EducationFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function EducationForm({ profile, updateProfile }: EducationFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const emptyEducation: Education = {
    [FieldName.SCHOOL]: '',
    [FieldName.DEGREE]: '',
    [FieldName.FIELD_OF_STUDY]: '',
    [FieldName.EDUCATION_FROM]: '',
    [FieldName.EDUCATION_TO]: '',
  };
  
  const [newEducation, setNewEducation] = useState<Education>({...emptyEducation});

  const handleAddEducation = () => {
    if (
      !newEducation[FieldName.SCHOOL] ||
      !newEducation[FieldName.DEGREE] ||
      !newEducation[FieldName.FIELD_OF_STUDY]
    ) {
      return; // Don't add incomplete education entries
    }

    const currentEducation = profile[FieldName.EDUCATION] || [];
    const updatedEducation = [...currentEducation, { ...newEducation }];
    updateProfile({ [FieldName.EDUCATION]: updatedEducation });

    // Reset the form
    setNewEducation({...emptyEducation});
  };

  const handleRemoveEducation = (index: number) => {
    const currentEducation = profile[FieldName.EDUCATION] || [];
    const updatedEducation = [...currentEducation];
    updatedEducation.splice(index, 1);
    updateProfile({ [FieldName.EDUCATION]: updatedEducation });
    
    // If removing the entry we're currently editing, exit edit mode
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && index < editingIndex) {
      // If removing an entry before the one we're editing, adjust the editing index
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleNewEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setNewEducation(prev => ({
      ...prev,
      [FieldName.DEGREE]: value
    }));
  };
  
  const handleEditEducation = (edu: Education, index: number) => {
    setEditingIndex(index);
    setNewEducation({...edu});
  };
  
  const handleUpdateEducation = () => {
    if (editingIndex === null) return;
    
    const currentEducation = profile[FieldName.EDUCATION] || [];
    const updatedEducation = [...currentEducation];
    updatedEducation[editingIndex] = {...newEducation};
    
    updateProfile({ [FieldName.EDUCATION]: updatedEducation });
    
    // Exit edit mode and reset form
    setEditingIndex(null);
    setNewEducation({...emptyEducation});
  };
  
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewEducation({...emptyEducation});
  };

  // Ensure education array exists
  const educationList = profile[FieldName.EDUCATION] || [];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <GraduationCap className="h-4 w-4 text-teal-500 mr-2" />
          Add your educational background to help employers understand your qualifications.
        </p>
      </div>

      {/* Existing Education List */}
      {educationList.length > 0 && (
        <div className="space-y-4 mb-4">
          <h3 className="text-md font-medium text-gray-900 flex items-center mb-3">
            <BookText className="h-5 w-5 text-teal-500 mr-2" />
            Your Education
          </h3>
          
          <EducationDisplay 
            profile={profile} 
            onEdit={handleEditEducation} 
            onDelete={handleRemoveEducation}
          />
        </div>
      )}

      {/* Add/Edit Education Form */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <GraduationCap className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                {editingIndex !== null ? 'Edit Education' : 'Add Education'}
              </h3>
              
              <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                {/* School */}
                <div className="sm:col-span-6">
                  <Label htmlFor="school" className="text-sm font-medium text-gray-700 flex items-center">
                    <School className="h-4 w-4 text-gray-400 mr-1.5" />
                    School/University
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="school"
                      name={FieldName.SCHOOL}
                      value={newEducation[FieldName.SCHOOL]}
                      onChange={handleNewEducationChange}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="e.g. University of Waterloo"
                    />
                  </div>
                </div>

                {/* Degree */}
                <div className="sm:col-span-3">
                  <Label htmlFor="degree" className="text-sm font-medium text-gray-700 flex items-center">
                    <GraduationCap className="h-4 w-4 text-gray-400 mr-1.5" />
                    Degree
                  </Label>
                  <div className="mt-1">
                    <Select
                      value={newEducation[FieldName.DEGREE]}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger id="degree" className="shadow-sm focus:ring-teal-500 focus:border-teal-500">
                        <SelectValue placeholder="Select a degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {degreeOptions.map(degree => (
                          <SelectItem key={degree} value={degree}>
                            {degree}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Field of Study */}
                <div className="sm:col-span-3">
                  <Label htmlFor="fieldOfStudy" className="text-sm font-medium text-gray-700 flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-1.5" />
                    Field of Study
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="fieldOfStudy"
                      name={FieldName.FIELD_OF_STUDY}
                      value={newEducation[FieldName.FIELD_OF_STUDY]}
                      onChange={handleNewEducationChange}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="e.g. Computer Science, Business"
                    />
                  </div>
                </div>

                {/* Year From */}
                <div className="sm:col-span-3">
                  <Label htmlFor="educationFrom" className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                    From Year
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="educationFrom"
                      name={FieldName.EDUCATION_FROM}
                      value={newEducation[FieldName.EDUCATION_FROM]}
                      onChange={handleNewEducationChange}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="e.g. 2018"
                    />
                  </div>
                </div>

                {/* Year To */}
                <div className="sm:col-span-3">
                  <Label htmlFor="educationTo" className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                    To Year (or expected)
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="educationTo"
                      name={FieldName.EDUCATION_TO}
                      value={newEducation[FieldName.EDUCATION_TO]}
                      onChange={handleNewEducationChange}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Leave blank if current"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                {editingIndex !== null ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleUpdateEducation}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={handleAddEducation}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            Adding your education history helps employers understand your background and qualifications.
            Be sure to include all relevant degrees and certifications.
          </p>
        </div>
      </div>
    </div>
  );
} 