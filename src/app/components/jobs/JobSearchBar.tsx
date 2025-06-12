'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, FilterIcon, X, Code, DollarSign, Globe, Check } from 'lucide-react';
import { MultiSelect } from '@/app/components/ui/multi-select';
import { useRouter, useSearchParams } from 'next/navigation';
import JobSearchBarSkeleton from '@/app/components/loading/JobSearchBarSkeleton';
import { LOCATION_TYPE_OPTIONS, ROLE_LEVEL_OPTIONS, INDUSTRY_SPECIALIZATION_OPTIONS } from '@/app/types/job';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';

interface JobSearchBarProps {
  detailsOpen?: boolean;
  isLoading?: boolean;
  isMobile?: boolean;
}

export default function JobSearchBar({ detailsOpen = false, isLoading = false, isMobile }: JobSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [minSalary, setMinSalary] = useState('any');
  const [locations, setLocations] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [sponsorship, setSponsorship] = useState('any');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  
  // Helper function to safely update URL parameters
  const updateUrlParams = (updates: Record<string, string | string[] | null>) => {
    // Get current URL parameters
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === 'any' || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, value);
      }
    });
    router.replace(`/jobs?${params.toString()}`);
  };
  
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
  
  useEffect(() => {
    if (isMobile) {
      setShowFilters(false);
    }
  }, [isMobile]);

  // Load filters from URL parameters on component mount
  useEffect(() => {
    const query = searchParams.get('query') || '';
    const salary = searchParams.get('salary') || 'any';
    const locs = searchParams.get('locations')?.split(',').filter(Boolean) || [];
    const specs = searchParams.get('specializations')?.split(',').filter(Boolean) || [];
    const exps = searchParams.get('experienceLevels')?.split(',').filter(Boolean) || [];
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
  
  // Handle filter changes with immediate update
  const handleSalaryChange = (value: string) => {
    setMinSalary(value);
    updateUrlParams({ salary: value });
  };
  
  const handleLocationsChange = (values: string[]) => {
    setLocations(values);
    updateUrlParams({ locations: values });
  };
  
  const handleExperienceLevelsChange = (values: string[]) => {
    setExperienceLevels(values);
    updateUrlParams({ experienceLevels: values });
  };
  
  // Toggle sponsorship filter
  const toggleSponsorshipFilter = () => {
    const newValue = sponsorship === 'yes' ? 'any' : 'yes';
    setSponsorship(newValue);
    updateUrlParams({ sponsorship: newValue });
  };
  
  // Handle search submission - search only when button is clicked
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    updateUrlParams({ query: searchQuery });
  };
  
  // Handle text input changes without automatic search
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };
  
  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
    updateUrlParams({ query: null });
  };
  
  // Add handler for specializations
  const handleSpecializationsChange = (values: string[]) => {
    setSpecializations(values);
    updateUrlParams({ specializations: values });
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
    updateUrlParams({ query: null, salary: null, locations: null, specializations: null, experienceLevels: null, sponsorship: null });
  };
  
  // Remove a specific filter
  const removeFilter = (filter: string) => {
    if (salaryRanges.some(r => r.label === filter)) {
      setMinSalary('any');
      updateUrlParams({ salary: null });
    } else if (INDUSTRY_SPECIALIZATION_OPTIONS.some(r => r.label === filter)) {
      const newSpecs = specializations.filter(spec => {
        const option = INDUSTRY_SPECIALIZATION_OPTIONS.find(r => r.value === spec);
        return option?.label !== filter;
      });
      setSpecializations(newSpecs);
      updateUrlParams({ specializations: newSpecs });
    } else if (LOCATION_TYPE_OPTIONS.some(r => r.label === filter)) {
      const newLocations = locations.filter(loc => {
        const option = LOCATION_TYPE_OPTIONS.find(r => r.value === loc);
        return option?.label !== filter;
      });
      setLocations(newLocations);
      updateUrlParams({ locations: newLocations });
    } else if (ROLE_LEVEL_OPTIONS.some(r => r.label === filter)) {
      const newLevels = experienceLevels.filter(level => {
        const option = ROLE_LEVEL_OPTIONS.find(r => r.value === level);
        return option?.label !== filter;
      });
      setExperienceLevels(newLevels);
      updateUrlParams({ experienceLevels: newLevels });
    } else if (filter === 'Provides Visa Sponsorship') {
      setSponsorship('any');
      updateUrlParams({ sponsorship: null });
    }
  };
  
  // If loading, show skeleton
  if (isLoading) {
    return <JobSearchBarSkeleton />;
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col space-y-4">
          {/* Modern search bar with integrated filters toggle */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search jobs, skills, companies..."
                className="block w-full px-4 py-2.5 pr-10 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Compact filters toggle for mobile */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/90 hover:border-gray-300 transition-all duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <>
                  <X className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Close</span>
                </>
              ) : (
                <>
                  <FilterIcon className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Filters</span>
                </>
              )}
            </button>
            
            {/* Modern search button */}
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Search</span>
            </button>
          </div>
          
          {/* Modern filters section */}
          <div className={`${showFilters ? 'block' : 'hidden'} transition-all duration-300`}>
            <div className={`grid grid-cols-1 ${detailsOpen ? 'xl:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'} gap-2`}>
              {/* Specialization Filter with modern icon */}
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg py-1 border border-white/30 hover:bg-white/80 transition-all duration-200">
                <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-md flex items-center justify-center w-8 h-8 shadow-sm">
                  <Code className="h-4 w-4 text-white" />
                </div>
                <MultiSelect
                  options={INDUSTRY_SPECIALIZATION_OPTIONS}
                  selected={specializations}
                  onChange={handleSpecializationsChange}
                  placeholder="Specializations"
                  itemName="specialization"
                  className="flex-1"
                />
              </div>
              
              {/* Location Filter with modern icon */}
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg py-1 border border-white/30 hover:bg-white/80 transition-all duration-200">
                <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-md flex items-center justify-center w-8 h-8 shadow-sm">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <MultiSelect
                  options={LOCATION_TYPE_OPTIONS}
                  selected={locations}
                  onChange={handleLocationsChange}
                  placeholder="Locations"
                  itemName="location"
                  className="flex-1"
                />
              </div>
              
              {/* Experience Level Filter with modern icon */}
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg py-1 border border-white/30 hover:bg-white/80 transition-all duration-200">
                <div className="flex-shrink-0 bg-gradient-to-br from-purple-500 to-purple-600 p-1.5 rounded-md flex items-center justify-center w-8 h-8 shadow-sm">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <MultiSelect
                  options={ROLE_LEVEL_OPTIONS}
                  selected={experienceLevels}
                  onChange={handleExperienceLevelsChange}
                  placeholder="Experience"
                  itemName="experience"
                  className="flex-1"
                />
              </div>
              
              {/* Salary Filter with modern icon */}
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg py-1 border border-white/30 hover:bg-white/80 transition-all duration-200">
                <div className="flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 p-1.5 rounded-md flex items-center justify-center w-8 h-8 shadow-sm">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <Select value={minSalary} onValueChange={handleSalaryChange}>
                  <SelectTrigger className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white hover:bg-white hover:text-black hover:border-gray-400 px-3 py-2 text-sm ring-offset-white focus:outline-none">
                    <SelectValue placeholder="Any salary" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-gray-200/60">
                    {salaryRanges.map((range) => (
                      <SelectItem 
                        key={range.value} 
                        value={range.value}
                        className="hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white text-sm"
                      >
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Visa Sponsorship Filter with modern icon */}
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg py-1 border border-white/30 hover:bg-white/80 transition-all duration-200">
                <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-600 p-1.5 rounded-md flex items-center justify-center w-8 h-8 shadow-sm">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex h-10 w-full items-center justify-start rounded-md border border-gray-200 bg-white hover:bg-white hover:text-teal-700 hover:border-gray-400 px-3 py-2 text-sm ring-offset-white focus:outline-none transition-all duration-200 ${
                    sponsorship === 'yes' 
                      ? 'text-teal-600 font-semibold' 
                      : 'text-gray-700'
                  }`}
                  onClick={toggleSponsorshipFilter}
                >
                  {sponsorship === 'yes' ? <Check className="h-4 w-4 mr-2" /> : null}
                  Visa sponsorship
                </Button>
              </div>
            </div>
            
            {/* Modern active filter tags */}
            {activeFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {activeFilters.map((filter) => (
                    <div key={filter} className="bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 rounded-full px-3 py-1 text-xs flex items-center gap-1.5 border border-teal-200/50 hover:from-teal-100 hover:to-teal-200 transition-all duration-200">
                      <span className="font-medium">{filter}</span>
                      <button 
                        type="button"
                        onClick={() => removeFilter(filter)} 
                        className="text-teal-500 hover:text-teal-700 hover:bg-teal-200 rounded-full p-0.5 transition-all duration-200"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-teal-600 hover:text-teal-800 font-medium px-2 py-1 rounded-md hover:bg-teal-50 transition-all duration-200"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
} 