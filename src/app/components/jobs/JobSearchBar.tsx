'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Briefcase, FilterIcon, X, Code } from 'lucide-react';
import { MultiSelect } from '@/app/components/ui/multi-select';
import { useRouter, useSearchParams } from 'next/navigation';
import JobSearchBarSkeleton from '@/app/components/loading/JobSearchBarSkeleton';
import { LOCATION_TYPE_OPTIONS, ROLE_LEVEL_OPTIONS, INDUSTRY_SPECIALIZATION_OPTIONS } from '@/app/types/job';
import JobSearchMoreFilters from '@/app/components/jobs/JobSearchMoreFilters';

interface JobSearchBarProps {
  detailsOpen?: boolean;
  isLoading?: boolean;
}

export default function JobSearchBar({ detailsOpen = false, isLoading = false }: JobSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize state from URL parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [minSalary, setMinSalary] = useState('any');
  const [locations, setLocations] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [sponsorship, setSponsorship] = useState('any');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Define filter options
  const salaryRanges = [
    { value: 'any', label: 'Any Salary' },
    { value: '60000', label: 'Min $60,000' },
    { value: '80000', label: 'Min $80,000' },
    { value: '100000', label: 'Min $100,000' },
    { value: '120000', label: 'Min $120,000' },
    { value: '140000', label: 'Min $140,000' },
    { value: '160000', label: 'Min $160,000' },
    { value: '180000', label: 'Min $180,000' },
    { value: '200000', label: 'Min $200,000' }
  ];
  
  // Load filters from URL parameters on component mount
  useEffect(() => {
    const query = searchParams.get('query') || '';
    const salary = searchParams.get('salary') || 'any';
    const locs = searchParams.get('locations')?.split(',') || [];
    const specs = searchParams.get('specializations')?.split(',') || [];
    const exps = searchParams.get('experienceLevels')?.split(',') || [];
    const sponsor = searchParams.get('sponsorship') || 'any';
    
    setSearchQuery(query);
    setMinSalary(salary);
    setLocations(locs);
    setSpecializations(specs);
    setExperienceLevels(exps);
    setSponsorship(sponsor);
    
    // Set active filters
    const filters = [];
    if (salary !== 'any') {
      const salaryOption = salaryRanges.find(r => r.value === salary);
      if (salaryOption) filters.push(salaryOption.label);
    }
    specs.forEach(spec => {
      const specializationOption = INDUSTRY_SPECIALIZATION_OPTIONS.find(r => r.value === spec);
      if (specializationOption) filters.push(specializationOption.label);
    });
    locs.forEach(loc => {
      const locationOption = LOCATION_TYPE_OPTIONS.find(r => r.value === loc);
      if (locationOption) filters.push(locationOption.label);
    });
    exps.forEach(exp => {
      const experienceOption = ROLE_LEVEL_OPTIONS.find(r => r.value === exp);
      if (experienceOption) filters.push(experienceOption.label);
    });
    if (sponsor === 'yes') {
      filters.push('Provides Visa Sponsorship');
    }
    
    setActiveFilters(filters);
  }, [searchParams]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);
  
  // Handle filter changes with immediate update
  const handleSalaryChange = (value: string) => {
    setMinSalary(value);
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value !== 'any') params.set('salary', value);
      else params.delete('salary');
      router.replace(`/jobs?${params.toString()}`);
    }, 0);
  };
  
  const handleLocationsChange = (values: string[]) => {
    setLocations(values);
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length > 0) params.set('locations', values.join(','));
      else params.delete('locations');
      router.replace(`/jobs?${params.toString()}`);
    }, 0);
  };
  
  const handleExperienceLevelsChange = (values: string[]) => {
    setExperienceLevels(values);
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length > 0) params.set('experienceLevels', values.join(','));
      else params.delete('experienceLevels');
      router.replace(`/jobs?${params.toString()}`);
    }, 0);
  };
  
  // Toggle sponsorship filter
  const toggleSponsorshipFilter = () => {
    const newValue = sponsorship === 'yes' ? 'any' : 'yes';
    setSponsorship(newValue);
    
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue !== 'any') params.set('sponsorship', newValue);
      else params.delete('sponsorship');
      router.replace(`/jobs?${params.toString()}`);
    }, 0);
  };
  
  // Handle search submission - still needed for Enter key support
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) params.set('query', searchQuery);
    else params.delete('query');
    
    router.replace(`/jobs?${params.toString()}`);
  };
  
  // Handle text input changes with debounce
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear any existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Set a new timeout to update the URL after the user stops typing
    searchTimeout.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set('query', value);
      else params.delete('query');
      router.replace(`/jobs?${params.toString()}`);
    }, 500); // 500ms debounce time
  };
  
  // Add handler for specializations
  const handleSpecializationsChange = (values: string[]) => {
    setSpecializations(values);
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length > 0) params.set('specializations', values.join(','));
      else params.delete('specializations');
      router.replace(`/jobs?${params.toString()}`);
    }, 0);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setMinSalary('any');
    setLocations([]);
    setSpecializations([]);
    setExperienceLevels([]);
    setSponsorship('any');
    setActiveFilters([]);
    router.replace('/jobs');
  };
  
  // Remove a specific filter
  const removeFilter = (filter: string) => {
    if (salaryRanges.some(r => r.label === filter)) {
      setMinSalary('any');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('salary');
      router.replace(`/jobs?${params.toString()}`);
    } else if (INDUSTRY_SPECIALIZATION_OPTIONS.some(r => r.label === filter)) {
      const newSpecs = specializations.filter(spec => {
        const option = INDUSTRY_SPECIALIZATION_OPTIONS.find(r => r.value === spec);
        return option?.label !== filter;
      });
      setSpecializations(newSpecs);
      const params = new URLSearchParams(searchParams.toString());
      if (newSpecs.length > 0) params.set('specializations', newSpecs.join(','));
      else params.delete('specializations');
      router.replace(`/jobs?${params.toString()}`);
    } else if (LOCATION_TYPE_OPTIONS.some(r => r.label === filter)) {
      const newLocations = locations.filter(loc => {
        const option = LOCATION_TYPE_OPTIONS.find(r => r.value === loc);
        return option?.label !== filter;
      });
      setLocations(newLocations);
      const params = new URLSearchParams(searchParams.toString());
      if (newLocations.length > 0) params.set('locations', newLocations.join(','));
      else params.delete('locations');
      router.replace(`/jobs?${params.toString()}`);
    } else if (ROLE_LEVEL_OPTIONS.some(r => r.label === filter)) {
      const newLevels = experienceLevels.filter(level => {
        const option = ROLE_LEVEL_OPTIONS.find(r => r.value === level);
        return option?.label !== filter;
      });
      setExperienceLevels(newLevels);
      const params = new URLSearchParams(searchParams.toString());
      if (newLevels.length > 0) params.set('experienceLevels', newLevels.join(','));
      else params.delete('experienceLevels');
      router.replace(`/jobs?${params.toString()}`);
    } else if (filter === 'Provides Visa Sponsorship') {
      setSponsorship('any');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('sponsorship');
      router.replace(`/jobs?${params.toString()}`);
    }
  };
  
  // If loading, show skeleton
  if (isLoading) {
    return <JobSearchBarSkeleton detailsOpen={detailsOpen} />;
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col space-y-4">
          {/* Main search bar with filters toggle */}
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for jobs, skills, or companies..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            
            {/* Filters toggle button (visible on mobile) */}
            <button
              type="button"
              className="md:hidden inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
            
            {/* Search button */}
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
            >
              Search
            </button>
          </div>
          
          {/* Filters - desktop view always visible, mobile only when toggled */}
          <div className={`${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className={`grid grid-cols-1 ${detailsOpen ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-4`}>
              {/* Specialization Filter */}
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
                  <Code className="h-5 w-5 text-gray-500" />
                </div>
                <MultiSelect
                  options={INDUSTRY_SPECIALIZATION_OPTIONS}
                  selected={specializations}
                  onChange={handleSpecializationsChange}
                  placeholder="Select specializations..."
                  itemName="specialization"
                />
              </div>
              
              {/* Location Filter */}
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
                  <MapPin className="h-5 w-5 text-gray-500" />
                </div>
                <MultiSelect
                  options={LOCATION_TYPE_OPTIONS}
                  selected={locations}
                  onChange={handleLocationsChange}
                  placeholder="Select locations..."
                  itemName="location"
                />
              </div>
              
              {/* Experience Level Filter */}
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                </div>
                <MultiSelect
                  options={ROLE_LEVEL_OPTIONS}
                  selected={experienceLevels}
                  onChange={handleExperienceLevelsChange}
                  placeholder="Select experience levels..."
                  itemName="experience"
                />
              </div>
              
              {/* More Filters */}
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
                  <FilterIcon className="h-5 w-5 text-gray-500" />
                </div>
                <JobSearchMoreFilters
                  minSalary={minSalary}
                  sponsorship={sponsorship}
                  onSalaryChange={handleSalaryChange}
                  onSponsorshipChange={toggleSponsorshipFilter}
                  salaryRanges={salaryRanges}
                />
              </div>
            </div>
            
            {/* Active Filter Tags & Clear Filters Button */}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <div key={filter} className="bg-teal-50 text-teal-700 rounded-full px-3 py-1 text-sm flex items-center">
                    {filter}
                    <button 
                      type="button"
                      onClick={() => removeFilter(filter)} 
                      className="ml-2 text-teal-500 hover:text-teal-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 