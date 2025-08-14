'use client';

import React, { ReactNode } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { SaveIcon, PlusIcon } from 'lucide-react';
import { FieldName } from '@/app/types/profile';

interface EditSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  children: ReactNode;
  isSaving?: boolean;
  isAddSection?: boolean;
}

export default function EditSectionModal({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  isSaving = false,
  isAddSection
}: EditSectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] p-0 flex flex-col overflow-hidden" aria-describedby={undefined}>
        <div className="p-6 pb-4 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-xl">{title}</DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-6" style={{ maxHeight: 'calc(80vh - 180px)', minHeight: '300px' }}>
          {children}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 mt-auto">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-4"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave} 
            disabled={isSaving}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4"
          >
            {isAddSection ? (
              <PlusIcon className="mr-2 h-4 w-4" />
            ) : (
              <SaveIcon className="mr-2 h-4 w-4" />
            )}
            {isSaving ? (isAddSection ? 'Adding...' : 'Saving...') : isAddSection ? 'Add' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 