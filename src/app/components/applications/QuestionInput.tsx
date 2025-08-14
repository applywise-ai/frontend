import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { MultiSelect } from '@/app/components/ui/multi-select';
import { Input } from '@/app/components/ui/input';
import { DatePicker } from '@/app/components/ui/date-picker';
import { Button } from '@/app/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ProFeatureDialog } from './AiCreditDialog';
import SubscriptionModal from '@/app/components/SubscriptionModal';
import { FileQuestionInput } from './FileQuestionInput';
import { FormQuestion, FormSectionType } from '@/app/types/application';
import { useProfile } from '@/app/contexts/ProfileContext';
import { FieldName } from '@/app/types/profile';
import { useApplications } from '@/app/contexts/ApplicationsContext';

interface QuestionInputProps {
  question: FormQuestion;
  onChange: (id: string, value: string | Partial<FormQuestion>) => void;
  onPreview?: (section?: FormSectionType) => void;
  hasError?: boolean;
  inputRef?: React.RefObject<HTMLDivElement | null>;
  onSuccess?: (message: string) => void;
  applicationId?: string;
  jobId?: string; // Add jobId prop for AI generation
}

function getAccentColorClass(section: FormSectionType): string {
  switch (section) {
    case 'personal': return 'focus-visible:ring-blue-500 hover:border-blue-300';
    case 'cover_letter': return 'focus-visible:ring-indigo-500 hover:border-indigo-300';
    case 'resume': return 'focus-visible:ring-green-500 hover:border-green-300';
    case 'education': return 'focus-visible:ring-teal-500 hover:border-teal-300';
    case 'experience': return 'focus-visible:ring-purple-500 hover:border-purple-300';
    case 'additional': return 'focus-visible:ring-amber-500 hover:border-amber-300';
    default: return '';
  }
}

