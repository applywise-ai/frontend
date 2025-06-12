import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { JobFilters } from '@/app/types/job';

export function useJobFilters() {
  const searchParams = useSearchParams();

  const filters = useMemo((): JobFilters => {
    const result: JobFilters = {};

    // Text search
    const query = searchParams.get('query');
    if (query) {
      result.query = query;
    }

    // Locations
    const locations = searchParams.get('locations');
    if (locations) {
      result.locations = locations.split(',');
    }

    // Specializations
    const specializations = searchParams.get('specializations');
    if (specializations) {
      result.specializations = specializations.split(',');
    }

    // Experience levels
    const experienceLevels = searchParams.get('experienceLevels');
    if (experienceLevels) {
      result.experienceLevels = experienceLevels.split(',');
    }

    // Minimum salary
    const salary = searchParams.get('salary');
    if (salary && salary !== 'any') {
      result.minSalary = parseInt(salary);
    }

    // Sponsorship
    const sponsorship = searchParams.get('sponsorship');
    if (sponsorship && sponsorship !== 'any') {
      result.sponsorship = sponsorship as 'yes' | 'no';
    }

    return result;
  }, [searchParams]);

  const hasFilters = useMemo(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  return {
    filters,
    hasFilters
  };
} 