import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { FormQuestion, FormSection as FormSectionType, FileType } from './QuestionInput';
import { QuestionLabel } from './QuestionLabel';
import { QuestionInput } from './QuestionInput';
import { User, FileText, CheckSquare, ListFilter, FileSpreadsheet } from 'lucide-react';

interface FormSectionProps {
  title: string;
  questions: FormQuestion[];
  onQuestionChange: (id: string, value: string) => void;
  section: FormSectionType;
  onPreview?: (fileType: FileType) => void;
  validationErrors?: string[];
  fieldRefs?: {[key: string]: React.RefObject<HTMLDivElement | null>};
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
    case 'resume':
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-100',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        icon: <FileSpreadsheet className="h-5 w-5" />
      };
    case 'application':
      return {
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-100',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        icon: <FileText className="h-5 w-5" />
      };
    case 'screening':
      return {
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-100',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-600',
        icon: <CheckSquare className="h-5 w-5" />
      };
    case 'custom':
      return {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-100',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        icon: <ListFilter className="h-5 w-5" />
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

export function FormSection({ title, questions, onQuestionChange, section, onPreview, validationErrors, fieldRefs }: FormSectionProps) {
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
            <div key={question.id} className="space-y-1.5">
              <QuestionLabel
                htmlFor={question.id}
                required={question.required || false}
                section={question.section}
              >
                {question.question}
              </QuestionLabel>
              <QuestionInput
                question={question}
                onChange={onQuestionChange}
                onPreview={onPreview}
                hasError={validationErrors?.includes(question.id)}
                inputRef={fieldRefs?.[question.id]}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 