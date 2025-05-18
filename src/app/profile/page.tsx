'use client';

import { useState, useEffect, useRef } from 'react';
import { UserProfile, FieldName } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { 
  User, 
  Link as LinkIcon, 
  GraduationCap, 
  Code, 
  Briefcase, 
  Globe, 
  Users, 
  Key,
  FileText,
  Building
} from 'lucide-react';

import ProfileSection from './components/ProfileSection';
import PersonalInfoForm from './components/PersonalInfoForm';
import PersonalInfoDisplay from './components/PersonalInfoDisplay';
import SocialLinksForm from './components/SocialLinksForm';
import SocialLinksDisplay from './components/SocialLinksDisplay';
import DemographicsForm from './components/DemographicsForm';
import DemographicsDisplay from './components/DemographicsDisplay';
import WorkEligibilityForm from './components/WorkEligibilityForm';
import WorkEligibilityDisplay from './components/WorkEligibilityDisplay';
import EducationForm from './components/EducationForm';
import EducationDisplay from './components/EducationDisplay';
import EmploymentForm from './components/EmploymentForm';
import EmploymentDisplay from './components/EmploymentDisplay';
import SkillsForm from './components/SkillsForm';
import SkillsDisplay from './components/SkillsDisplay';
import JobPreferencesForm from './components/JobPreferencesForm';
import JobPreferencesDisplay from './components/JobPreferencesDisplay';
import AccountForm from './components/AccountForm';
import AccountDisplay from './components/AccountDisplay';
import ProfileSectionResume from './components/ProfileSectionResume';

