'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import ReviewApplicationModal from '@/app/components/ReviewApplicationModal';
import { useAuth } from '@/app/contexts/AuthContext';
import { useApplications } from '@/app/contexts/ApplicationsContext';

type JobApplicationStatus = 'applying' | 'ready' | 'submitted' | 'cover_letter' | 'cover_letter_generated' | 'failed' | 'not_found';

interface JobApplicationUpdate {
  type: 'job_application_update';
  application_id: string;
  status: string;
  timestamp: number;
  able_to_submit?: boolean;
  details: {
    message: string;
    screenshot_url?: string;
  };
}

interface WebSocketMessage {
  message: JobApplicationUpdate;
}

interface ReviewApplicationModalState {
  open: boolean;
  applicationId?: string;
  jobId?: string;
  coverLetterUrl?: string;
  status: JobApplicationStatus;
  onEdit?: () => void;
  onSubmit?: () => void;
}

interface ReviewApplicationModalContextType {
  openModal: (params: {
    applicationId?: string;
    jobId?: string;
    coverLetterUrl?: string;
    status?: JobApplicationStatus;
    onEdit?: () => void;
    onSubmit?: () => void;
  }) => void;
  closeModal: () => void;
  isOpen: boolean;
  updateStatus: (status: JobApplicationStatus) => void;
  currentStatus: JobApplicationStatus;
  applicationUpdate: JobApplicationUpdate | null;
  timerSeconds: number;
  coverLetterUrl?: string;
}

const ReviewApplicationModalContext = createContext<ReviewApplicationModalContextType | undefined>(undefined);

export function ReviewApplicationModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ReviewApplicationModalState>({
    open: false,
    status: 'applying',
  });
  const [applicationUpdate, setApplicationUpdate] = useState<JobApplicationUpdate | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();
  const { updateApplicationStatus } = useApplications();

  const openModal = (params: {
    applicationId?: string;
    jobId?: string;
    coverLetterUrl?: string;
    status?: JobApplicationStatus;
    onEdit?: () => void;
    onSubmit?: () => void;
  }) => {
    if (params.status === 'applying' && user) {
      startWebSocketConnection();
      startProgressTimer();
    }
    setModalState({
      open: true,
      applicationId: params.applicationId,
      jobId: params.jobId,
      coverLetterUrl: params.coverLetterUrl,
      status: params.status || modalState.status,
      onEdit: params.onEdit,
      onSubmit: params.onSubmit,
    });
  };

  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      open: false,
    }));
  };

  const updateStatus = (status: JobApplicationStatus) => {
    setModalState(prev => ({
      ...prev,
      status,
    }));
    
    // Start WebSocket connection when status changes to 'applying'
    if (status === 'applying' && user) {
      startWebSocketConnection();
      startProgressTimer();
    } else {
      // Clean up WebSocket and timer for other statuses
      cleanupWebSocket();
      cleanupTimer();
    }
  };

  const startWebSocketConnection = () => {
    if (!user) return;
    
    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    const ws = new WebSocket(`ws://localhost:8000/ws/${user.uid}`);
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log('WebSocket connected for job application updates');
    };
    
    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        if (data.message.type === 'job_application_update') {
          setApplicationUpdate(data.message);
          
          // Update progress based on status
          if (data.message.status === 'Draft') {
            // Check if able to submit to determine next status
            updateStatus('ready');
          } else if (data.message.status === 'Failed') {
            updateStatus('failed');
            // Update application status in ApplicationsContext
            if (modalState.applicationId) {
              updateApplicationStatus(modalState.applicationId, 'Failed');
            }
          } else if (data.message.status === 'Not Found') {
            updateStatus('not_found');
            // Update application status in ApplicationsContext
            if (modalState.applicationId) {
              updateApplicationStatus(modalState.applicationId, 'Not Found');
            }
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
  };

  const cleanupWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const startProgressTimer = () => {
    // Clear existing timer
    cleanupTimer();
    
    // Reset timer
    setTimerSeconds(0);
    
    // Start 30-second timer that increments every 1300ms for smoother animation
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev >= 30) {
          clearInterval(interval);
          return 30;
        }
        return prev + 0.3; // Increment by 0.3 seconds for smoother progress
      });
    }, 300);
    
    setTimerInterval(interval);
  };

  const cleanupTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const handleModalClose = () => {
    closeModal();
    cleanupWebSocket();
    cleanupTimer();
  };

  const handleModalSubmit = () => {
    modalState.onSubmit?.();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupWebSocket();
      cleanupTimer();
    };
  }, []);

  return (
    <ReviewApplicationModalContext.Provider
      value={{
        openModal,
        closeModal,
        isOpen: modalState.open,
        updateStatus,
        currentStatus: modalState.status,
        applicationUpdate,
        timerSeconds,
        coverLetterUrl: modalState.coverLetterUrl,
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
        setApplicationId={(applicationId) => {
          setModalState(prev => ({
            ...prev,
            applicationId,
          }));
        }}
        applicationId={modalState.applicationId}
        jobId={modalState.jobId}
        coverLetterUrl={modalState.coverLetterUrl}
        status={modalState.status}
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