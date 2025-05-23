'use client';

import { UserProfile, FieldName } from '@/app/types';
import { Check, X, Calendar, Globe, HelpCircle } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

interface WorkEligibilityDisplayProps {
  profile: UserProfile;
}

export default function WorkEligibilityDisplay({ profile }: WorkEligibilityDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Age Verification */}
      <div className="flex items-start">
        <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-1" />
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Age Verification</p>
          <div className="flex items-center">
            <p className="text-sm text-gray-700 mr-2">Over 18 years of age:</p>
            {profile[FieldName.OVER_18] ? (
              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Yes</Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">No</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Canada Work Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-start">
          <Globe className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Canada Work Eligibility</p>
            <div className="space-y-2">
              <div className="flex items-center">
                {profile[FieldName.ELIGIBLE_CANADA] === undefined ? (
                  <HelpCircle className="h-5 w-5 text-gray-400 mr-2" />
                ) : profile[FieldName.ELIGIBLE_CANADA] ? (
                  <Check className="h-5 w-5 text-teal-600 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-red-500 mr-2" />
                )}
                <p className="text-sm text-gray-700">
                  Legally eligible to work in Canada
                  {profile[FieldName.ELIGIBLE_CANADA] === undefined && (
                    <span className="ml-2 text-sm text-yellow-500 font-normal italic">(No answer provided)</span>
                  )}
                </p>
              </div>
              
              <div className="flex items-center">
                {profile[FieldName.CA_SPONSORHIP] === undefined ? (
                  <HelpCircle className="h-5 w-5 text-gray-400 mr-2" />
                ) : profile[FieldName.CA_SPONSORHIP] ? (
                  <Check className="h-5 w-5 text-teal-600 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 mr-2" />
                )}
                <p className="text-sm text-gray-700">
                  Requires sponsorship to work in Canada
                  {profile[FieldName.CA_SPONSORHIP] === undefined && (
                    <span className="ml-2 text-sm text-yellow-500 font-normal italic">(No answer provided)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* US Work Eligibility */}
        <div className="flex items-start">
          <Globe className="h-5 w-5 text-gray-500 mr-3 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">United States Work Eligibility</p>
            <div className="space-y-2">
              <div className="flex items-center">
                {profile[FieldName.ELIGIBLE_US] === undefined ? (
                  <HelpCircle className="h-5 w-5 text-gray-400 mr-2" />
                ) : profile[FieldName.ELIGIBLE_US] ? (
                  <Check className="h-5 w-5 text-teal-600 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-red-500 mr-2" />
                )}
                <p className="text-sm text-gray-700">
                  Legally eligible to work in the United States
                  {profile[FieldName.ELIGIBLE_US] === undefined && (
                    <span className="ml-2 text-sm text-yellow-500 font-normal italic">(No answer provided)</span>
                  )}
                </p>
              </div>
              
              <div className="flex items-center">
                {profile[FieldName.US_SPONSORHIP] === undefined ? (
                  <HelpCircle className="h-5 w-5 text-gray-400 mr-2" />
                ) : profile[FieldName.US_SPONSORHIP] ? (
                  <Check className="h-5 w-5 text-teal-600 mr-2" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 mr-2" />
                )}
                <p className="text-sm text-gray-700">
                  Requires sponsorship to work in the United States
                  {profile[FieldName.US_SPONSORHIP] === undefined && (
                    <span className="ml-2 text-sm text-yellow-500 font-normal italic">(No answer provided)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 