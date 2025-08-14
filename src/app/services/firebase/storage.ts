import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
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
  async uploadResume(userId: string, file: File, applicationId?: string): Promise<UploadResult> {
    try {
      // Validate file type - only allow PDF
      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a PDF file.');
      }

      // Validate file size (10MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload a file smaller than 5MB.');
      }

      // Create the filename based on applicationId
      const fileExtension = file.name.split('.').pop();
      const filename = applicationId ? `${applicationId}.${fileExtension}` : `resume.${fileExtension}`;
      const filePath = `resumes/${userId}/${filename}`;

      // Create storage reference
      const storageRef = ref(storage, filePath);

      // Set metadata to help with CORS
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'originalName': file.name,
          'uploadedBy': userId,
          'uploadedAt': new Date().toISOString(),
          'applicationId': applicationId || ''
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
  async uploadCoverLetter(userId: string, file: File, applicationId: string): Promise<UploadResult> {
    try {
      // Validate file type - only allow PDF
      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a PDF file.');
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload a file smaller than 5MB.');
      }

      // Create filename using applicationId
      const fileExtension = file.name.split('.').pop();
      const filename = `${applicationId}.${fileExtension}`;
      const filePath = `cover-letters/${userId}/${filename}`;

      // Create storage reference
      const storageRef = ref(storage, filePath);

      // Set metadata to help with CORS
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'originalName': file.name,
          'uploadedBy': userId,
          'uploadedAt': new Date().toISOString(),
          'applicationId': applicationId
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
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please upload a file smaller than 5MB.');
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
    } catch (err) {
      console.log('Error deleting file:', err);
      // Don't throw error for delete operations as the file might not exist
    }
  }

  /**
   * Get download URL for a file in Firebase Storage
   * @param folder - The folder name (e.g., 'cover-letters', 'resumes')
   * @param userId - The user ID
   * @param applicationId - The application ID
   * @returns Promise<string | null> - Download URL if file exists, null otherwise
   */
  async getDownloadUrl(folder: string, userId: string, applicationId: string): Promise<string | null> {
    try {
      // Create the folder path: folder/{userId}/
      const folderPath = `${folder}/${userId}`;
      const folderRef = ref(storage, folderPath);
      
      // List all files in the folder
      const result = await listAll(folderRef);
      
      // Find the file that contains the applicationId in its name
      const matchingFile = result.items.find(item => {
        const fileName = item.name;
        return fileName.includes(applicationId);
      });
      
      if (matchingFile) {
        // Get the download URL for the matching file
        return await getDownloadURL(matchingFile);
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting download URL for file in ${folder}:`, error);
      // If there's an error (e.g., folder doesn't exist), return null
      return null;
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
   * Check if file is a Word document (deprecated - only PDFs supported)
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
        return 'Word Document (not supported)';
      case 'docx':
        return 'Word Document (not supported)';
      default:
        return 'Document';
    }
  }
}

const storageService = new StorageService();
export default storageService; 