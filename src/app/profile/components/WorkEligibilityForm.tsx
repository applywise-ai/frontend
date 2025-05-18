'use client';

import { UserProfile, FieldName } from '@/app/types';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Calendar, Globe, Briefcase, ShieldCheck } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

interface WorkEligibilityFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function WorkEligibilityForm({ profile, updateProfile }: WorkEligibilityFormProps) {
  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateProfile({ [field]: checked });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <Briefcase className="h-4 w-4 text-teal-500 mr-2" />
          Information about your work eligibility status.
        </p>
      </div>

      <div className="space-y-6">
        {/* Age Verification */}
        <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-teal-500 mt-0.5" />
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Age Verification</h3>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id={FieldName.OVER_18}
                    checked={profile[FieldName.OVER_18] || false}
                    onCheckedChange={(checked) => handleCheckboxChange(FieldName.OVER_18, checked as boolean)}
                    className="border-gray-300 text-teal-600"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={FieldName.OVER_18} className="font-medium text-gray-700">
                      I am over 18 years of age
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Required for most employment opportunities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Canada Work Eligibility */}
        <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Globe className="h-5 w-5 text-teal-500 mt-0.5" />
              <div className="w-full">
                <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  Canada Work Eligibility
                  <Badge className="ml-2 bg-red-50 text-red-700 hover:bg-red-100 border-red-200">Required</Badge>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id={FieldName.ELIGIBLE_CANADA}
                      checked={profile[FieldName.ELIGIBLE_CANADA] || false}
                      onCheckedChange={(checked) => handleCheckboxChange(FieldName.ELIGIBLE_CANADA, checked as boolean)}
                      className="border-gray-300 text-teal-600"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={FieldName.ELIGIBLE_CANADA} className="font-medium text-gray-700">
                        I am legally eligible to work in Canada
                      </Label>
                      <p className="text-sm text-gray-500">
                        You are a Canadian citizen, permanent resident, or have a valid work permit.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id={FieldName.CA_SPONSORHIP}
                      checked={profile[FieldName.CA_SPONSORHIP] || false}
                      onCheckedChange={(checked) => handleCheckboxChange(FieldName.CA_SPONSORHIP, checked as boolean)}
                      className="border-gray-300 text-teal-600"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={FieldName.CA_SPONSORHIP} className="font-medium text-gray-700">
                        I require sponsorship to work in Canada
                      </Label>
                      <p className="text-sm text-gray-500">
                        You require a company to sponsor your work permit or visa to work in Canada.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* US Work Eligibility */}
        <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Globe className="h-5 w-5 text-teal-500 mt-0.5" />
              <div className="w-full">
                <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  United States Work Eligibility
                  <Badge className="ml-2 bg-red-50 text-red-700 hover:bg-red-100 border-red-200">Required</Badge>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id={FieldName.ELIGIBLE_US}
                      checked={profile[FieldName.ELIGIBLE_US] || false}
                      onCheckedChange={(checked) => handleCheckboxChange(FieldName.ELIGIBLE_US, checked as boolean)}
                      className="border-gray-300 text-teal-600"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={FieldName.ELIGIBLE_US} className="font-medium text-gray-700">
                        I am legally eligible to work in the United States
                      </Label>
                      <p className="text-sm text-gray-500">
                        You are a U.S. citizen, permanent resident, or have a valid work authorization.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id={FieldName.US_SPONSORHIP}
                      checked={profile[FieldName.US_SPONSORHIP] || false}
                      onCheckedChange={(checked) => handleCheckboxChange(FieldName.US_SPONSORHIP, checked as boolean)}
                      className="border-gray-300 text-teal-600"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={FieldName.US_SPONSORHIP} className="font-medium text-gray-700">
                        I require sponsorship to work in the United States
                      </Label>
                      <p className="text-sm text-gray-500">
                        You require a company to sponsor your work visa (e.g., H-1B) to work in the U.S.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
        <div className="flex items-start">
          <ShieldCheck className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            Your work eligibility information helps employers determine if they can hire you based on legal requirements.
          </p>
        </div>
      </div>
    </div>
  );
} 