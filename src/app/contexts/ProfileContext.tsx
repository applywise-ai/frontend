'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile } from '@/app/types/profile';
import { profileService } from '@/app/services/firebase';
import { useAuth } from '@/app/contexts/AuthContext';
import { emptyEducation, emptyEmployment, emptyProject } from '@/app/utils/profile';
import { FieldName } from '@/app/types/profile';

interface ProfileContextType {
  profile: UserProfile;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>, save?: boolean) => Promise<void>;
  refreshProfile: () => void;
  saveProfile: (updatedProfile?: UserProfile) => Promise<void>;
  addInstance: (id: string) => void;
  deleteUser: () => Promise<void>;
  updateJobFeedback: (jobId: string, liked: boolean) => Promise<void>;
  getJobFeedback: (jobId: string) => boolean | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [originalProfile, setOriginalProfile] = useState<UserProfile>({} as UserProfile);
  const [profile, setProfile] = useState<UserProfile>({} as UserProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Reset profile when user changes
  useEffect(() => {
    if (!isAuthenticated) {
      setProfile({} as UserProfile);
      setIsLoading(false);
      setError(null);
      }
  }, [isAuthenticated]);

  // Load profile when user is available
  const loadProfile = useCallback(async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('ProfileProvider: Loading profile for user:', user.uid);
      let userProfile = await profileService.getProfile(user.uid);
      
      // If no profile exists, create one with basic info
      if (!userProfile) {
        await profileService.initializeProfile(user);
        userProfile = await profileService.getProfile(user.uid);
      }

      if (userProfile) {
        // Remove Firestore-specific fields and create clean profile
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, ...cleanProfile } = userProfile;

        setProfile(cleanProfile as UserProfile);
        setOriginalProfile(cleanProfile as UserProfile)
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  const addInstance = useCallback((id: string) => {
    if (!user || !profile) {
      throw new Error('User not authenticated or profile not loaded');
    }

    const idToEmptyInstance = {
      [FieldName.EMPLOYMENT]: emptyEmployment,
      [FieldName.EDUCATION]: emptyEducation,
      [FieldName.PROJECT]: emptyProject
    };

    try {
      const emptyInstance = idToEmptyInstance[id];
      if (!emptyInstance) {
        throw Error('Unable to add instance, incorrect instance id provided!')
      }
      console.log(profile, id)
      updateProfile({ [id]: [...profile[id], emptyInstance] })
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      throw err;
    }
  }, [profile, user]);

  // Update profile locally and in Firestore
  const updateProfile = useCallback(async (updates: Partial<UserProfile>, save?: boolean) => {
    if (!user || !profile) {
      throw new Error('User not authenticated or profile not loaded');
    }

    try {
      // Update local state immediately for better UX
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      if (save) {
        saveProfile(updatedProfile);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      // Revert local changes on error
      setProfile(originalProfile)
      throw err;
    }
  }, [user, profile, originalProfile]);

  // Refresh profile from Firestore
  const refreshProfile = useCallback(() => {
    setProfile(originalProfile)
  }, [originalProfile]);

  // Save current profile state to Firestore
  const saveProfile = useCallback(async (updatedProfile?: UserProfile) => {
    if (!user || !profile) {
      throw new Error('User not authenticated or profile not loaded');
    }

    try {
      if (updatedProfile) {
        await profileService.updateProfile(user.uid, updatedProfile);
      } else {
        await profileService.updateProfile(user.uid, profile);
      }
      setOriginalProfile(updatedProfile ? updatedProfile : profile);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
      throw err;
    }
  }, [user, profile]);

  // Delete user from Firestore
  const deleteUser = useCallback(async () => {
    if (!user || !profile) {
      throw new Error('User not authenticated or profile not loaded');
    }

    try {
      await profileService.deleteUser(user.uid);
      setProfile({} as UserProfile);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
      throw err;
    }
  }, [user, profile]);

  // Update job feedback
  const updateJobFeedback = useCallback(async (jobId: string, liked: boolean) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      await profileService.updateJobFeedback(user.uid, jobId, liked);
      // Refresh profile to get updated feedback arrays
      await loadProfile();
    } catch (err) {
      console.error('Error updating job feedback:', err);
      setError('Failed to update job feedback');
      throw err;
    }
  }, [user, loadProfile]);

  // Get job feedback for a specific job
  const getJobFeedback = useCallback((jobId: string): boolean | null => {
    if (!profile) {
      return null;
    }

    const likedJobs = profile.likedJobs || [];
    const dislikedJobs = profile.dislikedJobs || [];

    if (likedJobs.includes(jobId)) {
      return true;
    }
    if (dislikedJobs.includes(jobId)) {
      return false;
    }
    return null;
  }, [profile]);

  const value: ProfileContextType = {
    profile,
    isLoading,
    error,
    addInstance,
    updateProfile,
    refreshProfile,
    saveProfile,
    deleteUser,
    updateJobFeedback,
    getJobFeedback,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
} 