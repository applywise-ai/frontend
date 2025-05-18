export enum FieldName {
  // Personal Information
  RESUME = 'resume',
  RESUME_FILENAME = 'resumeFilename',
  FULL_NAME = 'fullName',
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  CITY = 'city',
  PROVINCE = 'province',
  COUNTRY = 'country',
  POSTAL_CODE = 'postalCode',
  ADDRESS_LINE1 = 'addressLine1',
  CURRENT_LOCATION = 'currentLocation',
  
  // Social Links
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  GITHUB = 'github',
  PORTFOLIO = 'portfolio',
  OTHER = 'other',
  
  // Demographics
  GENDER = 'gender',
  VETERAN = 'veteran',
  SEXUALITY = 'sexuality',
  RACE = 'race',
  HISPANIC = 'hispanic',
  DISABILITY = 'disability',
  TRANS = 'trans',
  
  // Work Eligibility
  ELIGIBLE_CANADA = 'eligibleCanada',
  ELIGIBLE_US = 'eligibleUS',
  US_SPONSORHIP = 'usSponsorship',
  CA_SPONSORHIP = 'caSponsorship',
  OVER_18 = 'over18',
  
  // Job Preferences
  NOTICE_PERIOD = 'noticePeriod',
  EXPECTED_SALARY = 'expectedSalary',
  JOB_TYPES = 'jobTypes',
  LOCATION_PREFERENCES = 'locationPreferences',
  ROLE_LEVEL = 'roleLevel',
  INDUSTRY_SPECIALIZATIONS = 'industrySpecializations',
  COMPANY_SIZE = 'companySize',
  
  // Education
  EDUCATION = 'education',
  SCHOOL = 'school',
  DEGREE = 'degree',
  FIELD_OF_STUDY = 'fieldOfStudy',
  EDUCATION_FROM = 'educationFrom',
  EDUCATION_TO = 'educationTo',
  
  // Employment
  EMPLOYMENT = 'employment',
  COMPANY = 'company',
  POSITION = 'position',
  EMPLOYMENT_FROM = 'employmentFrom',
  EMPLOYMENT_TO = 'employmentTo',
  EMPLOYMENT_DESCRIPTION = 'employmentDescription',
  EMPLOYMENT_LOCATION = 'employmentLocation',
  
  // Skills
  SKILLS = 'skills',
  
  // Other
  ACKNOWLEDGE = 'acknowledge',
  SOURCE = 'source',
  WORKDAY_EMAIL = 'workdayEmail',
  WORKDAY_PASSWORD = 'workdayPassword',
}

export interface Education {
  [FieldName.SCHOOL]: string;
  [FieldName.DEGREE]: string;
  [FieldName.FIELD_OF_STUDY]: string;
  [FieldName.EDUCATION_FROM]: string;
  [FieldName.EDUCATION_TO]: string;
}

export interface Employment {
  [FieldName.COMPANY]: string;
  [FieldName.POSITION]: string;
  [FieldName.EMPLOYMENT_FROM]: string;
  [FieldName.EMPLOYMENT_TO]: string;
  [FieldName.EMPLOYMENT_DESCRIPTION]: string;
  [FieldName.EMPLOYMENT_LOCATION]?: string;
}

export interface UserProfile {
  // Personal Information
  [FieldName.RESUME]?: string;
  [FieldName.RESUME_FILENAME]?: string;
  [FieldName.FULL_NAME]: string;
  [FieldName.EMAIL]: string;
  [FieldName.PHONE_NUMBER]: string;
  [FieldName.CITY]?: string;
  [FieldName.PROVINCE]?: string;
  [FieldName.COUNTRY]?: string;
  [FieldName.POSTAL_CODE]?: string;
  [FieldName.ADDRESS_LINE1]?: string;
  [FieldName.CURRENT_LOCATION]?: string;
  
