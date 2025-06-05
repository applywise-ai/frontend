'use client';

import { useState, useEffect, useRef } from 'react';
import { UserProfile, FieldName } from '@/app/types/profile';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import { 
  User, 
  Link as LinkIcon, 
  GraduationCap, 
  Code, 
  Code2,
  Briefcase, 
  Globe, 
  Users, 
  FileText,
  Building,
  AlertCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import { getProfileCompletionState, ProfileCompletionState, calculateCompletionPercentage, getNextSectionToFill } from '@/app/utils/profile';
import * as PC from '@/app/components/profile';

function ProfilePageContent() {
  const [profile, setProfile] = useState<UserProfile>({
    [FieldName.FULL_NAME]: '',
    [FieldName.EMAIL]: '',
    [FieldName.PHONE_NUMBER]: '',
    [FieldName.EDUCATION]: [],
    [FieldName.SKILLS]: [],
    [FieldName.TEMP_EDUCATION]: {
      [FieldName.SCHOOL]: '',
      [FieldName.DEGREE]: '',
      [FieldName.FIELD_OF_STUDY]: '',
      [FieldName.EDUCATION_FROM]: '',
      [FieldName.EDUCATION_TO]: '',
      [FieldName.EDUCATION_GPA]: ''
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');
  const [profileState, setProfileState] = useState<ProfileCompletionState>('incomplete');
  
  // Simplified refs for sections
  const sectionRefs = {
    resume: useRef<HTMLDivElement>(null),
    personal: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    employment: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    social: useRef<HTMLDivElement>(null),
    preferences: useRef<HTMLDivElement>(null),
    eligibility: useRef<HTMLDivElement>(null),
    demographics: useRef<HTMLDivElement>(null),
  };

  // Add ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Set up scroll listener
  useEffect(() => {
    const setupScrollListener = () => {
      if (!scrollContainerRef.current) {
        setTimeout(setupScrollListener, 200);
        return;
      }

      console.log('Setting up scroll listener');
      const scrollContainer = scrollContainerRef.current;
      
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        console.log('Cleaning up scroll listener');
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    };

    setupScrollListener();
  }, []);

  // Simple scroll handler
  const handleScroll = (event: Event) => {
    const scrollContainer = event.target as HTMLElement;
    const scrollPosition = scrollContainer.scrollTop + 100; // Add offset for better detection

    // Find the current section based on scroll position
    for (const [id, ref] of Object.entries(sectionRefs)) {
      if (ref.current) {
        const { offsetTop, offsetHeight } = ref.current;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    }
  };

  // Simple scroll to section function
  const scrollToSection = (sectionId: string) => {
    const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
    const scrollContainer = scrollContainerRef.current;
    if (ref.current && scrollContainer) {
      const sectionTop = ref.current.offsetTop;
      scrollContainer.scrollTo({
        top: sectionTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };
  
  const updateProfile = (section: Partial<UserProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...section
    }));
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch this from an API
        // For now, we'll simulate an API call with mock data
        setTimeout(() => {
          const mockProfile: UserProfile = {
            [FieldName.RESUME_FILENAME]: 'Kaiz_Nanji_New_Grad_Resume_V4.pdf',
            [FieldName.RESUME]: '/Users/kaiznanji/Documents/RESUMES/2025/Kaiz_Nanji_New_Grad_Resume_V4.pdf',
            [FieldName.FULL_NAME]: 'Kaiz Nanji',
            [FieldName.EMAIL]: 'k4nanji@uwaterloo.ca',
            [FieldName.PHONE_NUMBER]: '4168784499',
            [FieldName.CURRENT_LOCATION]: 'Toronto, ON',
            [FieldName.LINKEDIN]: 'https://www.linkedin.com/in/john-doe',
            [FieldName.TWITTER]: '@johndoe',
            [FieldName.GITHUB]: 'https://github.com/johndoe',
            [FieldName.PORTFOLIO]: 'https://example.com/portfolio',
            [FieldName.GENDER]: 'Man',
            [FieldName.VETERAN]: false,
            [FieldName.SEXUALITY]: ['Heterosexual'],
            [FieldName.ELIGIBLE_CANADA]: true,
            [FieldName.TRANS]: false,
            [FieldName.RACE]: ['East Asian'],
            [FieldName.NOTICE_PERIOD]: '8 weeks',
            [FieldName.EXPECTED_SALARY]: 110000,
            [FieldName.HISPANIC]: false,
            [FieldName.DISABILITY]: false,
            [FieldName.ELIGIBLE_US]: false,
            [FieldName.US_SPONSORHIP]: true,
            [FieldName.OVER_18]: true,
            [FieldName.SOURCE]: 'LinkedIn',
            [FieldName.CA_SPONSORHIP]: false,
            [FieldName.EDUCATION]: [
              {
                [FieldName.SCHOOL]: 'University of Waterloo',
                [FieldName.DEGREE]: "bachelor",
                [FieldName.FIELD_OF_STUDY]: 'Computer Science',
                [FieldName.EDUCATION_FROM]: "09/2020",
                [FieldName.EDUCATION_TO]: "04/2025",
              }
            ],
            [FieldName.SKILLS]: ['Python', 'Java', 'JavaScript']
          };
          
          setProfile(mockProfile);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Calculate profile completion state
  useEffect(() => {
    if (!isLoading) {
      setProfileState(getProfileCompletionState(profile));
    }
  }, [profile, isLoading]);

  const nextSection = getNextSectionToFill(profile, profileState);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="flex space-x-8">
              <div className="w-64 h-64 bg-gray-200 rounded"></div>
              <div className="flex-1 h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 pt-16 fixed inset-0 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar: Progress card + Navigation (desktop only) */}
          <div className="hidden md:flex md:flex-col md:w-72 flex-shrink-0">
            {/* Sticky container for progress card and navigation */}
            <Card className="sticky top-8 z-30 flex flex-col gap-0 overflow-visible rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 pb-4 border-b border-gray-100 bg-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 bg-teal-50 p-3 rounded-full">
                    <User className="h-7 w-7 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Profile Progress</h2>
                    <p className="text-sm text-gray-500">
                      {profileState === 'complete' 
                        ? 'Your profile is complete and ready for job applications.'
                        : profileState === 'partial'
                        ? 'Your profile is partially complete. Add more details for better autofill and job matches.'
                        : 'Complete your profile to unlock job application features.'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <Progress 
                      value={calculateCompletionPercentage(profile)} 
                      className="flex-1 h-3 bg-gray-100" 
                    />
                    <span className="text-base font-semibold text-teal-700 min-w-[48px] text-right">
                      {calculateCompletionPercentage(profile)}%
                    </span>
                  </div>
                  
                  {profileState === 'incomplete' && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-xs rounded-md px-3 py-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Complete required fields to unlock job applications</span>
                    </div>
                  )}
                  
                  {profileState === 'partial' && (
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-md px-3 py-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span>Add more details for better autofill and job matches</span>
                    </div>
                  )}
                  
                  {profileState === 'complete' && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                      <span>Your profile is ready for job applications!</span>
                    </div>
                  )}
                  
                  {nextSection && profileState !== 'complete' && (
                    <div 
                      className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-md px-3 py-2 cursor-pointer hover:bg-yellow-100 transition-colors"
                      onClick={() => scrollToSection(nextSection.id)}
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Next: {nextSection.name}</span>
                    </div>
                  )}
                </div>
              </div>
              <CardContent className="p-4 bg-white rounded-b-2xl">
                <nav className="flex flex-col space-y-1">
                  {Object.entries(sectionRefs).map(([id]) => (
                    <Button
                      key={id}
                      variant={activeSection === id ? 'default' : 'ghost'}
                      className={`justify-start ${
                        activeSection === id 
                          ? 'bg-teal-600 text-white hover:bg-teal-700' 
                          : 'text-gray-700'
                      }`}
                      onClick={() => scrollToSection(id)}
                    >
                      {getSectionIcon(id)}
                      {getSectionTitle(id)}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="flex-1 w-full">
            <div 
              ref={scrollContainerRef}
              className="h-[calc(100vh-100px)] overflow-y-auto pr-4 -mr-4 pb-4 mt-0"
            >
              {/* Mobile Progress Card */}
              <div className="md:hidden w-full mx-auto mb-4">
                <Card>
                  <CardContent className="p-6 flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 bg-teal-50 p-3 rounded-full">
                        <User className="h-7 w-7 text-teal-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Profile Progress</h2>
                        <p className="text-sm text-gray-500">
                          {profileState === 'complete' 
                            ? 'Your profile is complete and ready for job applications.'
                            : profileState === 'partial'
                            ? 'Your profile is partially complete. Add more details for better autofill and job matches.'
                            : 'Complete your profile to unlock job application features.'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <Progress 
                          value={calculateCompletionPercentage(profile)} 
                          className="flex-1 h-3 bg-gray-100" 
                        />
                        <span className="text-base font-semibold text-teal-700 min-w-[48px] text-right">
                          {calculateCompletionPercentage(profile)}%
                        </span>
                      </div>
                      
                      {profileState === 'incomplete' && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-xs rounded-md px-3 py-2">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          <span>Complete required fields to unlock job applications</span>
                        </div>
                      )}
                      
                      {profileState === 'partial' && (
                        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-md px-3 py-2">
                          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                          <span>Add more details for better job matches</span>
                        </div>
                      )}
                      
                      {profileState === 'complete' && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md px-3 py-2">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                          <span>Your profile is ready for job applications!</span>
                        </div>
                      )}
                      
                      {nextSection && profileState !== 'complete' && (
                        <div 
                          className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-md px-3 py-2 cursor-pointer hover:bg-yellow-100 transition-colors"
                          onClick={() => scrollToSection(nextSection.id)}
                        >
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          <span>Next: {nextSection.name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resume Section */}
              <div ref={sectionRefs.resume} id="resume">
                <PC.ProfileSectionResume profile={profile} updateProfile={updateProfile} />
              </div>
              
              <div ref={sectionRefs.personal} id="personal">
                <PC.ProfileSection
                  id="personal"
                  title="Personal Information"
                  icon={<User size={24} />}
                  displayContent={<PC.PersonalInfoDisplay profile={profile} />}
                  editContent={<PC.PersonalInfoForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={sectionRefs.education} id="education">
                <PC.ProfileSection
                  id="education"
                  title="Education"
                  icon={<GraduationCap size={24} />}
                  displayContent={<PC.EducationDisplay profile={profile} updateProfile={updateProfile} />}
                  editContent={<PC.EducationForm profile={profile} updateProfile={updateProfile} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={sectionRefs.employment} id="employment">
                <PC.ProfileSection
                  id="employment"
                  title="Employment History"
                  icon={<Building size={24} />}
                  displayContent={<PC.EmploymentDisplay profile={profile} updateProfile={updateProfile} />}
                  editContent={<PC.EmploymentForm profile={profile} updateProfile={updateProfile} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={sectionRefs.projects} id="projects">
                <PC.ProfileSection
                  id="projects"
                  title="Projects"
                  icon={<Code2 size={24} />}
                  displayContent={<PC.ProjectDisplay profile={profile} updateProfile={updateProfile} />}
                  editContent={<PC.ProjectForm profile={profile} updateProfile={updateProfile} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={sectionRefs.skills} id="skills">
                <PC.ProfileSection
                  id="skills"
                  title="Skills"
                  icon={<Code size={24} />}
                  displayContent={<PC.SkillsDisplay profile={profile} />}
                  editContent={<PC.SkillsForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={sectionRefs.social} id="social">
                <PC.ProfileSection
                  id="social"
                  title="Social Links"
                  icon={<LinkIcon size={24} />}
                  displayContent={<PC.SocialLinksDisplay profile={profile} />}
                  editContent={<PC.SocialLinksForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={sectionRefs.preferences} id="preferences">
                <PC.ProfileSection
                  id="preferences"
                  title="Job Preferences"
                  icon={<Briefcase size={24} />}
                  displayContent={<PC.JobPreferencesDisplay profile={profile} />}
                  editContent={<PC.JobPreferencesForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={sectionRefs.eligibility} id="eligibility">
                <PC.ProfileSection
                  id="eligibility"
                  title="Work Eligibility"
                  icon={<Globe size={24} />}
                  displayContent={<PC.WorkEligibilityDisplay profile={profile} />}
                  editContent={<PC.WorkEligibilityForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={sectionRefs.demographics} id="demographics">
                <PC.ProfileSection
                  id="demographics"
                  title="Demographics"
                  icon={<Users size={24} />}
                  displayContent={<PC.DemographicsDisplay profile={profile} />}
                  editContent={<PC.DemographicsForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get section icons
const getSectionIcon = (id: string) => {
  switch (id) {
    case 'resume': return <FileText className="mr-2 h-4 w-4" />;
    case 'personal': return <User className="mr-2 h-4 w-4" />;
    case 'education': return <GraduationCap className="mr-2 h-4 w-4" />;
    case 'employment': return <Building className="mr-2 h-4 w-4" />;
    case 'skills': return <Code className="mr-2 h-4 w-4" />;
    case 'social': return <LinkIcon className="mr-2 h-4 w-4" />;
    case 'preferences': return <Briefcase className="mr-2 h-4 w-4" />;
    case 'eligibility': return <Globe className="mr-2 h-4 w-4" />;
    case 'demographics': return <Users className="mr-2 h-4 w-4" />;
    case 'projects': return <Code2 className="mr-2 h-4 w-4" />;
    default: return null;
  }
};

// Helper function to get section titles
const getSectionTitle = (id: string) => {
  switch (id) {
    case 'resume': return 'Resume';
    case 'personal': return 'Personal Info';
    case 'education': return 'Education';
    case 'employment': return 'Employment';
    case 'skills': return 'Skills';
    case 'social': return 'Social Links';
    case 'preferences': return 'Job Preferences';
    case 'eligibility': return 'Work Eligibility';
    case 'demographics': return 'Demographics';
    case 'projects': return 'Projects';
    default: return id;
  }
};

export default function ProfilePage() {
  return (
    <ProtectedPage>
      <ProfilePageContent />
    </ProtectedPage>
  );
} 