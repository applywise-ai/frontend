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
import { useState } from 'react';
import { AiCreditDialog } from './AiCreditDialog';
import SubscriptionModal from '@/app/components/SubscriptionModal';
import { FileQuestionInput } from './FileQuestionInput';

// Define question types
export type QuestionType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'radio' | 'date' | 'file';
export type FormSection = 'personal' | 'coverLetter' | 'screening' | 'custom' | 'resume';
export type FileType = 'resume' | 'coverLetter' | 'other';

// Define the structure for form questions
export type FormQuestion = {
  id: string;
  question: string;
  answer: string;
  type: QuestionType;
  placeholder?: string;
  options?: string[];
  section: FormSection;
  fileType?: FileType;
  required?: boolean;
};

interface QuestionInputProps {
  question: FormQuestion;
  answer: string;
  onChange: (id: string, value: string) => void;
  onPreview?: (fileType: FileType) => void;
  hasError?: boolean;
  inputRef?: React.RefObject<HTMLDivElement | null>;
  onSuccess?: (message: string) => void;
  isPro?: boolean;
}

// Get appropriate color accent based on section
function getAccentColorClass(section: FormSection): string {
  switch (section) {
    case 'personal': return 'focus-visible:ring-blue-500 hover:border-blue-300';
    case 'coverLetter': return 'focus-visible:ring-indigo-500 hover:border-indigo-300';
    case 'resume': return 'focus-visible:ring-green-500 hover:border-green-300';
    case 'screening': return 'focus-visible:ring-teal-500 hover:border-teal-300';
    case 'custom': return 'focus-visible:ring-amber-500 hover:border-amber-300';
    default: return '';
  }
}

