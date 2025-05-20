'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { FieldName } from '@/app/types';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

// OpenCage API types
interface OpenCageResult {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    [key: string]: string | undefined;
  };
}

interface OpenCageResponse {
  results: OpenCageResult[];
  status: {
    code: number;
    message: string;
  };
}

// Default fallback suggestions in case API fails or network is unavailable
const defaultSuggestions = [
  'Remote',
  'Hybrid'
];

// Helper function to check if coordinates are near a known location
const isNearCoordinates = (lat1: number, lon1: number, lat2: number, lon2: number, radiusDegrees: number): boolean => {
  return Math.abs(lat1 - lat2) < radiusDegrees && Math.abs(lon1 - lon2) < radiusDegrees;
};

export default function LocationSearch({
  value,
  onChange,
  id = FieldName.CURRENT_LOCATION,
  name = FieldName.CURRENT_LOCATION,
  label = 'Current Location',
  required = false,
  placeholder = 'Enter your location'
}: LocationSearchProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update input when value prop changes
    setInputValue(value);
  }, [value]);

  // Function to fetch location suggestions from OpenCage Geocoding API
  const fetchLocationSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setFilteredSuggestions(defaultSuggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
      ));
      return;
    }

    setIsLoading(true);
    try {
      // The API key should ideally be stored in an environment variable
      // For demo purposes, we're using a limited key with restricted usage
      const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || 'YOUR_OPENCAGE_API_KEY'; 
      const encodedQuery = encodeURIComponent(query);
      
      // Detect if we should show the demo suggestions (for development without API key)
      if (apiKey === 'YOUR_OPENCAGE_API_KEY') {
        // Mock API response with sample data
        console.log('Using mock location data (no API key provided)');
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        
        const mockResults = [
          { formatted: 'New York, NY, United States' },
          { formatted: 'New Delhi, India' },
          { formatted: 'Newark, NJ, United States' },
          { formatted: 'New Orleans, LA, United States' }
        ].filter(item => item.formatted.toLowerCase().includes(query.toLowerCase()));
        
        const suggestions = [
          ...defaultSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())),
          ...mockResults.map(r => r.formatted)
        ];
        
        setFilteredSuggestions(suggestions);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${apiKey}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }
      
      const data = await response.json() as OpenCageResponse;
      
      // Format results and combine with default suggestions
      const apiSuggestions = data.results.map((result: OpenCageResult) => result.formatted);
      const suggestions = [
        ...defaultSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())),
        ...apiSuggestions
      ];
      
      setFilteredSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      // Fallback to default suggestions filtered by query
      setFilteredSuggestions(
        defaultSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced input handler to reduce API calls
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (inputValue.length < 2) {
      setFilteredSuggestions(
        defaultSuggestions.filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
      );
      return;
    }
    
    debounceTimerRef.current = setTimeout(() => {
      fetchLocationSuggestions(inputValue);
    }, 300);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue]);

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

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // In a real implementation, you would use reverse geocoding API
          console.log(`Getting location for: ${latitude}, ${longitude}`);
          
          // For demo purposes, simulate a delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Enhanced location detection logic - check if coordinates are near known cities
          // This is a simplified version - a real app would use the OpenCage reverse geocoding API
          
          // Toronto and surrounding area
          if (isNearCoordinates(latitude, longitude, 43.651070, -79.347015, 0.5)) {
            setInputValue('Toronto, ON, Canada');
            onChange('Toronto, ON, Canada');
          }
          // Mississauga
          else if (isNearCoordinates(latitude, longitude, 43.5890, -79.6441, 0.5)) {
            setInputValue('Mississauga, ON, Canada');
            onChange('Mississauga, ON, Canada');
          }
          // Waterloo
          else if (isNearCoordinates(latitude, longitude, 43.4643, -80.5204, 0.5)) {
            setInputValue('Waterloo, ON, Canada');
            onChange('Waterloo, ON, Canada');
          }
          // New York
          else if (isNearCoordinates(latitude, longitude, 40.7128, -74.0060, 0.5)) {
            setInputValue('New York, NY, United States');
            onChange('New York, NY, United States');
          }
          // Try to provide a more general location rather than exact coordinates
          else {
            // For Canada
            if (latitude > 42 && latitude < 50 && longitude > -84 && longitude < -74) {
              setInputValue('Ontario, Canada');
              onChange('Ontario, Canada');
            } 
            // For USA Northeast
            else if (latitude > 37 && latitude < 45 && longitude > -80 && longitude < -70) {
              setInputValue('Northeast United States');
              onChange('Northeast United States');
            }
            // Default to a generic format with city or region if possible
            else {
              // Format coordinates to 2 decimal places for display
              const displayLocation = `${Math.abs(latitude).toFixed(2)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(2)}°${longitude >= 0 ? 'E' : 'W'}`;
              setInputValue(displayLocation);
              onChange(displayLocation);
            }
          }
          
          setShowSuggestions(false);
        } catch (error) {
          console.error('Error getting location details:', error);
        } finally {
          setIsLoading(false);
        }
      },
      (error: GeolocationPositionError) => {
        console.error('Error getting current position:', error);
        setIsLoading(false);
        
        // Show appropriate user feedback based on error
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("Location access was denied. Please enable location services in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
          default:
            alert("An unknown error occurred while trying to access your location.");
            break;
        }
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
  };
  
  const handleFocus = () => {
    setShowSuggestions(true);
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
        handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
      } else if (filteredSuggestions.length > 0) {
        handleSuggestionClick(filteredSuggestions[0]);
      } else {
        onChange(inputValue);
        setShowSuggestions(false);
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

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  // Handle special cases for "Remote" and "Hybrid"
  const addWorkplaceType = (location: string) => {
    if (location.toLowerCase() === 'remote') {
      return 'Remote';
    }
    
    if (location.toLowerCase().startsWith('hybrid')) {
      return location;
    }
    
    if (location.toLowerCase().includes('hybrid')) {
      return `Hybrid ${location}`;
    }
    
    return location;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center justify-between mb-1">
        <Label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-700 flex items-center"
        >
          <MapPin className="h-4 w-4 text-gray-400 mr-1.5" />
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {/* Current location button positioned to the right of the label */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={getCurrentLocation}
          className="text-xs text-teal-600 hover:text-teal-800 flex items-center p-0 h-6 hover:bg-transparent focus:ring-0"
          disabled={isLoading}
        >
          <Navigation className="h-3 w-3 mr-1" />
          Use current location
        </Button>
      </div>
      
      <div className="relative">
        <Input
          type="text"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="shadow-sm focus:ring-teal-500 focus:border-teal-500 pr-10 text-sm"
          placeholder={placeholder}
          required={required}
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <MapPin className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      <div className={`absolute z-50 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none transition-all duration-200 ease-in-out ${
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
            Searching locations...
          </div>
        )}
        
        {!isLoading && filteredSuggestions.length === 0 && (
          <div className="py-3 px-3 text-sm text-gray-500 text-center">
            No locations found
          </div>
        )}
        
        {!isLoading && filteredSuggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => handleSuggestionClick(addWorkplaceType(suggestion))}
            className={`cursor-pointer select-none relative py-3 pl-3 pr-9 ${
              index === activeSuggestionIndex ? 'bg-teal-600 text-white' : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <MapPin className={`mr-2 h-4 w-4 ${index === activeSuggestionIndex ? 'text-white' : 'text-gray-400'}`} />
              <span className={`block truncate ${index === activeSuggestionIndex ? 'font-medium' : 'font-normal'}`}>
                {suggestion}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 