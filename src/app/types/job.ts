/**
 * Job interface representing a job posting in the application
 * Matches the Python backend JobBase model with camelCase fields
 */
export interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  companyDescription?: string;
  companyUrl?: string;
  location?: string;
  salaryMinRange?: number;
  salaryMaxRange?: number;
  salaryCurrency?: string;
  jobType?: string;
  description?: string;
  postedDate?: string;
  experienceLevel?: string;
  specialization?: string;
  responsibilities: string[];
  requirements: string[];
  jobUrl?: string;
  skills: string[];
  shortResponsibilities?: string;
  shortQualifications?: string;
  isRemote: boolean;
  isVerified: boolean;
  isSponsored: boolean;
  providesSponsorship: boolean;
  expired: boolean;
} 

// Job Types
export const JOB_TYPE_OPTIONS = [
  { value: 'fulltime', label: 'Full-time' },
  { value: 'parttime', label: 'Part-time' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
] as const;

export type JobType = typeof JOB_TYPE_OPTIONS[number]['value'];
  
  // Location Types
  export const LOCATION_TYPE_OPTIONS = [
    // US Locations
    { value: 'new-york-ny', label: 'New York, NY' },
    { value: 'mountain-view-ca', label: 'Mountain View, CA' },
    { value: 'san-francisco-ca', label: 'San Francisco, CA' },
    { value: 'san-jose-ca', label: 'San Jose, CA' },
    { value: 'sunnyvale-ca', label: 'Sunnyvale, CA' },
    { value: 'san-mateo-ca', label: 'San Mateo, CA' },
    { value: 'redwood-city-ca', label: 'Redwood City, CA' },
    { value: 'palo-alto-ca', label: 'Palo Alto, CA' },
    { value: 'menlo-park-ca', label: 'Menlo Park, CA' },
    { value: 'foster-city-ca', label: 'Foster City, CA' },
    { value: 'belmont-ca', label: 'Belmont, CA' },
    { value: 'bellevue-wa', label: 'Bellevue, WA' },
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
    { value: 'remote', label: 'Remote' }
  ] as const;
  
  export type LocationType = typeof LOCATION_TYPE_OPTIONS[number]['value'];
  
  // Role Levels
  export const ROLE_LEVEL_OPTIONS = [
    { value: 'internship', label: 'Intern & Co-op' },
    { value: 'entry', label: 'Entry Level & New Grad' },
    { value: 'associate', label: 'Junior (1-3 years)' },
    { value: 'mid-senior', label: 'Senior (3-5 years)' },
    { value: 'director', label: 'Director & Lead' },
    { value: 'executive', label: 'Executive' }
  ] as const;
  
  export type RoleLevel = typeof ROLE_LEVEL_OPTIONS[number]['value'];
  
  // Industry Specializations
  export const INDUSTRY_SPECIALIZATION_OPTIONS = [
    { value: 'backend', label: 'Backend Engineer' },
    { value: 'frontend', label: 'Frontend Engineer' },
    { value: 'fullstack', label: 'Full Stack Engineer' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'devops', label: 'DevOps & Infrastructure' },
    { value: 'data_science', label: 'Data Science' },
    { value: 'data_engineer', label: 'Data Engineer' },
    { value: 'ml_ai', label: 'Machine Learning & AI' },
    { value: 'product', label: 'Product Management' },
    { value: 'ux_ui', label: 'UX/UI Design' },
    { value: 'qa', label: 'QA & Testing' },
    { value: 'security', label: 'Security Engineer' },
    { value: 'cloud', label: 'Cloud Computing' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'game_dev', label: 'Game Development' },
    { value: 'ar_vr', label: 'AR/VR Development' },
    { value: 'embedded', label: 'Embedded Systems' },
    { value: 'iot', label: 'IoT Engineer' },
    { value: 'robotics', label: 'Robotics' },
    { value: 'fintech', label: 'Fintech' },
    { value: 'healthtech', label: 'Healthtech' },
    { value: 'edtech', label: 'Edtech' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'martech', label: 'Marketing Technology' },
    { value: 'enterprise', label: 'Enterprise Software' }
  ] as const;
  
  export const RELATED_SPECIALIZATIONS_MAP = {
    'frontend': ['fullstack', 'ux_ui'],
    'backend': ['fullstack', 'devops', 'security'],
    'fullstack': ['frontend', 'backend'],
    'mobile': ['frontend', 'game_dev', 'ar_vr'],
    'devops': ['backend', 'cloud', 'security'],
    'ml_ai': ['data_science', 'data_engineer'],
    'data_science': ['ml_ai', 'data_engineer'],
    'ux_ui': ['frontend', 'product'],
    'qa': ['backend'],
    'security': ['backend', 'devops'],
    'data_engineer': ['backend', 'data_science', 'ml_ai'],
    'product': ['ux_ui'],
    'cloud': ['devops', 'backend'],
    'blockchain': ['backend', 'security', 'fintech'],
    'game_dev': ['frontend', 'mobile', 'ar_vr'],
    'ar_vr': ['frontend', 'mobile', 'game_dev'],
    'embedded': ['backend', 'iot'],
    'iot': ['embedded', 'backend', 'cloud'],
    'robotics': ['embedded', 'ml_ai', 'iot'],
    'fintech': ['backend', 'security', 'data_science'],
    'healthtech': ['backend', 'data_science', 'ml_ai'],
    'edtech': ['frontend', 'backend', 'product'],
    'ecommerce': ['frontend', 'backend', 'product'],
    'martech': ['frontend', 'data_science', 'product'],
    'enterprise': ['backend', 'devops', 'security']
} as const;

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