export const QuestionInput = React.memo(function QuestionInput({
  question,
  onChange,
  onPreview,
  hasError,
  inputRef,
  onSuccess,
  applicationId,
  jobId,
}: QuestionInputProps) {
  const { profile } = useProfile();
  const isPro = profile?.[FieldName.IS_PRO_MEMBER] || false;
  const { applications, generateCustomAnswer } = useApplications();

  const accentColor = getAccentColorClass(question.section);
  const errorBorderClass = hasError ? 'border-red-500 focus-visible:ring-red-500' : '';

  const [localValue, setLocalValue] = useState<string>(question.answer || '');
  const [isAiPromptMode, setIsAiPromptMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Check if AI custom functionality should be shown
  const shouldShowAiCustom = question.ai_custom === true && (question.type === 'textarea' || question.type === 'text');
  const shouldShowAiPrompt = shouldShowAiCustom || (question.section === 'additional' && question.type === 'textarea');

  // Get job description from application context
  const getJobDescription = (): string => {
    if (!applicationId || !applications) return '';
    
    const application = applications.find(app => app && app.id && app.id === applicationId);
    return application?.job?.description || '';
  };

  useEffect(() => {
    setLocalValue(question.answer != null ? question.answer : '');
  }, [question.answer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (isAiPromptMode) {
      setAiPrompt(value);
    } else {
      setLocalValue(value);
      onChange(question.unique_label_id, value);
    }
  };

  const handleSelectChange = (value: string) => {
    if (question.pruned) {
      // If pruned, store the actual option value
      setLocalValue(value);
      onChange(question.unique_label_id, value);
    } else {
      // If not pruned, store the index of the selected option
      const index = question.options?.indexOf(value) ?? -1;
      if (index !== -1) {
        setLocalValue(index.toString());
        onChange(question.unique_label_id, index.toString());
      }
    }
  };

  const handleMultiSelectChange = (values: string[]) => {
    if (question.pruned) {
      // If pruned, store the actual option values
      setLocalValue(JSON.stringify(values));
      onChange(question.unique_label_id, JSON.stringify(values));
    } else {
      // If not pruned, store the indexes of the selected options
      const indexes = values.map(value => question.options?.indexOf(value) ?? -1).filter(index => index !== -1);
      setLocalValue(JSON.stringify(indexes));
      onChange(question.unique_label_id, JSON.stringify(indexes));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      setLocalValue('');
      onChange(question.unique_label_id, '');
      return;
    }
    
    // Format date as YYYY-MM-DD in local timezone to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatted = `${month}/${day}/${year}`;
    
    setLocalValue(formatted);
    onChange(question.unique_label_id, formatted);
  };
  
  const handleAiPromptClick = () => {
    if (isPro) {
      setIsAiPromptMode(true);
    } else {
      setShowCreditDialog(true);
    }
  };

  const handleGenerateAi = async () => {
    if (!jobId) {
      onSuccess?.('Job ID is required for AI generation. Please try again.');
      return;
    }

    const jobDescription = getJobDescription();
    if (!jobDescription) {
      onSuccess?.('Job description not available. Please try again.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Call the actual API to generate custom answer
      const response = await generateCustomAnswer(jobDescription, question.question, aiPrompt);
      
      // Update the local value with the generated answer
      setLocalValue(response.answer);
      onChange(question.unique_label_id, response.answer);
      
      // Show success notification
      onSuccess?.('AI response generated successfully!');
      
      // Exit AI mode after a brief delay
      setTimeout(() => {
        setIsAiPromptMode(false);
        setAiPrompt('');
      }, 500);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      onSuccess?.(error instanceof Error ? error.message : 'Failed to generate AI response');
    } finally {
      setIsGenerating(false);
    }
  };

  // Wrapper function for FileQuestionInput onChange
  const handleFileQuestionChange = (id: string, value: Partial<FormQuestion>) => {
    // Pass the FormQuestion update directly
    onChange(id, value);
  };

  return (
    <div ref={inputRef as unknown as React.RefObject<HTMLDivElement>}>
      {question.type === 'file' ? (
        <FileQuestionInput 
          question={question} 
          onChange={handleFileQuestionChange} 
          onPreview={onPreview} 
          hasError={hasError} 
          onSuccess={onSuccess} 
          applicationId={applicationId}
          jobId={jobId}
        />
      ) : shouldShowAiCustom ? (
        // Show textarea with AI button for ai-custom questions
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              ref={inputRef as unknown as React.RefObject<HTMLTextAreaElement>}
              id={question.unique_label_id}
              data-question-id={question.unique_label_id}
              rows={6}
              value={isAiPromptMode ? aiPrompt : localValue as string}
              onChange={(e) => isAiPromptMode ? setAiPrompt(e.target.value) : handleInputChange(e)}
              placeholder={isAiPromptMode ? "Optional: Add your prompt to generate a more personalized response..." : question.placeholder}
              className={`resize-none mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass} ${isAiPromptMode ? 'pr-12' : 'pr-12'}`}
              disabled={isGenerating}
            />
            {!isAiPromptMode && (
              <Button type="button" variant="ghost" size="sm" onClick={handleAiPromptClick} className="absolute top-2 right-2 h-8 w-8 p-0">
                <Sparkles className="h-4 w-4 text-teal-500" />
              </Button>
            )}
          </div>
          {isAiPromptMode && (
            <div className="flex justify-between">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAiPromptMode(false)} disabled={isGenerating}>
                <X className="h-3.5 w-3.5 mr-2" />
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleGenerateAi} className="bg-teal-600 text-white" disabled={isGenerating}>
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          )}
        </div>
      ) : question.type === 'textarea' && question.ai_custom === false ? (
        // Show regular input for textarea with ai-custom false
        <Input
          id={question.unique_label_id}
          data-question-id={question.unique_label_id}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type='text'
          placeholder={question.placeholder}
          value={localValue as string}
          onChange={handleInputChange}
          className={`mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
        />
      ) : question.type === 'textarea' ? (
        // Show regular textarea for other textarea questions
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              ref={inputRef as unknown as React.RefObject<HTMLTextAreaElement>}
              id={question.unique_label_id}
              data-question-id={question.unique_label_id}
              rows={6}
              value={isAiPromptMode ? aiPrompt : localValue as string}
              onChange={(e) => isAiPromptMode ? setAiPrompt(e.target.value) : handleInputChange(e)}
              placeholder={isAiPromptMode ? "Optional: Add your prompt to generate a more personalized response..." : question.placeholder}
              className={`resize-none mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass} ${isAiPromptMode || shouldShowAiPrompt ? 'pr-12' : ''}`}
              disabled={isGenerating}
            />
            {shouldShowAiPrompt && !isAiPromptMode && (
              <Button type="button" variant="ghost" size="sm" onClick={handleAiPromptClick} className="absolute top-2 right-2 h-8 w-8 p-0">
                <Sparkles className="h-4 w-4 text-teal-500" />
              </Button>
            )}
          </div>
          {isAiPromptMode && (
            <div className="flex justify-between">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAiPromptMode(false)} disabled={isGenerating}>
                <X className="h-3.5 w-3.5 mr-2" />
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleGenerateAi} className="bg-teal-600 text-white" disabled={isGenerating}>
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          )}
        </div>
      ) : question.type === 'select' ? (
        question.pruned ? (
          <div>
            <Input
              id={question.unique_label_id}
              data-question-id={question.unique_label_id}
              type='text'
              placeholder={question.placeholder || "Enter your selection"}
              value={localValue as string}
              onChange={handleInputChange}
              className={`mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
            />
          </div>
        ) : (
          <Select 
            value={localValue != null ? question.options?.[parseInt(localValue as string)] : ''} 
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className={`w-full mt-1 shadow-sm transition duration-200 border-input ${accentColor} ${errorBorderClass}`}>
              <SelectValue placeholder={question.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={`${question.unique_label_id}-${option}-${index}`} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      ) : question.type === 'multiselect' ? (
        question.pruned ? (
          <div>
            <Input
              id={question.unique_label_id}
              data-question-id={question.unique_label_id}
              type='text'
              placeholder={question.placeholder || "Enter options separated by commas"}
              value={localValue as string}
              onChange={handleInputChange}
              className={`mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
            />
            <p className="mt-1 text-sm text-gray-500">Enter your selected options separated by commas (e.g., Option 1, Option 2, Option 3)</p>
          </div>
        ) : (
          <MultiSelect
            options={question.options?.map((option) => ({ value: option, label: option })) || []}
            selected={
              (() => {
                if (!localValue) return [];
            
                const parsed =
                  Array.isArray(localValue)
                    ? localValue
                    : (() => {
                        try {
                          return JSON.parse(localValue as string);
                        } catch {
                          return [];
                        }
                      })();
            
                return Array.isArray(parsed)
                  ? parsed
                      .map((index: number) => question.options?.[index] || '')
                      .filter(Boolean)
                  : [];
              })()
            }
            onChange={handleMultiSelectChange}
            placeholder={question.placeholder || "Select options..."}
            className={`mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
            itemName="option"
            showOptions={true}
          />
        )
      ) : question.type === 'checkbox' ? (
        <Select 
          value={localValue as string || ''} 
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className={`w-full mt-1 shadow-sm transition duration-200 border-input ${accentColor} ${errorBorderClass}`}>
            <SelectValue placeholder={question.placeholder || "Select Yes or No"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      ) : question.type === 'date' ? (
        <div className="mt-1">
          <DatePicker
            date={localValue}
            setDate={handleDateChange}
            placeholder={question.placeholder || "Select a date"}
            className={`border-input shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
          />
        </div>
      ) : question.type === 'number' ? (
        <Input
          id={question.unique_label_id}
          data-question-id={question.unique_label_id}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type='number'
          placeholder={question.placeholder || "Enter a number"}
          value={localValue as string}
          onChange={handleInputChange}
          className={`mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
        />
      ) : (
        <Input
          id={question.unique_label_id}
          data-question-id={question.unique_label_id}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type='text'
          placeholder={question.placeholder}
          value={localValue as string}
          onChange={handleInputChange}
          className={`mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
        />
      )}

      {hasError && <p className="mt-1 text-sm text-red-600">This field is required</p>}

              <ProFeatureDialog
        isOpen={showCreditDialog}
        onClose={() => setShowCreditDialog(false)}
        onUpgrade={() => { setShowCreditDialog(false); setShowSubscriptionModal(true); }}
      />

      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} />
    </div>
  );
});
