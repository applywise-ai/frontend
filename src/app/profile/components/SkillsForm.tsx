'use client';

import { useState } from 'react';
import { UserProfile, FieldName } from '@/app/types';
import { PlusCircle, X, Lightbulb, Info, Tags } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Label } from '@/app/components/ui/label';

interface SkillsFormProps {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export default function SkillsForm({ profile, updateProfile }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const skills = profile[FieldName.SKILLS] || [];
    const skillExists = skills.includes(newSkill.trim());
    if (skillExists) {
      setNewSkill('');
      return;
    }

    const updatedSkills = [...skills, newSkill.trim()];
    updateProfile({ [FieldName.SKILLS]: updatedSkills });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const skills = profile[FieldName.SKILLS] || [];
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    updateProfile({ [FieldName.SKILLS]: updatedSkills });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Ensure skills array exists
  const skillsList = profile[FieldName.SKILLS] || [];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
          <Lightbulb className="h-4 w-4 text-teal-500 mr-2" />
          Add your technical and professional skills to improve job matching.
        </p>
      </div>

      <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Tags className="h-5 w-5 text-teal-500 mt-0.5" />
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add Skills</h3>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="new-skill" className="text-sm font-medium text-gray-700 mb-2 block">
                    Enter a skill
                  </Label>
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      id="new-skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. JavaScript, Project Management, Data Analysis"
                      className="flex-1 shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                    <Button 
                      onClick={handleAddSkill}
                      type="button"
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Skills List */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Your Skills</h4>
                  
                  {skillsList.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No skills added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className="bg-white px-3 py-1 text-sm font-normal"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            Add skills that are relevant to the positions you're applying for. 
            These will be used to match you with appropriate job opportunities.
          </p>
        </div>
      </div>
    </div>
  );
} 