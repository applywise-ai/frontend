/**
 * Tailwind CSS breakpoint utilities
 * Based on Tailwind's default breakpoint system
 */

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1460,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Get the pixel value for a specific breakpoint
 * @param breakpoint - The breakpoint name (sm, md, lg, xl, 2xl)
 * @returns The pixel value for the breakpoint
 */
export function getBreakpoint(breakpoint: Breakpoint): number {
  return BREAKPOINTS[breakpoint];
}
