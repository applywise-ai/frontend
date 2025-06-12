import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export interface UploadResult {
  url: string;
  filename: string;
  path: string;
}

class StorageService {
  /**
   * Upload a resume file to Firebase Storage
   */
  async uploadResume(userId: string, file: File): Promise<UploadResult> {
    try {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
      }

      // Validate file size (10MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload a file smaller than 5MB.');
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filename = `resume_${timestamp}.${fileExtension}`;
      const filePath = `resumes/${userId}/${filename}`;

      // Create storage reference
      const storageRef = ref(storage, filePath);

      // Set metadata to help with CORS
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'originalName': file.name,
          'uploadedBy': userId,
          'uploadedAt': new Date().toISOString()
        }
      };

      // Upload file with metadata
      const snapshot = await uploadBytes(storageRef, file, metadata);
      
      // Get download URL with retry logic for CORS issues
      let downloadURL: string;
      let retries = 3;
      
      while (retries > 0) {
        try {
          downloadURL = await getDownloadURL(snapshot.ref);
          break;
        } catch (urlError) {
          console.warn(`Attempt ${4 - retries} failed to get download URL:`, urlError);
          retries--;
          if (retries === 0) {
            throw urlError;
          }
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return {
        url: downloadURL!,
        filename: file.name, // Keep original filename for display
        path: filePath
      };
    } catch (error) {
      console.error('Error uploading resume:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          throw new Error('Upload failed due to browser security settings. Please try refreshing the page and uploading again.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Permission denied. Please make sure you are logged in and try again.');
        }
        if (error.message.includes('network')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        throw error;
      }
      throw new Error('Failed to upload resume. Please try again.');
    }
  }

  /**
   * Delete a resume file from Firebase Storage
   */
  async deleteResume(filePath: string): Promise<void> {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting resume:', error);
      // Don't throw error for delete operations as the file might not exist
    }
  }

  /**
   * Upload a cover letter file to Firebase Storage
   */
  async uploadCoverLetter(userId: string, file: File): Promise<UploadResult> {
    try {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload a file smaller than 5MB.');
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filename = `cover_letter_${timestamp}.${fileExtension}`;
      const filePath = `cover-letters/${userId}/${filename}`;

      // Create storage reference
      const storageRef = ref(storage, filePath);

      // Set metadata to help with CORS
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'originalName': file.name,
          'uploadedBy': userId,
          'uploadedAt': new Date().toISOString()
        }
      };

      // Upload file with metadata
      const snapshot = await uploadBytes(storageRef, file, metadata);
      
      // Get download URL with retry logic for CORS issues
      let downloadURL: string;
      let retries = 3;
      
      while (retries > 0) {
        try {
          downloadURL = await getDownloadURL(snapshot.ref);
          break;
        } catch (urlError) {
          console.warn(`Attempt ${4 - retries} failed to get download URL:`, urlError);
          retries--;
          if (retries === 0) {
            throw urlError;
          }
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return {
        url: downloadURL!,
        filename: file.name, // Keep original filename for display
        path: filePath
      };
    } catch (error) {
      console.error('Error uploading cover letter:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          throw new Error('Upload failed due to browser security settings. Please try refreshing the page and uploading again.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Permission denied. Please make sure you are logged in and try again.');
        }
        if (error.message.includes('network')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        throw error;
      }
      throw new Error('Failed to upload cover letter. Please try again.');
    }
  }

  /**
   * Delete a cover letter file from Firebase Storage
   */
  async deleteCoverLetter(filePath: string): Promise<void> {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      // Don't throw error for delete operations as the file might not exist
    }
  }

  /**
   * Upload any file to a specific folder
   */
  async uploadFile(userId: string, file: File, folder: string): Promise<UploadResult> {
    try {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload a file smaller than 10MB.');
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filename = `${folder}_${timestamp}.${fileExtension}`;
      const filePath = `${folder}/${userId}/${filename}`;

      // Create storage reference
      const storageRef = ref(storage, filePath);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        url: downloadURL,
        filename: file.name, // Keep original filename for display
        path: filePath
      };
    } catch (error) {
      console.error(`Error uploading ${folder}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to upload ${folder}. Please try again.`);
    }
  }

  /**
   * Delete any file from Firebase Storage
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error for delete operations as the file might not exist
    }
  }

  /**
   * Get file extension from filename
   */
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if file is a PDF
   */
  isPdf(filename: string): boolean {
    return this.getFileExtension(filename) === 'pdf';
  }

  /**
   * Check if file is a Word document
   */
  isWordDocument(filename: string): boolean {
    const ext = this.getFileExtension(filename);
    return ext === 'doc' || ext === 'docx';
  }

  /**
   * Get file type display name
   */
  getFileTypeDisplay(filename: string): string {
    const ext = this.getFileExtension(filename);
    switch (ext) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
        return 'Word Document';
      case 'docx':
        return 'Word Document';
      default:
        return 'Document';
    }
  }
}

const storageService = new StorageService();
export default storageService; 