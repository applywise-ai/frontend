'use client';

import React, { useState, useEffect } from 'react';
import { BadgeCheck, X, ExternalLink, Bookmark, DollarSign, MapPin, Briefcase, Clock, Globe, GraduationCap, Link as LinkIcon, Check, Pencil } from 'lucide-react';
import JobDetailsPanelSkeleton from '@/app/components/loading/JobDetailsPanelSkeleton';
import { Job } from '@/app/types/job';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';
import { getAvatarColor } from '@/app/utils/avatar';
import Link from 'next/link';

import SubscriptionModal from '@/app/components/SubscriptionModal';
import { useApplications } from '@/app/contexts/ApplicationsContext';
import { formatJobPostedDate, formatSalaryRange, getJobTypeLabel, getExperienceLevelLabel, getLocationLabelFromJob } from '@/app/utils/job';

interface JobDetailsPanelProps {
  job: Job | null;
  onClose?: () => void;
  isLoading?: boolean;
  fullPage?: boolean;
}

export default function JobDetailsPanel({ job, onClose, isLoading = false, fullPage = false }: JobDetailsPanelProps) {
  const { toggleSave, isJobSaved, applications } = useApplications();
  
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Get the actual application status for this job
  const getApplicationStatus = (): string | null => {
    if (!job || !applications) return null;
    const application = applications.find(app => app.jobId === job.id.toString());
    return application?.status || null;
  };
  
  const applicationStatus = getApplicationStatus();
  
  // Check if job is saved when job changes
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (job?.id) {
        try {
          const saved = await isJobSaved(job.id.toString());
          setIsSaved(saved);
        } catch (error) {
          console.error('Error checking job saved status:', error);
        }
      }
    };

    checkSavedStatus();
  }, [job?.id, isJobSaved]);
  
  const handleSaveToggle = async () => {
    setIsSaveLoading(true);
    try {
      await toggleSave(job?.id.toString() || '', isSaved);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save status:', error);
    } finally {
      setIsSaveLoading(false);
    }
  };
  
  if (isLoading) {
    return <JobDetailsPanelSkeleton />;
  }
  
  if (!job) return null;
  
  // Render status-based button
  const renderStatusButton = () => {
    if (!applicationStatus) {
      return (
        <AnimatedApplyButton
          size="sm"
          jobId={job.id.toString()}
          onShowSubscriptionModal={() => setShowSubscriptionModal(true)}
        />
      );
    }
    
    switch (applicationStatus) {
      case 'Draft':
        return (
          <Link href={`/applications/${applications?.find(app => app.jobId === job.id.toString())?.id}/edit`}>
            <div className="inline-flex items-center justify-center px-4 py-3 border border-amber-200 rounded-md shadow-sm bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
              <Pencil className="h-5 w-5 mr-2" />
              <span className="font-medium">Edit Draft</span>
            </div>
          </Link>
        );
      case 'Applied':
        return (
          <div className="inline-flex items-center justify-center px-4 py-3 border border-blue-200 rounded-md shadow-sm bg-blue-50 text-blue-700">
            <Check className="h-5 w-5 mr-2" />
            <span className="font-medium">Applied</span>
          </div>
        );
      case 'Interviewing':
        return (
          <div className="inline-flex items-center justify-center px-4 py-3 border border-green-200 rounded-md shadow-sm bg-green-50 text-green-700">
            <Check className="h-5 w-5 mr-2" />
            <span className="font-medium">Interviewing</span>
          </div>
        );
      case 'Accepted':
        return (
          <div className="inline-flex items-center justify-center px-4 py-3 border border-emerald-200 rounded-md shadow-sm bg-emerald-50 text-emerald-700">
            <Check className="h-5 w-5 mr-2" />
            <span className="font-medium">Accepted</span>
          </div>
        );
      case 'Rejected':
        return (
          <div className="inline-flex items-center justify-center px-4 py-3 border border-red-200 rounded-md shadow-sm bg-red-50 text-red-700">
            <X className="h-5 w-5 mr-2" />
            <span className="font-medium">Rejected</span>
          </div>
        );
      case 'Pending':
        return (
          <div className="inline-flex items-center justify-center px-4 py-3 border border-orange-200 rounded-md shadow-sm bg-orange-50 text-orange-700">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-medium">Pending</span>
          </div>
        );
      case 'Failed':
        return (
          <div className="inline-flex items-center justify-center px-4 py-3 border border-red-200 rounded-md shadow-sm bg-red-50 text-red-700">
            <X className="h-5 w-5 mr-2" />
            <span className="font-medium">Failed</span>
          </div>
        );
      case 'Not Found':
        return (
          <div className="inline-flex items-center justify-center px-4 py-3 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-gray-700">
            <X className="h-5 w-5 mr-2" />
            <span className="font-medium">Not Found</span>
          </div>
        );
      case 'Saved':
        return (
          <AnimatedApplyButton 
            jobId={job.id.toString()}
            onShowSubscriptionModal={() => setShowSubscriptionModal(true)}
          />
        );
      default:
        return (
          <AnimatedApplyButton 
            jobId={job.id.toString()}
            onShowSubscriptionModal={() => setShowSubscriptionModal(true)}
          />
        );
    }
  };
  
  return (
    <div className={`bg-white ${!fullPage && 'border-t border-l border-gray-200/60 shadow-lg h-screen pb-16'} flex flex-col`}>
      {/* Header with close button */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0 z-10">
        <div className="flex items-center min-w-0 flex-1">
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 mr-3 flex-shrink-0
            ${job.logo ? 'bg-gray-100' : getAvatarColor(job.company)}
          `}>
            {job.logo ? (
              <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
            ) : (
              <div className="text-lg font-bold text-white drop-shadow-sm">
                {job.company.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{job.title}</h2>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600">{job.company}</span>
              {job.isVerified && <BadgeCheck className="h-4 w-4 text-teal-500 flex-shrink-0" />}
            </div>
          </div>
        </div>
        
        {/* Action buttons - show in header on lg and down when not fullPage */}
        {!fullPage && (
          <div className="hidden lg:flex items-center space-x-2 ml-4 flex-shrink-0">
            <div className="flex-shrink-0">
              {renderStatusButton()}
            </div>
            
            <a 
              href={job.jobUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex-shrink-0"
              title="View original job posting"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View original job posting</span>
            </a>
            {!applicationStatus || applicationStatus === 'Saved' ? (
            <button
              onClick={handleSaveToggle}
              disabled={isSaveLoading}
              className="inline-flex items-center justify-center h-10 px-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-teal-600 text-teal-600' : 'text-gray-400 fill-transparent'} ${isSaveLoading ? 'animate-pulse' : ''}`} />
            </button>
            ) : null}
          </div>
        )}
        
        {/* Action buttons - show in header on md and down when not fullPage, but smaller */}
        {!fullPage && (
          <div className="lg:hidden flex items-center space-x-2 ml-3 flex-shrink-0">
            <div className="flex-shrink-0">
              {renderStatusButton()}
            </div>
            
            <a 
              href={job.jobUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex-shrink-0"
              title="View original job posting"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View original job posting</span>
            </a>
            {!applicationStatus || applicationStatus === 'Saved' ? (
            <button
              onClick={handleSaveToggle}
              disabled={isSaveLoading}
              className="inline-flex items-center justify-center h-10 px-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-teal-600 text-teal-600' : 'text-gray-400 fill-transparent'} ${isSaveLoading ? 'animate-pulse' : ''}`} />
            </button>
            ) : null}
          </div>
        )}
        
        {/* Action buttons - show in header on large screens when fullPage */}
        {fullPage && (
          <div className="hidden md:flex space-x-3">
            {renderStatusButton()}
            
            <a 
              href={job.jobUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-12 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              title="View original job posting"
            >
              <ExternalLink className="h-5 w-5" />
              <span className="sr-only">View original job posting</span>
            </a>
            {!applicationStatus || applicationStatus === 'Saved' ? (
            <button
              onClick={handleSaveToggle}
              disabled={isSaveLoading}
              className="inline-flex items-center justify-center h-12 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-teal-600 text-teal-600' : 'text-gray-400 fill-transparent'} ${isSaveLoading ? 'animate-pulse' : ''}`} />
            </button>
            ) : null}
          </div>
        )}
        
        {!fullPage && onClose && (
          <button 
            onClick={onClose}
            className="inline-flex items-center justify-center h-10 w-10 border border-gray-300 rounded-md shadow-sm bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ml-2 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Content - scrollable for sidebar, normal flow for full page */}
      <div className={`${fullPage ? 'p-4' : 'p-6'} ${fullPage ? 'space-y-3' : 'space-y-4'} ${fullPage ? '' : 'overflow-y-auto flex-grow'}`}>
        {/* Apply and Save Buttons - show below header on small screens when fullPage, or when buttons don't fit in header */}
        {fullPage && (
          <div className="md:hidden flex space-x-3">
            <div className="flex-1">
              {renderStatusButton()}
            </div>
            
            <a 
              href={job.jobUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              title="View original job posting"
            >
              <ExternalLink className="h-5 w-5" />
              <span className="sr-only">View original job posting</span>
            </a>
            {!applicationStatus || applicationStatus === 'Saved' ? (
            <button
              onClick={handleSaveToggle}
              disabled={isSaveLoading}
              className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-teal-600 text-teal-600' : 'text-gray-400 fill-transparent'} ${isSaveLoading ? 'animate-pulse' : ''}`} />
            </button>
            ) : null}
          </div>
        )}
        

        
        {/* Key Details and Company Info - Side by side on large screens when fullPage */}
        <div className={`${fullPage ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}`}>
          {/* Key Details */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200/60">
            <h3 className="font-semibold text-gray-900 mb-3 text-base flex items-center">
              <div className="w-1.5 h-4 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full mr-2"></div>
              Job Details
            </h3>
            <div className="bg-white/70 rounded-md p-3 border border-gray-200/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg p-2 shadow-sm">
                    <DollarSign className="h-4 w-4 text-teal-700" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Salary Range</div>
                    <div className="font-semibold text-sm text-gray-900">
                      {formatSalaryRange(job)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-2 shadow-sm">
                    <MapPin className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Location</div>
                    <div className="font-semibold text-sm text-gray-900">{getLocationLabelFromJob(job)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-2 shadow-sm">
                    <Briefcase className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Job Type</div>
                    <div className="font-semibold text-sm text-gray-900">{getJobTypeLabel(job.jobType)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-2 shadow-sm">
                    <Clock className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Posted</div>
                    <div className="font-semibold text-sm text-gray-900">
                      {job.postedDate ? formatJobPostedDate(job.postedDate) : 'Recently'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2 shadow-sm">
                    <GraduationCap className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Experience</div>
                    <div className="font-semibold text-sm text-gray-900">
                      {getExperienceLevelLabel(job.experienceLevel)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`bg-gradient-to-br ${job.providesSponsorship ? 'from-emerald-100 to-emerald-200' : 'from-gray-100 to-gray-200'} rounded-lg p-2 shadow-sm`}>
                    <Globe className={`h-4 w-4 ${job.providesSponsorship ? 'text-emerald-700' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Visa Sponsorship</div>
                    <div className="font-semibold text-sm text-gray-900">{job.providesSponsorship ? 'Available' : 'Not Available'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Company Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200/60 flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-3 text-base flex items-center">
              <div className="w-1.5 h-4 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full mr-2"></div>
              Company Information
            </h3>
            <div className="flex items-start space-x-3 mb-3">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden border-2 border-white shadow-sm
                ${job.logo ? 'bg-white' : getAvatarColor(job.company)}
              `}>
                {job.logo ? (
                  <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain p-1.5" />
                ) : (
                  <div className="text-base font-bold text-white drop-shadow-sm">
                    {job.company.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-base text-gray-900">{job.company}</h4>
                  {job.isVerified && <BadgeCheck className="h-4 w-4 text-teal-500" />}
                </div>
                {job.companyUrl && (
                  <div className="flex items-center space-x-2">
                    <div className="bg-teal-100 rounded-full p-1">
                      <LinkIcon className="h-3 w-3 text-teal-600" />
                    </div>
                    <a 
                      href={job.companyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 hover:underline text-xs font-medium transition-colors"
                    >
                      Visit Company Website
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className={`bg-white/70 rounded-md p-3 border border-gray-200/40 ${fullPage ? 'flex-1' : ''}`}>
              <p className="text-gray-700 leading-relaxed text-sm">
                We are a leading tech company focused on innovation and quality. Our team consists of talented individuals who are passionate about technology and creating amazing products.
              </p>
            </div>
          </div>
        </div>
        
        {/* Job Description */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200/60">
          <h3 className="font-semibold text-gray-900 mb-3 text-base flex items-center">
            <div className="w-1.5 h-4 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full mr-2"></div>
            Job Description
          </h3>
          <div className="bg-white/70 rounded-md p-3 border border-gray-200/40">
            <p className="text-gray-700 leading-relaxed text-sm">{job.description}</p>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200/60">
          <h3 className="font-semibold text-gray-900 mb-3 text-base flex items-center">
            <div className="w-1.5 h-4 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full mr-2"></div>
            Responsibilities
          </h3>
          <div className="bg-white/70 rounded-md p-3 border border-gray-200/40">
            <ul className="space-y-1.5">
              {job.responsibilities && job.responsibilities.length > 0 && (
                job.responsibilities.map((item, index) => (
                  <li key={`responsibility-${index}`} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed text-sm">{item}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200/60">
          <h3 className="font-semibold text-gray-900 mb-3 text-base flex items-center">
            <div className="w-1.5 h-4 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full mr-2"></div>
            Requirements
          </h3>
          <div className="bg-white/70 rounded-md p-3 border border-gray-200/40">
            <ul className="space-y-1.5">
              {job.requirements && job.requirements.length > 0 && (
                job.requirements.map((item, index) => (
                  <li key={`requirement-${index}`} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed text-sm">{item}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
} 