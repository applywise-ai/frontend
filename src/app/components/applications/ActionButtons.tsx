import { Button } from '@/app/components/ui/button';
import { Check, Save } from 'lucide-react';
import DeleteApplicationDialog from '@/app/components/applications/DeleteApplicationDialog';

interface ActionButtonsProps {
  onSaveSubmit: () => void;
  isLoading: boolean;
  isDeleting?: boolean;
  isSaved: boolean;
  formChanged: boolean;
  applicationId?: string;
  jobTitle?: string;
  companyName?: string;
}

export function ActionButtons({
  onSaveSubmit,
  isLoading,
  isSaved,
  formChanged,
  applicationId,
  jobTitle,
  companyName
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
        {applicationId && (
          <DeleteApplicationDialog
            applicationId={applicationId}
            jobTitle={jobTitle}
            companyName={companyName}
            buttonText="Delete"
            size="md"
          />
        )}
        
        <Button 
          onClick={onSaveSubmit}
          disabled={isLoading}
          className="rounded-md px-3 sm:px-3.5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center text-xs sm:text-sm"
        >
          {isLoading ? (
            <>{isSaved && !formChanged ? "Submitting..." : "Saving..."}</>
          ) : !formChanged ? (
            <>
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Submit
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
  );
} 