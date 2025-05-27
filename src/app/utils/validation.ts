import { Employment, Education, FieldName, Project } from '@/app/types/profile';

type ValidationRule = {
  required?: boolean;
  pattern?: RegExp;
  maxLength?: number;
  customMessage?: string;
  validate?: (value: string) => boolean;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
};

export const validate = <T extends Record<string, string | undefined>>(
  data: Partial<T>,
  rules: ValidationRules<T>
): Partial<Record<string, string>> => {
  const errors: Partial<Record<string, string>> = {};
  
  Object.entries(rules).forEach(([field, rule]) => {
    if (!rule) return;
    
    const value = data[field as keyof T];
    
    if (rule.required && !value) {
      errors[field] = "This field is required";
    }
    
    if (value) {
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.customMessage;
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = rule.customMessage;
      }
      
      if (rule.validate && !rule.validate(value)) {
        errors[field] = rule.customMessage;
      }
    }
  });
  
  return errors;
};

const employmentRules: ValidationRules<Employment> = {
  [FieldName.COMPANY]: {
    required: true
  },
  [FieldName.POSITION]: {
    required: true
  },
  [FieldName.EMPLOYMENT_FROM]: {
    required: true,
    pattern: /^\d{2}\/\d{4}$/,
    customMessage: 'Start date must be in MM/YYYY format'
  },
  [FieldName.EMPLOYMENT_DESCRIPTION]: {
    required: true,
    maxLength: 1000,
    customMessage: 'Description must be less than 1000 characters'
  },
  [FieldName.EMPLOYMENT_LOCATION]: {
    maxLength: 100,
    customMessage: 'Location must be less than 100 characters'
  }
};

const educationRules: ValidationRules<Education> = {
  [FieldName.SCHOOL]: {
    required: true,
    maxLength: 100,
    customMessage: 'School name must be less than 100 characters'
  },
  [FieldName.DEGREE]: {
    required: true
  },
  [FieldName.FIELD_OF_STUDY]: {
    required: true,
    maxLength: 100,
    customMessage: 'Field of study must be less than 100 characters'
  },
  [FieldName.EDUCATION_FROM]: {
    required: true,
    pattern: /^\d{2}\/\d{4}$/,
    customMessage: 'Start date must be in MM/YYYY format'
  },
  [FieldName.EDUCATION_GPA]: {
    validate: (value: string) => {
      if (!value) return true; // GPA is optional
      const gpa = parseFloat(value);
      return !isNaN(gpa) && gpa >= 0 && gpa <= 4.0;
    },
    customMessage: 'GPA must be a number between 0 and 4.0'
  }
};

const projectRules: ValidationRules<Project> = {
  [FieldName.PROJECT_NAME]: {
    required: true
  },
  [FieldName.PROJECT_DESCRIPTION]: {
    required: true
  }
};

export const validateEmployment = (employment: Partial<Employment>): Partial<Record<string, string>> => {
  return validate(employment, employmentRules);
};

export const validateEducation = (education: Partial<Education>): Partial<Record<string, string>> => {
  return validate(education, educationRules);
}; 

export const validateProject = (project: Partial<Project>): Partial<Record<string, string>> => {
  return validate(project, projectRules);
};