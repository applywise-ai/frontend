import { UserProfile, FieldName, Project, Education, Employment } from '@/app/types/profile';

export type ProfileCompletionState = 'complete' | 'partial' | 'incomplete';

export const emptyProject: Project = {
  [FieldName.PROJECT_NAME]: '',
  [FieldName.PROJECT_DESCRIPTION]: '',
  [FieldName.PROJECT_LINK]: ''
};

export const emptyEducation: Education = {
  [FieldName.COMPANY]: '',
  [FieldName.POSITION]: '',
  [FieldName.EMPLOYMENT_FROM]: '',
  [FieldName.EMPLOYMENT_TO]: '',
  [FieldName.EMPLOYMENT_DESCRIPTION]: '',
  [FieldName.EMPLOYMENT_LOCATION]: '',
};

export const emptyEmployment: Employment = {
  [FieldName.COMPANY]: '',
  [FieldName.POSITION]: '',
  [FieldName.EMPLOYMENT_FROM]: '',
  [FieldName.EMPLOYMENT_TO]: '',
  [FieldName.EMPLOYMENT_DESCRIPTION]: '',
  [FieldName.EMPLOYMENT_LOCATION]: '',
};

const partiallyCompleteFields = [
  FieldName.FULL_NAME,
  FieldName.EMAIL,
  FieldName.PHONE_NUMBER,
  FieldName.CURRENT_LOCATION,
  FieldName.EDUCATION,
  FieldName.EMPLOYMENT,
  FieldName.SKILLS,
  FieldName.ELIGIBLE_CANADA,
  FieldName.ELIGIBLE_US,
  FieldName.CA_SPONSORHIP,
  FieldName.US_SPONSORHIP,
  FieldName.EXPECTED_SALARY,
  FieldName.NOTICE_PERIOD,
  FieldName.OVER_18,
];

export const fullyCompleteFields = [
  ...partiallyCompleteFields,
  FieldName.PROJECT,
  FieldName.JOB_TYPES,
  FieldName.LOCATION_PREFERENCES,
  FieldName.ROLE_LEVEL,
  FieldName.INDUSTRY_SPECIALIZATIONS,
  FieldName.COMPANY_SIZE,
  // Social Links
  FieldName.LINKEDIN,
  FieldName.TWITTER,
  FieldName.GITHUB,
  FieldName.PORTFOLIO,
  // Demographics
  FieldName.GENDER,
  FieldName.SEXUALITY,
  FieldName.RACE,
];

export const isFieldFilled = (profile: UserProfile, field: string): boolean => {
  if (field === FieldName.EDUCATION || field === FieldName.EMPLOYMENT ||
    field === FieldName.SKILLS || field === FieldName.PROJECT
  ) {
    const arr = profile[field as keyof UserProfile] as unknown;
    return Array.isArray(arr) && arr.length > 0;
  }
  
  if (field === FieldName.ELIGIBLE_CANADA || field === FieldName.ELIGIBLE_US || 
      field === FieldName.CA_SPONSORHIP || field === FieldName.US_SPONSORHIP ||
      field === FieldName.OVER_18) {
    return profile[field as keyof UserProfile] !== undefined;
  }
  
  if (field === FieldName.JOB_TYPES || field === FieldName.LOCATION_PREFERENCES || 
      field === FieldName.INDUSTRY_SPECIALIZATIONS || field === FieldName.COMPANY_SIZE) {
    const arr = profile[field as keyof UserProfile] as string[] | undefined;
    return Array.isArray(arr) && arr.length > 0;
  }

  // Check if at least one social link is filled out
  if (field === FieldName.LINKEDIN || field === FieldName.TWITTER || 
      field === FieldName.GITHUB || field === FieldName.PORTFOLIO) {
    return Boolean(profile[FieldName.LINKEDIN]) || 
           Boolean(profile[FieldName.TWITTER]) || 
           Boolean(profile[FieldName.GITHUB]) || 
           Boolean(profile[FieldName.PORTFOLIO])
  }

  return Boolean(profile[field as keyof UserProfile]);
};

// Helper function to get label from value
export const getLabelFromValue = (value: string, options: readonly { readonly value: string; readonly label: string }[]) => {
  return options.find(option => option.value === value)?.label || value;
};

export const getProfileCompletionState = (profile: UserProfile): ProfileCompletionState => {
  // Check if all partially complete fields are filled
  const hasPartiallyCompleteFields = partiallyCompleteFields.every(field => isFieldFilled(profile, field));
  
  if (!hasPartiallyCompleteFields) {
    return 'incomplete';
  }
  
  // Check if all fully complete fields are filled
  const hasFullyCompleteFields = fullyCompleteFields.every(field => isFieldFilled(profile, field));
  
  return hasFullyCompleteFields ? 'complete' : 'partial';
};

