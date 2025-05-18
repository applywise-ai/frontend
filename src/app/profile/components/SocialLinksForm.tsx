'use client';

import { UserProfile, FieldName } from '@/app/types';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent } from '@/app/components/ui/card';
import { Linkedin, Github, Twitter, Globe, Link as LinkIcon } from 'lucide-react';

interface SocialLinksFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function SocialLinksForm({ profile, updateProfile }: SocialLinksFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProfile({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <LinkIcon className="h-4 w-4 text-teal-500 mr-2" />
          Add your professional profiles and portfolio links.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-y-5">
        {/* LinkedIn */}
        <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Linkedin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="w-full">
                <Label htmlFor={FieldName.LINKEDIN} className="text-sm font-medium text-gray-700 mb-2 block">
                  LinkedIn Profile
                </Label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    linkedin.com/in/
                  </span>
                  <Input
                    id={FieldName.LINKEDIN}
                    name={FieldName.LINKEDIN}
                    value={profile[FieldName.LINKEDIN]?.replace('https://www.linkedin.com/in/', '') || ''}
                    onChange={handleInputChange}
                    className="rounded-none rounded-r-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub */}
        <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Github className="h-5 w-5 text-gray-800 mt-0.5" />
              <div className="w-full">
                <Label htmlFor={FieldName.GITHUB} className="text-sm font-medium text-gray-700 mb-2 block">
                  GitHub Profile
                </Label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    github.com/
                  </span>
                  <Input
                    id={FieldName.GITHUB}
                    name={FieldName.GITHUB}
                    value={profile[FieldName.GITHUB]?.replace('https://github.com/', '') || ''}
                    onChange={handleInputChange}
                    className="rounded-none rounded-r-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Twitter */}
        <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Twitter className="h-5 w-5 text-sky-500 mt-0.5" />
              <div className="w-full">
                <Label htmlFor={FieldName.TWITTER} className="text-sm font-medium text-gray-700 mb-2 block">
                  Twitter Handle
                </Label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <Input
                    id={FieldName.TWITTER}
                    name={FieldName.TWITTER}
                    value={profile[FieldName.TWITTER]?.replace('@', '') || ''}
                    onChange={handleInputChange}
                    className="rounded-none rounded-r-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Globe className="h-5 w-5 text-teal-500 mt-0.5" />
              <div className="w-full">
                <Label htmlFor={FieldName.PORTFOLIO} className="text-sm font-medium text-gray-700 mb-2 block">
                  Portfolio Website
                </Label>
                <div>
                  <Input
                    type="url"
                    id={FieldName.PORTFOLIO}
                    name={FieldName.PORTFOLIO}
                    value={profile[FieldName.PORTFOLIO] || ''}
                    onChange={handleInputChange}
                    className="w-full focus:ring-teal-500 focus:border-teal-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
        <div className="flex items-start">
          <Globe className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            Adding professional links helps recruiters find additional information about your work and experience.
          </p>
        </div>
      </div>
    </div>
  );
} 