'use client';

import { UserProfile, FieldName } from '@/app/types/profile';
import { Button } from '@/app/components/ui/button';
import { FileText, Upload, Eye, AlertCircle, Sparkles } from 'lucide-react';
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
      <div className="flex flex-col space-y-6">
        {uploadError && (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-600">{uploadError}</span>
          </div>
        )}
        
        {/* Resume Status Section */}
        <div className="flex items-center">
          <div className="bg-teal-100 p-3 rounded-full mr-4 flex-shrink-0">
            <FileText className="h-8 w-8 text-teal-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {hasResume
                ? `Resume: ${profile[FieldName.RESUME_FILENAME]}`
                : "Upload your resume to apply for jobs more efficiently"}
            </p>
          </div>
        </div>
        
        {/* Autofill Feature Card */}
        <div className="bg-white/70 backdrop-blur-sm border border-teal-200/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <Checkbox
                id="resume-autofill"
                checked={profile[FieldName.RESUME_AUTOFILL] || false}
                onCheckedChange={(checked) => {
                  updateProfile({ [FieldName.RESUME_AUTOFILL]: Boolean(checked) });
                }}
                className="h-5 w-5 border-2 border-teal-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 data-[state=checked]:text-white"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-teal-600 flex-shrink-0" />
                <Label
                  htmlFor="resume-autofill"
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Profile Autofill
                </Label>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Automatically extract and populate your profile sections (education, experience, skills) from your resume
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
              className="w-full py-[21px] border-teal-300 text-teal-700 hover:bg-teal-50 hover:border-teal-400 font-medium"
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
              className="h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6"
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