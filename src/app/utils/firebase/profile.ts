import { doc, getDoc, setDoc, updateDoc, serverTimestamp, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { UserProfile } from '@/app/types/profile';
import { User } from 'firebase/auth';

export interface FirestoreUserProfile extends UserProfile {
  createdAt?: unknown;
  updatedAt?: unknown;
  aiCredits?: number;
}

class ProfileService {
  private getProfileRef(userId: string) {
    return doc(db, 'users', userId);
  }

  /**
   * Get user profile from Firestore
   */
  async getProfile(userId: string): Promise<FirestoreUserProfile | null> {
    try {
      const profileRef = this.getProfileRef(userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        return profileSnap.data() as FirestoreUserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile');
    }
  }

  /**
   * Create a new user profile in Firestore
   */
  async createProfile(user: User, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const profileRef = this.getProfileRef(user.uid);
      
      const newProfile: FirestoreUserProfile = {
        fullName: user.displayName || '',
        email: user.email || '',
        phoneNumber: '',
        skills: [],
        // Default notification preferences
        newJobMatches: false,
        autoApplyWithoutReview: false,
        ignorePartialProfileAlert: false,
        // Default subscription status
        isProMember: false,
        aiCredits: 5,
        // Default source
        source: 'Applywise',
        // Initialize job feedback arrays
        likedJobs: [],
        dislikedJobs: [],
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(profileRef, newProfile);
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error('Failed to create profile');
    }
  }

  /**
   * Update user profile in Firestore
   */
  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const profileRef = this.getProfileRef(userId);
      
      // Filter out undefined values and Firestore-specific fields
      const cleanData = this.cleanProfileData(profileData);

      const updateData = {
        ...cleanData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(profileRef, updateData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Clean profile data by removing undefined values and restricted fields
   */
  private cleanProfileData(data: Partial<UserProfile>): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Skip Firestore-specific fields
      if (key === 'createdAt' || key === 'updatedAt') {
        continue;
      }
      
      // Skip restricted fields that users cannot update
      if (key === 'isProMember' || key === 'aiCredits') {
        continue;
      }
      
      // Skip undefined values
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
    
    return cleaned;
  }

  /**
   * Initialize profile for a new user with basic info from Firebase Auth
   */
  async initializeProfile(user: User): Promise<void> {
    try {
      // Check if profile already exists
      const existingProfile = await this.getProfile(user.uid);
      
      if (!existingProfile) {
        await this.createProfile(user, {
          fullName: user.displayName || '',
          email: user.email || '',
        });
      }
    } catch (error) {
      console.error('Error initializing profile:', error);
      throw new Error('Failed to initialize profile');
    }
  }

  /**
   * Update specific profile section
   */
  async updateProfileSection(userId: string, section: Partial<UserProfile>): Promise<void> {
    return this.updateProfile(userId, section);
  }

  /**
   * Check if user profile exists
   */
  async profileExists(userId: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId);
      return profile !== null;
    } catch (error) {
      console.error('Error checking profile existence:', error);
      return false;
    }
  }

  /**
   * Update job feedback (liked/disliked jobs)
   */
  async updateJobFeedback(userId: string, jobId: string, liked: boolean): Promise<void> {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Initialize arrays if they don't exist
      const likedJobs = profile.likedJobs || [];
      const dislikedJobs = profile.dislikedJobs || [];

      // Remove job from both arrays first (in case user is changing their mind)
      const updatedLikedJobs = likedJobs.filter(id => id !== jobId);
      const updatedDislikedJobs = dislikedJobs.filter(id => id !== jobId);

      // Add to appropriate array
      if (liked) {
        updatedLikedJobs.push(jobId);
      } else {
        updatedDislikedJobs.push(jobId);
      }

      // Update profile
      await this.updateProfile(userId, {
        likedJobs: updatedLikedJobs,
        dislikedJobs: updatedDislikedJobs,
      });
    } catch (error) {
      console.error('Error updating job feedback:', error);
      throw new Error('Failed to update job feedback');
    }
  }

  /**
   * Get job feedback for a specific job
   */
  async getJobFeedback(userId: string, jobId: string): Promise<boolean | null> {
    try {
      const profile = await this.getProfile(userId);
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
    } catch (error) {
      console.error('Error getting job feedback:', error);
      return null;
    }
  }

  /**
   * Delete user profile and all their applications subcollection
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      // Delete all applications subcollection first
      const applicationsRef = collection(db, 'users', userId, 'applications');
      const applicationsSnap = await getDocs(applicationsRef);
      const batch = writeBatch(db);

      applicationsSnap.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Then delete the user profile document
      const profileRef = this.getProfileRef(userId);
      await deleteDoc(profileRef);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw new Error('Failed to delete user profile');
    }
  }
}

const profileService = new ProfileService();
export default profileService; 