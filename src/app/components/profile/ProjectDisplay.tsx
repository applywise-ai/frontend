'use client';

import { UserProfile, FieldName, Project } from '@/app/types/profile';
import { Link as LinkIcon, PencilIcon, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';
import { validateProject } from '@/app/utils/validation';
import { useNotification } from '@/app/contexts/NotificationContext';

import ProjectForm from './ProjectForm';
import EditSectionModal from './EditSectionModal';

interface ProjectDisplayProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function ProjectDisplay({ profile, updateProfile }: ProjectDisplayProps) {
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const projects = profile[FieldName.PROJECTS] as Project[] || [];
  const { showSuccess } = useNotification();

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    updateProfile({ [FieldName.PROJECTS]: updatedProjects });
    showSuccess('Project deleted successfully!');
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get the new entry from profile
      const newEntry = profile[FieldName.TEMP_PROJECT] as Project;
          
      const e = validateProject(newEntry);
      if (Object.keys(e).length > 0) {
        setErrors(e);
        setIsSaving(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedProjects = [...(profile[FieldName.PROJECTS] || [])];
      if (editingIndex !== undefined) {
        // If editing, replace the specific project entry
        updatedProjects[editingIndex] = newEntry;
      }
    
      // Update the profile with the updated projects array
      updateProfile({ [FieldName.PROJECTS]: updatedProjects });
      showSuccess('Project updated successfully!');
      setEditingIndex(undefined);
      setErrors({});
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    updateProfile({ [FieldName.TEMP_PROJECT]: {} as Project });
    setEditingIndex(undefined);
    setErrors({});
  };

  // Helper function to split description into lines and filter out empty ones
  const formatDescription = (description: string) => {
    return description.split('\n').filter(line => line.trim() !== '');
  };

  return (
    <>
      <div className="space-y-6">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} className={`${index > 0 ? 'pt-6 border-t border-gray-100' : ''}`}>
              <div className="flex items-start justify-between group">
                <div className="flex items-start w-full">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-2 rounded-lg mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                    <LinkIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="w-full">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 tracking-tight">
                          {project[FieldName.PROJECT_NAME]}
                        </h4>
                      </div>
                    </div>
                    
                    {project[FieldName.PROJECT_DESCRIPTION] && (
                      <div className="space-y-1 w-full">
                        {formatDescription(project[FieldName.PROJECT_DESCRIPTION]).map((line, i) => (
                          <p key={i} className="text-sm text-gray-600 leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>
                    )}

                    {project[FieldName.PROJECT_LINK] && (
                      <a 
                        href={project[FieldName.PROJECT_LINK]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-teal-600 hover:text-teal-700 mt-3 inline-flex items-center"
                      >
                        <LinkIcon className="h-4 w-4 mr-1.5" />
                        View Project
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1 ml-3 flex-shrink-0 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-purple-600 hover:bg-purple-50 h-8 w-8 p-0"
                    onClick={() => handleEdit(index)}
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>No projects added yet.</span>
          </div>
        )}
      </div>

      <EditSectionModal
        isOpen={editingIndex !== undefined}
        onClose={handleClose}
        onSave={handleSave}
        isSaving={isSaving}
        title="Edit Project"
      >
        {editingIndex !== undefined && (
          <ProjectForm
            profile={profile}
            updateProfile={updateProfile}
            editingIndex={editingIndex}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </EditSectionModal>
    </>
  );
} 