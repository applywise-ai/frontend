'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/app/utils/firebase';
import NavbarSkeleton from './loading/NavbarSkeleton';
import { isDashboardPage, shouldHideNavbar } from '@/app/utils/navigation';
import { Dialog, DialogContentWithoutCloseButton, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { 
  Bug, 
  HelpCircle, 
  Lightbulb,
  BookOpen,
  X,
  Send,
  ArrowLeft
} from 'lucide-react';

interface NavbarProps {
  isLoading?: boolean;
}

const Navbar = ({ isLoading = false }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [bugReport, setBugReport] = useState({ title: '', description: '' });
  const [featureSuggestion, setFeatureSuggestion] = useState({ title: '', description: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Check if current page is a dashboard page or should hide navbar
  const isCurrentDashboardPage = isDashboardPage(pathname);
  const hideNavbar = shouldHideNavbar(pathname);
  
  // Memoize the scroll handler to prevent recreating it on each render
  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 10;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  }, [scrolled]);

  useEffect(() => {
    if (hideNavbar) {
      return; // Early return if navbar should be hidden
    }
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const user = await authService.isLoggedIn();
        setIsLoggedIn(!!user);
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, hideNavbar]); // Stable dependency array

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close the mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutsideMobile = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideMobile);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMobile);
    };
  }, [mobileMenuOpen]);

  // Don't render anything if the navbar should be hidden
  if (hideNavbar) {
    return null;
  }

  // Show skeleton while loading
  if (isLoading || authLoading) {
    return <NavbarSkeleton />;
  }

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/';
  };

  const handleBugReportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBugReport(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureSuggestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeatureSuggestion(prev => ({ ...prev, [name]: value }));
  };

  const handleBugReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to submit bug report
    console.log('Bug report submitted:', bugReport);
    // Reset form and close modal
    setBugReport({ title: '', description: '' });
    setActiveSectionId(null);
    setHelpModalOpen(false);
  };

  const handleFeatureSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to submit feature suggestion
    console.log('Feature suggestion submitted:', featureSuggestion);
    // Reset form and close modal
    setFeatureSuggestion({ title: '', description: '' });
    setActiveSectionId(null);
    setHelpModalOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${
      isCurrentDashboardPage || isLoggedIn
        ? 'bg-white text-gray-900' 
        : 'bg-gray-900 text-white'
    } transition-all duration-300 ${
      isCurrentDashboardPage ? 'border-b border-gray-200 shadow-sm' : 
      scrolled ? (isCurrentDashboardPage || isLoggedIn ? 'border-b border-gray-200 shadow-md' : 'border-b border-gray-700 shadow-lg') : ''
    }`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href={isLoggedIn ? "/jobs" : "/"}>
                <Image
                  src={isLoggedIn ? "/images/logo_dark_transparent.png" : "/images/logo_transparent.png"}
                  alt="Logo"
                  width={180}
                  height={40}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>
            
            {/* Dashboard navigation links - only show when logged in */}
            {isLoggedIn && (
              <div className="hidden md:flex items-center ml-4 space-x-6">
                {/* Jobs link */}
                <Link 
                  href="/jobs" 
                  className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                    pathname === '/jobs' || pathname?.startsWith('/jobs/') ? 'text-teal-700 font-semibold' : 'text-gray-700 hover:text-teal-600 font-medium'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                  </svg>
                  <span>Jobs</span>
                </Link>
                
                {/* For You link */}
                <Link 
                  href="/for-you" 
                  className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                    pathname === '/for-you' ? 'text-teal-700 font-semibold' : 'text-gray-700 hover:text-teal-600 font-medium'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  <span>For You</span>
                </Link>
                
                {/* Saved Jobs link */}
                <Link 
                  href="/saved-jobs" 
                  className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                    pathname === '/saved-jobs' || pathname?.startsWith('/saved-jobs/') ? 'text-teal-700 font-semibold' : 'text-gray-700 hover:text-teal-600 font-medium'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                  <span>Saved</span>
                </Link>

                {/* Profile link - moved from dropdown to main navbar */}
                <Link 
                  href="/profile" 
                  className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                    pathname === '/profile' || pathname?.startsWith('/profile/') ? 'text-teal-700 font-semibold' : 'text-gray-700 hover:text-teal-600 font-medium'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span>Profile</span>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Help/Report Modal */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-700 hover:text-teal-600 transition-colors"
                  onClick={() => {
                    setHelpModalOpen(true);
                    setActiveSectionId(null);
                  }}
                >
                      <HelpCircle className="h-6 w-6" />
                    </Button>

                <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
                  <DialogContentWithoutCloseButton className="w-[95%] max-w-4xl bg-white p-0 rounded-lg max-h-[90vh] overflow-auto">
                    <div className="border-b border-gray-200 px-6 py-4 flex items-center">
                      {activeSectionId === null ? (
                        <>
                          <div className="w-8"></div> {/* Empty space for alignment */}
                          <DialogTitle className="text-lg font-medium text-center flex-grow">Help & Support</DialogTitle>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-600" 
                            onClick={() => setActiveSectionId(null)}
                          >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back
                          </Button>
                          <DialogTitle className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">
                            {activeSectionId === 'bug-report' ? 'Report a Bug' : 'Suggest a Feature'}
                          </DialogTitle>
                        </>
                      )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                        className="rounded-full h-8 w-8 p-0 flex items-center justify-center text-gray-500 ml-auto"
                        onClick={() => setHelpModalOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {activeSectionId === null && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Report Bug Card */}
                          <div 
                            className="h-[220px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group relative flex flex-col"
                            onClick={() => setActiveSectionId('bug-report')}
                          >
                            <div className="p-5 flex flex-col h-full">
                              <div className="flex items-center mb-3">
                                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center mr-3">
                                  <Bug className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-lg font-medium whitespace-nowrap">Report a Bug</h3>
                              </div>
                              <p className="text-sm text-gray-600 flex-grow">
                                Found something not working? Let us know.
                              </p>
                              <div className="mt-auto pt-4 flex justify-end">
                                <span className="text-sm text-teal-600 group-hover:text-teal-700 group-hover:underline transition-colors flex items-center">
                                  Report
                                  <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Help with Features Card */}
                          <div 
                            className="h-[220px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group relative flex flex-col"
                            onClick={() => router.push('/help/faq')}
                          >
                            <div className="p-5 flex flex-col h-full">
                              <div className="flex items-center mb-3">
                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                                  <BookOpen className="h-6 w-6 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-medium">Help</h3>
                              </div>
                              <p className="text-sm text-gray-600 flex-grow">
                                Learn how to use all features of ApplyWise.
                              </p>
                              <div className="mt-auto pt-4 flex justify-end">
                                <span className="text-sm text-teal-600 group-hover:text-teal-700 group-hover:underline transition-colors flex items-center">
                            View FAQ
                                  <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                                </span>
                              </div>
                            </div>
                          </div>

                      {/* Suggest Feature Card */}
                          <div 
                            className="h-[220px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group relative flex flex-col"
                            onClick={() => setActiveSectionId('feature-suggestion')}
                          >
                            <div className="p-5 flex flex-col h-full">
                              <div className="flex items-center mb-3">
                                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                                  <Lightbulb className="h-6 w-6 text-amber-500" />
                                </div>
                                <h3 className="text-lg font-medium">Suggest</h3>
                              </div>
                              <p className="text-sm text-gray-600 flex-grow">
                                Have an idea to make ApplyWise better?
                              </p>
                              <div className="mt-auto pt-4 flex justify-end">
                                <span className="text-sm text-teal-600 group-hover:text-teal-700 group-hover:underline transition-colors flex items-center">
                            Suggest
                                  <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSectionId === 'bug-report' && (
                      <div className="px-6 pb-6">
                        <form onSubmit={handleBugReportSubmit}>
                          <div className="space-y-6">
                            <div>
                              <label htmlFor="bug-title" className="block text-base font-medium text-gray-700 mb-2">
                                What&apos;s the issue?
                              </label>
                              <Input
                                id="bug-title"
                                name="title"
                                value={bugReport.title}
                                onChange={handleBugReportChange}
                                placeholder="Brief description of the problem"
                                className="text-base shadow-sm"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="bug-description" className="block text-base font-medium text-gray-700 mb-2">
                                Details
                              </label>
                              <Textarea
                                id="bug-description"
                                name="description"
                                value={bugReport.description}
                                onChange={handleBugReportChange}
                                placeholder="Please provide details about what happened and how to reproduce the issue"
                                className="text-base shadow-sm"
                                rows={5}
                                required
                              />
                            </div>
                            
                            <div className="flex justify-end pt-2">
                              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 text-base rounded-md">
                                <Send className="h-5 w-5 mr-2" />
                                Submit Report
                              </Button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {activeSectionId === 'feature-suggestion' && (
                      <div className="px-6 pb-6">
                        <form onSubmit={handleFeatureSuggestionSubmit}>
                          <div className="space-y-6">
                            <div>
                              <label htmlFor="feature-title" className="block text-base font-medium text-gray-700 mb-2">
                                Feature Idea
                              </label>
                              <Input
                                id="feature-title"
                                name="title"
                                value={featureSuggestion.title}
                                onChange={handleFeatureSuggestionChange}
                                placeholder="Brief description of your idea"
                                className="text-base shadow-sm"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="feature-description" className="block text-base font-medium text-gray-700 mb-2">
                                Details
                              </label>
                              <Textarea
                                id="feature-description"
                                name="description"
                                value={featureSuggestion.description}
                                onChange={handleFeatureSuggestionChange}
                                placeholder="Please provide more details about this feature and how it would help you"
                                className="text-base shadow-sm"
                                rows={5}
                                required
                              />
                            </div>
                            
                            <div className="flex justify-end pt-2">
                              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 text-base rounded-md">
                                <Send className="h-5 w-5 mr-2" />
                                Submit Suggestion
                          </Button>
                            </div>
                          </div>
                        </form>
                    </div>
                    )}
                  </DialogContentWithoutCloseButton>
                </Dialog>
                
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center h-16 px-2 hover:opacity-80 transition-colors focus:outline-none"
                  >
                    <div className="h-10 w-10 bg-white rounded flex items-center justify-center text-primary shadow-sm border border-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-900">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      {/* Dashboard page links in dropdown */}
                      <Link 
                        href="/settings"
                        className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                          pathname === '/settings' || pathname?.startsWith('/settings/') ? 'text-teal-700 font-bold' : 'text-gray-700'
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        Settings
                      </Link>
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`px-4 py-2 rounded-md text-sm transition-colors hover:bg-gray-800 ${
                    pathname === '/login' ? 'font-bold' : ''
                  }`}
                >
                  Log in
                </Link>
                <Link 
                  href="/signup"
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm transition-colors hover:opacity-90 ${
                    pathname === '/signup' ? 'font-bold' : 'font-medium'
                  }`}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu (hidden on desktop) */}
      {isLoggedIn && (
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </Button>
          
          {mobileMenuOpen && (
            <div ref={mobileMenuRef} className="absolute top-16 left-0 w-full bg-white shadow-md z-40 border-t border-gray-200">
              <div className="px-4 py-2">
                <Link 
                  href="/jobs" 
                  className={`flex items-center py-3 ${
                    pathname === '/jobs' || pathname?.startsWith('/jobs/') ? 'text-teal-700 font-semibold' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                  </svg>
                  Jobs
                </Link>
                <Link 
                  href="/for-you" 
                  className={`flex items-center py-3 ${
                    pathname === '/for-you' ? 'text-teal-700 font-semibold' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  For You
                </Link>
                <Link 
                  href="/saved-jobs" 
                  className={`flex items-center py-3 ${
                    pathname === '/saved-jobs' || pathname?.startsWith('/saved-jobs/') ? 'text-teal-700 font-semibold' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                  Saved Jobs
                </Link>
                <Link 
                  href="/profile" 
                  className={`flex items-center py-3 ${
                    pathname === '/profile' || pathname?.startsWith('/profile/') ? 'text-teal-700 font-semibold' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  Profile
                </Link>
                <Link 
                  href="/settings" 
                  className={`flex items-center py-3 ${
                    pathname === '/settings' || pathname?.startsWith('/settings/') ? 'text-teal-700 font-semibold' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center py-3 w-full text-left text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 