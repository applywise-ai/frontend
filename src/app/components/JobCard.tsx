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
    } else if (onViewDetails) {
      // On desktop, open the details panel
      onViewDetails();
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg border ${isSelected ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow ${showMinimal ? 'p-4' : 'p-6'} cursor-pointer`}
      onClick={handleCardClick}
    >
      <div className="flex items-start space-x-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className={`${showMinimal ? 'w-12 h-12' : 'w-16 h-16'} bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200`}>
            {logo ? (
              <img src={logo} alt={`${company} logo`} className="w-full h-full object-contain" />
            ) : (
              <Building className={`${showMinimal ? 'h-6 w-6' : 'h-8 w-8'} text-gray-400`} />
            )}
          </div>
        </div>
        
        {/* Job Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`${showMinimal ? 'text-base' : 'text-lg'} font-semibold text-gray-900 truncate`}>{title}</h3>
              <div className="flex items-center space-x-2">
                <p className={`${showMinimal ? 'text-sm' : 'text-md'} font-medium text-gray-700`}>{company}</p>
                {isVerified && !showMinimal && (
                  <span className="inline-flex items-center">
                    <BadgeCheck className="h-4 w-4 text-teal-500" />
                  </span>
                )}
              </div>
            </div>
            
            {/* Save Job Button - Only show when not in minimal mode */}
            {!showMinimal && (
              <button
                onClick={handleSaveToggle}
                className="flex-shrink-0 text-gray-400 hover:text-teal-600 transition-colors hidden sm:block"
                aria-label={isLocalSaved ? "Unsave job" : "Save job"}
              >
                <Bookmark className={`h-6 w-6 ${isLocalSaved ? 'fill-teal-600 text-teal-600' : 'fill-transparent'}`} />
              </button>
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
        
        {/* Action Buttons - Only show when details panel is closed */}
        {!isAnySelected && (
          <div className="flex-shrink-0 ml-2 flex flex-col space-y-2">
            {/* Apply Button */}
            <div onClick={(e) => e.stopPropagation()}>
              <AnimatedApplyButton 
                onClick={() => {
                  // Handle apply click
                }}
                size="sm"
                className="w-40"
              />
            </div>
            {/* View Details Button */}
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
        )}
      </div>
    </div>
  );
} 