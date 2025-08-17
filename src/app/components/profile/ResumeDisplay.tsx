'use client';

import { FieldName } from '@/app/types/profile';
import { Button } from '@/app/components/ui/button';
import { FileText, Upload, Eye, AlertCircle, Sparkles } from 'lucide-react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';
import { storageService } from '@/app/services/firebase';
import { useAuth } from '@/app/contexts/AuthContext';
import { useNotification } from '@/app/contexts/NotificationContext';
import { useProfile } from '@/app/contexts/ProfileContext';
import { readPdf } from "@/app/lib/parse-resume-from-pdf/read-pdf";
import { groupTextItemsIntoLines } from "@/app/lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "@/app/lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "@/app/lib/parse-resume-from-pdf/extract-resume-from-sections";
import { convertResumeToProfile } from "@/app/utils/resume-parser";

export default function ResumeDisplay() {
  const { profile, updateProfile } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const { showSuccess } = useNotification();
  const { user } = useAuth();
  const hasResume = Boolean(profile[FieldName.RESUME]);
  
  const handlePreview = async () => {
    if (!user || !profile[FieldName.RESUME]) return;
    
    setIsLoadingUrl(true);
    try {
      const resumeUrl = await storageService.getResumeUrl(user.uid);
      if (resumeUrl) {
        window.open(resumeUrl, '_blank');
      } else {
        throw new Error('Resume not found');
      }
    } catch (error) {
      console.error('Error getting resume URL:', error);
      setUploadError('Failed to load resume. Please try again.');
    } finally {
      setIsLoadingUrl(false);
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file
      if (file.type !== 'application/pdf') {
        throw new Error('Please upload a PDF file only.');
      }

      const localUrl = URL.createObjectURL(file);
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Delete old resume if it exists
      if (profile[FieldName.RESUME]) {
        await storageService.deleteResume(profile[FieldName.RESUME]);
      }

      // Upload file to Firebase Storage
      const uploadResult = await storageService.uploadResume(user.uid, file);

      // Update profile with new resume file
      updateProfile({
        [FieldName.RESUME_FILENAME]: uploadResult.filename,
        [FieldName.RESUME]: uploadResult.path // Store the storage path for future reference
      });

      // Show success notification
      showSuccess(`Resume uploaded successfully!`);
      
      // If autofill is enabled, update the profile with parsed data
      if (profile[FieldName.RESUME_AUTOFILL]) {
        // Resume parsing service
        const textItems = await readPdf(localUrl);
        const lines = groupTextItemsIntoLines(textItems || []);
        const sections = groupLinesIntoSections(lines);
        const resume = extractResumeFromSections(sections);

        const parsedProfile = convertResumeToProfile(resume);
        updateProfile(parsedProfile);
        // Show additional notification for autofill
        showSuccess('Profile sections have been automatically populated from your resume!');
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload resume. Please try again.');
      console.error('Error uploading resume:', error);
    } finally {
      setIsUploading(false);
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
              accept=".pdf"
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
              disabled={isLoadingUrl}
              className="h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isLoadingUrl ? 'Loading...' : 'Preview'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}