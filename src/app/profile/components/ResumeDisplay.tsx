'use client';

import { UserProfile, FieldName } from '@/app/types';
import { FileText, Eye, Upload } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';

interface ResumeDisplayProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function ResumeDisplay({ profile, updateProfile }: ResumeDisplayProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      
      // Create a preview URL for the file
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // In a real app, you would upload this file to a server and get a URL back
      updateProfile({ 
        [FieldName.RESUME]: fileUrl,
        [FieldName.RESUME_FILENAME]: file.name
      });
    }
  };

  const handlePreview = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    } else if (typeof profile[FieldName.RESUME] === 'string') {
      // Try to open the existing resume URL
      window.open(profile[FieldName.RESUME] as string, '_blank');
    }
  };

  const hasResume = Boolean(profile[FieldName.RESUME] || resumeFile);
  
  // Get the filename from the profile or the uploaded file
  const getFileName = () => {
    if (resumeFile) return resumeFile.name;
    if (profile[FieldName.RESUME_FILENAME]) return profile[FieldName.RESUME_FILENAME] as string;
    if (typeof profile[FieldName.RESUME] === 'string') {
      const path = profile[FieldName.RESUME] as string;
      return path.split('/').pop() || 'resume.pdf';
    }
    return '';
  };

  const filename = getFileName();

  return (
    <div className="p-6 bg-gradient-to-r from-teal-50 to-blue-50">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          <div className="bg-teal-100 p-3 rounded-full mr-4">
            <FileText className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {hasResume 
                ? `Resume: ${filename}` 
                : "Upload your resume to apply for jobs more efficiently"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1">
            <input
              type="file"
              id="resume-upload"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="sr-only"
            />
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto"
            >
              <label htmlFor="resume-upload" className="cursor-pointer flex items-center justify-center">
                <Upload className="h-4 w-4 mr-2" />
                {hasResume ? 'Replace Resume' : 'Upload Resume'}
              </label>
            </Button>
          </div>
          
          {hasResume && (
            <Button 
              onClick={handlePreview}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}