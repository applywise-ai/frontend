'use client';

import { useState } from 'react';
import { UserProfile, FieldName, Employment } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Building, Calendar, PlusCircle, Trash2, CalendarIcon, Briefcase, MapPin, FileText } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface EmploymentFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function EmploymentForm({ profile, updateProfile }: EmploymentFormProps) {
  const [employment, setEmployment] = useState<Employment[]>(
    profile[FieldName.EMPLOYMENT] as Employment[] || []
  );
  
  const [newEmployment, setNewEmployment] = useState<Employment>({
    [FieldName.COMPANY]: '',
    [FieldName.POSITION]: '',
    [FieldName.EMPLOYMENT_FROM]: '',
    [FieldName.EMPLOYMENT_TO]: '',
    [FieldName.EMPLOYMENT_DESCRIPTION]: '',
  });

  const handleAddEmployment = () => {
    if (!newEmployment[FieldName.COMPANY] || !newEmployment[FieldName.POSITION]) {
      return; // Don't add incomplete employment entries
    }

    const updatedEmployment = [...employment, { ...newEmployment }];
    setEmployment(updatedEmployment);
    updateProfile({ [FieldName.EMPLOYMENT]: updatedEmployment });
    
    // Reset the form
    setNewEmployment({
      [FieldName.COMPANY]: '',
      [FieldName.POSITION]: '',
      [FieldName.EMPLOYMENT_FROM]: '',
      [FieldName.EMPLOYMENT_TO]: '',
      [FieldName.EMPLOYMENT_DESCRIPTION]: '',
    });
  };

  const handleRemoveEmployment = (index: number) => {
    const updatedEmployment = employment.filter((_, i) => i !== index);
    setEmployment(updatedEmployment);
    updateProfile({ [FieldName.EMPLOYMENT]: updatedEmployment });
  };

  const handleNewEmploymentChange = (field: keyof Employment, value: string) => {
    setNewEmployment(prev => ({
      ...prev,
      [field]: value
    }));
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
          
          {employment.map((job, index) => (
            <Card key={index} className="relative border-gray-200 shadow-sm hover:shadow transition-shadow">
              <Button
                type="button"
                onClick={() => handleRemoveEmployment(index)}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                aria-label="Remove employment"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
              
              <CardContent className="p-5 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Building className="h-3.5 w-3.5 text-gray-400 mr-1" /> Company
                  </p>
                  <p className="font-medium text-gray-900">{job[FieldName.COMPANY]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Briefcase className="h-3.5 w-3.5 text-gray-400 mr-1" /> Position
                  </p>
                  <p className="font-medium text-gray-900">{job[FieldName.POSITION]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" /> Dates
                  </p>
                  <p className="font-medium text-gray-900">
                    {job[FieldName.EMPLOYMENT_FROM]} 
                    {job[FieldName.EMPLOYMENT_TO] ? 
                      ` - ${job[FieldName.EMPLOYMENT_TO]}` : 
                      <Badge className="ml-2 bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200">Present</Badge>
                    }
                  </p>
                </div>
                {job[FieldName.EMPLOYMENT_DESCRIPTION] && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 flex items-center">
                      <FileText className="h-3.5 w-3.5 text-gray-400 mr-1" /> Description
                    </p>
                    <p className="text-sm text-gray-700">{job[FieldName.EMPLOYMENT_DESCRIPTION]}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add New Employment Form */}
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Building className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add Employment</h3>
              
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
              
              <div className="mt-6">
                <Button
                  type="button"
                  onClick={handleAddEmployment}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Work Experience
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 