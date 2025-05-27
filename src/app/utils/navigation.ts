/**
 * List of all dashboard pages in the application
 */
export const DASHBOARD_PAGES = [
  '/jobs',
  '/applications',
  '/profile',
  '/settings',
  '/for-you',
  '/help'
];

/**
 * Check if a given pathname is a dashboard page or a subpage of a dashboard page
 * @param pathname The current pathname from usePathname()
 * @returns boolean indicating if the current page is a dashboard page
 */
export const isDashboardPage = (pathname: string | null): boolean => {
  if (!pathname) return false;
  
  // Direct match
  if (DASHBOARD_PAGES.includes(pathname)) return true;
  
  // Check if it's a subpage of any dashboard page
  return DASHBOARD_PAGES.some(page => pathname.startsWith(`${page}/`));
};

/**
 * List of pages where the navbar should be hidden
 */
export const HIDE_NAVBAR_PAGES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password'
];

/**
 * Check if the navbar should be hidden on the current page
 * @param pathname The current pathname from usePathname()
 * @returns boolean indicating if the navbar should be hidden
 */
export const shouldHideNavbar = (pathname: string | null): boolean => {
  if (!pathname) return false;
  return HIDE_NAVBAR_PAGES.includes(pathname);
}; 