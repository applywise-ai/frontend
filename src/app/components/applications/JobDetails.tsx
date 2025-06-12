import { Building, MapPin, DollarSign, Calendar } from 'lucide-react';
import { formatJobPostedDate } from '@/app/utils/job';
import { Timestamp } from 'firebase/firestore';

interface JobDetailsProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  status: string;
  postedDate?: string | Timestamp;
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
  title,
  company,
  location,
  salary,
  postedDate,
  daysAgo = 14
}: JobDetailsProps) {
  const companyInitial = company.charAt(0).toUpperCase();
  const companyColor = getCompanyColor(company);
  
  return (
    <div className="bg-white rounded-md">
      <div className="space-y-4">
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-10 h-10 ${companyColor} rounded-full flex items-center justify-center mr-3`}>
            <span className="text-white font-semibold text-sm">{companyInitial}</span>
          </div>
          <div>
            <h3 className="font-semibold text-md sm:text-lg text-gray-900 leading-tight">{title}</h3>
            <p className="text-gray-700 text-sm sm:text-md">{company}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex items-center space-x-2">
            <div className="bg-teal-100 rounded-full p-1.5">
              <MapPin className="h-4 w-4 text-teal-700" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Location</div>
              <div className="font-medium text-gray-800 text-sm">{location}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 rounded-full p-1.5">
              <DollarSign className="h-4 w-4 text-purple-700" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Salary Range</div>
              <div className="font-medium text-gray-800 text-sm">{salary}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-amber-100 rounded-full p-1.5">
              <Calendar className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Posted</div>
              <div className="font-medium text-gray-800 text-sm">
                {postedDate ? formatJobPostedDate(postedDate) : 
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
              <div className="font-medium text-gray-800 text-sm">Full-time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 