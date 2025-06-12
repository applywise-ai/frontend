import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

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

/**
 * Optimized navigation utility that uses router.replace for faster navigation
 * and prefetches the route for even better performance
 */
export const navigateOptimized = async (
  router: AppRouterInstance,
  path: string,
  options: {
    replace?: boolean;
    prefetch?: boolean;
    scroll?: boolean;
  } = {}
) => {
  const { replace = true, prefetch = true, scroll = true } = options;

  try {
    // Prefetch the route for faster loading
    if (prefetch) {
      router.prefetch(path);
    }

    // Use replace by default for faster navigation (no history entry)
    if (replace) {
      await router.replace(path, { scroll });
    } else {
      await router.push(path, { scroll });
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to regular push if replace fails
    router.push(path);
  }
};

/**
 * Navigate and don't wait for completion - useful when component will unmount
 */
export const navigateAndForget = (
  router: AppRouterInstance,
  path: string,
  options: {
    replace?: boolean;
    prefetch?: boolean;
  } = {}
) => {
  const { replace = true, prefetch = true } = options;

  // Prefetch for faster loading
  if (prefetch) {
    router.prefetch(path);
  }

  // Don't await - let navigation happen in background
  if (replace) {
    router.replace(path);
  } else {
    router.push(path);
  }
};

/**
 * Check if we're already on the target path to avoid unnecessary navigation
 */
export const shouldNavigate = (currentPath: string, targetPath: string): boolean => {
  return currentPath !== targetPath;
}; 