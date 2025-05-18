'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import JobSearchBar from '@/app/components/JobSearchBar';
import JobCard from '@/app/components/JobCard';
import JobDetailsPanel from '@/app/components/JobDetailsPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Job } from '@/app/types';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState('relevance');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const jobsPerPage = 5; // Number of jobs to display per page
  
  // Sample job data
  const sampleJobs: Job[] = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc',
      logo: '',
      location: 'Remote',
      salary: '120,000 - 150,000',
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
    {
      id: 2,
      title: 'Backend Engineer',
      company: 'DataFlow Systems',
      logo: '',
      location: 'San Francisco, CA',
      salary: '130,000 - 160,000',
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
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'Creative Solutions',
      logo: '',
      location: 'New York, NY (Hybrid)',
      salary: '90,000 - 120,000',
      salaryValue: 90000,
      jobType: 'Full-time',
      postedDate: '3 days ago',
      description: 'We\'re seeking a talented UX/UI Designer to create beautiful, intuitive interfaces for our clients. You should have a portfolio demonstrating your design skills and user-centered approach.',
      isVerified: false,
      providesSponsorship: false,
      experienceLevel: 'mid',
      jobUrl: 'https://example.com/jobs/ux-ui-designer',
      responsibilities: [
        "Create wireframes, prototypes, and high-fidelity mockups",
        "Conduct user research and usability testing",
        "Develop user personas and journey maps",
        "Collaborate with developers to ensure design implementation",
        "Maintain design systems and style guides"
      ],
      requirements: [
        "3+ years of experience in UX/UI design",
        "Proficiency with design tools (Figma, Sketch, Adobe XD)",
        "Strong portfolio showcasing user-centered design process",
        "Understanding of accessibility standards and best practices",
        "Excellent communication and presentation skills"
      ]
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      logo: '',
      location: 'Remote',
      salary: '110,000 - 140,000',
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
    },
    {
      id: 5,
      title: 'Junior Software Developer',
      company: 'StartUp Innovations',
      logo: '',
      location: 'Chicago, IL (Hybrid)',
      salary: '70,000 - 90,000',
      salaryValue: 70000,
      jobType: 'Full-time',
      postedDate: '1 day ago',
      description: 'Exciting opportunity for a junior developer to join our growing team. You\'ll work on a variety of projects with modern technologies while being mentored by senior developers.',
      isVerified: false,
      providesSponsorship: false,
      experienceLevel: 'entry',
      jobUrl: 'https://example.com/jobs/junior-software-developer',
      responsibilities: [
        "Develop and maintain web applications using JavaScript frameworks",
        "Write clean, maintainable, and efficient code",
        "Collaborate with cross-functional teams",
        "Participate in code reviews and testing",
        "Learn and adapt to new technologies and methodologies"
      ],
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "Basic knowledge of HTML, CSS, and JavaScript",
        "Familiarity with at least one modern framework (React, Angular, Vue)",
        "Strong problem-solving skills and attention to detail",
        "Willingness to learn and grow professionally"
      ]
    }
  ];
  
  // Calculate pagination values
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  // Filter jobs based on URL parameters
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let filtered = [...sampleJobs];
      
      // Apply search query filter
      const query = searchParams.get('query') || '';
      if (query) {
        const searchTerms = query.toLowerCase();
        filtered = filtered.filter(job => 
          job.title.toLowerCase().includes(searchTerms) || 
          job.company.toLowerCase().includes(searchTerms) || 
          job.description.toLowerCase().includes(searchTerms)
        );
      }
      
      // Apply minimum salary filter
      const minSalary = searchParams.get('salary');
      if (minSalary && minSalary !== 'any') {
        const minSalaryValue = parseInt(minSalary);
        filtered = filtered.filter(job => job.salaryValue >= minSalaryValue);
      }
      
      // Apply location filter
      const location = searchParams.get('location');
      if (location && location !== 'any') {
        if (location === 'remote') {
          filtered = filtered.filter(job => job.location.toLowerCase().includes('remote'));
        } else if (location === 'hybrid') {
          filtered = filtered.filter(job => job.location.toLowerCase().includes('hybrid'));
        } else if (location === 'onsite') {
          filtered = filtered.filter(job => 
            !job.location.toLowerCase().includes('remote') && 
            !job.location.toLowerCase().includes('hybrid')
          );
        } else if (location === 'us') {
          filtered = filtered.filter(job => job.location.includes('CA') || job.location.includes('NY') || job.location.includes('IL'));
        }
      }
      
      // Apply experience level filter
      const experience = searchParams.get('experience');
      if (experience && experience !== 'any') {
        filtered = filtered.filter(job => job.experienceLevel === experience);
      }
      
      // Apply sponsorship filter
      const sponsorship = searchParams.get('sponsorship');
      if (sponsorship && sponsorship !== 'any') {
        const providesSponsor = sponsorship === 'yes';
        filtered = filtered.filter(job => job.providesSponsorship === providesSponsor);
      }
      
      // Apply sorting
      if (sortOption === 'recent') {
        // Sort by most recent first (this is simplified as we don't have actual dates)
        filtered.sort((a, b) => a.postedDate.localeCompare(b.postedDate));
      } else if (sortOption === 'salary-high') {
        // Sort by salary high to low
        filtered.sort((a, b) => b.salaryValue - a.salaryValue);
      } else if (sortOption === 'salary-low') {
        // Sort by salary low to high
        filtered.sort((a, b) => a.salaryValue - b.salaryValue);
      }
      
      setFilteredJobs(filtered);
      setCurrentPage(1); // Reset to first page when filters change
      setIsLoading(false);
    }, 500); // Simulate loading delay
  }, [searchParams, sortOption]);
  
  // Handle sort option change
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };
  
  // Handle job selection for details
  const handleViewDetails = (job: Job) => {
    if (job.id === selectedJob?.id) {
      setSelectedJob(null);
      return;
    }
    
    setIsLoadingDetails(true);
    // Simulate API call to fetch job details
    setTimeout(() => {
      setSelectedJob(job);
      setIsLoadingDetails(false);
    }, 300);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full pb-6">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Main content layout with optional details panel */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: Search, filters, and job listings */}
          <div className={`${selectedJob ? 'lg:w-2/5' : 'w-full'} flex-shrink-0`}>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h1 className="text-2xl font-bold mb-6 text-gray-900">Find Your Next Opportunity</h1>
              <JobSearchBar detailsOpen={!!selectedJob} isLoading={isLoading} />
            </div>
            
            {/* Job Listing Header */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-gray-600">
                  {isLoading ? (
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                  ) : (
                    <p className="font-medium">{filteredJobs.length} jobs found</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <Select 
                    value={sortOption}
                    onValueChange={handleSortChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                      <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Job Listings */}
            <div className="space-y-4">
              {isLoading ? (
                // Show skeleton cards when loading
                [...Array(5)].map((_, index) => (
                  <JobCard
                    key={index}
                    title=""
                    company=""
                    logo=""
                    location=""
                    salary=""
                    jobType=""
                    postedDate=""
                    description=""
                    isLoading={true}
                  />
                ))
              ) : currentJobs.length > 0 ? (
                currentJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    company={job.company}
                    logo={job.logo}
                    location={job.location}
                    salary={job.salary}
                    jobType={job.jobType}
                    postedDate={job.postedDate}
                    description={job.description}
                    isVerified={job.isVerified}
                    isSponsored={job.isSponsored}
                    providesSponsorship={job.providesSponsorship}
                    compact={false}
                    isSelected={selectedJob?.id === job.id}
                    isAnySelected={!!selectedJob}
                    onViewDetails={() => handleViewDetails(job)}
                    id={job.id}
                  />
                ))
              ) : (
                // Empty State (when no jobs found)
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search filters or search for a different role.</p>
                  <button 
                    onClick={() => window.location.href = '/jobs'}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
              
              {/* Pagination - Only show if we have jobs and more than one page */}
              {!isLoading && filteredJobs.length > 0 && totalPages > 0 && (
                <div className="mt-8 flex justify-center">
                  <nav className="inline-flex rounded-md shadow bg-white border border-gray-200">
                    {/* Previous button - only show if not on first page */}
                    {currentPage > 1 && (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                        className="inline-flex items-center px-3 py-2 rounded-l-md border-r border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        Previous
                      </a>
                    )}
                    
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, index) => (
                      <a
                        key={index + 1}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(index + 1);
                        }}
                        className={`inline-flex items-center px-3 py-2 border-r border-gray-200 bg-white text-sm font-medium ${
                          currentPage === index + 1 ? 'text-teal-600' : 'text-gray-500 hover:bg-gray-50'
                        } ${currentPage > 1 || index > 0 ? '' : 'rounded-l-md'} ${currentPage < totalPages || index < totalPages - 1 ? '' : 'rounded-r-md border-r-0'}`}
                      >
                        {index + 1}
                      </a>
                    ))}
                    
                    {/* Next button - only show if not on last page */}
                    {currentPage < totalPages && (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                        className="inline-flex items-center px-3 py-2 rounded-r-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        Next
                      </a>
                    )}
                  </nav>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column: Job Details Panel */}
          {(selectedJob || isLoadingDetails) && (
            <div className="lg:w-3/5 lg:sticky lg:top-[5.5rem] lg:h-[calc(100vh-7rem)] self-start">
              <JobDetailsPanel 
                job={selectedJob} 
                onClose={() => setSelectedJob(null)} 
                isLoading={isLoadingDetails}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}