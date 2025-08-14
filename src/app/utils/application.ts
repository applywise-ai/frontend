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
 * Get file URL from a question by section type
 */
export function getFileUrlBySection(
  questions: Record<string, FormQuestion>, 
  section: FormSectionType
): string {
  const question = findQuestionBySection(questions, section);
  return question?.file_url || '';
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