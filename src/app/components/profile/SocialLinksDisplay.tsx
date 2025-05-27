'use client';

import { UserProfile, FieldName } from '@/app/types/profile';
import { 
  Linkedin, 
  Github, 
  Twitter, 
  Globe
} from 'lucide-react';

interface SocialLinksDisplayProps {
  profile: UserProfile;
}

export default function SocialLinksDisplay({ profile }: SocialLinksDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profile[FieldName.LINKEDIN] && (
        <div className="flex items-center">
          <div className="bg-blue-50 p-2 rounded-full mr-3">
            <Linkedin className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">LinkedIn</p>
            <a 
              href={profile[FieldName.LINKEDIN].startsWith('http') ? profile[FieldName.LINKEDIN] : `https://www.linkedin.com/in/${profile[FieldName.LINKEDIN]}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {profile[FieldName.LINKEDIN].replace('https://www.linkedin.com/in/', '')}
            </a>
          </div>
        </div>
      )}

      {profile[FieldName.GITHUB] && (
        <div className="flex items-center">
          <div className="bg-gray-100 p-2 rounded-full mr-3">
            <Github className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">GitHub</p>
            <a 
              href={profile[FieldName.GITHUB].startsWith('http') ? profile[FieldName.GITHUB] : `https://github.com/${profile[FieldName.GITHUB]}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {profile[FieldName.GITHUB].replace('https://github.com/', '')}
            </a>
          </div>
        </div>
      )}

      {profile[FieldName.TWITTER] && (
        <div className="flex items-center">
          <div className="bg-blue-50 p-2 rounded-full mr-3">
            <Twitter className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Twitter</p>
            <a 
              href={`https://twitter.com/${profile[FieldName.TWITTER].replace('@', '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {profile[FieldName.TWITTER]}
            </a>
          </div>
        </div>
      )}

      {profile[FieldName.PORTFOLIO] && (
        <div className="flex items-center">
          <div className="bg-green-50 p-2 rounded-full mr-3">
            <Globe className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Portfolio</p>
            <a 
              href={profile[FieldName.PORTFOLIO]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {profile[FieldName.PORTFOLIO]}
            </a>
          </div>
        </div>
      )}

      {!profile[FieldName.LINKEDIN] && 
       !profile[FieldName.GITHUB] && 
       !profile[FieldName.TWITTER] && 
       !profile[FieldName.PORTFOLIO] && (
        <p className="text-sm text-yellow-800 font-normal italic col-span-full">No social links added yet.</p>
      )}
    </div>
  );
} 