  // Social Links
  [FieldName.LINKEDIN]?: string;
  [FieldName.TWITTER]?: string;
  [FieldName.GITHUB]?: string;
  [FieldName.PORTFOLIO]?: string;
  [FieldName.OTHER]?: string;
  
  // Demographics
  [FieldName.GENDER]?: string;
  [FieldName.VETERAN]?: boolean;
  [FieldName.SEXUALITY]?: string[];
  [FieldName.RACE]?: string[];
  [FieldName.HISPANIC]?: boolean;
  [FieldName.DISABILITY]?: boolean;
  [FieldName.TRANS]?: boolean;
  
  // Work Eligibility
  [FieldName.ELIGIBLE_CANADA]?: boolean;
  [FieldName.ELIGIBLE_US]?: boolean;
  [FieldName.US_SPONSORHIP]?: boolean;
  [FieldName.CA_SPONSORHIP]?: boolean;
  [FieldName.OVER_18]?: boolean;
  
  // Job Preferences
  [FieldName.NOTICE_PERIOD]?: string;
  [FieldName.EXPECTED_SALARY]?: number;
  [FieldName.JOB_TYPES]?: string[];
  [FieldName.LOCATION_PREFERENCES]?: string[];
  [FieldName.ROLE_LEVEL]?: string;
  [FieldName.INDUSTRY_SPECIALIZATIONS]?: string[];
  [FieldName.COMPANY_SIZE]?: string[];
  
  // Education
  [FieldName.EDUCATION]: Education[];
  
  // Employment
  [FieldName.EMPLOYMENT]?: Employment[];
  
  // Skills
  [FieldName.SKILLS]: string[];
  
  // Other
  [FieldName.ACKNOWLEDGE]?: boolean;
  [FieldName.SOURCE]?: string;
  [FieldName.WORKDAY_EMAIL]?: string;
  [FieldName.WORKDAY_PASSWORD]?: string;
}

// Options for select fields
export const genderOptions = ['Man', 'Woman', 'Non-binary', 'Prefer not to say'];
export const raceOptions = ['White', 'Black', 'East Asian', 'South Asian', 'Southeast Asian', 'Middle Eastern', 'Indigenous', 'Pacific Islander', 'Other', 'Prefer not to say'];
export const sexualityOptions = ['Heterosexual', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Other', 'Prefer not to say'];
export const degreeOptions = ['High School', 'Associate\'s Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Other'];
export const noticePeriodOptions = ['Immediately', '2 weeks', '4 weeks', '8 weeks', '3 months', 'More than 3 months'];
export const sourceOptions = ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Job Board', 'University/College', 'Other'];
export const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship'];
export const locationOptions = ['Remote', 'Hybrid', 'On-site'];

// New options for job preferences
export const roleLevelOptions = [
  'Entry Level & New Grad',
  'Junior (1-3 years)',
  'Mid-Level (3-5 years)',
  'Senior (5-8 years)',
  'Lead/Principal (8+ years)',
  'Manager',
  'Director',
  'VP/Executive'
];

export const industrySpecializationOptions = [
  'Backend Engineering',
  'Frontend Engineering',
  'Full Stack Engineering',
  'Mobile Development',
  'DevOps & Infrastructure',
  'Data Science',
  'Data Engineering',
  'Machine Learning & AI',
  'Product Management',
  'UX/UI Design',
  'QA & Testing',
  'Security Engineering',
  'Cloud Computing',
  'Blockchain',
  'Game Development',
  'AR/VR Development',
  'Embedded Systems',
  'IoT Engineering',
  'Robotics',
  'Fintech',
  'Healthtech',
  'Edtech',
  'E-commerce',
  'Marketing Technology',
  'Enterprise Software'
];

export const companySizeOptions = [
  'Startup (1-50 employees)',
  'Small (51-200 employees)',
  'Medium (201-1000 employees)',
  'Large (1001-5000 employees)',
  'Enterprise (5000+ employees)'
]; 