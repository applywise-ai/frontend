'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Tags, PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import topSkillsData from '@/app/utils/top-skills.json';

interface SkillSearchProps {
  value: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
}

// Extract skill names from the JSON data
const allSkills = topSkillsData.skills.map(skill => skill.name);

// Cache for search results to improve performance
type SkillCache = {
  [query: string]: {
    timestamp: number;
    results: string[];
  }
};

// In-memory cache with 1-hour expiration
const skillsCache: SkillCache = {};
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

export default function SkillSearch({
  value = [],
  onChange,
  placeholder = 'Search for a skill...'
}: SkillSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Function to search for skills in the local JSON data
  const searchSkills = async (query: string): Promise<string[]> => {
    // Simulate network delay for a more realistic feel
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!query) {
      // Return popular skills if query is empty
      return allSkills.slice(0, 20);
    }

    const normalizedQuery = query.toLowerCase().trim();
    
    // Special case for showing all skills
    if (normalizedQuery === ' ') {
      return allSkills.slice(0, 20);
    }

    // Check cache first
    const cacheKey = normalizedQuery;
    if (skillsCache[cacheKey] && (Date.now() - skillsCache[cacheKey].timestamp) < CACHE_EXPIRY) {
      console.log('Using cached skills data for:', query);
      return skillsCache[cacheKey].results;
    }

    // Filter skills that match the query
    const filteredSkills = allSkills.filter(skill => 
      skill.toLowerCase().includes(normalizedQuery)
    );
    
    // Sort by relevance - exact matches first, then starting with query, then containing query
    const sortedSkills = filteredSkills.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      
      // Exact match
      if (aLower === normalizedQuery) return -1;
      if (bLower === normalizedQuery) return 1;
      
      // Starts with query
      if (aLower.startsWith(normalizedQuery) && !bLower.startsWith(normalizedQuery)) return -1;
      if (!aLower.startsWith(normalizedQuery) && bLower.startsWith(normalizedQuery)) return 1;
      
      // Alphabetical order
      return aLower.localeCompare(bLower);
    });
    
    // Cache the results
    skillsCache[cacheKey] = {
      timestamp: Date.now(),
      results: sortedSkills
    };
    
    return sortedSkills;
  };

  // Debounced input handler to improve performance
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (showSuggestions) {
      debounceTimerRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await searchSkills(inputValue);
          // Filter out skills that are already selected
          const availableSkills = results.filter(skill => !value.includes(skill));
          setFilteredSuggestions(availableSkills);
        } catch (error) {
          console.error('Error searching skills:', error);
          setFilteredSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 200);
    }
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue, value, showSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    if (inputValue) {
      // If input has value, search with that
      setIsLoading(true);
      searchSkills(inputValue).then(results => {
        setFilteredSuggestions(results.filter(skill => !value.includes(skill)));
        setIsLoading(false);
      });
    } else {
      // Show popular skills when focus with empty input
      setIsLoading(true);
      searchSkills(' ').then(results => {
        setFilteredSuggestions(results.filter(skill => !value.includes(skill)));
        setIsLoading(false);
      });
    }
  };

  const handleClick = () => {
    setShowSuggestions(true);
    if (inputValue) {
      // If input has value, search with that
      setIsLoading(true);
      searchSkills(inputValue).then(results => {
        setFilteredSuggestions(results.filter(skill => !value.includes(skill)));
        setIsLoading(false);
      });
    } else {
      // Show popular skills on click with empty input
      setIsLoading(true);
      searchSkills(' ').then(results => {
        setFilteredSuggestions(results.filter(skill => !value.includes(skill)));
        setIsLoading(false);
      });
    }
  };
  
  const handleBlur = () => {
    // Delay hiding the suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
        handleAddSkill(filteredSuggestions[activeSuggestionIndex]);
      } else if (inputValue.trim() && !value.includes(inputValue.trim())) {
        handleAddSkill(inputValue.trim());
      }
      return;
    }

    // Escape key
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      return;
    }

    // Up arrow
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeSuggestionIndex > 0) {
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
      } else {
        // Wrap to bottom
        setActiveSuggestionIndex(filteredSuggestions.length - 1);
      }
      return;
    }

    // Down arrow
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeSuggestionIndex < filteredSuggestions.length - 1) {
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
      } else {
        // Wrap to top
        setActiveSuggestionIndex(0);
      }
      return;
    }
  };

  const handleAddSkill = (skill: string) => {
    if (!skill.trim() || value.includes(skill.trim())) {
      setInputValue('');
      return;
    }
    
    const updatedSkills = [...value, skill.trim()];
    onChange(updatedSkills);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = value.filter(skill => skill !== skillToRemove);
    onChange(updatedSkills);
  };

  return (
    <div className="space-y-4" ref={dropdownRef}>
      <div className="relative">
        <div className="flex w-full items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onClick={handleClick}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="shadow-sm focus:ring-teal-500 focus:border-teal-500 pr-10"
              placeholder={placeholder}
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Search className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          <Button 
            onClick={() => handleAddSkill(inputValue)}
            type="button"
            className="bg-teal-600 hover:bg-teal-700 text-white"
            disabled={!inputValue.trim() || value.includes(inputValue.trim())}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        
        <div className={`absolute z-50 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm transition-all duration-200 ease-in-out ${
          showSuggestions && (isLoading || filteredSuggestions.length > 0) 
            ? 'opacity-100 mt-1 translate-y-0' 
            : 'opacity-0 -translate-y-1 invisible'
        }`}>
          {isLoading && (
            <div className="flex items-center justify-center py-3 px-3 text-gray-500">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading skills...
            </div>
          )}
          
          {!isLoading && filteredSuggestions.length === 0 && (
            <div className="py-3 px-3 text-sm text-gray-500 text-center">
              No skills found
            </div>
          )}
          
          {!isLoading && filteredSuggestions.length > 0 && (
            <div className="max-h-60 overflow-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleAddSkill(suggestion)}
                  className={`cursor-pointer select-none relative py-3 pl-3 pr-9 ${
                    index === activeSuggestionIndex ? 'bg-teal-600 text-white' : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <Tags className={`mr-2 h-4 w-4 ${index === activeSuggestionIndex ? 'text-white' : 'text-gray-400'}`} />
                    <span className={`block truncate ${index === activeSuggestionIndex ? 'font-medium' : 'font-normal'}`}>
                      {suggestion}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Display selected skills */}
      {value.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected Skills</p>
          <div className="flex flex-wrap gap-2">
            {value.map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="bg-white px-3 py-1 text-sm font-normal"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 