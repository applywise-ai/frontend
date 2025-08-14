import { Building, MapPin, DollarSign, Calendar, ExternalLink } from 'lucide-react';
import { formatJobPostedDate, formatSalaryRange, getLocationLabelFromJob, getJobTypeLabel } from '@/app/utils/job';
import { Job } from '@/app/types/job';
import Link from 'next/link';

interface JobDetailsProps {
  job: Job;
  status: string;
  daysAgo?: number;
}

// Generate a consistent color based on company name
function getCompanyColor(company: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export function JobDetails({
  job,
  daysAgo = 14
}: JobDetailsProps) {
  const companyInitial = job.company.charAt(0).toUpperCase();
  const companyColor = getCompanyColor(job.company);
  
  return (
    <div className="bg-white rounded-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {job.logo ? (
              <div className="flex-shrink-0 w-12 h-12 mr-3 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to colored initial if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className={`w-full h-full ${companyColor} rounded-lg flex items-center justify-center hidden`}>
                  <span className="text-white font-semibold text-sm">{companyInitial}</span>
                </div>
              </div>
            ) : (
              <div className={`flex-shrink-0 w-12 h-12 ${companyColor} rounded-lg flex items-center justify-center mr-3`}>
                <span className="text-white font-semibold text-sm">{companyInitial}</span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-md sm:text-lg text-gray-900 leading-tight">{job.title}</h3>
              <p className="text-gray-700 text-sm sm:text-md">{job.company}</p>
            </div>
          </div>
          
          {/* View Full Details Button */}
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center justify-center w-10 h-10 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex items-center space-x-2">
            <div className="bg-teal-100 rounded-full p-1.5">
              <MapPin className="h-4 w-4 text-teal-700" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Location</div>
              <div className="font-medium text-gray-800 text-sm">{getLocationLabelFromJob(job)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 rounded-full p-1.5">
              <DollarSign className="h-4 w-4 text-purple-700" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Salary Range</div>
              <div className="font-medium text-gray-800 text-sm">{formatSalaryRange(job)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-amber-100 rounded-full p-1.5">
              <Calendar className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Posted</div>
              <div className="font-medium text-gray-800 text-sm">
                {job.postedDate ? formatJobPostedDate(job.postedDate) : 
                 daysAgo === 0 ? 'Today' : 
                 daysAgo === 1 ? 'Yesterday' : 
                 `${daysAgo} days ago`}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-green-100 rounded-full p-1.5">
              <Building className="h-4 w-4 text-green-700" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Job Type</div>
              <div className="font-medium text-gray-800 text-sm">{getJobTypeLabel(job.jobType)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 