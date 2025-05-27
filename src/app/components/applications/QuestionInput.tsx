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
import { FileText, Eye, Trash2, Plus } from 'lucide-react';
import { useState, useRef } from 'react';

// Define question types
export type QuestionType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'radio' | 'date' | 'file';
export type FormSection = 'personal' | 'application' | 'screening' | 'custom' | 'resume';
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
  onChange: (id: string, value: string) => void;
  onPreview?: (fileType: FileType) => void;
  hasError?: boolean;
  inputRef?: React.RefObject<HTMLDivElement | null>;
}

// Get appropriate color accent based on section
function getAccentColorClass(section: FormSection): string {
  switch (section) {
    case 'personal': return 'focus-visible:ring-blue-500 hover:border-blue-300';
    case 'application': return 'focus-visible:ring-indigo-500 hover:border-indigo-300';
    case 'resume': return 'focus-visible:ring-green-500 hover:border-green-300';
    case 'screening': return 'focus-visible:ring-teal-500 hover:border-teal-300';
    case 'custom': return 'focus-visible:ring-amber-500 hover:border-amber-300';
    default: return '';
  }
}

// File upload component
function FileQuestionInput({ question, onChange, onPreview, hasError }: QuestionInputProps) {
  const accentColor = getAccentColorClass(question.section);
  const errorBorderClass = hasError ? 'border-red-500 focus-visible:ring-red-500' : '';
  const [fileName, setFileName] = useState<string>(question.answer || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  return (
    <div className="mt-2 space-y-3">
      {fileName ? (
        <div className="flex flex-col md:flex-row lg:flex-col items-stretch md:items-center lg:items-stretch gap-2">
          <button
            type="button"
            onClick={handleClickFileName}
            className="flex-1 flex items-center border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-900 hover:text-white transition-colors group relative"
          >
            <FileText className="h-4 w-4 mr-2 text-gray-500 group-hover:text-white flex-shrink-0" />
            <span className="truncate max-w-[calc(100%-60px)] break-words">{fileName}</span>
            <span className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 px-2 py-1 rounded text-xs font-medium text-white">Change File</span>
          </button>
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
          <div className="w-full sm:w-auto">
            <label 
              htmlFor={`file-${question.id}`}
              className={`flex w-full justify-center items-center gap-1.5 cursor-pointer px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 ${accentColor} ${errorBorderClass}`}
            >
              <Plus className="h-4 w-4" />
              Upload file
            </label>
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

export function QuestionInput({ question, onChange, onPreview, hasError, inputRef }: QuestionInputProps) {
  const accentColor = getAccentColorClass(question.section);
  const errorBorderClass = hasError ? 'border-red-500 focus-visible:ring-red-500' : '';
  
  // Create a unique key for the input to help React keep track
  const inputKey = `${question.id}-${question.type}`;
  
  return (
    <div ref={inputRef}>
      {question.type === 'file' ? (
        <FileQuestionInput question={question} onChange={onChange} onPreview={onPreview} hasError={hasError} />
      ) : question.type === 'textarea' ? (
        <Textarea 
          key={inputKey}
          id={question.id}
          rows={4}
          value={question.answer || ''} 
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          className={`resize-none mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
        />
      ) : question.type === 'select' || question.type === 'radio' ? (
        <Select
          key={inputKey}
          value={question.answer || ''}
          onValueChange={(value: string) => onChange(question.id, value)}
        >
          <SelectTrigger className={`w-full mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}>
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
            date={question.answer ? new Date(question.answer) : undefined}
            setDate={(date) => onChange(question.id, date ? date.toISOString().split('T')[0] : '')}
            placeholder={question.placeholder || "Select a date"}
            className={errorBorderClass}
          />
        </div>
      ) : (
        <Input 
          key={inputKey}
          id={question.id}
          type={question.type === 'email' ? 'email' : question.type === 'phone' ? 'tel' : 'text'}
          placeholder={question.placeholder}
          value={question.answer || ''}
          onChange={(e) => onChange(question.id, e.target.value)}
          className={`mt-1 shadow-sm transition duration-200 ${accentColor} ${errorBorderClass}`}
        />
      )}
      {hasError && (
        <p className="mt-1 text-sm text-red-600">This field is required</p>
      )}
    </div>
  );
} 