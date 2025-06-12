import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Input } from '@/app/components/ui/input';
import { DatePicker } from '@/app/components/ui/date-picker';
import { Button } from '@/app/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AiCreditDialog } from './AiCreditDialog';
import SubscriptionModal from '@/app/components/SubscriptionModal';
import { FileQuestionInput } from './FileQuestionInput';
import { FormQuestion, FileType, FormSectionType, Answer } from '@/app/types/application';
import { useProfile } from '@/app/contexts/ProfileContext';
import { FieldName } from '@/app/types/profile';

interface QuestionInputProps {
  question: FormQuestion;
  answer: Answer;
  onChange: (id: string, value: Answer) => void;
  onPreview?: (fileType: FileType) => void;
  hasError?: boolean;
  inputRef?: React.RefObject<HTMLDivElement | null>;
  onSuccess?: (message: string) => void;
  applicationId?: string;
}

function getAccentColorClass(section: FormSectionType): string {
  switch (section) {
    case 'personal': return 'focus-visible:ring-blue-500 hover:border-blue-300';
    case 'coverLetter': return 'focus-visible:ring-indigo-500 hover:border-indigo-300';
    case 'resume': return 'focus-visible:ring-green-500 hover:border-green-300';
    case 'screening': return 'focus-visible:ring-teal-500 hover:border-teal-300';
    case 'custom': return 'focus-visible:ring-amber-500 hover:border-amber-300';
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
  answer,
  applicationId,
}: QuestionInputProps) {
  const { profile } = useProfile();
  const isPro = profile?.[FieldName.IS_PRO_MEMBER] || false;
  
  const accentColor = getAccentColorClass(question.section);
  const errorBorderClass = hasError ? 'border-red-500 focus-visible:ring-red-500' : '';

  const [localValue, setLocalValue] = useState<string>(answer as string || '');
  const [isAiPromptMode, setIsAiPromptMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const shouldShowAiPrompt = question.section === 'screening' && question.type === 'textarea';

  useEffect(() => {
    setLocalValue(answer as string || '');
  }, [answer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    onChange(question.id, value);
    setLocalValue(value);
  };

  const handleSelectChange = (value: string) => {
    onChange(question.id, value);
    setLocalValue(value);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      onChange(question.id, '');
      setLocalValue('');
      return;
    }
    
    // Format date as YYYY-MM-DD in local timezone to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;
    
    onChange(question.id, formatted);
    setLocalValue(formatted);
  };

  const handleAiPromptClick = () => {
    if (isPro) {
      setIsAiPromptMode(true);
    } else {
      setShowCreditDialog(true);
    }
  };

  const handleGenerateAi = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const aiResponse = generateMockAiResponse(question.question, aiPrompt);
      onChange(question.id, aiResponse);
      setLocalValue(aiResponse);
      setIsGenerating(false);
      onSuccess?.('AI response generated successfully!');
      setTimeout(() => {
        setIsAiPromptMode(false);
        setAiPrompt('');
      }, 500);
    }, 2000);
  };

  const generateMockAiResponse = (questionText: string, userPrompt: string) => {
    const responses = {
      'Why do you want to work at our company?': `I am genuinely excited about the opportunity to join your company because of your reputation for innovation and commitment to excellence. ${userPrompt ? `Additionally, ${userPrompt.toLowerCase()}` : ''}`,
      'Describe a challenging project you worked on.': `One of the most challenging projects I tackled involved ${userPrompt || 'leading a cross-functional team to deliver a complex solution.'}`
    };
    return responses[questionText as keyof typeof responses] || `Here's a thoughtful response: ${userPrompt || 'I am confident in my ability to contribute effectively.'}`;
  };

  return (
    <div ref={inputRef as unknown as React.RefObject<HTMLDivElement>}>
      {question.type === 'file' ? (
        <FileQuestionInput question={question} answer={answer} onChange={onChange} onPreview={onPreview} hasError={hasError} onSuccess={onSuccess} applicationId={applicationId} />
      ) : question.type === 'textarea' ? (
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              ref={inputRef as unknown as React.RefObject<HTMLTextAreaElement>}
              id={question.id}
              data-question-id={question.id}
              rows={4}
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
      ) : question.type === 'select' || question.type === 'radio' ? (
        <Select value={localValue as string} onValueChange={handleSelectChange}>
          <SelectTrigger className={`w-full mt-1 shadow-sm transition duration-200 border-input ${accentColor} ${errorBorderClass}`}>
            <SelectValue placeholder={question.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : question.type === 'date' ? (
        <div className="mt-1">
          <DatePicker
            date={localValue ? new Date(localValue as string + 'T00:00:00') : undefined}
            setDate={handleDateChange}
            placeholder={question.placeholder || "Select a date"}
            className={`border-input shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
          />
        </div>
      ) : (
        <Input
          id={question.id}
          data-question-id={question.id}
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={question.type === 'email' ? 'email' : question.type === 'phone' ? 'tel' : 'text'}
          placeholder={question.placeholder}
          value={localValue as string}
          onChange={handleInputChange}
          className={`mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
        />
      )}

      {hasError && <p className="mt-1 text-sm text-red-600">This field is required</p>}

      <AiCreditDialog
        isOpen={showCreditDialog}
        onClose={() => setShowCreditDialog(false)}
        onConfirm={() => { setShowCreditDialog(false); setIsAiPromptMode(true); }}
        onUpgrade={() => { setShowCreditDialog(false); setShowSubscriptionModal(true); }}
      />

      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} />
    </div>
  );
});
