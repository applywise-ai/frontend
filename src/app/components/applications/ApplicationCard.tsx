import { FC, useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Eye, Pencil, Loader2, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import { unmodifiable, getStatusColor } from '@/app/types/application';
import { ApplicationWithJob } from '@/app/contexts/ApplicationsContext';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';
import DeleteApplicationDialog from '@/app/components/applications/DeleteApplicationDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useRouter } from 'next/navigation';
import { getAvatarColor } from '@/app/utils/avatar';

interface ApplicationCardProps {
  application: ApplicationWithJob;
  onStatusChange?: (id: string, newStatus: string) => Promise<void>;
  onRemoveSaved?: (id: string) => Promise<void>;
}

const ApplicationCard: FC<ApplicationCardProps> = ({ application, onStatusChange, onRemoveSaved }) => {
  const { id, jobId, status, appliedDate, createdAt, job } = application;
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isRemovingSaved, setIsRemovingSaved] = useState(false);
  const router = useRouter();
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status || !onStatusChange) return;
    
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(id, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRemoveSaved = async () => {
    if (!onRemoveSaved) return;
    
    setIsRemovingSaved(true);
    try {
      await onRemoveSaved(id);
    } finally {
      setIsRemovingSaved(false);
    }
  };

  const handleCardClick = async (e: React.MouseEvent) => {
    // Don't trigger navigation if clicking on interactive elements
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('select')
    ) {
      return;
    }
    
    // Don't navigate if job is expired
    if (job?.expired) {
      return;
    }
    
    setIsNavigating(true);
    // Navigate to job details page using jobId
    router.push(`/jobs/${jobId}`);
  };

  // Get display values with fallbacks
  const displayTitle = job?.title || `Job Position (ID: ${jobId})`;
  const displayCompany = job?.company || 'Company Name';
  const displayLogo = job?.logo;
  const companyInitial = displayCompany.charAt(0).toUpperCase();
  
  // Determine the effective status - for expired jobs, keep original status for dropdown but prevent actions
  const effectiveStatus = status; // Always use the actual application status
  const isJobExpired = job?.expired;
  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow relative">
      <CardContent className="p-0">
        <div 
          className={`group/card ${job?.expired ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={handleCardClick}
        >
          <div className={`p-4 sm:p-5 ${job?.expired ? '' : 'hover:bg-gray-50'} transition-colors`}>
            {isNavigating && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
              </div>
            )}
          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden flex items-center justify-center ${getAvatarColor(displayCompany)}`}>
              {displayLogo ? (
                <img 
                  src={displayLogo} 
                  alt={`${displayCompany} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to letter avatar if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`text-xl font-bold text-white ${displayLogo ? 'hidden' : ''}`}>
                {companyInitial}
              </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 truncate transition-colors">
                {!job ? (
                  <span className="text-red-600">Job not found</span>
                ) : (
                  displayTitle
                )}
              </h3>
                  <ExternalLink className={`h-4 w-4 text-gray-400 ${job?.expired ? 'opacity-0' : 'opacity-0 group-hover/card:opacity-100'} transition-opacity`} />
                </div>
                <p className="text-sm text-gray-600 truncate">{displayCompany}</p>
                <div className="mt-2 flex items-center space-x-2">
                  {unmodifiable(effectiveStatus) ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(effectiveStatus)}`}>
                    {effectiveStatus}
                  </span>
                ) : (
                  <Select
                    value={effectiveStatus}
                    onValueChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className={`w-fit h-6 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(effectiveStatus)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Interviewing">Interviewing</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                  <span className="text-xs text-gray-500">
                    {formatDate(appliedDate || createdAt)}
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-300 px-4 py-3 bg-gray-50 flex justify-end space-x-2">
          {isJobExpired || (effectiveStatus as string) === 'Not Found' ? (
            // No buttons for expired job postings
            <div className="flex items-center py-1.5 text-sm text-gray-500 ">Job posting has expired</div>
          ) : effectiveStatus === 'Draft' ? (
            <>
              <DeleteApplicationDialog
                applicationId={id}
                jobTitle={displayTitle}
                companyName={displayCompany}
                variant="button"
                buttonText="Delete"
                size="sm"
                redirectTo="/applications"
                className="w-24"
              />
              <Link href={`/applications/${id}/edit`} scroll={false} passHref onClick={() => setIsEditing(true)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-4 w-24 text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                  disabled={isEditing}
                >
                  {isEditing ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Pencil className="h-4 w-4 mr-1" />
                  )}
                  {isEditing ? 'Loading...' : 'Edit'}
                </Button>
              </Link>
            </>
          ) : effectiveStatus === 'Pending' ? (
            <>
              <DeleteApplicationDialog
                applicationId={id}
                jobTitle={displayTitle}
                companyName={displayCompany}
                variant="button"
                buttonText="Delete"
                size="sm"
                redirectTo="/applications"
                className="w-24"
              />
              <AnimatedApplyButton
                jobId={jobId}
                applicationId={id}
                buttonText="Review"
                size="xs"
                className="w-24"
              />
            </>
          ) : effectiveStatus === 'Failed' ? (
            <>
              <DeleteApplicationDialog
                applicationId={id}
                jobTitle={displayTitle}
                companyName={displayCompany}
                variant="button"
                buttonText="Delete"
                size="sm"
                redirectTo="/applications"
                className="w-24"
              />
              <AnimatedApplyButton
                jobId={jobId}
                applicationId={id}
                buttonText="Apply"
                size="xs"
                className="w-24"
              />
            </>
          ) : (effectiveStatus as string) === 'Not Found' ? (
            <>
              <DeleteApplicationDialog
                applicationId={id}
                jobTitle={displayTitle}
                companyName={displayCompany}
                variant="button"
                buttonText="Delete"
                size="sm"
                redirectTo="/applications"
                className="w-24"
              />
              <AnimatedApplyButton
                jobId={jobId}
                applicationId={id}
                buttonText="Apply"
                size="xs"
                className="w-24"
              />
            </>
          ) : effectiveStatus !== 'Saved' && (
            <Link href={`/applications/${id}/view`} passHref onClick={() => setIsViewing(true)}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-4 w-24 text-teal-600 hover:text-teal-700 border-teal-300 hover:bg-teal-50 hover:border-teal-400"
                disabled={isViewing}
              >
                {isViewing ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                {isViewing ? 'Loading...' : 'View'}
              </Button>
            </Link>
          )}
          <div className={`flex items-center space-x-2 ${effectiveStatus !== 'Saved' && 'hidden'}`}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400"
                onClick={handleRemoveSaved}
                disabled={isRemovingSaved}
              >
                {isRemovingSaved ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-1" />
                )}
                {isRemovingSaved ? 'Removing...' : 'Remove'}
              </Button>
              <AnimatedApplyButton
                jobId={jobId}
                applicationId={id}
                buttonText="Apply"
                size="xs"
                className="w-24"
              />
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard; 