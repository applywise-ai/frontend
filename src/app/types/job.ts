import { Timestamp } from "firebase/firestore";

/**
 * Job interface representing a job posting in the application
 */
export interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  salaryValue: number; // Numeric value for filtering
  jobType: string;
  postedDate: string | Timestamp;
  description: string;
  isVerified?: boolean;
  isSponsored?: boolean;
  providesSponsorship?: boolean;
  experienceLevel: string;
  specialization?: string;
  responsibilities?: string[];
  requirements?: string[];
  jobUrl?: string;
  score?: number; // For personalized recommendations
  tags?: string[]; // Tags for job categorization
  shortResponsibilities?: string; // Concise summary of responsibilities
  shortQualifications?: string; // Concise summary of qualifications
  expired?: boolean; // Whether the job posting has expired
} 

// Job Types
export const JOB_TYPE_OPTIONS = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
  ] as const;
  
  export type JobType = typeof JOB_TYPE_OPTIONS[number]['value'];
  
  // Location Types
  export const LOCATION_TYPE_OPTIONS = [
    // US Locations
    { value: 'new-york-ny', label: 'New York, NY' },
    { value: 'san-francisco-ca', label: 'San Francisco, CA' },
    { value: 'seattle-wa', label: 'Seattle, WA' },
    { value: 'austin-tx', label: 'Austin, TX' },
    { value: 'boston-ma', label: 'Boston, MA' },
    { value: 'los-angeles-ca', label: 'Los Angeles, CA' },
    { value: 'chicago-il', label: 'Chicago, IL' },
    { value: 'denver-co', label: 'Denver, CO' },
    { value: 'miami-fl', label: 'Miami, FL' },
    { value: 'washington-dc', label: 'Washington, DC' },
    { value: 'portland-or', label: 'Portland, OR' },
    { value: 'atlanta-ga', label: 'Atlanta, GA' },
    { value: 'dallas-tx', label: 'Dallas, TX' },
    { value: 'san-diego-ca', label: 'San Diego, CA' },
    { value: 'nashville-tn', label: 'Nashville, TN' },
    { value: 'philadelphia-pa', label: 'Philadelphia, PA' },
    { value: 'phoenix-az', label: 'Phoenix, AZ' },
    { value: 'minneapolis-mn', label: 'Minneapolis, MN' },
    { value: 'pittsburgh-pa', label: 'Pittsburgh, PA' },
    { value: 'raleigh-nc', label: 'Raleigh, NC' },
    // Canada Locations
    { value: 'toronto-on', label: 'Toronto, ON' },
    { value: 'vancouver-bc', label: 'Vancouver, BC' },
    { value: 'montreal-qc', label: 'Montreal, QC' },
    { value: 'calgary-ab', label: 'Calgary, AB' },
    { value: 'ottawa-on', label: 'Ottawa, ON' },
    { value: 'edmonton-ab', label: 'Edmonton, AB' },
    { value: 'halifax-ns', label: 'Halifax, NS' },
    { value: 'victoria-bc', label: 'Victoria, BC' },
    { value: 'winnipeg-mb', label: 'Winnipeg, MB' },
    { value: 'quebec-city-qc', label: 'Quebec City, QC' },
    { value: 'hamilton-on', label: 'Hamilton, ON' },
    { value: 'kitchener-on', label: 'Kitchener, ON' },
    { value: 'mississauga-on', label: 'Mississauga, ON' },
    { value: 'burnaby-bc', label: 'Burnaby, BC' },
    { value: 'surrey-bc', label: 'Surrey, BC' },
    { value: 'remote', label: 'Remote' },
    { value: 'other', label: 'Other' }
  ] as const;
  
  export type LocationType = typeof LOCATION_TYPE_OPTIONS[number]['value'];
  
  // Role Levels
  export const ROLE_LEVEL_OPTIONS = [
  { value: 'intern', label: 'Intern & Co-op' },
  { value: 'entry', label: 'Entry Level & New Grad' },
  { value: 'junior', label: 'Junior (1-3 years)' },
  { value: 'mid', label: 'Mid-Level (3-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead/Principal (8+ years)' },
  { value: 'manager', label: 'Manager' },
  { value: 'director', label: 'Director' },
  { value: 'executive', label: 'VP/Executive' }
  ] as const;
  
  export type RoleLevel = typeof ROLE_LEVEL_OPTIONS[number]['value'];
  
  // Industry Specializations
  export const INDUSTRY_SPECIALIZATION_OPTIONS = [
  { value: 'backend', label: 'Backend Engineering' },
  { value: 'frontend', label: 'Frontend Engineering' },
  { value: 'fullstack', label: 'Full Stack Engineering' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'devops', label: 'DevOps & Infrastructure' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'data_engineering', label: 'Data Engineering' },
  { value: 'ml_ai', label: 'Machine Learning & AI' },
  { value: 'product', label: 'Product Management' },
  { value: 'ux_ui', label: 'UX/UI Design' },
  { value: 'qa', label: 'QA & Testing' },
  { value: 'security', label: 'Security Engineering' },
  { value: 'cloud', label: 'Cloud Computing' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'game_dev', label: 'Game Development' },
  { value: 'ar_vr', label: 'AR/VR Development' },
  { value: 'embedded', label: 'Embedded Systems' },
  { value: 'iot', label: 'IoT Engineering' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthtech', label: 'Healthtech' },
  { value: 'edtech', label: 'Edtech' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'martech', label: 'Marketing Technology' },
  { value: 'enterprise', label: 'Enterprise Software' }
  ] as const;
  
  export type IndustrySpecialization = typeof INDUSTRY_SPECIALIZATION_OPTIONS[number]['value'];
  
  // Company Sizes
  export const COMPANY_SIZE_OPTIONS = [
  { value: 'startup', label: 'Startup (1-50 employees)' },
  { value: 'small', label: 'Small (51-200 employees)' },
  { value: 'medium', label: 'Medium (201-1000 employees)' },
  { value: 'large', label: 'Large (1001-5000 employees)' },
  { value: 'enterprise', label: 'Enterprise (5000+ employees)' }
  ] as const;
  
  export type CompanySize = typeof COMPANY_SIZE_OPTIONS[number]['value'];
  
  // Education Degrees
  export const DEGREE_OPTIONS = [
  { value: 'high_school', label: 'High School' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'doctorate', label: 'Doctorate' },
  { value: 'other', label: 'Other' }
  ] as const;
  
  export type DegreeType = typeof DEGREE_OPTIONS[number]['value'];

  // Job Filters Interface
  export interface JobFilters {
    query?: string;
    locations?: string[];
    specializations?: string[];
    experienceLevels?: string[];
    minSalary?: number;
    sponsorship?: 'yes' | 'no' | 'any';
    sortBy?: 'recent' | 'salary-high' | 'salary-low';
  }