import { Button } from '@/app/components/ui/button';
import { Check, Trash2, Save } from 'lucide-react';

interface ActionButtonsProps {
  onCancel: () => void;
  onSaveSubmit: () => void;
  isLoading: boolean;
  isSaved: boolean;
  formChanged: boolean;
}

export function ActionButtons({
  onCancel,
  onSaveSubmit,
  isLoading,
  isSaved,
  formChanged
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="rounded-md px-3 sm:px-3.5 py-2 sm:py-0 border-red-300 hover:bg-red-50 hover:text-red-800 text-red-700 flex items-center text-xs sm:text-sm"
        >
          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          Delete
        </Button>
        
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