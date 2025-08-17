import { ExternalLink, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ActionButtons } from './ActionButtons';
import { FormQuestion } from '@/app/types/application';
import { getFileUrlBySection } from '@/app/utils/application';
import { FormSectionType } from '../../types/application';
import storageService from '@/app/services/firebase/storage';

interface ApplicationPreviewHeaderProps {
    activeTab: FormSectionType | 'application';
    onSaveSubmit: () => void;
    isLoading: boolean;
    isDeleting?: boolean;
    isSaved: boolean;
    formChanged: boolean;
    answers?: Record<string, FormQuestion>;
    applicationId?: string;
    jobTitle?: string;
    companyName?: string;
    screenshot?: string;
}

export function ApplicationPreviewHeader({
    activeTab,
    onSaveSubmit,
    isLoading,
    isSaved,
    formChanged,
    answers = {},
    applicationId,
    jobTitle,
    companyName,
    screenshot
}: ApplicationPreviewHeaderProps) {
    const [externalLink, setExternalLink] = useState<string>('#');



    // Load external link dynamically based on active tab
    useEffect(() => {
        const loadExternalLink = async () => {

            const currentTime = new Date().getTime();
            
            try {
                switch (activeTab) {
                    case 'application':
                        if (screenshot) {
                            const screenshotUrl = await storageService.generateUrlFromPath(screenshot);
                            setExternalLink(screenshotUrl || '#');
                        } else {
                            setExternalLink('#');
                        }
                        break;
                    case 'resume':
                        const resumeUrl = await getFileUrlBySection(answers, 'resume');
                        setExternalLink(resumeUrl ? `${resumeUrl}&t=${currentTime}` : '#');
                        break;
                    case 'cover_letter':
                        const coverLetterUrl = await getFileUrlBySection(answers, 'cover_letter');
                        setExternalLink(coverLetterUrl ? `${coverLetterUrl}?t=${currentTime}` : '#');
                        break;
                    default:
                        setExternalLink('#');
                        break;
                }
            } catch (error) {
                console.error('Error loading external link:', error);
                setExternalLink('#');
            }
        };

        loadExternalLink();
    }, [activeTab, answers, screenshot]);

    // Get the appropriate color based on active tab
    const getButtonColor = () => {
        return activeTab === 'cover_letter' ? 'text-indigo-600 hover:bg-indigo-50' : 'text-blue-600 hover:bg-blue-50';
    };

    const hasValidLink = externalLink !== '#';

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3.5 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
                <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold">Preview</h2>
        </div>
        <div className="flex items-center space-x-2">
        {hasValidLink ? (
          <a 
              href={externalLink} 
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-white rounded-md px-3 py-2.5 shadow-sm transition-colors border border-gray-200 ${getButtonColor()}`}
              title={`Open ${activeTab.toLowerCase()} in new tab`}
          >
              <ExternalLink className={`h-4 w-4 ${activeTab === 'cover_letter' ? 'text-indigo-600' : 'text-blue-600'}`} />
              <span className="sr-only">Open in new tab</span>
          </a>
        ) : (
          <button 
              disabled
              className="bg-gray-100 rounded-md px-3 py-2.5 shadow-sm border border-gray-200 cursor-not-allowed"
              title={`No ${activeTab.toLowerCase()} file available`}
          >
              <ExternalLink className="h-4 w-4 text-gray-400" />
              <span className="sr-only">No file available</span>
          </button>
        )}
        <ActionButtons
          onSaveSubmit={onSaveSubmit}
          isLoading={isLoading}
          isSaved={isSaved}
          formChanged={formChanged}
          applicationId={applicationId}
          jobTitle={jobTitle}
          companyName={companyName}
        />
        </div>
    </div>
  );
}
