import { ExternalLink, FileText } from 'lucide-react';
import { ActionButtons } from './ActionButtons';

interface ApplicationPreviewHeaderProps {
    activeTab: "application" | "resume" | "coverLetter";
    onCancel: () => void;
    onSaveSubmit: () => void;
    isLoading: boolean;
    isDeleting?: boolean;
    isSaved: boolean;
    formChanged: boolean;
}

export function ApplicationPreviewHeader({
    activeTab,
    onCancel,
    onSaveSubmit,
    isLoading,
    isDeleting = false,
    isSaved,
    formChanged
}: ApplicationPreviewHeaderProps) {
    // Get the appropriate external link based on active tab
  const getExternalLink = () => {
    switch (activeTab) {
      case 'application':
        return '#'; // Placeholder for application link
      case 'resume':
        return '/images/sample_resume.pdf';
      case 'coverLetter':
        return '/images/sample_cover_letter.pdf';
      default:
        return '#';
    }
  };

  // Get the appropriate color based on active tab
  const getButtonColor = () => {
    return activeTab === 'coverLetter' ? 'text-indigo-600 hover:bg-indigo-50' : 'text-blue-600 hover:bg-blue-50';
  };
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3.5 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
                <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold">Preview</h2>
        </div>
        <div className="flex items-center space-x-2">
        <a 
            href={getExternalLink()} 
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-white rounded-md px-3 py-2.5 shadow-sm transition-colors border border-gray-200 ${getButtonColor()}`}
            title={`Open ${activeTab.toLowerCase()} in new tab`}
        >
            <ExternalLink className={`h-4 w-4 ${activeTab === 'coverLetter' ? 'text-indigo-600' : 'text-blue-600'}`} />
            <span className="sr-only">Open in new tab</span>
        </a>
        <ActionButtons
            onCancel={onCancel}
            onSaveSubmit={onSaveSubmit}
            isLoading={isLoading}
            isDeleting={isDeleting}
            isSaved={isSaved}
            formChanged={formChanged}
        />
        </div>
    </div>
  );
}
