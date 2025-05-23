import { Button } from './ui/button';
import { CheckCircle2, ExternalLink, Mail, Clock, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';

interface ApplicationSubmittedContentProps {
  jobTitle?: string;
  companyName?: string;
  applicationId?: string;
  onViewApplications: () => void;
  onBrowseJobs: () => void;
  variant?: 'card' | 'plain';
}

export default function ApplicationSubmittedContent({
  jobTitle = 'Senior Software Engineer',
  companyName = 'TechNova Solutions',
  applicationId = '123',
  onViewApplications,
  onBrowseJobs,
  variant = 'card',
}: ApplicationSubmittedContentProps) {
  const submittedDate = new Date();
  
  const content = (
    <>
      <div className="flex justify-center mb-5">
        <div className="bg-green-100 p-3 sm:p-4 rounded-full">
          <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-600" />
        </div>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mb-3">Application Successfully Submitted!</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6">
        Your application for <span className="font-semibold">{jobTitle}</span> at <span className="font-semibold">{companyName}</span> has been submitted successfully.
      </p>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-6 w-full mb-6">
        <h3 className="text-blue-800 font-medium mb-3 sm:mb-4 text-base sm:text-lg text-center">What happens next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm mb-2 sm:mb-3">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Confirmation Email</h4>
            <p className="text-blue-700 text-xs sm:text-sm">You&apos;ll receive a confirmation email from the employer about your submitted application</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm mb-2 sm:mb-3">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Application Review</h4>
            <p className="text-blue-700 text-xs sm:text-sm">The employer will review your application and reach out with next steps</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm mb-2 sm:mb-3">
              <List className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Track Your Status</h4>
            <p className="text-blue-700 text-xs sm:text-sm">You can track the status of your application on your dashboard</p>
          </div>
        </div>
      </div>
      
      <div className="pt-1 pb-3 text-xs sm:text-sm text-gray-500">
        <p>
          Application ID: <span className="font-mono">{applicationId}</span>
        </p>
        <p>
          Submitted on: {submittedDate.toLocaleDateString()} at {submittedDate.toLocaleTimeString()}
        </p>
      </div>
      
      <div className="flex flex-row gap-4 justify-center mt-2">
        <Button
          variant="outline" 
          onClick={onViewApplications}
          className="text-xs sm:text-sm py-2 px-3 sm:px-4 h-auto"
        >
          View All Applications
        </Button>
        <Button 
          onClick={onBrowseJobs}
          className="bg-teal-600 hover:bg-teal-700 text-xs sm:text-sm py-2 px-3 sm:px-4 h-auto"
        >
          <ExternalLink className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Browse More Jobs
        </Button>
      </div>
    </>
  );

  if (variant === 'card') {
    return (
      <Card className="text-center shadow-sm">
        <CardHeader className="pb-2 sm:pb-4">
          <div className="flex justify-center my-4 sm:my-6">
            <div className="bg-green-100 p-3 sm:p-4 rounded-full">
              <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl">Application Successfully Submitted!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          <p className="text-sm sm:text-base text-gray-600">
            Your application for <span className="font-semibold">{jobTitle}</span> at <span className="font-semibold">{companyName}</span> has been submitted successfully.
          </p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-6 mt-4 sm:mt-6">
            <h3 className="text-blue-800 font-medium mb-3 sm:mb-4 text-base sm:text-lg text-center">What happens next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm mb-2 sm:mb-3">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Confirmation Email</h4>
                <p className="text-blue-700 text-xs sm:text-sm">You&apos;ll receive a confirmation email from the employer about your submitted application</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm mb-2 sm:mb-3">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Application Review</h4>
                <p className="text-blue-700 text-xs sm:text-sm">The employer will review your application and reach out with next steps</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm mb-2 sm:mb-3">
                  <List className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Track Your Status</h4>
                <p className="text-blue-700 text-xs sm:text-sm">You can track the status of your application on your dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="pt-3 sm:pt-4">
            <p className="text-xs sm:text-sm text-gray-500">
              Application ID: <span className="font-mono">{applicationId}</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Submitted on: {submittedDate.toLocaleDateString()} at {submittedDate.toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row gap-4 justify-center pt-4 sm:pt-6">
          <Button
            variant="outline" 
            onClick={onViewApplications}
            className="text-xs sm:text-sm py-2 px-3 sm:px-4 h-auto"
          >
            View All Applications
          </Button>
          <Button 
            onClick={onBrowseJobs}
            className="bg-teal-600 hover:bg-teal-700 text-xs sm:text-sm py-2 px-3 sm:px-4 h-auto"
          >
            <ExternalLink className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Browse More Jobs
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return <div className="flex flex-col items-center py-4 px-4 text-center">{content}</div>;
} 