'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { useNotification } from '@/app/contexts/NotificationContext';
import { useApplications } from '@/app/contexts/ApplicationsContext';
import { navigateOptimized } from '../../utils/navigation';
import { useRouter } from 'next/navigation';


interface DeleteApplicationDialogProps {
  applicationId: string;
  jobTitle?: string;
  companyName?: string;
  onDelete?: () => void;
  variant?: 'button' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  redirectTo?: string;
  buttonText?: string;
  className?: string;
}

export default function DeleteApplicationDialog({
  applicationId,
  jobTitle,
  companyName,
  onDelete,
  variant = 'button',
  size = 'md',
  redirectTo = '/applications',
  buttonText = 'Delete Application',
  className = '',
}: DeleteApplicationDialogProps) {
    const router = useRouter();
    const { showSuccess } = useNotification();
    const { deleteApplication } = useApplications();
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!applicationId) return;
        
        setIsDeleting(true);
        
        try {
        await deleteApplication(applicationId);
        showSuccess('Application deleted successfully');
        onDelete?.();
        navigateOptimized(router, redirectTo);
        setOpen(false);
        } catch (error) {
        console.error('Error deleting application:', error);
        } finally {
        setIsDeleting(false);
        }
    };

    const getSizeClasses = () => {
        switch (size) {
        case 'sm':
            return 'px-3 text-sm';
        case 'lg':
            return 'px-6 py-3 text-base';
        default:
            return 'px-4 py-2.5 text-sm';
        }
    };

    const getIconSize = () => {
        switch (size) {
        case 'sm':
            return 'h-4 w-4 mr-1';
        case 'lg':
            return 'h-5 w-5 mr-2';
        default:
            return 'h-4 w-4 mr-2';
        }
    };

    const TriggerButton = () => {
        if (variant === 'icon') {
        return (
            <button
            onClick={() => setOpen(true)}
            className={`inline-flex items-center justify-center rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 hover:text-red-800 font-medium transition-all duration-200 shadow-sm ${getSizeClasses()}`}
            title="Delete Application"
            >
            <Trash2 className={getIconSize()} />
            </button>
        );
        }

        return (
        <button
            onClick={() => setOpen(true)}
            className={`inline-flex items-center justify-center rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 hover:text-red-800 font-medium transition-all duration-200 shadow-sm ${getSizeClasses()} ${className}`}
        >
            <Trash2 className={`${getIconSize()}`} />
            {buttonText}
        </button>
        );
    };

    return (
        <>
        <TriggerButton />
        
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md w-full bg-white">
            <DialogHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                Delete Application
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                {jobTitle && companyName ? (
                    <>
                    Are you sure you want to delete your application for{' '}
                    <span className="font-medium text-gray-900">{jobTitle}</span> at{' '}
                    <span className="font-medium text-gray-900">{companyName}</span>?
                    </>
                ) : (
                    'Are you sure you want to delete this application?'
                )}
                <br />
                <span className="text-sm text-red-600 mt-2 block">
                    This action cannot be undone.
                </span>
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                onClick={() => setOpen(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 text-sm"
                >
                Cancel
                </button>
                <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-red-600 bg-red-600 text-white hover:bg-red-700 font-medium transition-all duration-200 text-sm flex items-center justify-center"
                >
                {isDeleting ? (
                    <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Deleting...
                    </>
                ) : (
                    <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Application
                    </>
                )}
                </button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
} 