'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import JobSearchBar from '@/app/components/jobs/JobSearchBar';
import JobCard from '@/app/components/jobs/JobCard';
import JobDetailsPanel from '@/app/components/jobs/JobDetailsPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Job } from '@/app/types/job';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState('none');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const jobsPerPage = 9; // Updated to match applications page
  
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
    },
    {
      id: 6,
      title: 'Machine Learning Engineer',
      company: 'AI Solutions Corp',
      logo: '',
      location: 'Boston, MA',
      salary: '140,000 - 180,000',
      salaryValue: 140000,
      jobType: 'Full-time',
      postedDate: '4 days ago',
      description: 'Join our AI team to develop and deploy machine learning models that power our next-generation products. Experience with TensorFlow, PyTorch, and cloud ML platforms required.',
      isVerified: true,
      providesSponsorship: true,
      experienceLevel: 'senior',
      jobUrl: 'https://example.com/jobs/ml-engineer',
      responsibilities: [
        "Design and implement machine learning models",
        "Optimize model performance and scalability",
        "Collaborate with data scientists and engineers",
        "Deploy models to production environments",
        "Research and implement new ML techniques"
      ],
      requirements: [
        "5+ years of experience in machine learning",
        "Strong Python programming skills",
        "Experience with ML frameworks (TensorFlow, PyTorch)",
        "Knowledge of cloud ML platforms (AWS SageMaker, GCP AI Platform)",
        "Master's or PhD in Computer Science, Statistics, or related field"
      ]
    },
    {
      id: 7,
      title: 'Product Manager',
      company: 'Innovation Labs',
      logo: '',
      location: 'Seattle, WA (Hybrid)',
      salary: '100,000 - 130,000',
      salaryValue: 100000,
      jobType: 'Full-time',
      postedDate: '2 weeks ago',
      description: 'We\'re looking for a Product Manager to drive the development of our enterprise software solutions. You\'ll work closely with engineering, design, and business teams to deliver exceptional products.',
      isVerified: true,
      providesSponsorship: false,
      experienceLevel: 'mid',
      jobUrl: 'https://example.com/jobs/product-manager',
      responsibilities: [
        "Define product strategy and roadmap",
        "Gather and prioritize product requirements",
        "Work with cross-functional teams to deliver features",
        "Analyze market trends and competitor products",
        "Track and report on product metrics"
      ],
      requirements: [
        "3+ years of product management experience",
        "Strong analytical and problem-solving skills",
        "Excellent communication and leadership abilities",
        "Experience with agile development methodologies",
        "Technical background or understanding of software development"
      ]
    },
    {
      id: 8,
      title: 'Mobile App Developer Intern',
      company: 'AppWorks',
      logo: '',
      location: 'Remote',
      salary: '95,000 - 125,000',
      salaryValue: 95000,
      jobType: 'Full-time',
      postedDate: '1 week ago',
      description: 'Join our mobile development team to create innovative iOS and Android applications. Experience with React Native, Swift, or Kotlin required.',
      isVerified: false,
      providesSponsorship: true,
      experienceLevel: 'intern',
      jobUrl: 'https://example.com/jobs/mobile-developer',
      responsibilities: [
        "Develop and maintain mobile applications",
        "Implement responsive and intuitive UIs",
        "Integrate with backend services and APIs",
        "Optimize app performance and user experience",
        "Collaborate with designers and product managers"
      ],
      requirements: [
        "3+ years of mobile development experience",
        "Proficiency in React Native, Swift, or Kotlin",
        "Experience with mobile app architecture patterns",
        "Knowledge of mobile UI/UX best practices",
        "Understanding of app store submission process"
      ]
    },
    {
      id: 9,
      title: 'Data Scientist',
      company: 'Analytics Pro',
      logo: '',
      location: 'Austin, TX',
      salary: '115,000 - 145,000',
      salaryValue: 115000,
      jobType: 'Full-time',
      postedDate: '3 days ago',
      description: 'We\'re seeking a Data Scientist to help us extract insights from large datasets and build predictive models. Experience with statistical analysis and machine learning required.',
      isVerified: true,
      providesSponsorship: true,
      experienceLevel: 'senior',
      jobUrl: 'https://example.com/jobs/data-scientist',
      responsibilities: [
        "Analyze complex datasets to identify patterns",
        "Develop and implement predictive models",
        "Create data visualizations and reports",
        "Collaborate with business stakeholders",
        "Present findings to technical and non-technical audiences"
      ],
      requirements: [
        "4+ years of experience in data science",
        "Strong programming skills in Python or R",
        "Experience with statistical analysis and ML",
        "Knowledge of SQL and data warehousing",
        "Master's degree in Statistics, Mathematics, or related field"
      ]
    },
    {
      id: 10,
      title: 'Security Engineer',
      company: 'SecureTech',
      logo: '',
      location: 'Washington, DC',
      salary: '125,000 - 155,000',
      salaryValue: 125000,
      jobType: 'Full-time',
      postedDate: '5 days ago',
      description: 'Join our security team to protect our systems and data. Experience with security tools, penetration testing, and compliance frameworks required.',
      isVerified: true,
      providesSponsorship: false,
      experienceLevel: 'senior',
      jobUrl: 'https://example.com/jobs/security-engineer',
      responsibilities: [
        "Implement security controls and best practices",
        "Conduct security assessments and penetration testing",
        "Monitor and respond to security incidents",
        "Develop security policies and procedures",
        "Ensure compliance with security standards"
      ],
      requirements: [
        "5+ years of experience in security engineering",
        "Knowledge of security tools and frameworks",
        "Experience with penetration testing",
        "Understanding of compliance requirements",
        "Relevant security certifications (CISSP, CEH, etc.)"
      ]
    },
    {
      id: 11,
      title: 'Full Stack Developer',
      company: 'WebTech Solutions',
      logo: '',
      location: 'Denver, CO (Hybrid)',
      salary: '105,000 - 135,000',
      salaryValue: 105000,
      jobType: 'Full-time',
      postedDate: '2 days ago',
      description: 'We\'re looking for a Full Stack Developer to build and maintain our web applications. Experience with modern JavaScript frameworks and backend technologies required.',
      isVerified: false,
      providesSponsorship: true,
      experienceLevel: 'mid',
      jobUrl: 'https://example.com/jobs/full-stack-developer',
      responsibilities: [
        "Develop full-stack web applications",
        "Implement responsive and accessible UIs",
        "Design and optimize database schemas",
        "Write clean, maintainable code",
        "Collaborate with cross-functional teams"
      ],
      requirements: [
        "3+ years of full-stack development experience",
        "Proficiency in JavaScript/TypeScript",
        "Experience with React, Node.js, and SQL",
        "Knowledge of web development best practices",
        "Understanding of cloud platforms and services"
      ]
    },
    {
      id: 12,
      title: 'QA Engineer',
      company: 'Quality First',
      logo: '',
      location: 'Remote',
      salary: '85,000 - 110,000',
      salaryValue: 85000,
      jobType: 'Full-time',
      postedDate: '1 week ago',
      description: 'Join our QA team to ensure the quality of our software products. Experience with automated testing, test planning, and quality assurance processes required.',
      isVerified: false,
      providesSponsorship: false,
      experienceLevel: 'mid',
      jobUrl: 'https://example.com/jobs/qa-engineer',
      responsibilities: [
        "Develop and execute test plans",
        "Create and maintain automated tests",
        "Perform manual testing when needed",
        "Report and track bugs",
        "Collaborate with development teams"
      ],
      requirements: [
        "3+ years of QA experience",
        "Knowledge of testing methodologies",
        "Experience with test automation tools",
        "Understanding of software development lifecycle",
        "Strong attention to detail"
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
      const locations = searchParams.get('locations')?.split(',') || [];
      if (locations.length > 0) {
        filtered = filtered.filter(job => {
          const jobLocation = job.location.toLowerCase();
          return locations.some(loc => {
            if (loc === 'remote') {
              return jobLocation.includes('remote');
            } else if (loc === 'hybrid') {
              return jobLocation.includes('hybrid');
            } else {
              // For city locations, check if the job location contains the city name
              const cityName = loc.split('-')[0].replace(/-/g, ' '); // Convert 'new-york-ny' to 'new york'
              return jobLocation.includes(cityName);
            }
          });
        });
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
        filtered.sort((a, b) => a.postedDate.localeCompare(b.postedDate));
      } else if (sortOption === 'salary-high') {
        filtered.sort((a, b) => b.salaryValue - a.salaryValue);
      } else if (sortOption === 'salary-low') {
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

  // Add this function before the return statement
  const getVisiblePages = (currentPage: number, totalPages: number) => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
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
              <h1 className="text-lg sm:text-2xl font-bold mb-6 text-gray-900">Find Your Next Opportunity</h1>
              <JobSearchBar detailsOpen={!!selectedJob} isLoading={false} />
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
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Choose one</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                      <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Job Listings */}
            <div className={`space-y-4 ${isLoading ? 'animate-pulse' : ''}`}>
              {isLoading ? (
                // Show skeleton cards when loading
                [...Array(5)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="flex flex-wrap gap-2">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <nav className="inline-flex items-center gap-1" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-md border text-sm font-medium ${
                        currentPage === 1
                          ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' 
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                      aria-label="Previous page"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {getVisiblePages(currentPage, totalPages).map((pageNum, idx) => (
                      pageNum === '...' ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={`page-${pageNum}`}
                          onClick={() => handlePageChange(Number(pageNum))}
                          className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md min-w-[2.5rem] justify-center ${
                            currentPage === pageNum
                              ? 'z-10 bg-teal-50 border-teal-500 text-teal-600 hover:bg-teal-100'
                              : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                          aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      )
                    ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-md border text-sm font-medium ${
                            currentPage === totalPages
                          ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' 
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                      aria-label="Next page"
                        >
                          <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
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