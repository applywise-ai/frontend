import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { FileText, Eye, Trash2, Plus, Sparkles, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { FormQuestion, FileType, FormSection } from './QuestionInput';

interface FileQuestionInputProps {
  question: FormQuestion;
  onChange: (id: string, value: string) => void;
  onPreview?: (fileType: FileType) => void;
  hasError?: boolean;
  onSuccess?: (message: string) => void;
  isPremium?: boolean;
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

export function FileQuestionInput({ question, onChange, onPreview, hasError, onSuccess, isPremium }: FileQuestionInputProps) {
  const accentColor = getAccentColorClass(question.section);
  const errorBorderClass = hasError ? 'border-red-500 focus-visible:ring-red-500' : '';
  const [fileName, setFileName] = useState<string>(question.answer || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // AI generation state for cover letters
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Check if this is a cover letter file input that should have AI generation
  const shouldShowAiGenerate = isPremium && question.section === 'coverLetter' && question.fileType === 'coverLetter';
  
  console.log(shouldShowAiGenerate)
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange(question.id, file.name);
    }
  };
  
  // Handle file preview
  const handlePreview = () => {
    if (onPreview && question.fileType) {
      onPreview(question.fileType);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback for when onPreview is not provided
      alert(`Preview of ${fileName} would open here`);
    }
  };
  
  // Handle file removal
  const handleRemove = () => {
    setFileName('');
    onChange(question.id, '');
  };
  
  // Trigger file input click
  const handleClickFileName = () => {
    fileInputRef.current?.click();
  };
  
  // AI generation handlers - simplified for premium users
  const handleAiGenerateClick = () => {
    setIsAiMode(true);
  };

  const handleCancelAi = () => {
    setIsAiMode(false);
    setAiPrompt('');
  };
  
  const handleGenerateAi = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual AI API call)
    setTimeout(() => {
      // For cover letters, we'll generate a filename instead of file content
      const generatedFileName = 'AI_Generated_Cover_Letter.pdf';
      setFileName(generatedFileName);
      onChange(question.id, generatedFileName);
      setIsGenerating(false);
      
      // Show success notification
      if (onSuccess) {
        onSuccess('AI cover letter generated successfully!');
        if (onPreview) {
          onPreview(question.fileType || 'coverLetter');
        }
      }
      
      // Exit AI mode after a brief delay
      setTimeout(() => {
        setIsAiMode(false);
        setAiPrompt('');
      }, 500);
    }, 2000);
  };

  // If in AI mode, show the AI generation interface
  if (isAiMode) {
    return (
      <div className="mt-2 space-y-3">
        <div className="space-y-3">
          <Textarea 
            rows={4}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Optional: Add specific details you'd like to include in your AI-generated cover letter (e.g., specific experiences, skills to highlight, company research)..."
            className={`resize-none shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
            disabled={isGenerating}
          />
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelAi}
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
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isGenerating}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-2 space-y-3">
      {fileName ? (
        <div className="flex flex-col md:flex-row lg:flex-col items-stretch md:items-center lg:items-stretch gap-2">
          <div className="flex gap-2 flex-1">
            <button
              type="button"
              onClick={handleClickFileName}
              className="flex-1 flex items-center border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-900 hover:text-white transition-colors group relative"
            >
              <FileText className="h-4 w-4 mr-2 text-gray-500 group-hover:text-white flex-shrink-0" />
              <span className="truncate max-w-[calc(100%-60px)] break-words">{fileName}</span>
              <span className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 px-2 py-1 rounded text-xs font-medium text-white">Change File</span>
            </button>
            {shouldShowAiGenerate && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAiGenerateClick}
                className="h-10 flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4" />
                AI Generate
              </Button>
            )}
          </div>
          <div className="flex flex-row gap-2 w-full md:w-auto lg:w-full">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePreview}
              className={`flex-1 md:flex-none lg:flex-1 min-w-fit flex items-center gap-1.5 ${accentColor} ${errorBorderClass}`}
              disabled={!fileName}
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              className="flex-1 md:flex-none lg:flex-1 min-w-fit flex items-center gap-1.5 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center border border-dashed border-gray-300 rounded-md px-3 py-2 text-sm text-gray-500 bg-gray-50">
            <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>No file selected</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <label 
                htmlFor={`file-${question.id}`}
                className={`h-10 flex w-full justify-center items-center gap-1.5 cursor-pointer px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 ${accentColor} ${errorBorderClass}`}
              >
                <Plus className="h-4 w-4" />
                Upload file
              </label>
            </div>
            {shouldShowAiGenerate && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAiGenerateClick}
                className="h-10 flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4" />
                AI Generate
              </Button>
            )}
          </div>
        </div>
      )}
      
      <Input 
        id={`file-${question.id}`}
        ref={fileInputRef}
        type="file" 
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
} 