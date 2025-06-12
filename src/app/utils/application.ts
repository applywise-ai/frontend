import { Answer, FileType } from '@/app/types/application';

/**
 * File details interface for upload results
 */
export interface UploadResult {
  filename: string;
  url: string;
  path: string;
}

/**
 * File details interface for extracted file information
 */
export interface FileDetails {
  fileName: string;
  fileUrl: string;
  filePath: string;
}

/**
 * Get file details from answer object using dynamic property names based on fileType
 * @param answer - The answer object containing file details
 * @param fileType - The type of file (resume, coverLetter, etc.)
 * @returns FileDetails object with fileName, fileUrl, and filePath
 */
export function getFileDetails(answer: Answer, fileType?: FileType): FileDetails {
  // If answer is an object, extract file details from it
  if (typeof answer === 'object' && answer !== null) {
    if (fileType) {
      // Dynamic property names based on fileType
      const filenameKey = `${fileType}Filename`;
      const urlKey = `${fileType}Url`;
      const pathKey = `${fileType}Path`;
      
      return {
        fileName: (answer[filenameKey as keyof typeof answer] as string) || '',
        fileUrl: (answer[urlKey as keyof typeof answer] as string) || '',
        filePath: (answer[pathKey as keyof typeof answer] as string) || '',
      };
    }
    
    // Fallback to generic fields if no fileType
    return {
      fileName: (answer.filename as string) || '',
      fileUrl: (answer.fileUrl as string) || '',
      filePath: (answer.filePath as string) || '',
    };
  }
  
  // If answer is a string, use it as filename
  return {
    fileName: answer as string || '',
    fileUrl: '',
    filePath: '',
  };
}

/**
 * Create file details object dynamically based on fileType
 * @param uploadResult - The upload result containing filename, url, and path
 * @param fileType - The type of file (resume, coverLetter, etc.)
 * @returns Record with dynamic property names for the file details
 */
export function createFileDetails(
  uploadResult: UploadResult, 
  fileType?: FileType
): Record<string, string | number | boolean | null> {
  const fileDetails: Record<string, string | number | boolean | null> = {};
  
  if (fileType) {
    // Dynamic property names based on fileType
    fileDetails[`${fileType}Filename`] = uploadResult.filename;
    fileDetails[`${fileType}Url`] = uploadResult.url;
    fileDetails[`${fileType}Path`] = uploadResult.path;
  } else {
    // Fallback to generic fields
    fileDetails.filename = uploadResult.filename;
    fileDetails.fileUrl = uploadResult.url;
    fileDetails.filePath = uploadResult.path;
  }
  
  return fileDetails;
}

/**
 * Create clear/empty file details object dynamically based on fileType
 * @param fileType - The type of file (resume, coverLetter, etc.)
 * @returns Record with dynamic property names set to empty strings
 */
export function createClearFileDetails(
  fileType?: FileType
): Record<string, string | number | boolean | null> {
  const clearDetails: Record<string, string | number | boolean | null> = {};
  
  if (fileType) {
    // Dynamic property names based on fileType
    clearDetails[`${fileType}Filename`] = '';
    clearDetails[`${fileType}Url`] = '';
    clearDetails[`${fileType}Path`] = '';
  } else {
    // Fallback to generic fields
    clearDetails.filename = '';
    clearDetails.fileUrl = '';
    clearDetails.filePath = '';
  }
  
  return clearDetails;
}

/**
 * Get file URL from answers for a specific file type
 * @param answers - Record of all form answers
 * @param fileType - The type of file to find (resume, coverLetter, etc.)
 * @returns The file URL or empty string if not found
 */
export function getFileUrlFromAnswers(
  answers: Record<string, Answer>, 
  fileType: FileType
): string {
  // Find answer that contains the file type data
  const fileAnswer = Object.values(answers).find((answer) => {
    if (typeof answer === 'object' && answer !== null) {
      const urlKey = `${fileType}Url`;
      const filenameKey = `${fileType}Filename`;
      return urlKey in answer || filenameKey in answer;
    }
    return false;
  });

  if (fileAnswer) {
    const fileDetails = getFileDetails(fileAnswer, fileType);
    return fileDetails.fileUrl;
  }

  return '';
} 