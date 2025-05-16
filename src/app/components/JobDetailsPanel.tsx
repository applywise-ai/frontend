'use client';

import { X, DollarSign, MapPin, Briefcase, Clock, Building, Bookmark, BadgeCheck, Globe, Zap, Link, GraduationCap } from 'lucide-react';
import { useState } from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  salaryValue: number;
  jobType: string;
  postedDate: string;
  description: string;
  isVerified?: boolean;
  isSponsored?: boolean;
  providesSponsorship?: boolean;
  experienceLevel: string;
}

interface JobDetailsPanelProps {
  job: Job | null;
  onClose: () => void;
}

export default function JobDetailsPanel({ job, onClose }: JobDetailsPanelProps) {
  const [isSaved, setIsSaved] = useState(false);
  
  if (!job) return null;
  
  const experienceLevelMap: Record<string, string> = {
    'entry': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior Level',
    'executive': 'Executive'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden h-full flex flex-col">
      {/* Header with close button */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
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
          <button className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            <Zap className="mr-2 h-5 w-5" />
            Apply Now
          </button>
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
                <div className="font-medium">{experienceLevelMap[job.experienceLevel] || job.experienceLevel}</div>
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
          <h3 className="font-medium text-gray-900 mb-3">Company Information</h3>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
              {job.logo ? (
                <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
              ) : (
                <Building className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-lg">{job.company}</h4>
              <div className="flex items-center space-x-2">
                <Link className="h-4 w-4 text-teal-600" />
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
            <h4>Responsibilities:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Design and implement new features and functionality</li>
              <li>Build reusable code and libraries for future use</li>
              <li>Ensure the technical feasibility of UI/UX designs</li>
              <li>Optimize applications for maximum speed and scalability</li>
              <li>Collaborate with other team members and stakeholders</li>
            </ul>
            <h4>Requirements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Proficient with JavaScript and modern frameworks</li>
              <li>Experience with responsive design and cross-browser compatibility</li>
              <li>Strong problem-solving skills and attention to detail</li>
              <li>Excellent communication and teamwork abilities</li>
              <li>Bachelor's degree in Computer Science or related field (or equivalent experience)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 