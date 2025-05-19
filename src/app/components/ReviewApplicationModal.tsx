import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { XCircle, Pencil, Send, Info } from 'lucide-react';
import React from 'react';

interface ReviewApplicationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onEdit?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  className?: string;
}

export default function ReviewApplicationModal({
  open,
  setOpen,
  onEdit,
  onSubmit,
  onCancel,
  className = '',
}: ReviewApplicationModalProps) {
  const handleClose = () => {
    setOpen(false);
    onCancel?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={`max-w-2xl w-full h-[80vh] overflow-y-auto flex flex-col bg-white ${className}`}>
        <DialogHeader>
          <DialogTitle>Review Your Application</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col items-center justify-center py-4 w-full overflow-auto">
          {/* Wide, scrollable image */}
          <div className="w-full overflow-auto">
            <img
              src="/images/sample_job_app_ss.png"
              alt="Filled Job Application Preview"
              className="w-full object-contain rounded-lg border shadow mb-6"
              style={{ background: '#f9fafb', display: 'block' }}
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          </div>
        </div>
        <DialogFooter className="sticky bottom-0 bg-white pt-1 pb-1 border-t flex flex-row gap-3 justify-end">
          <div className="w-full flex flex-col">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-md px-3 py-2 flex items-start gap-2 mt-2 mb-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="text-left">By clicking submit, you agree for Applywise to submit this application on your behalf.</span>
            </div>
            <div className="flex flex-row gap-3 justify-end mt-2 mb-0">
              <div className="flex-1 flex justify-start">
                <button
                  className="px-4 py-2 rounded-md border border-red-500 bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors flex items-center"
                  onClick={handleClose}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Cancel
                </button>
              </div>
              <button
                className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-colors flex items-center"
                onClick={() => { setOpen(false); onEdit?.(); }}
              >
                <Pencil className="h-5 w-5 mr-2" />
                Edit
              </button>
              <button
                className="px-4 py-2 rounded-md border border-teal-600 bg-teal-600 text-white hover:bg-teal-700 font-medium transition-colors flex items-center"
                onClick={() => { setOpen(false); onSubmit?.(); }}
              >
                <Send className="h-5 w-5 mr-2" />
                Submit
              </button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 