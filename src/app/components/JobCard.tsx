'use client';

import { useState, useEffect } from 'react';
import { DollarSign, MapPin, Briefcase, Clock, Building, Bookmark, Award, BadgeCheck, Globe, Eye } from 'lucide-react';
import JobCardSkeleton from './loading/JobCardSkeleton';
import { useRouter } from 'next/navigation';
import AnimatedApplyButton from './AnimatedApplyButton';

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
  
  // Check if the viewport is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint in Tailwind is 1024px
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
      className={`bg-white rounded-lg border ${isSelected ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow ${showMinimal ? 'p-3 sm:p-4' : 'p-4 sm:p-6'} ${(!isMobile && isAnySelected) ? 'cursor-pointer' : ''}`}
      onClick={() => isAnySelected && handleCardClick()}
    >
      <div className="flex flex-col space-y-3">
        {/* Top Row: Logo, Title/Company, Save, Apply, View */}
        <div className="flex flex-row sm:items-center sm:space-x-4 w-full">
          {/* Logo and Title/Company */}
          <div className="flex flex-row items-center flex-1 min-w-0 space-x-3">
            {/* Company Logo */}
            <div className="flex-shrink-0 flex justify-center items-center">
              <div className={`${showMinimal ? 'w-12 h-12' : 'w-16 h-16'} bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200`}>
                {logo ? (
                  <img src={logo} alt={`${company} logo`} className="w-full h-full object-contain" />
                ) : (
                  <Building className={`${showMinimal ? 'h-6 w-6' : 'h-8 w-8'} text-gray-400`} />
                )}
              </div>
            </div>
            {/* Title and Company */}
            <div className="flex-1 min-w-0">
              <h3 className={`${showMinimal ? 'text-sm sm:text-base' : 'text-base sm:text-lg'} font-semibold text-gray-900 truncate`}>{title}</h3>
              <div className="flex items-center space-x-2">
                <p className={`${showMinimal ? 'text-xs sm:text-sm' : 'text-sm sm:text-md'} font-medium text-gray-700`}>{company}</p>
                {isVerified && !showMinimal && (
                  <span className="inline-flex items-center">
                    <BadgeCheck className="h-4 w-4 text-teal-500" />
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Actions: Save, Apply, View (row on desktop, stacked on mobile) */}
          {!isAnySelected && (
            <div className="flex flex-row items-start space-x-2">
              {/* Save Job Button */}
              {!showMinimal && (
                <button
                  onClick={handleSaveToggle}
                  className="flex-shrink-0 text-gray-400 hover:text-teal-600 transition-colors"
                  aria-label={isLocalSaved ? "Unsave job" : "Save job"}
                >
                  <Bookmark className={`h-6 w-6 ${isLocalSaved ? 'fill-teal-600 text-teal-600' : 'fill-transparent'}`} />
                </button>
              )}
              {/* Apply and View side by side, same width */}
              <div className="hidden sm:flex flex-col space-y-2">
                <div onClick={(e) => e.stopPropagation()} className="w-40">
                  <AnimatedApplyButton 
                    onClick={() => {
                      // Handle apply click
                    }}
                    size="sm"
                    className="w-full"
                  />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent duplicate click events
                    if (isMobile && id) {
                      router.push(`/jobs/${id}`);
                    } else if (onViewDetails) {
                      onViewDetails();
                    }
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 w-40"
                >
                  <Eye className="mr-1.5 h-4 w-4" />
                  View
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Tags Section - Only show when not in minimal mode */}
        {!showMinimal && (
          <div className="mt-2 flex flex-wrap gap-2">
            {isSponsored && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Award className="mr-1 h-3 w-3" />
                Sponsored
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {jobType}
            </span>
            {providesSponsorship !== undefined && !compact && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                providesSponsorship 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <Globe className="mr-1 h-3 w-3" />
                {providesSponsorship ? 'Visa Sponsorship Available' : 'No Visa Sponsorship'}
              </span>
            )}
          </div>
        )}
        {/* Job Details - only show in non-minimal mode */}
        {!showMinimal && !compact && (
          <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
              {location}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="mr-1.5 h-4 w-4 text-gray-400" />
              {salary}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Briefcase className="mr-1.5 h-4 w-4 text-gray-400" />
              {jobType}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
              {postedDate}
            </div>
          </div>
        )}
        {/* Show minimal details in compact mode */}
        {!showMinimal && compact && (
          <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
              {location}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
              {postedDate}
            </div>
          </div>
        )}
        {/* Description - only in non-minimal mode */}
        {!showMinimal && !compact && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      <div className="flex sm:hidden flex-row space-x-2 mt-3">
          <div onClick={(e) => e.stopPropagation()} className="w-1/2">
            <AnimatedApplyButton 
              onClick={() => {
                // Handle apply click
              }}
              size="sm"
              className="w-full"
            />
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent duplicate click events
              if (isMobile && id) {
                router.push(`/jobs/${id}`);
              } else if (onViewDetails) {
                onViewDetails();
              }
            }}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 w-1/2"
          >
            <Eye className="mr-1.5 h-4 w-4" />
            View
          </button>
        </div>
    </div>
  );
} 