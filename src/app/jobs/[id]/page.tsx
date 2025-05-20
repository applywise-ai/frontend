'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DollarSign, MapPin, Briefcase, Clock, Building, Bookmark, BadgeCheck, Globe, Link as LinkIcon, GraduationCap, ExternalLink, ArrowLeft } from 'lucide-react';
import { Job, experienceLevelMap } from '@/app/types';
import Link from 'next/link';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';

export default function JobDetailsPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [referrer, setReferrer] = useState<string>('/jobs');
  
  // Detect referrer
  useEffect(() => {
    // Check if we came from saved-jobs page
    if (document.referrer.includes('/saved-jobs')) {
      setReferrer('/saved-jobs');
    }
  }, []);
  
  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      
      // In a real app, you would fetch this from an API
      // For now, we'll simulate an API call with mock data
      setTimeout(() => {
        // This is mock data - in a real app, you'd fetch this from your API
        const mockJobs: Record<string, Job> = {
          '1': {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'Tech Innovations Inc',
            logo: '',
            location: 'Remote',
            salary: '$120,000 - $150,000',
            salaryValue: 120000,
            jobType: 'Full-time',
            postedDate: '2 days ago',
            description: 'We are looking for a skilled Senior Frontend Developer to join our team. You will be responsible for building and maintaining our web applications using modern JavaScript frameworks.',
            isVerified: true,
            providesSponsorship: true,
            experienceLevel: 'senior',
            jobUrl: 'https://example.com/jobs/senior-frontend-developer',
            responsibilities: [
              "Lead frontend development for complex web applications",
              "Architect scalable and maintainable frontend solutions",
              "Collaborate with UX/UI designers to implement responsive designs",
              "Mentor junior developers and conduct code reviews",
              "Optimize application performance and ensure cross-browser compatibility"
            ],
            requirements: [
              "5+ years of experience with modern JavaScript frameworks (React, Vue, or Angular)",
              "Strong understanding of HTML5, CSS3, and responsive design principles",
              "Experience with state management solutions (Redux, Vuex, etc.)",
              "Knowledge of modern build tools and workflows (Webpack, Babel, etc.)",
              "Bachelor's degree in Computer Science or equivalent experience"
            ]
          },
          '2': {
            id: 2,
            title: 'Backend Engineer',
            company: 'DataFlow Systems',
            logo: '',
            location: 'San Francisco, CA',
            salary: '$130,000 - $160,000',
            salaryValue: 130000,
            jobType: 'Full-time',
            postedDate: '1 week ago',
            description: 'Join our engineering team to build scalable backend services. Experience with Node.js, Python, and cloud infrastructure required.',
            isVerified: true,
            isSponsored: true,
            providesSponsorship: false,
            experienceLevel: 'mid',
            jobUrl: 'https://example.com/jobs/backend-engineer',
            responsibilities: [
              "Design and implement scalable backend services and APIs",
              "Optimize database queries and data structures",
              "Implement security and data protection measures",
              "Integrate with third-party services and APIs",
              "Participate in on-call rotation to support production systems"
            ],
            requirements: [
              "3+ years experience with Node.js or Python",
              "Familiarity with SQL and NoSQL databases",
              "Experience with cloud platforms (AWS, GCP, or Azure)",
              "Knowledge of microservices architecture",
              "Understanding of CI/CD pipelines and DevOps practices"
            ]
          },
          '4': {
            id: 4,
            title: 'DevOps Engineer',
            company: 'Cloud Systems',
            logo: '',
            location: 'Remote',
            salary: '$110,000 - $140,000',
            salaryValue: 110000,
            jobType: 'Contract',
            postedDate: '5 days ago',
            description: 'Looking for an experienced DevOps Engineer to help us build and maintain our cloud infrastructure. Experience with AWS, Kubernetes, and CI/CD pipelines required.',
            isVerified: true,
            providesSponsorship: true,
            experienceLevel: 'senior',
            jobUrl: 'https://example.com/jobs/devops-engineer',
            responsibilities: [
              "Design and implement cloud infrastructure using IaC tools",
              "Set up and maintain CI/CD pipelines",
              "Monitor system performance and troubleshoot issues",
              "Implement security best practices and compliance measures",
              "Automate routine operational tasks"
            ],
            requirements: [
              "4+ years of experience in DevOps or SRE roles",
              "Strong knowledge of AWS or other cloud platforms",
              "Experience with container orchestration (Kubernetes, Docker Swarm)",
              "Proficiency with infrastructure as code tools (Terraform, CloudFormation)",
              "Understanding of networking concepts and security practices"
            ]
          }
        };
        
        const jobId = params.id as string;
        const foundJob = mockJobs[jobId] || null;
        
        setJob(foundJob);
        setIsLoading(false);
        
        // Check if job is saved
        // In a real app, you would check against your saved jobs in localStorage or API
        setIsSaved(false);
      }, 800);
    };
    
    fetchJobDetails();
  }, [params.id]);
  
  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    // In a real app, you would save/unsave the job in localStorage or via API
  };
  
  if (isLoading) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
        <p className="text-gray-600 mb-8">The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link 
          href="/jobs"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Jobs
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link 
          href={referrer}
          className="flex items-center mb-5 h-10 w-40 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-md transition-colors cursor-pointer mt-0"
        >
          <span className="flex items-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to jobs
          </span>
        </Link>
        
        {/* Job details card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200 mr-4">
                  {job.logo ? (
                    <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
                  ) : (
                    <Building className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{job.title}</h1>
                  <div className="flex items-center mt-1">
                    <span className="text-base sm:text-lg text-gray-600">{job.company}</span>
                    {job.isVerified && <BadgeCheck className="ml-1 h-5 w-5 text-teal-500" />}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="mr-1.5 h-4 w-4 text-gray-400" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Briefcase className="mr-1.5 h-4 w-4 text-gray-400" />
                      {job.jobType}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                      {job.postedDate}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Desktop Apply and Save Buttons */}
              <div className="hidden lg:flex lg:items-center lg:space-x-3 lg:mt-0 lg:ml-4">
                <AnimatedApplyButton
                  onClick={() => {
                    // Handle quick apply
                  }}
                />
                
                <a 
                  href={job.jobUrl || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-3.5 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  title="View original job posting"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span className="sr-only">View original job posting</span>
                </a>
                
                <button
                  onClick={handleSaveToggle}
                  className="inline-flex items-center justify-center px-4 py-3.5 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  aria-label={isSaved ? "Unsave job" : "Save job"}
                >
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-teal-600 text-teal-600' : 'text-gray-400 fill-transparent'}`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Mobile Apply and Save Buttons */}
            <div className="block lg:hidden mb-8">
              <div className="flex space-x-3">
                <AnimatedApplyButton 
                  onClick={() => {
                    // Handle quick apply
                  }}
                  className="flex-1"
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
                  onClick={handleSaveToggle}
                  className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  aria-label={isSaved ? "Unsave job" : "Save job"}
                >
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-teal-600 text-teal-600' : 'text-gray-400 fill-transparent'}`} />
                </button>
              </div>
            </div>
            
            {/* Key Details */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-3 mb-8">
              <h3 className="font-medium text-gray-900 text-lg">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 text-base sm:text-lg mb-4">Company Information</h3>
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
                    <a href="#" className="text-teal-600 hover:underline text-xs sm:text-sm">Company Website</a>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                We are a leading tech company focused on innovation and quality. Our team consists of talented individuals who are passionate about technology and creating amazing products.
              </p>
            </div>
            
            {/* Description */}
            <div className="mb-0">
              <h3 className="font-medium text-gray-900 text-base sm:text-lg mb-4">Job Description</h3>
              <div className="prose max-w-none text-gray-600">
                <p>{job.description}</p>
                
                <div className="mt-8">
                  <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3">Responsibilities:</h4>
                  <ul className="list-disc pl-5 space-y-2 mt-3">
                    {job.responsibilities && job.responsibilities.length > 0 && (
                      job.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    )}
                  </ul>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3">Requirements:</h4>
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
      </div>
    </div>
  );
} 