export const calculateCompletionPercentage = (profile: UserProfile): number => {
  const totalFields = fullyCompleteFields.length;
  const filledFields = fullyCompleteFields.filter((field: string) => isFieldFilled(profile, field)).length;
  return Math.round((filledFields / totalFields) * 100);
};

// The id's match the refs in app/profile/page.tsx
export const getNextSectionToFill = (profile: UserProfile, profileState: ProfileCompletionState) => {
  if (profileState === 'complete') return null;

  // Check partially complete fields first
  if (!profile[FieldName.RESUME] || !profile[FieldName.RESUME_FILENAME]) {
    return { name: 'Resume', id: 'resume' };
  }
  if (!profile[FieldName.FULL_NAME] || !profile[FieldName.EMAIL] || !profile[FieldName.PHONE_NUMBER] ||
    !profile[FieldName.CURRENT_LOCATION]
  ) {
    return { name: 'Personal Info', id: 'personal' };
  }
  if (!profile[FieldName.EDUCATION]?.length) {
    return { name: 'Education', id: 'education' };
  }
  if (!profile[FieldName.EMPLOYMENT]?.length) {
    return { name: 'Employment', id: 'employment' };
  }
  if (!profile[FieldName.PROJECT]?.length) {
    return { name: 'Projects', id: 'projects' };
  }
  if (!profile[FieldName.SKILLS]?.length) {
    return { name: 'Skills', id: 'skills' };
  }
  if (profile[FieldName.ELIGIBLE_CANADA] == undefined || profile[FieldName.ELIGIBLE_US] == undefined ||
      profile[FieldName.CA_SPONSORHIP] == undefined || profile[FieldName.US_SPONSORHIP] == undefined ||
      profile[FieldName.OVER_18]  == undefined) {
    return { name: 'Work Eligibility', id: 'eligibility' };
  }
  if (!profile[FieldName.EXPECTED_SALARY]) {
    return { name: 'Expected Salary', id: 'preferences' };
  }
  if (!profile[FieldName.NOTICE_PERIOD]) {
    return { name: 'Notice Period', id: 'preferences' };
  }

  // If partially complete, check fully complete fields
  if (profileState === 'partial') {
    if (!profile[FieldName.JOB_TYPES]?.length || !profile[FieldName.LOCATION_PREFERENCES]?.length ||
        !profile[FieldName.ROLE_LEVEL] || !profile[FieldName.INDUSTRY_SPECIALIZATIONS]?.length ||
        !profile[FieldName.COMPANY_SIZE]?.length) {
      return { name: 'Job Preferences', id: 'preferences' };
    }
    if (!profile[FieldName.LINKEDIN] && !profile[FieldName.TWITTER] && !profile[FieldName.GITHUB] &&
        !profile[FieldName.PORTFOLIO]) {
      return { name: 'Social Links', id: 'social' };
    }
    if (!profile[FieldName.GENDER] || !profile[FieldName.RACE]?.length) {
      return { name: 'Demographics', id: 'demographics' };
    }
  }

  return null;
}; 

/**
 * Check if the user profile has enough details to generate personalized recommendations
 * Returns true if the profile has the minimum required fields for scoring
 */
export function hasEnoughProfileDetailsForRecommendations(profile: UserProfile | null): boolean {
  if (!profile) return false;

  // Check for required fields that are used in the scoring algorithm
  const hasExperienceLevel = !!profile.roleLevel;
  const hasSpecializations = !!(profile.industrySpecializations && profile.industrySpecializations.length > 0);
  const hasJobTypes = !!(profile.jobTypes && profile.jobTypes.length > 0);
  const hasSkills = !!(profile.skills && profile.skills.length > 0);
  const hasLocationPreferences = !!(profile.locationPreferences && profile.locationPreferences.length > 0);

  // We need at least 3 out of 5 key fields to generate meaningful recommendations
  const requiredFields = [hasExperienceLevel, hasSpecializations, hasJobTypes, hasSkills, hasLocationPreferences];
  const filledFields = requiredFields.filter(Boolean).length;

  return filledFields >= 3;
}

/**
 * Get a list of missing profile fields that are needed for recommendations
 */
export function getMissingProfileFields(profile: UserProfile | null): string[] {
  if (!profile) return ['Complete profile setup'];

  const missingFields: string[] = [];

  if (!profile.roleLevel) {
    missingFields.push('Experience level');
  }

  if (!profile.industrySpecializations || profile.industrySpecializations.length === 0) {
    missingFields.push('Industry specializations');
  }

  if (!profile.jobTypes || profile.jobTypes.length === 0) {
    missingFields.push('Job type preferences');
  }

  if (!profile.skills || profile.skills.length === 0) {
    missingFields.push('Skills');
  }

  if (!profile.locationPreferences || profile.locationPreferences.length === 0) {
    missingFields.push('Location preferences');
  }

  return missingFields;
} 