import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Calendar, 
  HelpCircle,
  MessageCircle,
  Globe,
  BookOpen,
  FileSpreadsheet
} from 'lucide-react';
import { Label } from '@/app/components/ui/label';
import { FormQuestion, FormSection } from './QuestionInput';
import { ReactNode } from 'react';

interface QuestionLabelProps {
  htmlFor: string;
  required?: boolean;
  section?: FormSection;
  children: ReactNode;
}

export function QuestionLabel({ htmlFor, required = false, section, children }: QuestionLabelProps) {
  return (
    <Label 
      htmlFor={htmlFor} 
      className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium text-gray-700"
    >
      <div className="flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gray-100">
        {getQuestionIcon(htmlFor, section)}
      </div>
      <span className="leading-tight">
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
    </Label>
  );
}

// Legacy version for backward compatibility
export function LegacyQuestionLabel({ question }: { question: FormQuestion }) {
  return (
    <QuestionLabel
      htmlFor={question.id}
      required={question.required || false}
      section={question.section}
    >
      {question.question}
    </QuestionLabel>
  );
}

// Function to get the appropriate icon based on question ID or type
function getQuestionIcon(id: string, section?: FormSection) {
  const iconColor = getIconColorBySection(section || 'personal');
  
  // First check specific field IDs
  switch (id) {
    case 'fullName': return <User className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'email': return <Mail className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'phone': return <Phone className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'currentCompany': return <Building className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'currentRole': return <Briefcase className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'yearsOfExperience': return <Clock className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'desiredSalary': return <DollarSign className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'availableStartDate': return <Calendar className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'resume': return <FileSpreadsheet className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'coverLetter': return <MessageCircle className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'referredBy': return <Globe className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'whyJoin': return <MessageCircle className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'challengingProject': return <BookOpen className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'workEnvironment': return <Building className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'relocation': return <Globe className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    case 'salaryExpectations': return <DollarSign className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
    default: return <HelpCircle className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${iconColor}`} />;
  }
}

// Helper to get icon color based on question section
function getIconColorBySection(section: FormSection): string {
  switch (section) {
    case 'personal': return 'text-blue-600';
    case 'resume': return 'text-green-600';
    case 'application': return 'text-indigo-600';
    case 'screening': return 'text-teal-600';
    case 'custom': return 'text-amber-600';
    default: return 'text-gray-500';
  }
} 