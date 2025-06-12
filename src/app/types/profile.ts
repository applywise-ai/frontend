// Re-export job-related types
export type {
  JobType,
  LocationType,
  RoleLevel,
  IndustrySpecialization,
  CompanySize,
  DegreeType
} from './job';

export {
  JOB_TYPE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  ROLE_LEVEL_OPTIONS,
  INDUSTRY_SPECIALIZATION_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  DEGREE_OPTIONS
} from './job';

export enum FieldName {
  // Personal Information
  RESUME = 'resume',
  RESUME_FILENAME = 'resumeFilename',
  RESUME_URL = 'resumeUrl',
  RESUME_AUTOFILL = 'resumeAutofill',
  FULL_NAME = 'fullName',
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  CURRENT_LOCATION = 'currentLocation',
  
  // Social Links
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  GITHUB = 'github',
  PORTFOLIO = 'portfolio',
  
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
  
  // Notification Preferences
  NEW_JOB_MATCHES = 'newJobMatches',
  AUTO_APPLY_WITHOUT_REVIEW = 'autoApplyWithoutReview',
  IGNORE_PARTIAL_PROFILE_ALERT = 'ignorePartialProfileAlert',
  
  // Subscription
  IS_PRO_MEMBER = 'isProMember',
  AI_CREDITS = 'aiCredits',
  
  // Education
  EDUCATION = 'education',
  SCHOOL = 'school',
  DEGREE = 'degree',
  FIELD_OF_STUDY = 'fieldOfStudy',
  EDUCATION_FROM = 'educationFrom',
  EDUCATION_TO = 'educationTo',
  EDUCATION_GPA = 'educationGpa',
  TEMP_EDUCATION = 'tempEducation',
  
  // Employment
  EMPLOYMENT = 'employment',
  COMPANY = 'company',
  POSITION = 'position',
  EMPLOYMENT_FROM = 'employmentFrom',
  EMPLOYMENT_TO = 'employmentTo',
  EMPLOYMENT_DESCRIPTION = 'employmentDescription',
  EMPLOYMENT_LOCATION = 'employmentLocation',
  TEMP_EMPLOYMENT = 'tempEmployment',
  
  // Skills
  SKILLS = 'skills',
  
  // Other
  SOURCE = 'source',
  
  // Projects
  PROJECTS = 'projects',
  PROJECT_NAME = 'projectName',
  PROJECT_DESCRIPTION = 'projectDescription',
  PROJECT_LINK = 'projectLink',
  TEMP_PROJECT = 'tempProject',
  
  // Job Feedback
  LIKED_JOBS = 'likedJobs',
  DISLIKED_JOBS = 'dislikedJobs',
}

export interface Education {
  [FieldName.SCHOOL]: string;
  [FieldName.DEGREE]: string;
  [FieldName.FIELD_OF_STUDY]: string;
  [FieldName.EDUCATION_FROM]: string;
  [FieldName.EDUCATION_TO]: string;
  [FieldName.EDUCATION_GPA]?: string;
}

export interface Employment {
  [FieldName.COMPANY]: string;
  [FieldName.POSITION]: string;
  [FieldName.EMPLOYMENT_FROM]: string;
  [FieldName.EMPLOYMENT_TO]: string;
  [FieldName.EMPLOYMENT_DESCRIPTION]: string;
  [FieldName.EMPLOYMENT_LOCATION]?: string;
}

export interface Project {
  [FieldName.PROJECT_NAME]: string;
  [FieldName.PROJECT_DESCRIPTION]: string;
  [FieldName.PROJECT_LINK]?: string;
}

export interface UserProfile {
  // Personal Information
  [FieldName.RESUME]?: string;
  [FieldName.RESUME_FILENAME]?: string;
  [FieldName.RESUME_URL]?: string;
  [FieldName.RESUME_AUTOFILL]?: boolean;
  [FieldName.FULL_NAME]: string;
  [FieldName.EMAIL]: string;
  [FieldName.PHONE_NUMBER]: string;
  [FieldName.CURRENT_LOCATION]?: string;
  
  // Social Links
  [FieldName.LINKEDIN]?: string;
  [FieldName.TWITTER]?: string;
  [FieldName.GITHUB]?: string;
  [FieldName.PORTFOLIO]?: string;
  
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
  
  // Notification Preferences
  [FieldName.NEW_JOB_MATCHES]?: boolean;
  [FieldName.AUTO_APPLY_WITHOUT_REVIEW]?: boolean;
  [FieldName.IGNORE_PARTIAL_PROFILE_ALERT]?: boolean;
  
  // Subscription
  [FieldName.IS_PRO_MEMBER]?: boolean;
  [FieldName.AI_CREDITS]?: number;
  
  // Education
  [FieldName.EDUCATION]?: Education[];
  [FieldName.TEMP_EDUCATION]?: Education;
  
  // Employment
  [FieldName.EMPLOYMENT]?: Employment[];
  [FieldName.TEMP_EMPLOYMENT]?: Employment;
  
  // Skills
  [FieldName.SKILLS]: string[];
  
  // Other
  [FieldName.SOURCE]?: string;
  
  // Projects
  [FieldName.PROJECTS]?: Project[];
  [FieldName.TEMP_PROJECT]?: Project;
  
  // Job Feedback
  [FieldName.LIKED_JOBS]?: string[];
  [FieldName.DISLIKED_JOBS]?: string[];
}

// Options for select fields
export const genderOptions = ['Man', 'Woman', 'Non-binary', 'Prefer not to say'];
export const raceOptions = ['White', 'Black', 'East Asian', 'South Asian', 'Southeast Asian', 'Middle Eastern', 'Indigenous', 'Pacific Islander', 'Other', 'Prefer not to say'];
export const sexualityOptions = ['Heterosexual', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Other', 'Prefer not to say'];
export const noticePeriodOptions = ['Immediately', '2 weeks', '4 weeks', '8 weeks', '3 months', 'More than 3 months'];
export const sourceOptions = ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Job Board', 'University/College', 'Applywise', 'Other'];

