'use client';

import { useState, useEffect } from 'react';
import JobCard from '@/app/components/JobCard';
import { useRouter } from 'next/navigation';
import { Job } from '@/app/types';
import { Eye, Building, Code, Database, Paintbrush, Laptop } from 'lucide-react';

export default function SavedJobs() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3; // Showing 3 jobs per page
  
  // Calculate pagination values
  const totalPages = Math.ceil(savedJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = savedJobs.slice(indexOfFirstJob, indexOfLastJob);
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  // Simulate loading saved jobs from local storage or an API
  useEffect(() => {
    // In a real application, you would fetch this data from an API or local storage
    const fetchSavedJobs = () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // This would be replaced with actual data from localStorage or an API
        const mockSavedJobs: Job[] = [
          {
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
          {
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
          {
            id: 3,
            title: 'UX/UI Designer',
            company: 'Creative Solutions',
            logo: '',
            location: 'New York, NY (Hybrid)',
            salary: '$90,000 - $120,000',
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
          },
          {
            id: 5,
            title: 'Junior Software Developer',
            company: 'StartUp Innovations',
            logo: '',
            location: 'Chicago, IL (Hybrid)',
            salary: '$70,000 - $90,000',
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
        
        setSavedJobs(mockSavedJobs);
        setIsLoading(false);
      }, 500);
    };
    
    fetchSavedJobs();
  }, []);

  // Handle viewing job details
  const handleViewDetails = (jobId: number) => {
    router.push(`/jobs/${jobId}`);
  };

  // Handle removing a job from saved list
  const handleRemoveJob = (jobId: number) => {
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedJobs);
    
    // Calculate if this was the last job on the page
    const newTotalPages = Math.ceil(updatedJobs.length / jobsPerPage);
    
    // If we're now on an empty page (except for page 1), go to the previous page
    if (currentPage > newTotalPages && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full pb-6">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Main content layout */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h1 className="text-lg sm:text-2xl font-bold mb-2 text-gray-900">Saved Jobs</h1>
            <p className="text-gray-600">Jobs you&apos;ve saved for later</p>
          </div>
          
          {/* Job Listing Header */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">
                {isLoading ? (
                  <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                ) : (
                  <p className="font-medium">{savedJobs.length} saved jobs</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="space-y-4">
            {isLoading ? (
              // Show skeleton cards when loading
              [...Array(2)].map((_, index) => (
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
            ) : savedJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex items-start space-x-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                        {job.logo ? (
                          <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
                        ) : (
                          job.title.toLowerCase().includes('frontend') || job.title.toLowerCase().includes('ui') ? (
                            <Code className="h-8 w-8 text-teal-500" />
                          ) : job.title.toLowerCase().includes('backend') || job.title.toLowerCase().includes('data') ? (
                            <Database className="h-8 w-8 text-indigo-500" />
                          ) : job.title.toLowerCase().includes('design') || job.title.toLowerCase().includes('ux') ? (
                            <Paintbrush className="h-8 w-8 text-purple-500" />
                          ) : job.title.toLowerCase().includes('software') || job.title.toLowerCase().includes('developer') ? (
                            <Laptop className="h-8 w-8 text-blue-500" />
                          ) : (
                            <Building className="h-8 w-8 text-gray-500" />
                          )
                        )}
                      </div>
                    </div>
                    
                    {/* Job Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm sm:text-md font-medium text-gray-700">{job.company}</p>
                            {job.isVerified && (
                              <span className="inline-flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-teal-500">
                                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Save Job Button */}
                        <button
                          onClick={() => handleRemoveJob(job.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove saved job"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal-600">
                            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Tags Section */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {job.isSponsored && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
                              <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
                            </svg>
                            Sponsored
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.jobType}
                        </span>
                        {job.providesSponsorship !== undefined && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.providesSponsorship 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
                              <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.55a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
                            </svg>
                            {job.providesSponsorship ? 'Visa Sponsorship Available' : 'No Visa Sponsorship'}
                          </span>
                        )}
                      </div>
                      
                      {/* Job Details */}
                      <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400 mr-1.5">
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400 mr-1.5">
                            <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                          </svg>
                          {job.salary}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400 mr-1.5">
                            <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                            <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                          </svg>
                          {job.jobType}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400 mr-1.5">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                          </svg>
                          {job.postedDate}
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                        {job.description}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="mt-4 flex space-x-3">
                        <button 
                          onClick={() => handleViewDetails(job.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          <Eye className="mr-1.5 h-4 w-4" />
                          View Details
                        </button>
                        <button 
                          onClick={() => handleRemoveJob(job.id)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
                <p className="text-gray-500 mb-6">You haven&apos;t saved any jobs yet. Browse jobs and click the bookmark icon to save them for later.</p>
                <button 
                  onClick={() => router.push('/jobs')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Browse Jobs
                </button>
              </div>
            )}
            
            {/* Pagination - Only show if we have jobs and more than one page */}
            {!isLoading && savedJobs.length > 0 && totalPages > 1 && (
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
      </div>
    </div>
  );
} 