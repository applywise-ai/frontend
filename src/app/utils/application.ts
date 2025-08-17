import { FormQuestion, FormSectionType } from '@/app/types/application';

/**
 * Find a FormQuestion by section type from a record of questions
 */
export function findQuestionBySection(
  questions: Record<string, FormQuestion>, 
  section: FormSectionType
): FormQuestion | undefined {
  return Object.values(questions).find(question => question.section === section);
}

/**
 * Get file path from a question by section type
 */
export function getFilePathBySection(
  questions: Record<string, FormQuestion>, 
  section: FormSectionType
): string {
  const question = findQuestionBySection(questions, section);
  return question?.file_path || '';
}

/**
 * Get file URL from a question by section type (dynamically generated from file path)
 */
export async function getFileUrlBySection(
  questions: Record<string, FormQuestion>, 
  section: FormSectionType
): Promise<string> {
  const question = findQuestionBySection(questions, section);
  const filePath = question?.file_path;
  
  if (!filePath) return '';
  
  // If it's already a URL (for backward compatibility), return as is
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  // For file paths, use storage service to generate URL
  try {
    const storageService = (await import('@/app/services/firebase/storage')).default;
    const url = await storageService.generateUrlFromPath(filePath);
    return url || '';
  } catch (error) {
    console.error('Error generating file URL from path:', error);
    return '';
  }
}



/**
 * Get file name from a question by section type
 */
export function getFileNameBySection(
  questions: Record<string, FormQuestion>, 
  section: FormSectionType
): string {
  const question = findQuestionBySection(questions, section);
  return question?.file_name || '';
} 