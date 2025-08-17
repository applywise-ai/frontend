
import { FormQuestion } from '@/app/types/application';
import apiService from './api';

interface PrepareResponse {
  application_id: string;
  status: string;
  form_questions?: FormQuestion[];
}

interface SubmitResponse {
  status: string;
  message?: string;
}

interface SaveRequest {
  application_id: string;
  form_questions: FormQuestion[];
}

interface SaveResponse {
  status: string;
  message?: string;
}

interface GenerateCoverLetterRequest {
  job_id: string;
  prompt: string;
}

interface GenerateCoverLetterResponse {
  application_id: string;
  cover_letter_path: string;
  message: string;
}

interface GenerateCustomAnswerRequest {
  job_description: string;
  question: string;
  prompt: string;
}

interface GenerateCustomAnswerResponse {
  answer: string;
  message: string;
}

class ApplicationsService {
  /**
   * Apply to a job - use the /prepare endpoint to get form questions
   */
  async apply(jobId: string): Promise<string> {
    try {
      // Call the /prepare endpoint to get form questions for this job
      const prepareData = await apiService.post<PrepareResponse>(`/applications/prepare`, { job_id: jobId });
      return prepareData.application_id;
    } catch (error) {
      console.error('Error preparing application:', error);
      throw new Error('Failed to prepare application');
    }
  }

  /**
   * Submit an application - use the /submit endpoint
   */
  async submit(applicationId: string): Promise<SubmitResponse> {
    try {
      const response = await apiService.post<SubmitResponse>(`/applications/submit`, { application_id: applicationId });
      return response;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw new Error('Failed to submit application');
    }
  }

  /**
   * Save an application - use the /save endpoint
   */
  async save(applicationId: string, formQuestions: FormQuestion[]): Promise<SaveResponse> {
    try {
      const requestData: SaveRequest = {
        application_id: applicationId,
        form_questions: formQuestions
      };
      console.log(requestData)
      const response = await apiService.post<SaveResponse>(`/applications/save`, requestData);
      return response;
    } catch (error) {
      console.error('Error saving application:', error);
      throw new Error('Failed to save application');
    }
  }

  /**
   * Generate a cover letter - use the /generate-cover-letter endpoint
   */
  async generateCoverLetter(jobId: string, prompt: string): Promise<GenerateCoverLetterResponse> {
    try {
      const requestData: GenerateCoverLetterRequest = {
        job_id: jobId,
        prompt: prompt
      };
      
      const response = await apiService.post<GenerateCoverLetterResponse>(`/applications/generate-cover-letter`, requestData);
      return response;
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw new Error('Failed to generate cover letter');
    }
  }

  /**
   * Generate a custom answer - use the /generate-custom-answer endpoint
   */
  async generateCustomAnswer(jobDescription: string, question: string, prompt: string): Promise<GenerateCustomAnswerResponse> {
    try {
      const requestData: GenerateCustomAnswerRequest = {
        job_description: jobDescription,
        question: question,
        prompt: prompt
      };
      
      const response = await apiService.post<GenerateCustomAnswerResponse>(`/applications/generate-custom-answer`, requestData);
      return response;
    } catch (error) {
      console.error('Error generating custom answer:', error);
      throw new Error('Failed to generate custom answer');
    }
  }
}

const applicationsService = new ApplicationsService();
export default applicationsService; 