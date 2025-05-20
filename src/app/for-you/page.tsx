'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, DollarSign, MapPin, Briefcase, Building, Bookmark, BadgeCheck, Heart, ThumbsUp, ThumbsDown, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Job } from '@/app/types';
import { useRouter } from 'next/navigation';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';

export default function ForYou() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState<Record<number | string, boolean>>({});
  const [jobFeedback, setJobFeedback] = useState<Record<number | string, boolean | null>>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Fetch personalized job recommendations
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      setIsLoading(true);
      
      // Simulate API call with a delay
      setTimeout(() => {
        // Mock data - in a real app, this would come from an API with personalized recommendations
        const recommendedJobs: Job[] = [
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
            matchPercentage: 98,
            jobUrl: 'https://example.com/jobs/senior-frontend-developer',
            tags: ['React', 'TypeScript', 'UI/UX', 'JavaScript'],
            shortResponsibilities: 'Build & maintain web applications, collaborate with designers, optimize for performance',
            shortQualifications: '5+ years experience, strong React/TypeScript skills, responsive design expertise',
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
            matchPercentage: 92,
            jobUrl: 'https://example.com/jobs/backend-engineer',
            tags: ['Node.js', 'Python', 'AWS', 'API Design'],
            shortResponsibilities: 'Design & develop backend services, implement APIs, optimize database performance',
            shortQualifications: '3+ years experience, Node.js/Python proficiency, AWS/cloud infrastructure knowledge',
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
            matchPercentage: 87,
            jobUrl: 'https://example.com/jobs/ux-ui-designer',
            tags: ['Figma', 'UI Design', 'User Research', 'Prototyping'],
            shortResponsibilities: 'Create user-centered designs, develop wireframes & prototypes, collaborate with developers',
            shortQualifications: 'Design portfolio, Figma expertise, user research experience, understanding of design systems',
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
            matchPercentage: 85,
            jobUrl: 'https://example.com/jobs/devops-engineer',
            tags: ['AWS', 'Kubernetes', 'CI/CD', 'Docker'],
            shortResponsibilities: 'Manage cloud infrastructure, implement CI/CD pipelines, automate deployment processes',
            shortQualifications: '4+ years DevOps experience, AWS certification, Kubernetes expertise, security best practices',
          },
          {
            id: 5,
            title: 'Machine Learning Engineer',
            company: 'AI Innovations',
            logo: '',
            location: 'Austin, TX',
            salary: '$140,000 - $180,000',
            salaryValue: 140000,
            jobType: 'Full-time',
            postedDate: '1 day ago',
            description: 'Join our AI team to develop cutting-edge machine learning models and solutions for real-world problems.',
            isVerified: true,
            providesSponsorship: true,
            experienceLevel: 'senior',
            matchPercentage: 82,
            jobUrl: 'https://example.com/jobs/ml-engineer',
            tags: ['Python', 'TensorFlow', 'Deep Learning', 'NLP'],
            shortResponsibilities: 'Design & implement ML models, analyze data, optimize algorithms for production',
            shortQualifications: 'ML expertise, Python proficiency, experience with TensorFlow/PyTorch, statistics background',
          }
        ];
        
        setJobs(recommendedJobs);
        setIsLoading(false);
      }, 1800);
    };
    
    fetchRecommendedJobs();
  }, []);
  
  // Handle navigation between job cards
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === jobs.length - 1 ? prevIndex : prevIndex + 1
    );
  };
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? prevIndex : prevIndex - 1
    );
  };
  
  // Toggle save job state
  const toggleSaveJob = (jobId: number | string) => {
    setIsSaved(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
    // In a real app, you would call an API to save/unsave the job
  };
  
  // View job details
  const viewJobDetails = (jobId: number | string) => {
    router.push(`/jobs/${jobId}`);
  };
  
  // Handle job feedback (like/dislike)
  const handleJobFeedback = (jobId: number | string, liked: boolean) => {
    // If already selected the same option, do nothing
    if (jobFeedback[jobId] === liked) return;
    
    setJobFeedback(prev => ({
      ...prev,
      [jobId]: liked
    }));
    // In a real app, you would call an API to record the user's preference
    
    // Only auto advance if this is a new selection, not a change
    if (jobFeedback[jobId] === undefined && currentIndex < jobs.length - 1) {
      setTimeout(() => goToNext(), 500);
    }
  };
  
  return (
    <div className="bg-gray-50 w-full pb-6">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Loading Animation or Carousel */}
        <div className="relative mt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              {/* Cool Loading Animation */}
              <div className="flex space-x-4 items-center justify-center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-4 h-4 rounded-full bg-teal-500"
                    animate={{
                      y: ["0%", "-100%", "0%"],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              <motion.div 
                className="mt-8 text-teal-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Finding perfect matches for you...
              </motion.div>
            </div>
          ) : (
            <>
              {/* Navigation Controls */}
              <div className="absolute left-0 top-[45%] transform -translate-y-1/2 z-20 ml-[-12px] sm:ml-0">
                <button
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className={`bg-white p-3 rounded-full shadow-lg ${
                    currentIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-teal-600'
                  }`}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
              
              <div className="absolute right-0 top-[45%] transform -translate-y-1/2 z-20 mr-[-12px] sm:mr-0">
                <button
                  onClick={goToNext}
                  disabled={currentIndex === jobs.length - 1}
                  className={`bg-white p-3 rounded-full shadow-lg ${
                    currentIndex === jobs.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-teal-600'
                  }`}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              
              {/* Job Carousel */}
              <div className="relative overflow-hidden" ref={carouselRef}>
                <div 
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  <div className="flex">
                    {jobs.map((job, index) => (
                      <div 
                        key={job.id} 
                        className="w-full flex-shrink-0"
                      >
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-xl overflow-hidden mx-auto max-w-4xl border border-gray-200"
                          >
                            {/* Match Percentage */}
                            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white flex justify-between items-center">
                              <div className="flex items-center">
                                <Heart className="h-5 w-5 mr-2 fill-white" />
                                <span className="font-bold">{job.matchPercentage}% Match</span>
                              </div>
                              <div className="text-sm">
                                Job {index + 1} of {jobs.length}
                              </div>
                            </div>
                            
                            {/* Job Content */}
                            <div className="p-6">
                              {/* Header */}
                              <div className="flex justify-between items-start">
                                <div className="flex items-start">
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 mr-4">
                                    {job.logo ? (
                                      <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
                                    ) : (
                                      <Building className="h-8 w-8 text-gray-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{job.title}</h2>
                                    <div className="flex items-center">
                                      <span className="text-base sm:text-lg text-gray-700">{job.company}</span>
                                      {job.isVerified && (
                                        <BadgeCheck className="ml-1 h-5 w-5 text-teal-500" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleSaveJob(job.id)}
                                  className="flex-shrink-0 text-gray-400 hover:text-teal-600 transition-colors"
                                  aria-label={isSaved[job.id] ? "Unsave job" : "Save job"}
                                >
                                  <Bookmark className={`h-6 w-6 ${isSaved[job.id] ? 'fill-teal-600 text-teal-600' : 'fill-transparent'}`} />
                                </button>
                              </div>
                              
                              {/* Job Details */}
                              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-5 w-5 text-gray-400" />
                                  <span className="text-gray-700">{job.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-5 w-5 text-gray-400" />
                                  <span className="text-gray-700">{job.salary}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Briefcase className="h-5 w-5 text-gray-400" />
                                  <span className="text-gray-700">{job.jobType}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-5 w-5 text-gray-400" />
                                  <span className="text-gray-700">{job.postedDate}</span>
                                </div>
                              </div>
                              
                              {/* Description */}
                              <div className="mt-4">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Job Description</h3>
                                <p className="text-gray-700">{job.description}</p>
                              </div>
                              
                              {/* Tags, Responsibilities, and Qualifications */}
                              <div className="mt-4 grid grid-cols-1 gap-3">
                                {/* Tags */}
                                {job.tags && job.tags.length > 0 && (
                                  <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Skills & Technologies</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {job.tags.map((tag, idx) => (
                                        <span 
                                          key={idx} 
                                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"
                                        >
                                          <Tag className="h-3 w-3 mr-1" />
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Responsibilities */}
                                {job.shortResponsibilities && (
                                  <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Key Responsibilities</h4>
                                    <p className="text-sm text-gray-700">{job.shortResponsibilities}</p>
                                  </div>
                                )}
                                
                                {/* Qualifications */}
                                {job.shortQualifications && (
                                  <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Qualifications</h4>
                                    <p className="text-sm text-gray-700">{job.shortQualifications}</p>
                                  </div>
                                )}
                              </div>
                              
                              {/* Why We Recommended */}
                              <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-1">
                                  <Heart className="h-4 w-4 inline mr-2 text-rose-500" />
                                  Why we recommended this
                                </h3>
                                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                                  <li>Matches your experience in {job.experienceLevel === 'senior' ? 'senior-level positions' : job.experienceLevel === 'mid' ? 'mid-level roles' : 'entry-level positions'}</li>
                                  <li>Aligns with your preferred {job.location.toLowerCase().includes('remote') ? 'remote work style' : 'location preferences'}</li>
                                  <li>Matches your skill set in {job.title.split(' ')[0]} development</li>
                                </ul>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="mt-6 flex space-x-4">
                                <button
                                  onClick={() => viewJobDetails(job.id)}
                                  className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
                                >
                                  View Full Details
                                </button>
                                <AnimatedApplyButton 
                                  onClick={() => {
                                    // Handle apply click
                                  }}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                        
                        {/* Job Feedback Section */}
                        <div className="mt-4 mb-4 flex flex-col items-center">
                          <p className="text-gray-700 font-medium mb-2">Would you like to see more jobs like this?</p>
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleJobFeedback(job.id, true)}
                              className={`flex items-center px-6 py-2 rounded-md transition-colors ${
                                jobFeedback[job.id] === true 
                                  ? 'bg-teal-100 text-teal-700 border border-teal-500' 
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <ThumbsUp className={`h-5 w-5 mr-2 ${jobFeedback[job.id] === true ? 'text-teal-600' : 'text-gray-500'}`} />
                              Yes
                            </button>
                            <button
                              onClick={() => handleJobFeedback(job.id, false)}
                              className={`flex items-center px-6 py-2 rounded-md transition-colors ${
                                jobFeedback[job.id] === false 
                                  ? 'bg-gray-100 text-gray-700 border border-gray-400' 
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <ThumbsDown className={`h-5 w-5 mr-2 ${jobFeedback[job.id] === false ? 'text-gray-600' : 'text-gray-500'}`} />
                              No
                            </button>
                          </div>
                          {jobFeedback[job.id] !== undefined && (
                            <p className="text-sm text-gray-500 mt-1">
                              {jobFeedback[job.id] 
                                ? "Thanks! We'll show you more jobs like this." 
                                : "Thanks! We'll refine your recommendations."}
                            </p>
                          )}
                        </div>
                        
                        {/* Progress Indicators */}
                        <div className="flex justify-center mt-2 space-x-2">
                          {jobs.map((_, i) => (
                            <button
                              key={i}
                              className={`h-2 rounded-full transition-all ${
                                i === currentIndex ? 'w-8 bg-teal-500' : 'w-2 bg-gray-300'
                              }`}
                              onClick={() => setCurrentIndex(i)}
                              aria-label={`Go to job ${i + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 