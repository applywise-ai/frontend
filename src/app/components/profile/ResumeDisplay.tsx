'use client';

import { UserProfile, FieldName } from '@/app/types/profile';
import { Button } from '@/app/components/ui/button';
import { FileText, Upload, Eye, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';

interface ResumeDisplayProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function ResumeDisplay({ profile, updateProfile }: ResumeDisplayProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const hasResume = Boolean(profile[FieldName.RESUME]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Simulate API call to parse resume
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock parsed profile data
      const parsedProfile = {
        [FieldName.FULL_NAME]: 'Kaiz Nanji',
        [FieldName.EMAIL]: 'k4nanji@uwaterloo.ca',
        [FieldName.PHONE_NUMBER]: '4168784499',
        [FieldName.CURRENT_LOCATION]: 'Toronto, ON',
        [FieldName.LINKEDIN]: 'https://www.linkedin.com/in/kaiz-nanji',
        [FieldName.GITHUB]: 'https://github.com/kaiznanji',
        [FieldName.EDUCATION]: [
          {
            [FieldName.SCHOOL]: 'University of Waterloo',
            [FieldName.DEGREE]: 'bachelor',
            [FieldName.FIELD_OF_STUDY]: 'Computer Science',
            [FieldName.EDUCATION_FROM]: '09/2020',
            [FieldName.EDUCATION_TO]: '04/2025',
          }
        ],
        [FieldName.EMPLOYMENT]: [
          {
            [FieldName.COMPANY]: 'Tech Company',
            [FieldName.POSITION]: 'Software Engineer Intern',
            [FieldName.EMPLOYMENT_FROM]: '05/2023',
            [FieldName.EMPLOYMENT_TO]: '08/2023',
            [FieldName.EMPLOYMENT_DESCRIPTION]: 'Worked on various projects using React and TypeScript'
          }
        ],
        [FieldName.SKILLS]: ['Python', 'Java', 'JavaScript', 'React', 'TypeScript']
      };

      // Update profile with new resume file
      updateProfile({
        [FieldName.RESUME_FILENAME]: file.name,
        [FieldName.RESUME]: URL.createObjectURL(file)
      });

      // If autofill is enabled, update the profile with parsed data
      if (profile[FieldName.RESUME_AUTOFILL]) {
        updateProfile(parsedProfile);
      }
    } catch (error) {
      setUploadError('Failed to upload resume. Please try again.');
      console.error('Error uploading resume:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = () => {
    if (profile[FieldName.RESUME]) {
      window.open(profile[FieldName.RESUME], '_blank');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-teal-50 to-blue-50">
      <div className="flex flex-col space-y-4">
        {uploadError && (
          <div className="flex items-center gap-2 mt-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600">{uploadError}</span>
          </div>
        )}
        <div className="flex items-center">
          <div className="bg-teal-100 p-3 rounded-full mr-4">
            <FileText className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {hasResume
                ? `Resume: ${profile[FieldName.RESUME_FILENAME]}`
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
              onChange={handleFileChange}
              className="sr-only"
            />
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto"
              disabled={isUploading}
            >
              <label htmlFor="resume-upload" className="cursor-pointer flex items-center justify-center">
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : hasResume ? 'Replace Resume' : 'Upload Resume'}
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
      <div className="mt-4 flex items-center space-x-2">
        <Checkbox
          id="resume-autofill"
          checked={profile[FieldName.RESUME_AUTOFILL] || false}
          onCheckedChange={(checked) => {
            updateProfile({ [FieldName.RESUME_AUTOFILL]: Boolean(checked) });
          }}
        />
        <Label
          htmlFor="resume-autofill"
          className="text-sm text-gray-600 cursor-pointer"
        >
          Use resume to autofill profile sections
        </Label>
      </div>
    </div>
  );
}