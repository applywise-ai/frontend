import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { ChevronDown, ChevronUp, DollarSign, Globe, Check } from 'lucide-react';

interface MoreFiltersProps {
  minSalary: string;
  sponsorship: string;
  onSalaryChange: (value: string) => void;
  onSponsorshipChange: () => void;
  salaryRanges: { value: string; label: string; }[];
  isMobile: boolean;
}

export default function JobSearchMoreFilters({
  minSalary,
  sponsorship,
  onSalaryChange,
  onSponsorshipChange,
  salaryRanges,
  isMobile
}: MoreFiltersProps) {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setExpandedSection(null);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const FilterSection = ({ 
    title, 
    id, 
    children 
  }: { 
    title: string; 
    id: string; 
    children: React.ReactNode 
  }) => (
    <div className="border-b border-gray-200/50 last:border-0">
      <button
        onClick={() => toggleSection(id)}
        className="flex w-full items-center justify-between px-5 py-6 hover:bg-white/60 transition-all duration-200"
      >
        <span className="text-base font-medium text-gray-900">{title}</span>
        {expandedSection === id ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {expandedSection === id && (
        <div className="px-5 pb-5">
          {children}
        </div>
      )}
    </div>
  );

  const DesktopFiltersContent = () => (
    <div className="flex flex-col divide-y divide-gray-200/50">
      <FilterSection title="Salary Range" id="salary">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Set your minimum salary expectation</p>
          <Select value={minSalary} onValueChange={onSalaryChange}>
            <SelectTrigger className="bg-white/80 border-gray-200/60 hover:border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-gray-900">
              <SelectValue placeholder="Select minimum salary" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-gray-200/60">
              {salaryRanges.map((range) => (
                <SelectItem 
                  key={range.value} 
                  value={range.value}
                  className="hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white"
                >
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FilterSection>

      <FilterSection title="Visa Sponsorship" id="sponsorship">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">Visa sponsorship available</p>
            <p className="text-xs text-gray-500">Show only jobs that offer visa sponsorship</p>
          </div>
          <Switch
            checked={sponsorship === 'yes'}
            onCheckedChange={onSponsorshipChange}
          />
        </div>
      </FilterSection>
    </div>
  );

  const MobileFiltersContent = () => (
    <div className="w-full space-y-2">
      {/* Salary Filter with MultiSelect-matching styling */}
      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg py-1 border border-white/30 hover:bg-white/80 transition-all duration-200">
        <div className="flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 p-1.5 rounded-md flex items-center justify-center w-7 h-7 shadow-sm">
          <DollarSign className="h-3.5 w-3.5 text-white" />
        </div>
        <Select value={minSalary} onValueChange={onSalaryChange}>
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

      {/* Visa Sponsorship Button with MultiSelect-matching styling */}
      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg py-1 border border-white/30 hover:bg-white/80 transition-all duration-200">
        <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-600 p-1.5 rounded-md flex items-center justify-center w-7 h-7 shadow-sm">
          <Globe className="h-3.5 w-3.5 text-white" />
        </div>
        <Button
          variant="outline"
          className={`flex h-10 w-full items-center justify-start rounded-md border border-gray-200 bg-white hover:bg-white hover:text-teal-700 hover:border-gray-400 px-3 py-2 text-sm ring-offset-white focus:outline-none transition-all duration-200 ${
            sponsorship === 'yes' 
              ? 'text-teal-600 font-semibold' 
              : 'text-gray-700'
          }`}
          onClick={onSponsorshipChange}
        >
          {sponsorship === 'yes' ? <Check className="h-4 w-4 mr-2" /> : null}
          Visa sponsorship
        </Button>
      </div>
    </div>
  );

  // Mobile view - show filters directly without button
  if (isMobile) {
    return <MobileFiltersContent />;
  }

  // Desktop view - use popover with modern styling
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="default"
          className="w-full"
        >
          More filters
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen max-w-sm p-0 border border-white/30 shadow-xl bg-white/95 backdrop-blur-sm rounded-xl" align="end">
        <DesktopFiltersContent />
      </PopoverContent>
    </Popover>
  );
} 