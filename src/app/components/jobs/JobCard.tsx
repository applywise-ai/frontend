'use client';

import { useState, useEffect } from 'react';
import { DollarSign, MapPin, Briefcase, Clock, Bookmark, BadgeCheck, Globe, Eye, GraduationCap } from 'lucide-react';
import JobCardSkeleton from '@/app/components/loading/JobCardSkeleton';
import { useRouter } from 'next/navigation';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';
import { getBreakpoint } from '@/app/utils/breakpoints';
import { getAvatarColor } from '@/app/utils/avatar';
import { INDUSTRY_SPECIALIZATION_OPTIONS } from '@/app/types/job';
import { useApplications } from '@/app/contexts/ApplicationsContext';
import { formatJobPostedDate, formatSalaryRange, getJobTypeLabel, getExperienceLevelLabel, getLocationLabelFromJob } from '@/app/utils/job';
import { Job } from '@/app/types/job';

interface JobCardProps {
  job: Job;
  compact?: boolean;
  onViewDetails?: () => void;
  isSelected?: boolean;
  isAnySelected?: boolean;
  onUnsave?: () => void;
  isLoading?: boolean;
}

export default function JobCard({
  job,
  compact = false,
  onViewDetails,
  isSelected = false,
  isAnySelected = false,
  isLoading = false,
}: JobCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const router = useRouter();
  const { toggleSave } = useApplications();

  // Extract job properties
  const {
    id,
    title,
    company,
    logo,
    jobType,
    postedDate,
    description,
    isSponsored = false,
    isVerified = false,
    providesSponsorship,
    experienceLevel,
    specialization,
  } = job;
  
  // Check if the viewport is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < getBreakpoint('lg')); // lg breakpoint
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);


  
  // If loading, return skeleton
  if (isLoading) {
    return <JobCardSkeleton compact={compact} />;
  }
  
  // Show minimal data when any job is selected
  const showMinimal = isAnySelected;

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!id) return;
    
    setIsSaveLoading(true);
    try {
      // Job is not saved (filtered out from jobs page), so we're saving it
      await toggleSave(id.toString(), false);
      // TODO: Filter out job from jobs page after clicking save
    } catch (error) {
      console.error('Error toggling save status:', error);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleCardClick = () => {
    if (isMobile && id) {
      // On mobile, navigate to the job details page
      router.push(`/jobs/${id}`);
    } else if (!isMobile && onViewDetails && isAnySelected) {
      // On desktop, only open the details panel if another job is selected
      onViewDetails();
    }
  };

  // Helper function to get specialization display name
  const getSpecializationLabel = (spec: string) => {
    const option = INDUSTRY_SPECIALIZATION_OPTIONS.find(opt => opt.value === spec);
    return option ? option.label : spec;
  };

  return (
    <div 
      className={`
        group relative bg-white/80 backdrop-blur-sm rounded-xl border 
        ${isSelected 
          ? 'border-teal-500 ring-2 ring-teal-200/50 shadow-lg shadow-teal-500/10' 
          : 'border-gray-200/60 hover:border-gray-300/80'
        } 
        shadow-sm hover:shadow-xl hover:shadow-gray-900/5
        transition-all duration-300 ease-out
        ${showMinimal ? 'p-3 pb-0' : 'p-4'} 
        ${(!isMobile && isAnySelected) ? 'cursor-pointer hover:-translate-y-1' : 'hover:-translate-y-0.5'}
        overflow-hidden
      `}
      onClick={() => isAnySelected && handleCardClick()}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30 pointer-events-none" />

      <div className="relative z-10 flex flex-col space-y-3">
        {/* Main Content Row */}
        <div className="flex items-start justify-between gap-4">
          {/* Left Content - Logo, Title, Company, Tags */}
          <div className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="flex items-start space-x-3 mb-3">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <div className={`
                  ${showMinimal ? 'w-10 h-10' : 'w-12 h-12'} 
                  ${logo ? 'bg-white border-2 border-gray-100 shadow-sm' : getAvatarColor(company)} 
                  rounded-xl flex items-center justify-center overflow-hidden
                  transition-transform duration-200 group-hover:scale-105
                `}>
                  {logo ? (
                    <img src={logo} alt={`${company} logo`} className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className={`${showMinimal ? 'text-sm' : 'text-lg'} font-bold text-white drop-shadow-sm`}>
                      {company.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`
                      ${showMinimal ? 'text-sm' : 'text-base sm:text-lg'} 
                      font-bold text-gray-900 line-clamp-2 leading-tight
                      group-hover:text-teal-700 transition-colors duration-200
                    `}>
                      {title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <p className={`
                        ${showMinimal ? 'text-xs' : 'text-sm'} 
                        font-semibold text-gray-700
                      `}>
                        {company}
                      </p>
                      {isVerified && (
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 text-teal-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Save Button - beside job title */}
                  {!showMinimal && (
                    <button
                      onClick={handleSaveToggle}
                      disabled={isSaveLoading}
                      className="hidden sm:flex flex-shrink-0 p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Save job"
                    >
                      <Bookmark className={`h-6 w-6 fill-transparent ${isSaveLoading ? 'animate-pulse' : ''}`} />
                    </button>
                  )}
                </div>
                
                {/* Minimal info for selected state */}
                {showMinimal && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[110px]">{getLocationLabelFromJob(job)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="truncate max-w-[60px]">
                        {formatSalaryRange(job)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span className="whitespace-nowrap">{postedDate ? formatJobPostedDate(postedDate) : 'Recently'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {!showMinimal && (
              <div className="flex flex-wrap gap-2 pt-1">
                {isSponsored && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-white border border-orange-300/50">
                    Sponsored
                  </span>
                )}
                {specialization && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200/50">
                    <Briefcase className="mr-1.5 h-3 w-3" />
                    {getSpecializationLabel(specialization)}
                  </span>
                )}
                {experienceLevel && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200/50">
                    <GraduationCap className="mr-1.5 h-3 w-3" />
                    {getExperienceLevelLabel(experienceLevel)}
                  </span>
                )}
                {providesSponsorship && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200/50">
                    <Globe className="mr-1.5 h-3 w-3" />
                    Visa Sponsorship
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Right Content - Action Buttons */}
          {!isAnySelected && !showMinimal && (
            <div className="hidden sm:flex flex-col space-y-2 flex-shrink-0">
              <div onClick={(e) => e.stopPropagation()}>
                <AnimatedApplyButton 
                  size="sm"
                  className="w-40 lg:w-52"
                  jobId={id?.toString()}
                />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMobile && id) {
                    router.push(`/jobs/${id}`);
                  } else if (onViewDetails) {
                    onViewDetails();
                  }
                }}
                className="inline-flex items-center justify-center w-40 lg:w-52 px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
              >
                <Eye className="mr-1.5 h-4 w-4" />
                View
              </button>
            </div>
          )}
          
          {/* Mobile Save Button - Top Right */}
          {!showMinimal && (
            <button
              onClick={handleSaveToggle}
              disabled={isSaveLoading}
              className="sm:hidden flex-shrink-0 p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save job"
            >
              <Bookmark className={`h-5 w-5 fill-transparent ${isSaveLoading ? 'animate-pulse' : ''}`} />
            </button>
          )}
        </div>

        {/* Job Details Grid */}
        {!showMinimal && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1 bg-gray-100 rounded-lg">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <span className="truncate">{getLocationLabelFromJob(job)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1 bg-gray-100 rounded-lg">
                <DollarSign className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <span className="truncate">
                {formatSalaryRange(job)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1 bg-gray-100 rounded-lg">
                <Briefcase className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <span className="truncate">{getJobTypeLabel(jobType)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1 bg-gray-100 rounded-lg">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <span className="truncate">{postedDate ? formatJobPostedDate(postedDate) : 'Recently'}</span>
            </div>
          </div>
        )}

        {/* Description */}
        {!showMinimal && !compact && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Mobile Action Buttons */}
        {!isAnySelected && (
          <div className="grid grid-cols-2 gap-3 sm:hidden pt-2 border-t border-gray-100">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile && id) {
                  router.push(`/jobs/${id}`);
                } else if (onViewDetails) {
                  onViewDetails();
                }
              }}
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 h-10"
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <AnimatedApplyButton 
                size="sm"
                className="w-full h-10"
                jobId={id?.toString()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 