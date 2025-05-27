import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MoreFiltersProps {
  minSalary: string;
  sponsorship: string;
  onSalaryChange: (value: string) => void;
  onSponsorshipChange: () => void;
  salaryRanges: { value: string; label: string; }[];
}

export default function JobSearchMoreFilters({
  minSalary,
  sponsorship,
  onSalaryChange,
  onSponsorshipChange,
  salaryRanges
}: MoreFiltersProps) {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => toggleSection(id)}
        className="flex w-full items-center justify-between px-4 py-4 hover:bg-gray-50"
      >
        <span className="text-base font-medium text-gray-900">{title}</span>
        {expandedSection === id ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {expandedSection === id && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full"
        >
          More filters
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen max-w-sm p-0 border border-gray-200 shadow-lg bg-white/95" align="end">
        <div className="flex flex-col divide-y divide-gray-200">
          <FilterSection title="Salary" id="salary">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Minimum salary</label>
              <Select value={minSalary} onValueChange={onSalaryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select minimum salary" />
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
          </FilterSection>

          <FilterSection title="Visa Sponsorship" id="sponsorship">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">Visa sponsorship available</p>
                <p className="text-sm text-gray-500">Show jobs that offer visa sponsorship</p>
              </div>
              <Switch
                checked={sponsorship === 'yes'}
                onCheckedChange={onSponsorshipChange}
              />
            </div>
          </FilterSection>
        </div>
      </PopoverContent>
    </Popover>
  );
} 