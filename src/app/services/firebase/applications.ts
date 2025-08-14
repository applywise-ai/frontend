import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { 
  Application, 
  FirestoreApplication, 
  FormQuestion
} from '@/app/types/application';

class ApplicationsService {
  /**
   * Get reference to user's applications subcollection
   */
  private getApplicationsRef(userId: string) {
    return collection(db, 'users', userId, 'applications');
  }

  /**
   * Get reference to specific application document
   */
  private getApplicationRef(userId: string, applicationId: string) {
    return doc(db, 'users', userId, 'applications', applicationId);
  }

  /**
   * Convert Firestore application to Application interface
   */
  private convertFromFirestore(data: FirestoreApplication, id: string): Application {
    return {
      ...data,
      id,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      lastUpdated: data.lastUpdated instanceof Timestamp ? data.lastUpdated.toDate().toISOString() : new Date().toISOString(),
      appliedDate: data.appliedDate instanceof Timestamp ? data.appliedDate.toDate().toISOString() : undefined,
    };
  }

  /**
   * Convert Application to Firestore format
   */
  private convertToFirestore(application: Partial<Application>): Partial<FirestoreApplication> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, lastUpdated, appliedDate, id, ...rest } = application;
    
    const firestoreData: Partial<FirestoreApplication> = {
      ...rest,
      lastUpdated: serverTimestamp(),
    };

    // Only set appliedDate if it exists and status is not Draft
    if (appliedDate && application.status !== 'Draft') {
      firestoreData.appliedDate = serverTimestamp();
    }

    return firestoreData;
  }

  /**
   * Create a new application
   */
  async createApplication(
    userId: string, 
    jobId: string,
    status: Application['status'] = 'Draft',
    formQuestions?: FormQuestion[]
  ): Promise<string> {
    try {
      const applicationsRef = this.getApplicationsRef(userId);
      
      const newApplication: Partial<FirestoreApplication> = {
        userId,
        jobId,
        status,
        formQuestions: formQuestions || [],
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      };

      const docRef = await addDoc(applicationsRef, newApplication);
      return docRef.id;
    } catch (error) {
      console.error('Error creating application:', error);
      throw new Error('Failed to create application');
    }
  }

  /**
   * Get all applications for a user
   */
  async getUserApplications(userId: string): Promise<Application[]> {
    try {
      const applicationsRef = this.getApplicationsRef(userId);
      const q = query(applicationsRef, orderBy('lastUpdated', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const applications: Application[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreApplication;
        applications.push(this.convertFromFirestore(data, doc.id));
      });

      return applications;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw new Error('Failed to fetch applications');
    }
  }

  /**
   * Get applications by status
   */
  async getApplicationsByStatus(userId: string, status: Application['status']): Promise<Application[]> {
    try {
      const applicationsRef = this.getApplicationsRef(userId);
      const q = query(
        applicationsRef, 
        where('status', '==', status),
        orderBy('lastUpdated', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const applications: Application[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreApplication;
        applications.push(this.convertFromFirestore(data, doc.id));
      });

      return applications;
    } catch (error) {
      console.error('Error fetching applications by status:', error);
      throw new Error('Failed to fetch applications');
    }
  }

  /**
   * Get a specific application by ID
   */
  async getApplication(userId: string, applicationId: string): Promise<Application | null> {
    try {
      const applicationRef = this.getApplicationRef(userId, applicationId);
      const docSnap = await getDoc(applicationRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as FirestoreApplication;
        return this.convertFromFirestore(data, docSnap.id);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw new Error('Failed to fetch application');
    }
  }

  /**
   * Update an application
   */
  async updateApplication(
    userId: string, 
    applicationId: string, 
    updates: Partial<Application>
  ): Promise<Application> {
    try {
      const applicationRef = this.getApplicationRef(userId, applicationId);
      const updateData = this.convertToFirestore(updates);
      
      await updateDoc(applicationRef, updateData);
      
      // Return updated application
      const updatedApp = await this.getApplication(userId, applicationId);
      if (!updatedApp) {
        throw new Error('Failed to retrieve updated application');
      }
      
      return updatedApp;
    } catch (error) {
      console.error('Error updating application:', error);
      throw new Error('Failed to update application');
    }
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(
    userId: string, 
    applicationId: string, 
    status: Application['status']
  ): Promise<Application> {
    try {
      const updates: Partial<Application> = { status };
      
      // Set appliedDate when status changes to Applied
      if (status === 'Applied') {
        updates.appliedDate = new Date().toISOString();
      }
      
      return await this.updateApplication(userId, applicationId, updates);
    } catch (error) {
      console.error('Error updating application status:', error);
      throw new Error('Failed to update application status');
    }
  }

  /**
   * Update form questions for an application
   */
  async updateFormQuestions(
    userId: string, 
    applicationId: string, 
    formQuestions: FormQuestion[]
  ): Promise<Application> {
    try {
      return await this.updateApplication(userId, applicationId, { formQuestions });
    } catch (error) {
      console.error('Error updating form questions:', error);
      throw new Error('Failed to update form questions');
    }
  }

  /**
   * Delete an application
   */
  async deleteApplication(userId: string, applicationId: string): Promise<boolean> {
    try {
      const applicationRef = this.getApplicationRef(userId, applicationId);
      await deleteDoc(applicationRef);
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw new Error('Failed to delete application');
    }
  }

  /**
   * Save a job (create saved application)
   */
  async saveJob(userId: string, jobId: string): Promise<string> {
    try {
      // Check if job is already saved to prevent duplicates
      const alreadySaved = await this.isJobSaved(userId, jobId);
      if (alreadySaved) {
        // Find and return the existing saved application ID
        const applicationsRef = this.getApplicationsRef(userId);
        const q = query(
          applicationsRef, 
          where('jobId', '==', jobId),
          where('status', '==', 'Saved')
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].id;
        }
      }
      
      const applicationId = await this.createApplication(userId, jobId, 'Saved');
      return applicationId;
    } catch (error) {
      console.error('Error saving job:', error);
      throw new Error('Failed to save job');
    }
  }

  /**
   * Get application statistics for a user
   */
  async getApplicationStats(userId: string): Promise<{
    total: number;
    draft: number;
    applied: number;
    saved: number;
    interviewing: number;
    rejected: number;
  }> {
    try {
      const applications = await this.getUserApplications(userId);
      
      return {
        total: applications.length,
        draft: applications.filter(app => app.status === 'Draft').length,
        applied: applications.filter(app => app.status === 'Applied').length,
        saved: applications.filter(app => app.status === 'Saved').length,
        interviewing: applications.filter(app => app.status === 'Interviewing').length,
        rejected: applications.filter(app => app.status === 'Rejected').length,
      };
    } catch (error) {
      console.error('Error getting application stats:', error);
      throw new Error('Failed to get application statistics');
    }
  }

  /**
   * Check if user has already applied to a job
   */
  async hasAppliedToJob(userId: string, jobId: string): Promise<boolean> {
    try {
      const applicationsRef = this.getApplicationsRef(userId);
      const q = query(applicationsRef, where('jobId', '==', jobId));
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking if applied to job:', error);
      return false;
    }
  }

  /**
   * Check if user has saved a job
   */
  async isJobSaved(userId: string, jobId: string): Promise<boolean> {
    try {
      const applicationsRef = this.getApplicationsRef(userId);
      const q = query(
        applicationsRef, 
        where('jobId', '==', jobId),
        where('status', '==', 'Saved')
      );
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking if job is saved:', error);
      return false;
    }
  }

  /**
   * Unsave a job (delete the saved application)
   */
  async unsaveJob(userId: string, jobId: string): Promise<boolean> {
    try {
      // Find the saved application for this job
      const applicationsRef = this.getApplicationsRef(userId);
      const q = query(
        applicationsRef, 
        where('jobId', '==', jobId),
        where('status', '==', 'Saved')
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return false; // Job wasn't saved
      }

      // Delete the saved application
      const doc = querySnapshot.docs[0];
      return await this.deleteApplication(userId, doc.id);
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw new Error('Failed to unsave job');
    }
  }

}

const applicationsService = new ApplicationsService();
export default applicationsService; 