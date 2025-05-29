'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import JobSearchBar from '@/app/components/jobs/JobSearchBar';
import JobCard from '@/app/components/jobs/JobCard';
import JobDetailsPanel from '@/app/components/jobs/JobDetailsPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Job } from '@/app/types/job';
import { getBreakpoint } from '@/app/utils/breakpoints';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState('none');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
  const isDetailsPanelOpen = !!selectedJob
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  // Close details panel on large viewport or smaller
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < getBreakpoint('lg') && isDetailsPanelOpen) { 
        setSelectedJob(null); // Close details panel on large viewport
      }
      setIsMobile(
        window.innerWidth < getBreakpoint('sm') ||
        (isDetailsPanelOpen && window.innerWidth < getBreakpoint('2xl'))
      ); // Set mobile viewport for jobs page
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [isDetailsPanelOpen]);

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
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 h-screen w-full overflow-hidden flex flex-col">
      {/* Sticky Search and Filters Header */}
      <div className={`${isDetailsPanelOpen && 'z-[60]'} flex-shrink-0 pt-2 bg-white backdrop-blur-sm border-t border-b border-gray-200/60 shadow-sm relative ${selectedJob ? 'lg:w-2/5' : 'w-full'}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-4">
            {/* Top row: Title and results/sort */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">{isMobile ? 'Jobs' : 'Find Your Next Opportunity'}</h1>
              
              {/* Results count and sort - always visible */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                  <div className="text-gray-600">
                    {isLoading ? (
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    ) : (
                      <p className="text-sm font-medium">{filteredJobs.length} jobs</p>
                    )}
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 relative ${isDetailsPanelOpen && 'z-[80]'}`}>
                  <span className="text-xs text-gray-500">Sort:</span>
                  <Select 
                    value={sortOption}
                    onValueChange={handleSortChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[140px] h-8 bg-white/80 border-gray-200/60 hover:border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`bg-white/95 backdrop-blur-sm border-gray-200/60 ${isDetailsPanelOpen && 'z-[80]'}`}>
                      <SelectItem value="none" className="text-sm">Default</SelectItem>
                      <SelectItem value="recent" className="text-sm">Recent</SelectItem>
                      <SelectItem value="salary-high" className="text-sm">Salary ↓</SelectItem>
                      <SelectItem value="salary-low" className="text-sm">Salary ↑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Bottom row: Search and filters */}
            <div className="w-full">
              <JobSearchBar 
                detailsOpen={!!selectedJob} 
                isLoading={false}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left column: Job listings */}
          <div className={`${selectedJob ? 'lg:w-2/5 lg:-ml-5' : 'w-full'} flex-shrink-0 h-full overflow-hidden flex flex-col`}>
            {/* Job Listings */}
            <div className={`flex-1 overflow-y-auto space-y-4 pb-8 ${isLoading ? 'animate-pulse' : ''}`}>
              {isLoading ? (
                // Modern skeleton cards
                [...Array(5)].map((_, index) => (
                  <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
                        <div className="flex flex-wrap gap-2">
                          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
                          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : currentJobs.length > 0 ? (
                <>
                  {currentJobs.map((job) => (
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
                  ))}
                  
                  {/* Modern Pagination */}
                  {!isLoading && filteredJobs.length > 0 && totalPages > 0 && (
                    <div className="mt-12 flex justify-center pb-6">
                      <nav className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/30" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === 1
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                          }`}
                          aria-label="Previous page"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {getVisiblePages(currentPage, totalPages).map((pageNum, idx) => (
                          pageNum === '...' ? (
                            <span
                              key={`ellipsis-${idx}`}
                              className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={`page-${pageNum}`}
                              onClick={() => handlePageChange(Number(pageNum))}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg min-w-[2.5rem] justify-center transition-all duration-200 ${
                                currentPage === pageNum
                                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
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
                          className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === totalPages
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                          }`}
                          aria-label="Next page"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                // Modern Empty State
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No jobs found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    We couldn&apos;t find any jobs matching your criteria. Try adjusting your search filters or exploring different roles.
                  </p>
                  <button 
                    onClick={() => router.replace("/jobs")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column: Job Details Panel */}
          {(selectedJob || isLoadingDetails) && (
            <div className="lg:w-3/5 lg:fixed lg:right-0 lg:top-16 lg:overflow-hidden self-start" style={{ height: 'calc(100vh - 4rem)' }}>
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