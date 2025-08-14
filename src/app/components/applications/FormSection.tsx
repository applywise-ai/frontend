import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { FormQuestion, FormSectionType } from '@/app/types/application';
import { QuestionLabel } from './QuestionLabel';
import { QuestionInput } from './QuestionInput';
import { User, FileText, CheckSquare, ListFilter, FileSpreadsheet, Users } from 'lucide-react';

interface FormSectionProps {
  title: string;
  questions: FormQuestion[];
  onAnswerChange: (id: string, value: string | Partial<FormQuestion>) => void;
  answers: {[key: string]: FormQuestion};
  section: FormSectionType;
  onPreview?: (section?: FormSectionType) => void;
  validationErrors?: string[];
  fieldRefs?: {[key: string]: React.RefObject<HTMLDivElement | null>};
  onSuccess?: (message: string) => void;
  applicationId?: string;
  jobId?: string; // Add jobId prop for AI generation
}

// Get section style based on section type
function getSectionStyle(section?: FormSectionType) {
  switch (section) {
    case 'personal':
      return {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-100',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        icon: <User className="h-5 w-5" />
      };
    case 'education':
      return {
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-100',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        icon: <FileText className="h-5 w-5" />
      };
    case 'experience':
      return {
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-100',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        icon: <CheckSquare className="h-5 w-5" />
      };
    case 'resume':
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-100',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        icon: <FileSpreadsheet className="h-5 w-5" />
      };
    case 'cover_letter':
      return {
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-100',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        icon: <FileText className="h-5 w-5" />
      };
    case 'additional':
      return {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-100',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        icon: <ListFilter className="h-5 w-5" />
      };
    case 'demographic':
      return {
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-100',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        icon: <Users className="h-5 w-5" />
      };
    default:
      return {
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-100',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        icon: <ListFilter className="h-5 w-5" />
      };
  }
}

export const FormSection = React.memo(function FormSection(props: FormSectionProps) {
  const {
    title, questions, onAnswerChange, section, onPreview,
    validationErrors, fieldRefs, onSuccess, applicationId, jobId
  } = props;

  // Don't render anything if there are no questions
  if (!questions || questions.length === 0) {
    return null;
  }

  // Get section styling
  const style = getSectionStyle(section);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className={`pb-4 ${style.bgColor} border-b ${style.borderColor}`}>
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <div className={`rounded-full p-1.5 mr-3 ${style.iconBg} ${style.iconColor}`}>
            {style.icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.unique_label_id} className="space-y-1.5">
              <QuestionLabel
                htmlFor={question.unique_label_id}
                required={question.required || false}
                section={question.section}
              >
                {question.question}
              </QuestionLabel>
              <QuestionInput
                key={`${section}-${question.unique_label_id}`}
                question={question}
                onChange={onAnswerChange}
                onPreview={onPreview}
                hasError={validationErrors?.includes(question.unique_label_id)}
                inputRef={fieldRefs?.[question.unique_label_id]}
                onSuccess={onSuccess}
                applicationId={applicationId}
                jobId={jobId}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});