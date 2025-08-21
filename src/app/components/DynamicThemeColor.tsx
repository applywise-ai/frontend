'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { isDashboardPage } from '@/app/utils/navigation';

const DynamicThemeColor = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isCurrentDashboardPage = isDashboardPage(pathname);

  useEffect(() => {
    // Determine the theme color based on navbar logic
    const shouldUseWhiteNavbar = isCurrentDashboardPage || isAuthenticated;
    const themeColor = shouldUseWhiteNavbar ? '#ffffff' : '#111827';
    const statusBarStyle = shouldUseWhiteNavbar ? 'default' : 'black-translucent';

    // Update theme-color meta tag for Chrome Android
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', themeColor);
    } else {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.setAttribute('name', 'theme-color');
      themeColorMeta.setAttribute('content', themeColor);
      document.head.appendChild(themeColorMeta);
    }

    // Update apple-mobile-web-app-status-bar-style for Safari iOS
    let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (statusBarMeta) {
      statusBarMeta.setAttribute('content', statusBarStyle);
    } else {
      statusBarMeta = document.createElement('meta');
      statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      statusBarMeta.setAttribute('content', statusBarStyle);
      document.head.appendChild(statusBarMeta);
    }
  }, [pathname, isAuthenticated, isCurrentDashboardPage]);

  return null; // This component doesn't render anything
};

export default DynamicThemeColor;
