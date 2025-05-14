'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Hide navbar on login and signup pages
  const hideNavbarPaths = ['/login', '/signup'];
  const shouldHideNavbar = hideNavbarPaths.includes(pathname);
  
  // Memoize the scroll handler to prevent recreating it on each render
  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 10;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  }, [scrolled]);

  useEffect(() => {
    if (shouldHideNavbar) {
      return; // Early return if navbar should be hidden
    }
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, shouldHideNavbar]); // Stable dependency array

  // Don't render anything if the navbar should be hidden
  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 bg-gray-900 text-white transition-all duration-300 ${
      scrolled ? 'border-b border-gray-700 shadow-lg' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/logo_transparent.png"
                alt="Logo"
                width={180}
                height={60}
                className="object-contain"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 rounded-md text-sm transition-colors hover:bg-gray-800"
            >
              Log in
            </Link>
            <Link 
              href="/signup"
              className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium transition-colors hover:bg-blue-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 