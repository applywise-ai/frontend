'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Job } from '@/app/types/job';
import JobDetailsPanel from '@/app/components/jobs/JobDetailsPanel';
import Link from 'next/link';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referrer, setReferrer] = useState<string>('/jobs');
  
  // Detect referrer
  useEffect(() => {
    // Check if we came from a specific page
    if (document.referrer.includes('/for-you')) {
      setReferrer('/for-you');
    } else if (document.referrer.includes('/applications')) {
      setReferrer('/applications');
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
      }, 800);
    };
    
    fetchJobDetails();
  }, [params.id]);
  
  if (!job && !isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
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
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Back button */}
        {/* <Link 
          href={referrer}
          className="flex items-center mb-3 h-8 w-32 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-md transition-colors cursor-pointer text-sm"
        >
          <span className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </span>
        </Link> */}
        
        {/* Job details using JobDetailsPanel component */}
        <div className="max-w-9xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <JobDetailsPanel 
              job={job} 
              onClose={() => router.push(referrer)}
              isLoading={isLoading}
              fullPage={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 