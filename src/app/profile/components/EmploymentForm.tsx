'use client';

import { useState } from 'react';
import { UserProfile, FieldName, Employment } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Building, PlusCircle, CalendarIcon, Briefcase, MapPin, FileText, X, CheckIcon } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import EmploymentDisplay from './EmploymentDisplay';

interface EmploymentFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function EmploymentForm({ profile, updateProfile }: EmploymentFormProps) {
  const [employment, setEmployment] = useState<Employment[]>(
    profile[FieldName.EMPLOYMENT] as Employment[] || []
  );
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const emptyEmployment: Employment = {
    [FieldName.COMPANY]: '',
    [FieldName.POSITION]: '',
    [FieldName.EMPLOYMENT_FROM]: '',
    [FieldName.EMPLOYMENT_TO]: '',
    [FieldName.EMPLOYMENT_DESCRIPTION]: '',
    [FieldName.EMPLOYMENT_LOCATION]: '',
  };
  
  const [newEmployment, setNewEmployment] = useState<Employment>({...emptyEmployment});

  const handleAddEmployment = () => {
    if (!newEmployment[FieldName.COMPANY] || !newEmployment[FieldName.POSITION]) {
      return; // Don't add incomplete employment entries
    }

    const updatedEmployment = [...employment, { ...newEmployment }];
    setEmployment(updatedEmployment);
    updateProfile({ [FieldName.EMPLOYMENT]: updatedEmployment });
    
    // Reset the form
    setNewEmployment({...emptyEmployment});
  };

  const handleRemoveEmployment = (index: number) => {
    const updatedEmployment = employment.filter((_, i) => i !== index);
    setEmployment(updatedEmployment);
    updateProfile({ [FieldName.EMPLOYMENT]: updatedEmployment });
    
    // If removing the entry we're currently editing, exit edit mode
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && index < editingIndex) {
      // If removing an entry before the one we're editing, adjust the editing index
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleNewEmploymentChange = (field: keyof Employment, value: string) => {
    setNewEmployment(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleEditEmployment = (job: Employment, index: number) => {
    setEditingIndex(index);
    setNewEmployment({...job});
  };
  
  const handleUpdateEmployment = () => {
    if (editingIndex === null) return;
    
    const updatedEmployment = [...employment];
    updatedEmployment[editingIndex] = {...newEmployment};
    
    setEmployment(updatedEmployment);
    updateProfile({ [FieldName.EMPLOYMENT]: updatedEmployment });
    
    // Exit edit mode and reset form
    setEditingIndex(null);
    setNewEmployment({...emptyEmployment});
  };
  
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewEmployment({...emptyEmployment});
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <Building className="h-4 w-4 text-teal-500 mr-2" />
          Add your work experience to highlight your professional background.
        </p>
      </div>
      
      {/* Existing Employment List */}
      {employment.length > 0 && (
        <div className="space-y-4 mb-4">
          <h3 className="text-md font-medium text-gray-900 flex items-center mb-3">
            <FileText className="h-5 w-5 text-teal-500 mr-2" />
            Your Work Experience
          </h3>
          
          <EmploymentDisplay 
            profile={profile} 
            onEdit={handleEditEmployment} 
            onDelete={handleRemoveEmployment}
          />
        </div>
      )}
      
      {/* Edit or Add New Employment Form */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Building className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                {editingIndex !== null ? 'Edit Employment' : 'Add Employment'}
              </h3>
              
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
                      value={newEmployment[FieldName.COMPANY]}
                      onChange={(e) => handleNewEmploymentChange(FieldName.COMPANY, e.target.value)}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Company name"
                    />
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
                      value={newEmployment[FieldName.POSITION]}
                      onChange={(e) => handleNewEmploymentChange(FieldName.POSITION, e.target.value)}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Job title"
                    />
                  </div>
                </div>
                
                {/* From Date */}
                <div className="sm:col-span-3">
                  <Label htmlFor="from-date" className="text-sm font-medium text-gray-700 flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                    From
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="from-date"
                      type="text"
                      placeholder="MM/YYYY"
                      value={newEmployment[FieldName.EMPLOYMENT_FROM]}
                      onChange={(e) => handleNewEmploymentChange(FieldName.EMPLOYMENT_FROM, e.target.value)}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                
                {/* To Date */}
                <div className="sm:col-span-3">
                  <Label htmlFor="to-date" className="text-sm font-medium text-gray-700 flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                    To (or "Present")
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="to-date"
                      type="text"
                      placeholder="MM/YYYY or Present"
                      value={newEmployment[FieldName.EMPLOYMENT_TO]}
                      onChange={(e) => handleNewEmploymentChange(FieldName.EMPLOYMENT_TO, e.target.value)}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
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
                      value={newEmployment[FieldName.EMPLOYMENT_LOCATION]}
                      onChange={(e) => handleNewEmploymentChange(FieldName.EMPLOYMENT_LOCATION, e.target.value)}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
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
                      value={newEmployment[FieldName.EMPLOYMENT_DESCRIPTION]}
                      onChange={(e) => handleNewEmploymentChange(FieldName.EMPLOYMENT_DESCRIPTION, e.target.value)}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Describe your responsibilities and achievements"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                {editingIndex !== null ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleUpdateEmployment}
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
                    onClick={handleAddEmployment}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Work Experience
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 