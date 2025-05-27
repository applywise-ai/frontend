import { FC, useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Eye, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Application, isDraft } from '@/app/types/application';
import AnimatedApplyButton from '@/app/components/AnimatedApplyButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useRouter } from 'next/navigation';

interface ApplicationCardProps {
  application: Application;
  onDelete: (id: string) => void;
  onApply?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, newStatus: string) => Promise<void>;
}

const ApplicationCard: FC<ApplicationCardProps> = ({ application, onDelete, onApply, onStatusChange }) => {
  const { id, jobId, jobTitle, company, status, appliedDate } = application;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
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
  
  // Get status badge styles
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Saved':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Interviewing':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'Rejected':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'Draft':
      default:
        return 'bg-amber-50 text-amber-600 border-amber-200';
    }
  };
  
  // Get avatar background color based on company name
  const getAvatarColor = (companyName: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    
    // Generate a simple hash from the company name
    const hash = companyName.split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return colors[hash % colors.length];
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(false);
    }
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

  const handleApply = async () => {
    if (!onApply) return;
    await onApply(id);
  };

  const handleCardClick = async (e: React.MouseEvent) => {
    // Don't trigger navigation if clicking on interactive elements
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('select')
    ) {
      return;
    }
    
    setIsNavigating(true);
    router.push(`/jobs/${jobId}`);
  };

  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow relative">
      <CardContent className="p-0">
        <div 
          className="group/card cursor-pointer" 
          onClick={handleCardClick}
        >
          <div className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
            {isNavigating && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
              </div>
            )}
          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden flex items-center justify-center ${getAvatarColor(company)}`}>
              <div className="text-xl font-bold text-white">
                {company.charAt(0)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 truncate transition-colors">
                {jobTitle}
              </h3>
                  <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-gray-600 truncate">{company}</p>
                <div className="mt-2 flex items-center space-x-2">
                  {isDraft(status) || status === 'Saved' ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(status)}`}>
                    {status}
                  </span>
                ) : (
                  <Select
                    value={status}
                    onValueChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className={`w-fit h-6 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyles(status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Interviewing">Interviewing</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                  <span className="text-xs text-gray-500">
                    {formatDate(appliedDate)}
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-300 px-4 py-3 bg-gray-50 flex justify-end space-x-2">
          {isDraft(status) ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-1" />
                )}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Link href={`/applications/${id}/edit`} passHref onClick={() => setIsEditing(true)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
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
          ) : status === 'Saved' ? (
            <AnimatedApplyButton
              onClick={handleApply}
              applicationId={id}
              buttonText="Apply"
              size="xs"
            />
          ) : (
            <Link href={`/applications/${id}/submitted`} passHref onClick={() => setIsViewing(true)}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-teal-600 hover:text-teal-700 border-teal-300 hover:bg-teal-50 hover:border-teal-400"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard; 