'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Job } from '@/app/types/job';
import { UserProfile } from '@/app/types/profile';
import { useJobs } from '@/app/contexts/JobsContext';
import { useProfile } from '@/app/contexts/ProfileContext';

// New type for jobs with scores
export interface JobWithScore {
  job: Job;
  score: number;
}

interface RecommenderContextType {
  recommendedJobs: JobWithScore[];
  isLoading: boolean;
  refreshRecommendations: () => Promise<void>;
  calculateJobScore: (job: Job, userProfile: UserProfile) => number;
}

const RecommenderContext = createContext<RecommenderContextType | undefined>(undefined);

interface RecommenderProviderProps {
  children: ReactNode;
}

export function RecommenderProvider({ children }: RecommenderProviderProps) {
  const { allJobs, fetchInitialJobs } = useJobs();
  const { profile } = useProfile();
  const [recommendedJobs, setRecommendedJobs] = useState<JobWithScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Scoring weights (totaling 84 for base scoring, plus up to 16 bonus points = max 100)
  const WEIGHTS = {
    ROLE_LEVEL: 30,        // Highest priority - role level match
    SPECIALIZATION: 25,    // Second priority - field specialization
    SALARY: 12,           // Third priority - salary expectations (reduced from 20)
    LOCATION: 7,          // Fourth priority - location preferences (reduced from 15)
    SKILLS: 10            // Fifth priority - skills match
    // BONUS: up to 16 points (8 for today, 6 for 2 days, 4 for 5 days, 2 for week, 5 for sponsorship, 3 for verified)
  };

  const calculateJobScore = (job: Job, userProfile: UserProfile): number => {
    let score = 0;

    // 1. ROLE LEVEL SCORING (30 points max)
    if (userProfile.roleLevel && job.experienceLevel) {
      const userLevel = userProfile.roleLevel.toLowerCase();
      const jobLevel = job.experienceLevel.toLowerCase();
      
      if (userLevel === jobLevel) {
        score += WEIGHTS.ROLE_LEVEL; // Perfect match
      } else {
        // Partial scoring for adjacent levels
        const levelHierarchy = ['entry', 'junior', 'mid', 'senior', 'lead', 'principal'];
        const userIndex = levelHierarchy.indexOf(userLevel);
        const jobIndex = levelHierarchy.indexOf(jobLevel);
        
        if (userIndex !== -1 && jobIndex !== -1) {
          const levelDiff = Math.abs(userIndex - jobIndex);
          if (levelDiff === 1) {
            score += WEIGHTS.ROLE_LEVEL * 0.7; // Adjacent level
          } else if (levelDiff === 2) {
            score += WEIGHTS.ROLE_LEVEL * 0.4; // Two levels apart
          }
          // More than 2 levels apart gets 0 points
        }
      }
    }

    // 2. SPECIALIZATION SCORING (25 points max)
    if (userProfile.industrySpecializations && userProfile.industrySpecializations.length > 0 && job.specialization) {
      const userSpecs = userProfile.industrySpecializations.map(spec => spec.toLowerCase());
      const jobSpec = job.specialization.toLowerCase();
      
      if (userSpecs.includes(jobSpec)) {
        score += WEIGHTS.SPECIALIZATION; // Perfect match
      } else {
        // Related specializations scoring
        const hasRelatedSpec = userSpecs.some(userSpec => {
          const relatedSpecs = getRelatedSpecializations(userSpec);
          return relatedSpecs.includes(jobSpec);
        });
        if (hasRelatedSpec) {
          score += WEIGHTS.SPECIALIZATION * 0.6; // Related field
        }
      }
    }

    // 3. SALARY SCORING (20 points max)
    if (userProfile.expectedSalary && job.salaryValue) {
      const userSalary = userProfile.expectedSalary;
      const jobSalary = job.salaryValue;
      
      if (jobSalary >= userSalary) {
        // Job pays at or above expectation
        const salaryRatio = Math.min(jobSalary / userSalary, 1.5); // Cap at 1.5x
        score += WEIGHTS.SALARY * Math.min(salaryRatio, 1);
      } else {
        // Job pays below expectation
        const salaryRatio = jobSalary / userSalary;
        if (salaryRatio >= 0.8) {
          score += WEIGHTS.SALARY * 0.8; // Within 20% of expectation
        } else if (salaryRatio >= 0.6) {
          score += WEIGHTS.SALARY * 0.5; // Within 40% of expectation
        }
        // Below 60% gets 0 points
      }
    }

    // 4. LOCATION SCORING (7 points max)
    if (userProfile.locationPreferences && userProfile.locationPreferences.length > 0 && job.location) {
      const jobLocation = job.location.toLowerCase();
      let locationScore = 0;
      
      // Remote is always preferred and gets full points
      if (jobLocation.includes('remote')) {
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
        
        // Hybrid gets some points if no other matches
        if (locationScore === 0 && jobLocation.includes('hybrid')) {
          locationScore = WEIGHTS.LOCATION * 0.5;
        }
      }
      
      score += locationScore;
    }

    // 5. SKILLS SCORING (10 points max)
    if (userProfile.skills && userProfile.skills.length > 0 && job.tags) {
      const userSkills = userProfile.skills.map(skill => skill.toLowerCase());
      const jobSkills = job.tags.map(tag => tag.toLowerCase());
      
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

    // BONUS FACTORS (up to 16 additional points - heavily weighted toward recent postings)
    // Base score: 84 points max + Bonus: 16 points max = Total: 100 points max
    let bonus = 0;

    // Verified companies bonus
    if (job.isVerified) {
      bonus += 3;
    }

    // Sponsorship bonus (if user needs it)
    if (userProfile.usSponsorship && job.providesSponsorship) {
      bonus += 5;
    }

    // Recent posting bonus - heavily prioritize recent jobs
    if (job.postedDate) {
      const posted = new Date(job.postedDate.toString());
      const now = new Date();
      const diffTime = now.getTime() - posted.getTime();
      const daysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (daysAgo <= 0) {
        bonus += 8; // Posted today - highest priority
        console.log(`🔥 FRESH JOB: ${job.title} at ${job.company} posted TODAY (+8 bonus)`);
      } else if (daysAgo <= 2) {
        bonus += 6; // Posted in past 2 days - very high priority
        console.log(`🚀 RECENT JOB: ${job.title} at ${job.company} posted ${daysAgo} days ago (+6 bonus)`);
      } else if (daysAgo <= 5) {
        bonus += 4; // Posted in past 5 days - high priority
        console.log(`⭐ NEW JOB: ${job.title} at ${job.company} posted ${daysAgo} days ago (+4 bonus)`);
      } else if (daysAgo <= 7) {
        bonus += 2; // Posted within a week - moderate priority
        console.log(`📅 WEEK OLD: ${job.title} at ${job.company} posted ${daysAgo} days ago (+2 bonus)`);
      }
    }

    return Math.min(score + bonus, 100); // Cap at 100
  };

  const getRelatedSpecializations = (specialization: string): string[] => {
    const relatedMap: Record<string, string[]> = {
      'frontend': ['fullstack', 'ui_ux', 'web'],
      'backend': ['fullstack', 'devops', 'api'],
      'fullstack': ['frontend', 'backend', 'web'],
      'mobile': ['frontend', 'ios', 'android'],
      'devops': ['backend', 'cloud', 'infrastructure'],
      'ml_ai': ['data_science', 'python', 'analytics'],
      'data_science': ['ml_ai', 'analytics', 'python'],
      'ui_ux': ['frontend', 'design', 'product'],
      'qa': ['automation', 'testing', 'backend'],
      'security': ['backend', 'devops', 'infrastructure']
    };

    return relatedMap[specialization] || [];
  };



  const inflateScore = (score: number): number => {
    // Inflate the score by applying a curve that makes scores higher
    // Use a power function to boost scores while keeping them realistic
    const inflatedScore = Math.pow(score / 100, 0.6) * 100;
    
    // Add a base boost to make scores more impressive
    const boostedScore = inflatedScore + 15;
    
    // Cap at 99 and round up to nearest whole number
    const finalScore = Math.min(Math.ceil(boostedScore), 99);
    
    // Temporary debug log
    if (score > 0) {
      console.log(`Score inflation: ${score.toFixed(1)} → ${finalScore}`);
    }
    
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
    if (!profile) return;
    
    setIsLoading(true);
    try {
      // Fetch all jobs if not already loaded
      if (allJobs.length === 0) {
        await fetchInitialJobs();
      }
      
      // Generate recommendations based on current jobs and profile
      const recommendations = generateRecommendations(allJobs, profile);
      setRecommendedJobs(recommendations);
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate recommendations when profile or jobs change
  useEffect(() => {
    if (profile && allJobs.length > 0) {
      const recommendations = generateRecommendations(allJobs, profile);
      setRecommendedJobs(recommendations);
    }
  }, [profile, allJobs]);

  const applyDiversityFilters = (
    scoredJobs: Array<{ job: Job; score: number }>
  ): JobWithScore[] => {
    const result: JobWithScore[] = [];
    const usedCompanies = new Set<string>();
    const usedSpecializations = new Set<string>();
    
    // First pass: Get high-scoring diverse jobs
    for (const { job, score } of scoredJobs) {
      if (result.length >= 15) break; // Leave room for backfill
      
      // Skip if we already have 2 jobs from this company
      const companyCount = result.filter(j => j.job.company === job.company).length;
      if (companyCount >= 2) continue;
      
      // Prefer diverse specializations for first 10 jobs
      if (result.length < 10 && job.specialization && usedSpecializations.has(job.specialization)) {
        continue;
      }
      
      result.push({ job, score });
      usedCompanies.add(job.company);
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
    
    // If we have fewer than 20, backfill with remaining highest-scored jobs
    if (result.length < 20) {
      for (const { job, score } of allScoredJobs) {
        if (result.length >= 20) break;
        if (!usedJobIds.has(job.id)) {
          result.push({ job, score });
          usedJobIds.add(job.id);
        }
      }
    }
    
    return result.slice(0, 20); // Ensure exactly 20 jobs
  };

  const contextValue: RecommenderContextType = {
    recommendedJobs,
    isLoading,
    refreshRecommendations,
    calculateJobScore
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