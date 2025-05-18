'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, DollarSign, MapPin, Briefcase, FilterIcon, X, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import JobSearchBarSkeleton from './loading/JobSearchBarSkeleton';

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
  const [location, setLocation] = useState('any');
  const [experience, setExperience] = useState('any');
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
  
  const locationOptions = [
    { value: 'any', label: 'Any Location' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' },
    { value: 'us', label: 'United States' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' }
  ];
  
  const experienceLevels = [
    { value: 'any', label: 'Any Experience' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' }
  ];
  
  // Load filters from URL parameters on component mount
  useEffect(() => {
    const query = searchParams.get('query') || '';
    const salary = searchParams.get('salary') || 'any';
    const loc = searchParams.get('location') || 'any';
    const exp = searchParams.get('experience') || 'any';
    const sponsor = searchParams.get('sponsorship') || 'any';
    
    setSearchQuery(query);
    setMinSalary(salary);
    setLocation(loc);
    setExperience(exp);
    setSponsorship(sponsor);
    
    // Set active filters
    const filters = [];
    if (salary !== 'any') {
      const salaryOption = salaryRanges.find(r => r.value === salary);
      if (salaryOption) filters.push(salaryOption.label);
    }
    if (loc !== 'any') {
      const locationOption = locationOptions.find(r => r.value === loc);
      if (locationOption) filters.push(locationOption.label);
    }
    if (exp !== 'any') {
      const experienceOption = experienceLevels.find(r => r.value === exp);
      if (experienceOption) filters.push(experienceOption.label);
    }
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
      router.push(`/jobs?${params.toString()}`);
    }, 0);
  };
  
  const handleLocationChange = (value: string) => {
    setLocation(value);
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value !== 'any') params.set('location', value);
      else params.delete('location');
      router.push(`/jobs?${params.toString()}`);
    }, 0);
  };
  
  const handleExperienceChange = (value: string) => {
    setExperience(value);
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value !== 'any') params.set('experience', value);
      else params.delete('experience');
      router.push(`/jobs?${params.toString()}`);
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
      router.push(`/jobs?${params.toString()}`);
    }, 0);
  };
  
  // Handle search submission - still needed for Enter key support
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) params.set('query', searchQuery);
    else params.delete('query');
    
    router.push(`/jobs?${params.toString()}`);
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
      router.push(`/jobs?${params.toString()}`);
    }, 500); // 500ms debounce time
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setMinSalary('any');
    setLocation('any');
    setExperience('any');
    setSponsorship('any');
    setActiveFilters([]);
    router.push('/jobs');
  };
  
  // Remove a specific filter
  const removeFilter = (filter: string) => {
    if (salaryRanges.some(r => r.label === filter)) {
      setMinSalary('any');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('salary');
      router.push(`/jobs?${params.toString()}`);
    } else if (locationOptions.some(r => r.label === filter)) {
      setLocation('any');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('location');
      router.push(`/jobs?${params.toString()}`);
    } else if (experienceLevels.some(r => r.label === filter)) {
      setExperience('any');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('experience');
      router.push(`/jobs?${params.toString()}`);
    } else if (filter === 'Provides Visa Sponsorship') {
      setSponsorship('any');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('sponsorship');
      router.push(`/jobs?${params.toString()}`);
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
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            
            {/* Filters toggle button (visible on mobile) */}
            <button
              type="button"
              className="md:hidden inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
            
            {/* Search button */}
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Search
            </button>
          </div>
          
          {/* Filters - desktop view always visible, mobile only when toggled */}
          <div className={`${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className={`grid grid-cols-1 ${detailsOpen ? 'sm:grid-cols-2' : 'sm:grid-cols-4'} gap-4`}>
              {/* Minimum Salary Filter */}
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                </div>
                <Select value={minSalary} onValueChange={handleSalaryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Minimum Salary" />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Location Filter */}
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
                  <MapPin className="h-5 w-5 text-gray-500" />
                </div>
                <Select value={location} onValueChange={handleLocationChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Experience Level Filter */}
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                </div>
                <Select value={experience} onValueChange={handleExperienceChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sponsorship Toggle Button */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={toggleSponsorshipFilter}
                  className={`w-full py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center space-x-2
                  ${sponsorship === 'yes' 
                    ? 'border-2 border-teal-500 text-teal-700 bg-teal-50'
                    : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500`}
                >
                  <Globe className="h-4 w-4" />
                  <span>Visa Sponsorship</span>
                </button>
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