'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import ReviewApplicationModal from '@/app/components/ReviewApplicationModal';

interface ReviewApplicationModalState {
  open: boolean;
  applicationId?: string;
  jobId?: string;
  success?: boolean;
  onEdit?: () => void;
  onSubmit?: () => void;
}

interface ReviewApplicationModalContextType {
  openModal: (params: {
    applicationId?: string;
    jobId?: string;
    success?: boolean;
    onEdit?: () => void;
    onSubmit?: () => void;
  }) => void;
  closeModal: () => void;
  isOpen: boolean;
}

const ReviewApplicationModalContext = createContext<ReviewApplicationModalContextType | undefined>(undefined);

export function ReviewApplicationModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ReviewApplicationModalState>({
    open: false,
  });

  const openModal = (params: {
    applicationId?: string;
    jobId?: string;
    success?: boolean;
    onEdit?: () => void;
    onSubmit?: () => void;
  }) => {
    setModalState({
      open: true,
      ...params,
    });
  };

  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      open: false,
    }));
  };

  const handleModalClose = () => {
    closeModal();
  };

  const handleModalSubmit = () => {
    modalState.onSubmit?.();
  };

  return (
    <ReviewApplicationModalContext.Provider
      value={{
        openModal,
        closeModal,
        isOpen: modalState.open,
      }}
    >
      {children}
      <ReviewApplicationModal
        open={modalState.open}
        setOpen={(open) => {
          if (!open) {
            handleModalClose();
          }
        }}
        applicationId={modalState.applicationId}
        jobId={modalState.jobId}
        success={modalState.success}
        onEdit={modalState.onEdit}
        onSubmit={handleModalSubmit}
        onCancel={handleModalClose}
      />
    </ReviewApplicationModalContext.Provider>
  );
}

export function useReviewApplicationModal() {
  const context = useContext(ReviewApplicationModalContext);
  if (context === undefined) {
    throw new Error('useReviewApplicationModal must be used within a ReviewApplicationModalProvider');
  }
  return context;
} 