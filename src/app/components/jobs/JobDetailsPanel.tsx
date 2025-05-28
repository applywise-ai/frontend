'use client';

import { useState } from 'react';
import { Building, BadgeCheck, X, ExternalLink, Bookmark, DollarSign, MapPin, Briefcase, Clock, Globe, GraduationCap, Link as LinkIcon } from 'lucide-react';
import JobDetailsPanelSkeleton from '@/app/components/loading/JobDetailsPanelSkeleton';
import { Job } from '@/app/types/job';
import { ROLE_LEVEL_OPTIONS } from '@/app/types/job';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';

interface JobDetailsPanelProps {
  job: Job | null;
  onClose: () => void;
  isLoading?: boolean;
}

export default function JobDetailsPanel({ job, onClose, isLoading = false }: JobDetailsPanelProps) {
  const [isSaved, setIsSaved] = useState(false);
  
  if (isLoading) {
    return <JobDetailsPanelSkeleton />;
  }
  
  if (!job) return null;
  
  return (
    <div className="bg-white border-t border-l border-gray-200/60 shadow-lg h-screen flex flex-col pb-16">
      {/* Header with close button */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0 z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200 mr-3">
            {job.logo ? (
              <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
            ) : (
              <Building className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{job.title}</h2>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600">{job.company}</span>
              {job.isVerified && <BadgeCheck className="h-4 w-4 text-teal-500" />}
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Content - scrollable */}
      <div className="p-6 space-y-6 overflow-y-auto flex-grow">
        {/* Apply and Save Buttons */}
        <div className="flex space-x-3">
          <AnimatedApplyButton 
            onClick={() => {
              // Handle quick apply
            }}
            className="flex-1"
            applicationId={job.id.toString()}
          />
          
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
          
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-teal-600 text-teal-600' : 'text-gray-400 fill-transparent'}`} />
          </button>
        </div>
        
        {/* Key Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-gray-900">Job Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-100 rounded-full p-2">
                <DollarSign className="h-5 w-5 text-teal-700" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Salary Range</div>
                <div className="font-medium">{job.salary}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <MapPin className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium">{job.location}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-full p-2">
                <Briefcase className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Job Type</div>
                <div className="font-medium">{job.jobType}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 rounded-full p-2">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Posted</div>
                <div className="font-medium">{job.postedDate}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-full p-2">
                <GraduationCap className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Experience</div>
                <div className="font-medium">
                  {ROLE_LEVEL_OPTIONS.find(level => level.value === job.experienceLevel)?.label || job.experienceLevel}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`${job.providesSponsorship ? 'bg-emerald-100' : 'bg-gray-100'} rounded-full p-2`}>
                <Globe className={`h-5 w-5 ${job.providesSponsorship ? 'text-emerald-700' : 'text-gray-700'}`} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Visa Sponsorship</div>
                <div className="font-medium">{job.providesSponsorship ? 'Available' : 'Not Available'}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Company Section */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3 text-base sm:text-lg">Company Information</h3>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
              {job.logo ? (
                <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
              ) : (
                <Building className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-base sm:text-lg">{job.company}</h4>
              <div className="flex items-center space-x-2">
                <LinkIcon className="h-4 w-4 text-teal-600" />
                <a href="#" className="text-teal-600 hover:underline text-sm">Company Website</a>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            We are a leading tech company focused on innovation and quality. Our team consists of talented individuals who are passionate about technology and creating amazing products.
          </p>
        </div>
        
        {/* Description */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Job Description</h3>
          <div className="prose max-w-none text-gray-600">
            <p>{job.description}</p>
            
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Responsibilities:</h4>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                {job.responsibilities && job.responsibilities.length > 0 && (
                  job.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                )}
              </ul>
            </div>
            
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Requirements:</h4>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                {job.requirements && job.requirements.length > 0 && (
                  job.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 