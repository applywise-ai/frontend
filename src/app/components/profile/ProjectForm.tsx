'use client';

import { useState, useEffect } from 'react';
import { UserProfile, FieldName, Project } from '@/app/types/profile';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Link as LinkIcon, FileText } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface ProjectFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  editingIndex?: number;
  errors?: Partial<Record<string, string>>;
  setErrors?: (errors: Partial<Record<string, string>>) => void;
}

export default function ProjectForm({ 
  editingIndex,
  profile,
  updateProfile,
  errors,
  setErrors
}: ProjectFormProps) {
  const emptyProject: Project = {
    [FieldName.PROJECT_NAME]: '',
    [FieldName.PROJECT_DESCRIPTION]: '',
    [FieldName.PROJECT_LINK]: ''
  };
  
  const [project, setProject] = useState<Project>(
    editingIndex !== undefined && profile[FieldName.PROJECTS] ? profile[FieldName.PROJECTS][editingIndex] : emptyProject
  );

  useEffect(() => {
    updateProfile({[FieldName.TEMP_PROJECT]: project});
  }, []);

  const handleProjectChange = (field: keyof Project, value: string) => {
    const updatedProject = {
      ...project,
      [field]: value
    };
    setProject(updatedProject);

    // Clear error when field is updated
    if (errors?.[field] && setErrors) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    // Update temporary project in profile
    const tempProject = {
      [FieldName.TEMP_PROJECT]: {
        [FieldName.PROJECT_NAME]: updatedProject[FieldName.PROJECT_NAME],
        [FieldName.PROJECT_DESCRIPTION]: updatedProject[FieldName.PROJECT_DESCRIPTION],
        [FieldName.PROJECT_LINK]: updatedProject[FieldName.PROJECT_LINK]
      }
    };
    updateProfile(tempProject);
  };

  const getFieldError = (field: keyof Project) => errors?.[field];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <LinkIcon className="h-4 w-4 text-teal-500 mr-2" />
          {editingIndex !== undefined ? 'Edit your project' : 'Add your project to showcase your work.'}
        </p>
      </div>
      
      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-full">
              <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                {/* Project Name */}
                <div className="sm:col-span-6">
                  <Label htmlFor={FieldName.PROJECT_NAME} className="text-sm font-medium text-gray-700 flex items-center">
                    <LinkIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                    Project Name
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id={FieldName.PROJECT_NAME}
                      value={project[FieldName.PROJECT_NAME]}
                      onChange={(e) => handleProjectChange(FieldName.PROJECT_NAME, e.target.value)}
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.PROJECT_NAME) ? 'border-red-500' : ''}`}
                      placeholder="Enter project name"
                    />
                    {getFieldError(FieldName.PROJECT_NAME) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.PROJECT_NAME)}</p>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div className="sm:col-span-6">
                  <Label htmlFor={FieldName.PROJECT_DESCRIPTION} className="text-sm font-medium text-gray-700 flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-1.5" />
                    Description
                  </Label>
                  <div className="mt-1">
                    <Textarea
                      id={FieldName.PROJECT_DESCRIPTION}
                      value={project[FieldName.PROJECT_DESCRIPTION]}
                      onChange={(e) => handleProjectChange(FieldName.PROJECT_DESCRIPTION, e.target.value)}
                      className={`shadow-sm focus:ring-teal-500 focus:border-teal-500 ${getFieldError(FieldName.PROJECT_DESCRIPTION) ? 'border-red-500' : ''}`}
                      placeholder="Describe your project"
                      rows={4}
                    />
                    {getFieldError(FieldName.PROJECT_DESCRIPTION) && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError(FieldName.PROJECT_DESCRIPTION)}</p>
                    )}
                  </div>
                </div>
                
                {/* Project Link */}
                <div className="sm:col-span-6">
                  <Label htmlFor={FieldName.PROJECT_LINK} className="text-sm font-medium text-gray-700 flex items-center">
                    <LinkIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                    Project Link (Optional)
                  </Label>
                  <div className="mt-1">
                    <Input
                      type="url"
                      id={FieldName.PROJECT_LINK}
                      value={project[FieldName.PROJECT_LINK]}
                      onChange={(e) => handleProjectChange(FieldName.PROJECT_LINK, e.target.value)}
                      className="shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="https://github.com/username/project"
                    />
                    <p className="mt-1 text-xs text-gray-500">Add a link to your project repository or live demo</p>
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