export function QuestionInput({ question, onChange, onPreview, hasError, inputRef, onSuccess, isPro, answer }: QuestionInputProps) {
  const accentColor = getAccentColorClass(question.section);
  const errorBorderClass = hasError ? 'border-red-500 focus-visible:ring-red-500' : '';
  // AI prompt state - only for screening textarea questions
  const [isAiPromptMode, setIsAiPromptMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Mock credit data (replace with actual user data)
  const [creditsRemaining] = useState(5); // This would come from user context/API
  
  // Create a unique key for the input to help React keep track
  const inputKey = `${question.id}-${question.type}`;
  
  // Check if this is a screening textarea question that should have AI prompt
  const shouldShowAiPrompt = question.section === 'screening' && question.type === 'textarea';
  
  // Handle AI prompt button click - show dialog first
  const handleAiPromptClick = () => {
    // TODO: Call api to check if this is an AI application already
    if (isPro) {
      // Premium users skip credit dialog and go straight to AI prompt
      setIsAiPromptMode(true);
    } else {
      // Non-premium users see credit dialog
      setShowCreditDialog(true);
    }
  };
  
  // Handle dialog confirmation - proceed with AI generation
  const handleDialogConfirm = () => {
    setShowCreditDialog(false);
    setIsAiPromptMode(true);
  };
  
  // Handle dialog close
  const handleDialogClose = () => {
    setShowCreditDialog(false);
  };
  
  // Handle upgrade (placeholder)
  const handleUpgrade = () => {
    setShowCreditDialog(false);
    setShowSubscriptionModal(true);
  };

  // Handle cancel AI prompt
  const handleCancelAiPrompt = () => {
    setIsAiPromptMode(false);
    setAiPrompt('');
  };
  
  // Handle generate AI response
  const handleGenerateAi = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual AI API call)
    setTimeout(() => {
      const aiResponse = generateMockAiResponse(question.question, aiPrompt);
      onChange(question.id, aiResponse);
      setIsGenerating(false);
      
      // Show success notification
      if (onSuccess) {
        onSuccess('AI response generated successfully!');
      }
      
      // Exit AI mode after a brief delay
      setTimeout(() => {
        setIsAiPromptMode(false);
        setAiPrompt('');
      }, 500);
    }, 2000);
  };
  
  // Mock AI response generator (replace with actual AI integration)
  const generateMockAiResponse = (questionText: string, userPrompt: string) => {
    const responses = {
      'Why do you want to work at our company?': `I am genuinely excited about the opportunity to join your company because of your reputation for innovation and commitment to excellence. ${userPrompt ? `Additionally, ${userPrompt.toLowerCase()}` : ''} Your company&apos;s values align perfectly with my professional goals, and I believe I can contribute meaningfully to your team&apos;s success while growing my own skills in this dynamic environment.`,
      'Describe a challenging project you worked on.': `One of the most challenging projects I tackled involved ${userPrompt || 'leading a cross-functional team to deliver a complex software solution under tight deadlines'}. This project required me to coordinate multiple stakeholders, manage competing priorities, and solve technical challenges while maintaining high quality standards. Through effective communication, strategic planning, and collaborative problem-solving, we successfully delivered the project on time and exceeded expectations. This experience taught me valuable lessons about leadership, resilience, and the importance of clear communication in complex projects.`
    };
    
    return responses[questionText as keyof typeof responses] || `Based on your question "${questionText}", here&apos;s a thoughtful response: ${userPrompt || 'I have relevant experience and skills that make me a strong candidate for this position. I am passionate about contributing to your team and helping achieve your company&apos;s goals.'} I believe my background and enthusiasm make me well-suited for this role.`;
  };
  
  return (
    <div ref={inputRef}>
      {question.type === 'file' ? (
        <FileQuestionInput question={question} onChange={onChange} onPreview={onPreview} hasError={hasError} onSuccess={onSuccess} isPro={isPro} />
      ) : question.type === 'textarea' ? (
        <div className="space-y-3">
          <div className="relative">
        <Textarea 
          key={inputKey}
          id={question.id}
          rows={4}
              value={isAiPromptMode ? aiPrompt : (answer || '')} 
              onChange={(e) => isAiPromptMode ? setAiPrompt(e.target.value) : onChange(question.id, e.target.value)}
              placeholder={isAiPromptMode ? "Optional: Add specific details you'd like to include in your AI-generated response..." : question.placeholder}
              className={`resize-none mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass} ${isAiPromptMode ? 'pr-12' : shouldShowAiPrompt ? 'pr-12' : ''}`}
              disabled={isGenerating}
        />
            
            {/* AI Prompt Button - only show for screening questions */}
            {shouldShowAiPrompt && !isAiPromptMode && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAiPromptClick}
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-teal-50 hover:text-teal-600 transition-colors group"
                title="Prompt with AI"
              >
                <Sparkles className="h-4 w-4 text-teal-500 group-hover:text-teal-600" />
              </Button>
            )}
          </div>
          
          {/* AI Prompt Mode Controls */}
          {isAiPromptMode && (
            <div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelAiPrompt}
                  className="flex items-center gap-1.5 border-gray-300 text-gray-600 hover:bg-gray-50"
                  disabled={isGenerating}
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                
                <Button
                  type="button"
                  size="sm"
                  onClick={handleGenerateAi}
                  className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={isGenerating}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : question.type === 'select' || question.type === 'radio' ? (
        <Select
          key={inputKey}
          value={answer || ''}
          onValueChange={(value: string) => onChange(question.id, value)}
        >
          <SelectTrigger className={`w-full mt-1 shadow-sm transition duration-200 border-input ${accentColor} ${errorBorderClass}`}>
            <SelectValue placeholder={question.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map((option: string) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : question.type === 'date' ? (
        <div className="mt-1" key={inputKey}>
          <DatePicker 
            date={answer ? new Date(answer) : undefined}
            setDate={(date) => onChange(question.id, date ? date.toISOString().split('T')[0] : '')}
            placeholder={question.placeholder || "Select a date"}
            className={`border-input shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
          />
        </div>
      ) : (
        <Input 
          id={question.id}
          type={question.type === 'email' ? 'email' : question.type === 'phone' ? 'tel' : 'text'}
          placeholder={question.placeholder}
          value={answer}
          onChange={(e) => onChange(question.id, e.target.value)}
          className={`mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
        />
      )}
      {hasError && (
        <p className="mt-1 text-sm text-red-600">This field is required</p>
      )}
      
      {/* AI Credit Dialog */}
      <AiCreditDialog
        isOpen={showCreditDialog}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        onUpgrade={handleUpgrade}
        creditsRemaining={creditsRemaining}
      />
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
} 