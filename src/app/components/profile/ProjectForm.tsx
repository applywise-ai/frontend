'use client';

import { useState, useEffect } from 'react';
import { FieldName, Project } from '@/app/types/profile';
import { useProfile } from '@/app/contexts/ProfileContext';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Link as LinkIcon, FileText } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface ProjectFormProps {
  editingIndex?: number;
  errors?: Partial<Record<string, string>>;
  setErrors?: (errors: Partial<Record<string, string>>) => void;
}

export default function ProjectForm({ 
  editingIndex,
  errors,
  setErrors
}: ProjectFormProps) {
  const { profile, updateProfile } = useProfile();
  
  const [project, setProject] = useState<Project | null>(null);
  const projects = profile[FieldName.PROJECT] || [];

  const handleProjectChange = (field: keyof Project, value: string) => {
    if (!project) return;
    
    const updatedProject = {
      ...project,
      [field]: value
    } as Project;
    setProject(updatedProject);

    // Clear error when field is updated
    if (errors?.[field] && setErrors) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    let index = editingIndex;
    if (index === null || index === undefined) {
      index = projects.length - 1;
    }
    const updatedProjects = [...projects];
    updatedProjects[index] = updatedProject;
    // Update the index of the project
    updateProfile({ [FieldName.PROJECT]: updatedProjects });
  };

  useEffect(() => {
    if (Object.keys(profile).length === 0) return;

    let index = editingIndex;
    if (index === null || index === undefined) {
      index = projects.length - 1;
    }
    setProject(projects[index]);
  }, [profile, editingIndex, projects]);

  const getFieldError = (field: keyof Project) => errors?.[field];

  if (!project) return;

  return (
    <div className="space-y-6">
      {/* General error display */}
      {errors?.general && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg px-3 py-2">
          {errors.general}
        </div>
      )}
      
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
                      value={project[FieldName.PROJECT_NAME] ?? ""}
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
                      value={project[FieldName.PROJECT_DESCRIPTION] ?? ""}
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
                      value={project[FieldName.PROJECT_LINK] ?? ""}
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