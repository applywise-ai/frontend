'use client';

import { useState, useEffect } from 'react';
import { DollarSign, MapPin, Briefcase, Clock, Bookmark, Award, BadgeCheck, Globe, Eye, ArrowRight } from 'lucide-react';
import JobCardSkeleton from '@/app/components/loading/JobCardSkeleton';
import { useRouter } from 'next/navigation';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';
import { getBreakpoint } from '@/app/utils/breakpoints';

interface JobCardProps {
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  jobType: string;
  postedDate: string;
  description: string;
  isSponsored?: boolean;
  isVerified?: boolean;
  providesSponsorship?: boolean;
  compact?: boolean;
  onViewDetails?: () => void;
  isSelected?: boolean;
  isAnySelected?: boolean;
  isSaved?: boolean;
  onUnsave?: () => void;
  isLoading?: boolean;
  id?: number | string;
}

export default function JobCard({
  title,
  company,
  logo,
  location,
  salary,
  jobType,
  postedDate,
  description,
  isSponsored = false,
  isVerified = false,
  providesSponsorship,
  compact = false,
  onViewDetails,
  isSelected = false,
  isAnySelected = false,
  isSaved = false,
  onUnsave,
  isLoading = false,
  id
}: JobCardProps) {
  const [isLocalSaved, setIsLocalSaved] = useState(isSaved);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  
  // Update local state when prop changes
  useEffect(() => {
    setIsLocalSaved(isSaved);
  }, [isSaved]);
  
  // Get avatar background color based on company name
  const getAvatarColor = (companyName: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-teal-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-cyan-500 to-cyan-600'
    ];
    
    // Generate a simple hash from the company name
    const hash = companyName.split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return colors[hash % colors.length];
  };
  
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

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (isSaved && onUnsave) {
      // If this is a saved job with an unsave handler, use that
      onUnsave();
    } else {
      // Otherwise, just toggle the local state
      setIsLocalSaved(!isLocalSaved);
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
        ${showMinimal ? 'p-3' : 'p-4'} 
        ${(!isMobile && isAnySelected) ? 'cursor-pointer hover:-translate-y-1' : 'hover:-translate-y-0.5'}
        overflow-hidden
      `}
      onClick={() => isAnySelected && handleCardClick()}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30 pointer-events-none" />
      
      {/* Sponsored badge */}
      {isSponsored && !showMinimal && (
        <div className="absolute top-5 right-16 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
            <Award className="inline h-3 w-3 mr-1" />
            Sponsored
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col space-y-3">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
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
                    font-bold text-gray-900 mb-0.5 line-clamp-2 leading-tight
                    group-hover:text-teal-700 transition-colors duration-200
                  `}>
                    {title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-1">
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
                  
                  {/* Minimal info for selected state */}
                  {showMinimal && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[110px]">{location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="truncate max-w-[60px]">{salary.split("-")[0]}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="whitespace-nowrap">{postedDate}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Save Button */}
                {!showMinimal && (
                  <button
                    onClick={handleSaveToggle}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200"
                    aria-label={isLocalSaved ? "Unsave job" : "Save job"}
                  >
                    <Bookmark className={`h-5 w-5 ${isLocalSaved ? 'fill-teal-600 text-teal-600' : 'fill-transparent'}`} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Grid */}
        {!showMinimal && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1 bg-gray-100 rounded-lg">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1 bg-gray-100 rounded-lg">
                <DollarSign className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <span className="truncate">{salary}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1 bg-gray-100 rounded-lg">
                <Briefcase className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <span className="truncate">{jobType}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1 bg-gray-100 rounded-lg">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <span className="truncate">{postedDate}</span>
            </div>
          </div>
        )}

        {/* Description */}
        {!showMinimal && !compact && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Tags */}
        {!showMinimal && (
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200/50">
              {jobType}
            </span>
            {providesSponsorship && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200/50">
                <Globe className="mr-1.5 h-3 w-3" />
                Visa Sponsorship
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {!isAnySelected && (
          <>
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center justify-between pt-1.5 border-t border-gray-100">
              <div className="flex items-center space-x-3 flex-1">
                <div onClick={(e) => e.stopPropagation()} className="flex-1 max-w-[180px]">
                  <AnimatedApplyButton 
                    onClick={() => {
                      // Handle apply click
                    }}
                    size="sm"
                    className="w-full"
                    applicationId={id?.toString()}
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
                  className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 group/btn"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                </button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex sm:hidden space-x-3 pt-2 border-t border-gray-100">
              <div onClick={(e) => e.stopPropagation()} className="flex-1">
                <AnimatedApplyButton 
                  onClick={() => {
                    // Handle apply click
                  }}
                  size="sm"
                  className="w-full"
                  applicationId={id?.toString()}
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
                className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 flex-1"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 