// Add type declaration to avoid TypeScript errors
declare global {
  interface Window {
    __isScrolling?: boolean;
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    [FieldName.FULL_NAME]: '',
    [FieldName.EMAIL]: '',
    [FieldName.PHONE_NUMBER]: '',
    [FieldName.EDUCATION]: [],
    [FieldName.SKILLS]: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');
  
  // Refs for each section
  const personalRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const employmentRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const preferencesRef = useRef<HTMLDivElement>(null);
  const eligibilityRef = useRef<HTMLDivElement>(null);
  const demographicsRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  
  // Ref to track user scrolling state
  const isUserScrollingRef = useRef<boolean>(true);
  
  // Debounced section update to prevent UI glitches during rapid scrolling
  const debounce = <T extends (...args: string[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  
  // Map of section IDs to refs
  const sectionRefs = {
    personal: personalRef,
    social: socialRef,
    education: educationRef,
    employment: employmentRef,
    skills: skillsRef,
    preferences: preferencesRef,
    eligibility: eligibilityRef,
    demographics: demographicsRef,
    account: accountRef,
    resume: resumeRef,
  };
  
  // Function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    // Temporarily disable intersection observer updates
    isUserScrollingRef.current = false;
    
    // Set active section immediately for better UX
    setActiveSection(sectionId);
    
    // Perform the scroll
    const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Re-enable intersection observer after animation likely completes
    setTimeout(() => {
      isUserScrollingRef.current = true;
    }, 1000);
  };
  
  // Set up intersection observer to update active section based on scroll position
  useEffect(() => {
    if (isLoading) return;
    
    let scrollTimeout: NodeJS.Timeout;
    
    // Function to update active section with additional checks
    const updateActiveSection = (id: string) => {
      if (!isUserScrollingRef.current) return;
      
      // Only update if the section isn't already active (prevents flickering)
      if (activeSection !== id) {
        setActiveSection(id);
      }
    };
    
    // Debounced version of the update function to avoid rapid changes
    const debouncedUpdateSection = debounce(updateActiveSection, 50);
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Only process if user is manually scrolling
        if (!isUserScrollingRef.current) return;
        
        // Filter only for elements that are intersecting
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        
        if (intersectingEntries.length > 0) {
          // Sort based on position from top and visibility ratio
          const sortedEntries = intersectingEntries.sort((a, b) => {
            // Prioritize elements that are more visible
            const visibilityDiff = b.intersectionRatio - a.intersectionRatio;
            
            // If visibility difference is significant, use that
            if (Math.abs(visibilityDiff) > 0.2) {
              return visibilityDiff;
            }
            
            // Otherwise, prioritize elements closer to the top
            const rectA = a.boundingClientRect;
            const rectB = b.boundingClientRect;
            
            // If the element is above the viewport center, give it higher priority
            const viewportHeight = window.innerHeight;
            const viewportCenter = viewportHeight / 2;
            
            const distanceFromCenterA = Math.abs(rectA.top - viewportCenter);
            const distanceFromCenterB = Math.abs(rectB.top - viewportCenter);
            
            return distanceFromCenterA - distanceFromCenterB;
          });
          
          const topEntry = sortedEntries[0];
          debouncedUpdateSection(topEntry.target.id);
        }
      },
      { 
        threshold: [0, 0.1, 0.25, 0.5, 0.75], // More thresholds for smoother transitions
        rootMargin: "-10px 0px -70% 0px" // Less aggressive top margin
      }
    );
    
    // Observe all section elements
    Object.keys(sectionRefs).forEach((id) => {
      const ref = sectionRefs[id as keyof typeof sectionRefs];
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    // Improve scroll handling
    const handleScroll = () => {
      // Mark that user is scrolling
      isUserScrollingRef.current = true;
      
      // Clear previous timeout
      clearTimeout(scrollTimeout);
      
      // Set a reasonable timeout after scrolling stops to resume normal behavior
      scrollTimeout = setTimeout(() => {
        isUserScrollingRef.current = true;
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isLoading, sectionRefs, activeSection]);
  
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
            [FieldName.RESUME]: '/Users/kaiznanji/Documents/RESUMES/2025/Kaiz_Nanji_New_Grad_Resume_V4.pdf',
            [FieldName.FULL_NAME]: 'Kaiz Nanji',
            [FieldName.EMAIL]: 'k4nanji@uwaterloo.ca',
            [FieldName.PHONE_NUMBER]: '4168784499',
            [FieldName.CURRENT_LOCATION]: 'Toronto, ON',
            [FieldName.LINKEDIN]: 'https://www.linkedin.com/in/john-doe',
            [FieldName.TWITTER]: '@johndoe',
            [FieldName.GITHUB]: 'https://github.com/johndoe',
            [FieldName.PORTFOLIO]: 'https://example.com/portfolio',
            [FieldName.OTHER]: 'mylink.com',
            [FieldName.GENDER]: 'Man',
            [FieldName.VETERAN]: false,
            [FieldName.SEXUALITY]: ['Heterosexual'],
            [FieldName.ACKNOWLEDGE]: true,
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
                [FieldName.DEGREE]: "Bachelor's Degree",
                [FieldName.FIELD_OF_STUDY]: 'Computer Science',
                [FieldName.EDUCATION_FROM]: "2020",
                [FieldName.EDUCATION_TO]: "2025",
              }
            ],
            [FieldName.SKILLS]: ['Python', 'Java', 'JavaScript'],
            [FieldName.WORKDAY_EMAIL]: 'mathstutors0@gmail.com',
            [FieldName.WORKDAY_PASSWORD]: 'Password123!',
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
    <div className="bg-gray-50 pb-6">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar navigation - hidden on mobile */}
          <div className="hidden md:block md:w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="flex flex-col space-y-1">
                  <Button
                    variant={activeSection === 'resume' ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeSection === 'resume' 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => scrollToSection('resume')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                  <Button
                    variant={activeSection === 'personal' ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeSection === 'personal' 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => scrollToSection('personal')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Personal Info
                  </Button>
                  <Button
                    variant={activeSection === 'education' ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeSection === 'education' 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => scrollToSection('education')}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Education
                  </Button>
                  <Button
                    variant={activeSection === 'employment' ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeSection === 'employment' 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => scrollToSection('employment')}
                  >
                    <Building className="mr-2 h-4 w-4" />
                    Employment
                  </Button>
                  <Button
                    variant={activeSection === 'skills' ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeSection === 'skills' 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => scrollToSection('skills')}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Skills
                  </Button>
                  <Button
                    variant={activeSection === 'social' ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeSection === 'social' 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => scrollToSection('social')}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Social Links
                  </Button>
                  <Button
                    variant={activeSection === 'preferences' ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeSection === 'preferences' 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => scrollToSection('preferences')}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Job Preferences
                  </Button>
                  <Button
                    variant={activeSection === 'eligibility' ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeSection === 'eligibility' 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => scrollToSection('eligibility')}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Work Eligibility
                  </Button>
                  <Button
                    variant={activeSection === 'demographics' ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeSection === 'demographics' 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => scrollToSection('demographics')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Demographics
                  </Button>
                  <Button
                    variant={activeSection === 'account' ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeSection === 'account' 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => scrollToSection('account')}
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main content area - full width on mobile */}
          <div className="flex-1 w-full">
            <div className="h-[calc(100vh-100px)] md:h-[calc(100vh-180px)] overflow-y-auto pr-4 -mr-4 pb-4 mt-0">
              {/* Resume Section */}
              <div ref={resumeRef} id="resume">
                <ProfileSectionResume profile={profile} updateProfile={updateProfile} />
              </div>
              
              <div ref={personalRef} id="personal">
                <ProfileSection
                  id="personal"
                  title="Personal Information"
                  icon={<User size={24} />}
                  displayContent={<PersonalInfoDisplay profile={profile} />}
                  editContent={<PersonalInfoForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={educationRef} id="education">
                <ProfileSection
                  id="education"
                  title="Education"
                  icon={<GraduationCap size={24} />}
                  displayContent={<EducationDisplay profile={profile} />}
                  editContent={<EducationForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={employmentRef} id="employment">
                <ProfileSection
                  id="employment"
                  title="Employment"
                  icon={<Briefcase size={24} />}
                  displayContent={<EmploymentDisplay profile={profile} />}
                  editContent={<EmploymentForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={skillsRef} id="skills">
                <ProfileSection
                  id="skills"
                  title="Skills"
                  icon={<Code size={24} />}
                  displayContent={<SkillsDisplay profile={profile} />}
                  editContent={<SkillsForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={socialRef} id="social">
                <ProfileSection
                  id="social"
                  title="Social Links"
                  icon={<LinkIcon size={24} />}
                  displayContent={<SocialLinksDisplay profile={profile} />}
                  editContent={<SocialLinksForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={preferencesRef} id="preferences">
                <ProfileSection
                  id="preferences"
                  title="Job Preferences"
                  icon={<Briefcase size={24} />}
                  displayContent={<JobPreferencesDisplay profile={profile} />}
                  editContent={<JobPreferencesForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={eligibilityRef} id="eligibility">
                <ProfileSection
                  id="eligibility"
                  title="Work Eligibility"
                  icon={<Globe size={24} />}
                  displayContent={<WorkEligibilityDisplay profile={profile} />}
                  editContent={<WorkEligibilityForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={demographicsRef} id="demographics">
                <ProfileSection
                  id="demographics"
                  title="Demographics"
                  icon={<Users size={24} />}
                  displayContent={<DemographicsDisplay profile={profile} />}
                  editContent={<DemographicsForm profile={profile} updateProfile={() => {}} />}
                  profile={profile}
                  updateProfile={updateProfile}
                />
              </div>

              <div ref={accountRef} id="account">
                <ProfileSection
                  id="account"
                  title="Account"
                  icon={<Key size={24} />}
                  displayContent={<AccountDisplay profile={profile} />}
                  editContent={<AccountForm profile={profile} updateProfile={() => {}} />}
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