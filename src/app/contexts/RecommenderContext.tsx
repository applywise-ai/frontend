'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Job, RELATED_SPECIALIZATIONS_MAP, INDUSTRY_SPECIALIZATION_OPTIONS, JOB_TYPE_OPTIONS, LOCATION_TYPE_OPTIONS } from '@/app/types/job';
import { UserProfile } from '@/app/types/profile';
import { useProfile } from '@/app/contexts/ProfileContext';
import jobsService from '@/app/services/api/jobs';
import { useApplications } from '@/app/contexts/ApplicationsContext';

// New type for jobs with scores
export interface JobWithScore {
  job: Job;
  score: number;
}

interface RecommenderContextType {
  recommendedJobs: JobWithScore[];
  isLoading: boolean;
  fetchedJobs: boolean;
  refreshRecommendations: () => Promise<void>;
  calculateJobScore: (job: Job, userProfile: UserProfile) => number;
  generateRecommendationReasons: (job: Job, userProfile: UserProfile) => string[];
  removeJobFromRecommendations: (jobId: string) => void;
}

const RecommenderContext = createContext<RecommenderContextType | undefined>(undefined);

interface RecommenderProviderProps {
  children: ReactNode;
}

export function RecommenderProvider({ children }: RecommenderProviderProps) {
  const { profile } = useProfile();
  const { applications } = useApplications();
  const [recommendedJobs, setRecommendedJobs] = useState<JobWithScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedJobs, setFetchedJobs] = useState(false);

  // Scoring weights (totaling 100 points)
  const WEIGHTS = {
    SPECIALIZATION: 35,    // Highest priority - specialization match (direct or related)
    JOB_TYPE: 25,         // Second priority - job type preferences
    SKILLS: 25,           // Third priority - skills match
    LOCATION: 10,         // Fourth priority - location preferences
    POSTING_DATE: 5       // Fifth priority - recent postings (reduced since all jobs are recent)
  };

  const calculateJobScore = (job: Job, userProfile: UserProfile): number => {
    let score = 0;

    // 1. SPECIALIZATION SCORING (25 points max)
    if (userProfile.industrySpecializations && userProfile.industrySpecializations.length > 0 && job.specialization) {
      const userSpecs = userProfile.industrySpecializations.map(spec => spec.toLowerCase());
      const jobSpec = job.specialization.toLowerCase();
      
      if (userSpecs.includes(jobSpec)) {
        score += WEIGHTS.SPECIALIZATION; // Direct match - full points
      } else {
        // Check for related specializations using the map
        const hasRelatedSpec = userSpecs.some(userSpec => {
          const relatedSpecs = RELATED_SPECIALIZATIONS_MAP[userSpec as keyof typeof RELATED_SPECIALIZATIONS_MAP] || [];
          return relatedSpecs.some(relatedSpec => relatedSpec === jobSpec);
        });
        if (hasRelatedSpec) {
          score += WEIGHTS.SPECIALIZATION * 0.6; // Related field - 60% points
        }
      }
    }

    // 2. JOB TYPE SCORING (20 points max)
    if (userProfile.jobTypes && userProfile.jobTypes.length > 0 && job.jobType) {
      const userJobTypes = userProfile.jobTypes.map((type: string) => type.toLowerCase());
      const jobType = job.jobType.toLowerCase();
      
      if (userJobTypes.includes(jobType)) {
        score += WEIGHTS.JOB_TYPE; // Perfect match
      } else {
        // Partial scoring for related job types
        if (jobType === 'fulltime' && userJobTypes.includes('parttime')) {
          score += WEIGHTS.JOB_TYPE * 0.7; // Part-time preference but full-time job
        } else if (jobType === 'parttime' && userJobTypes.includes('fulltime')) {
          score += WEIGHTS.JOB_TYPE * 0.8; // Full-time preference but part-time job
        } else {
          score += WEIGHTS.JOB_TYPE * 0.5; // Partial match
        }
      }
    }

    // 3. COMPANY SIZE SCORING (15 points max) - Skip for now since Job doesn't have companySize
    // TODO: Add companySize to Job interface when backend provides it

    // 4. POSTING DATE SCORING (5 points max) - All jobs are within 7 days
    if (job.postedDate) {
      const posted = new Date(job.postedDate.toString());
      const now = new Date();
      const diffTime = now.getTime() - posted.getTime();
      const daysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (daysAgo <= 0) {
        score += WEIGHTS.POSTING_DATE; // Posted today - full points
      } else if (daysAgo <= 1) {
        score += WEIGHTS.POSTING_DATE * 0.8; // Posted yesterday
      } else if (daysAgo <= 3) {
        score += WEIGHTS.POSTING_DATE * 0.6; // Posted in past 3 days
      } else if (daysAgo <= 7) {
        score += WEIGHTS.POSTING_DATE * 0.4; // Posted within a week
      }
      // All jobs should be within 7 days, so no older scoring needed
    }

    // 5. SKILLS SCORING (15 points max)
    if (userProfile.skills && userProfile.skills.length > 0 && job.skills) {
      const userSkills = userProfile.skills.map((skill: string) => skill.toLowerCase());
      const jobSkills = job.skills.map((skill: string) => skill.toLowerCase());
      
      const matchingSkills = userSkills.filter(skill => 
        jobSkills.some(jobSkill => 
          jobSkill.includes(skill) || skill.includes(jobSkill)
        )
      );
      
      if (matchingSkills.length > 0) {
        const skillMatchRatio = matchingSkills.length / Math.max(userSkills.length, 1);
        score += WEIGHTS.SKILLS * skillMatchRatio;
      }
    }

    // 6. LOCATION SCORING (5 points max)
    if (userProfile.locationPreferences && userProfile.locationPreferences.length > 0 && job.location) {
      const jobLocation = job.location.toLowerCase();
      let locationScore = 0;
      
      // Remote is always preferred and gets full points
      if (job.isRemote) {
        locationScore = WEIGHTS.LOCATION;
      } else {
        // Check each preferred location for matches
        for (const preferredLocation of userProfile.locationPreferences) {
          const userLocation = preferredLocation.toLowerCase();
          
          if (userLocation === jobLocation) {
            locationScore = Math.max(locationScore, WEIGHTS.LOCATION); // Exact match
          } else if (jobLocation.includes(userLocation) || userLocation.includes(jobLocation)) {
            locationScore = Math.max(locationScore, WEIGHTS.LOCATION * 0.7); // Partial match
          }
        }
      }
      
      score += locationScore;
    }

    return Math.min(score, 100); // Cap at 100
  };

  // Helper functions to get labels from values
  const getSpecializationLabel = (value: string): string => {
    const option = INDUSTRY_SPECIALIZATION_OPTIONS.find(opt => opt.value === value);
    return option?.label || value;
  };

  const getJobTypeLabel = (value: string): string => {
    const option = JOB_TYPE_OPTIONS.find(opt => opt.value === value);
    return option?.label || value;
  };

  const getLocationLabel = (value: string): string => {
    const option = LOCATION_TYPE_OPTIONS.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Function to generate descriptive recommendation reasons based on scoring
  const generateRecommendationReasons = (job: Job, userProfile: UserProfile): string[] => {
    const reasons: string[] = [];
    
    // 1. Experience level match
    if (userProfile.roleLevel && job.experienceLevel) {
      const userLevel = userProfile.roleLevel.toLowerCase();
      const jobLevel = job.experienceLevel.toLowerCase();
      
      if (userLevel === jobLevel) {
        reasons.push(`Perfect match for your ${userProfile.roleLevel} experience level`);
      } else {
        // Check for adjacent levels
        const levels = ['internship', 'entry', 'associate', 'mid-senior', 'director', 'executive'];
        const userIndex = levels.indexOf(userLevel);
        const jobIndex = levels.indexOf(jobLevel);
        
        if (userIndex !== -1 && jobIndex !== -1) {
          const levelDiff = Math.abs(userIndex - jobIndex);
          if (levelDiff === 1) {
            reasons.push(`Adjacent experience level - ${job.experienceLevel} role (you're ${userProfile.roleLevel})`);
          } else if (levelDiff === 2) {
            reasons.push(`Related experience level - ${job.experienceLevel} role (you're ${userProfile.roleLevel})`);
          }
        }
      }
    }
    
    // 2. Specialization match
    if (userProfile.industrySpecializations && userProfile.industrySpecializations.length > 0 && job.specialization) {
      const userSpecs = userProfile.industrySpecializations.map(spec => spec.toLowerCase());
      const jobSpec = job.specialization.toLowerCase();
      
      if (userSpecs.includes(jobSpec)) {
        reasons.push(`Perfect match for your ${getSpecializationLabel(job.specialization)} specialization`);
      } else {
        // Check for related specializations
        const hasRelatedSpec = userSpecs.some(userSpec => {
          const relatedSpecs = RELATED_SPECIALIZATIONS_MAP[userSpec as keyof typeof RELATED_SPECIALIZATIONS_MAP] || [];
          return relatedSpecs.some(relatedSpec => relatedSpec === jobSpec);
        });
        if (hasRelatedSpec) {
          reasons.push(`Related to your specialization field`);
        }
      }
    }
    
    // 3. Job type match
    if (userProfile.jobTypes && userProfile.jobTypes.length > 0 && job.jobType) {
      const userJobTypes = userProfile.jobTypes.map((type: string) => type.toLowerCase());
      const jobType = job.jobType.toLowerCase();
      
      if (userJobTypes.includes(jobType)) {
        reasons.push(`Matches your preferred ${getJobTypeLabel(job.jobType)} work arrangement`);
      } else if (jobType === 'fulltime' && userJobTypes.includes('parttime')) {
        reasons.push(`Full-time opportunity (you prefer part-time but this could be a good fit)`);
      } else if (jobType === 'parttime' && userJobTypes.includes('fulltime')) {
        reasons.push(`Part-time role (you prefer full-time but this offers flexibility)`);
      }
    }
    
    // 4. Skills match
    if (userProfile.skills && userProfile.skills.length > 0 && job.skills) {
      const userSkills = userProfile.skills.map((skill: string) => skill.toLowerCase());
      const jobSkills = job.skills.map((skill: string) => skill.toLowerCase());
      
      const matchingSkills = userSkills.filter(skill => 
        jobSkills.some(jobSkill => 
          jobSkill.includes(skill) || skill.includes(jobSkill)
        )
      );
      
      if (matchingSkills.length > 0) {
        const skillMatchRatio = matchingSkills.length / Math.max(userSkills.length, 1);
        if (skillMatchRatio >= 0.5) {
          reasons.push(`Strong skill match: ${matchingSkills.slice(0, 3).join(', ')}${matchingSkills.length > 3 ? ' and more' : ''}`);
        } else if (skillMatchRatio >= 0.25) {
          reasons.push(`Good skill overlap: ${matchingSkills.slice(0, 2).join(', ')}${matchingSkills.length > 2 ? ' and more' : ''}`);
        } else {
          reasons.push(`Some matching skills: ${matchingSkills[0]}${matchingSkills.length > 1 ? ' and more' : ''}`);
        }
      }
    }
    
    // 5. Location match
    if (userProfile.locationPreferences && userProfile.locationPreferences.length > 0 && job.location) {
      if (job.isRemote) {
        reasons.push(`Remote work opportunity (matches your location preferences)`);
      } else {
        const jobLocation = job.location.toLowerCase();
        const hasExactMatch = userProfile.locationPreferences.some(pref => 
          pref.toLowerCase() === jobLocation
        );
        const hasPartialMatch = userProfile.locationPreferences.some(pref => 
          jobLocation.includes(pref.toLowerCase()) || pref.toLowerCase().includes(jobLocation)
        );
        
        if (hasExactMatch) {
          reasons.push(`Perfect location match: ${getLocationLabel(job.location)}`);
        } else if (hasPartialMatch) {
          reasons.push(`Location aligns with your preferences: ${getLocationLabel(job.location)}`);
        }
      }
    }
    
    // 6. Recent posting
    if (job.postedDate) {
      const posted = new Date(job.postedDate.toString());
      const now = new Date();
      const diffTime = now.getTime() - posted.getTime();
      const daysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (daysAgo <= 1) {
        reasons.push(`Fresh opportunity - posted ${daysAgo === 0 ? 'today' : 'yesterday'}`);
      } else if (daysAgo <= 3) {
        reasons.push(`Recently posted - ${daysAgo} days ago`);
      }
    }
    
    // Return top 3 most relevant reasons
    return reasons.slice(0, 3);
  };

  const inflateScore = (score: number): number => {
    // Inflate the score by applying a curve that makes scores higher
    // Use a power function to boost scores while keeping them realistic
    const inflatedScore = Math.pow(score / 100, 0.6) * 100;
    
    // Cap at 99 and round up to nearest whole number
    const finalScore = Math.min(Math.ceil(inflatedScore), 99);
    
    return finalScore;
  };

  const generateRecommendations = (jobs: Job[], userProfile: UserProfile): JobWithScore[] => {
    // Step 1: Calculate scores for all jobs
    const scoredJobs = jobs.map(job => ({
      job,
      score: calculateJobScore(job, userProfile)
    }));

    // Step 2: Sort by score (highest first)
    scoredJobs.sort((a, b) => b.score - a.score);

    // Step 3: Apply diversity filters to ensure variety
    const diverseJobs = applyDiversityFilters(scoredJobs);

    // Step 4: Ensure we always return exactly 20 jobs
    const finalJobs = ensureTwentyJobs(diverseJobs, scoredJobs);

    // Step 5: Inflate scores and sort final 20 jobs by inflated score (highest first)
    const inflatedJobs = finalJobs.map(jobWithScore => ({
      ...jobWithScore,
      score: inflateScore(jobWithScore.score)
    }));

    // Step 6: Sort the final 20 jobs by inflated score (highest first)
    inflatedJobs.sort((a, b) => b.score - a.score);

    return inflatedJobs;
  };

  // Function to refresh recommendations
  const refreshRecommendations = async (): Promise<void> => {
    if (!profile || isLoading) return;
    
    // Check if profile has enough details for recommendations
    const hasExperienceLevel = !!profile.roleLevel;
    const hasSpecializations = !!(profile.industrySpecializations && profile.industrySpecializations.length > 0);
    const hasJobTypes = !!(profile.jobTypes && profile.jobTypes.length > 0);
    const hasSkills = !!(profile.skills && profile.skills.length > 0);
    const hasLocationPreferences = !!(profile.locationPreferences && profile.locationPreferences.length > 0);
    
    const requiredFields = [hasExperienceLevel, hasSpecializations, hasJobTypes, hasSkills, hasLocationPreferences];
    const filledFields = requiredFields.filter(Boolean).length;
    
    // Don't make API call if profile is incomplete (need at least 3 out of 5 fields)
    if (filledFields < 3) {
      setFetchedJobs(true);
      return;
    }
    
    setIsLoading(true);
    try {
      // Get disliked job IDs to exclude from API
      // Include applied job IDs to exclude from API
      const appliedJobIds = applications?.filter(app => app.status !== 'Saved').map(app => app.jobId) || [];
      const excludedJobIds = profile.dislikedJobs || [];
      
      // Fetch recommended jobs from API with profile parameters
      const recommendedJobsFromAPI = await jobsService.getRecommendedJobs(
        profile.roleLevel ? [profile.roleLevel] : undefined,
        profile.industrySpecializations || undefined,
        profile.usSponsorship || undefined,
        excludedJobIds.concat(appliedJobIds)
      );

      // Generate recommendations based on API jobs and profile
      const recommendations = generateRecommendations(recommendedJobsFromAPI, profile);
      if (recommendations.length > 0) {
        setRecommendedJobs(recommendations);
      }

    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    } finally {
      setIsLoading(false);
      setFetchedJobs(true);
    }
  };

  // Auto-generate recommendations when job-related profile preferences change
  useEffect(() => {
    if (profile && applications) {
      refreshRecommendations();
    }
    // These should change when anything sent to the api changes
  }, [
    profile?.roleLevel,
    profile?.usSponsorship,
    profile?.industrySpecializations,
    applications?.length
  ]);

  // Regenerate scores when rating-related profile fields change (without API calls)
  useEffect(() => {
    if (profile && recommendedJobs.length > 0) {
      // Recalculate scores for existing jobs without fetching new ones
      const rescoredJobs = recommendedJobs.map(jobWithScore => ({
        ...jobWithScore,
        score: calculateJobScore(jobWithScore.job, profile)
      }));
      
      // Sort by new scores
      rescoredJobs.sort((a, b) => b.score - a.score);
      
      setRecommendedJobs(rescoredJobs);
    }
  }, [
    profile?.industrySpecializations,  // Specialization scoring (35 points)
    profile?.jobTypes,                 // Job type scoring (25 points)
    profile?.skills,                   // Skills scoring (25 points)
    profile?.locationPreferences,      // Location scoring (10 points)
    profile?.expectedSalary
  ]);

  const applyDiversityFilters = (
    scoredJobs: Array<{ job: Job; score: number }>
  ): JobWithScore[] => {
    const result: JobWithScore[] = [];
    const usedCompanies = new Set<string>();
    const usedSpecializations = new Set<string>();
    const usedJobTitleCompany = new Set<string>(); // Track job title + company combinations
    
    // First pass: Get high-scoring diverse jobs
    for (const { job, score } of scoredJobs) {
      if (result.length >= 15) break; // Leave room for backfill
      
      // Skip if we already have 2 jobs from this company
      const companyCount = result.filter(j => j.job.company === job.company).length;
      if (companyCount >= 2) continue;
      
      // Skip if we already have a job with the same title and company
      const jobTitleCompany = `${job.title.toLowerCase().trim()}-${job.company.toLowerCase().trim()}`;
      if (usedJobTitleCompany.has(jobTitleCompany)) continue;
      
      // Prefer diverse specializations for first 10 jobs
      if (result.length < 10 && job.specialization && usedSpecializations.has(job.specialization)) {
        continue;
      }
      
      result.push({ job, score });
      usedCompanies.add(job.company);
      usedJobTitleCompany.add(jobTitleCompany);
      if (job.specialization) {
        usedSpecializations.add(job.specialization);
      }
    }
    
    return result;
  };

  const ensureTwentyJobs = (
    diverseJobs: JobWithScore[],
    allScoredJobs: Array<{ job: Job; score: number }>
  ): JobWithScore[] => {
    const result = [...diverseJobs];
    const usedJobIds = new Set(result.map(jobWithScore => jobWithScore.job.id));
    const usedJobTitleCompany = new Set(
      result.map(jobWithScore => 
        `${jobWithScore.job.title.toLowerCase().trim()}-${jobWithScore.job.company.toLowerCase().trim()}`
      )
    );
    
    // If we have fewer than 20, backfill with remaining highest-scored jobs
    if (result.length < 20) {
      for (const { job, score } of allScoredJobs) {
        if (result.length >= 20) break;
        if (!usedJobIds.has(job.id)) {
          // Also check for duplicate job title + company combinations
          const jobTitleCompany = `${job.title.toLowerCase().trim()}-${job.company.toLowerCase().trim()}`;
          if (!usedJobTitleCompany.has(jobTitleCompany)) {
            result.push({ job, score });
            usedJobIds.add(job.id);
            usedJobTitleCompany.add(jobTitleCompany);
          }
        }
      }
    }
    
    return result.slice(0, 20); // Ensure exactly 20 jobs
  };

  // Function to remove a job from recommendations when applied to
  const removeJobFromRecommendations = (jobId: string): void => {
    setRecommendedJobs(prev => prev.filter(jobWithScore => jobWithScore.job.id !== jobId));
  };

  const contextValue: RecommenderContextType = {
    recommendedJobs,
    isLoading,
    fetchedJobs,
    refreshRecommendations,
    calculateJobScore,
    generateRecommendationReasons,
    removeJobFromRecommendations
  };

  return (
    <RecommenderContext.Provider value={contextValue}>
      {children}
    </RecommenderContext.Provider>
  );
}

export function useRecommender(): RecommenderContextType {
  const context = useContext(RecommenderContext);
  if (context === undefined) {
    throw new Error('useRecommender must be used within a RecommenderProvider');
  }
  return context;
} 