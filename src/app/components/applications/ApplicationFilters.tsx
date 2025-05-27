import { FC } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface ApplicationFiltersProps {
  activeFilter: string;
  onFilterChange: (value: string) => void;
  counts: {
    all: number;
    draft: number;
    applied: number;
    saved: number;
    interviewing: number;
    rejected: number;
  };
}

const ApplicationFilters: FC<ApplicationFiltersProps> = ({ 
  activeFilter, 
  onFilterChange,
  counts 
}) => {
  return (
    <div className="mb-6">
      <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
        <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 h-auto border-b pb-0 bg-transparent">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:shadow-none rounded-none py-3 text-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:bg-transparent"
          >
            All ({counts.all})
          </TabsTrigger>
          
          <TabsTrigger 
            value="saved" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:shadow-none rounded-none py-3 text-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:bg-transparent"
          >
            Saved ({counts.saved})
          </TabsTrigger>
          
          <TabsTrigger 
            value="draft" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:shadow-none rounded-none py-3 text-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:bg-transparent"
          >
            Draft ({counts.draft})
          </TabsTrigger>
          
          <TabsTrigger 
            value="applied" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:shadow-none rounded-none py-3 text-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:bg-transparent"
          >
            Applied ({counts.applied})
          </TabsTrigger>
          
          <TabsTrigger 
            value="interviewing" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:shadow-none rounded-none py-3 text-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:bg-transparent"
          >
            Interviewing ({counts.interviewing})
          </TabsTrigger>
          
          <TabsTrigger 
            value="rejected" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-700 data-[state=active]:shadow-none rounded-none py-3 text-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:bg-transparent"
          >
            Rejected ({counts.rejected})
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ApplicationFilters; 