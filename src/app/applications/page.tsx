'use client';

import { useState, useEffect, useMemo } from 'react';
import { Briefcase, AlertCircle, PlusCircle, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Application } from '@/app/types/application';
import { ApplicationService } from '@/app/utils/applicationService';
import ApplicationCard from '@/app/components/applications/ApplicationCard';
import ApplicationFilters from '@/app/components/applications/ApplicationFilters';
import Link from 'next/link';
import { Input } from '@/app/components/ui/input';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const applicationsPerPage = 9;
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const data = await ApplicationService.getAllApplications();
        setApplications(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, []);
  
  // Handle deleting an application
  const handleDeleteApplication = async (id: string) => {
    try {
      const success = await ApplicationService.deleteApplication(id);
      if (success) {
        // Remove the application from state
        setApplications(applications.filter(app => app.id !== id));
      }
    } catch (err) {
      console.error('Error deleting application:', err);
      // Could add a toast notification here
    }
  };
  
  // Handle status change
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Call the service to update the status
      const updatedApplication = await ApplicationService.updateApplicationStatus(id, newStatus as Application['status']);
      
      // Update the application in state
      setApplications(applications.map(app => 
        app.id === id ? updatedApplication : app
      ));
    } catch (err) {
      console.error('Error updating application status:', err);
      // Could add a toast notification here
    }
  };
  
  // Handle applying to a saved job
  // const handleApply = async (id: string) => {
    // TODO: Update to draft when the modal closes
    // try {
    //   // Update the application status to "Draft"
    //   const updatedApplication = await ApplicationService.updateApplicationStatus(id, 'Draft');
      
    //   // Update the application in state
    //   setApplications(applications.map(app => 
    //     app.id === id ? updatedApplication : app
    //   ));
    // } catch (err) {
    //   console.error('Error applying to job:', err);
    //   // Could add a toast notification here
    // }
  // };
  
  // Filter applications based on active filter and search query
  const filteredApplications = useMemo(() => {
    let filtered = applications;
    
    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(app => 
        app.status.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.jobTitle.toLowerCase().includes(query) ||
        app.company.toLowerCase().includes(query)
    );
    }
    
    return filtered;
  }, [applications, activeFilter, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);
  
  // Calculate counts for filter badges
  const filterCounts = useMemo(() => {
    return {
      all: applications.length,
      draft: applications.filter(app => app.status === 'Draft').length,
      applied: applications.filter(app => app.status === 'Applied').length,
      saved: applications.filter(app => app.status === 'Saved').length,
      interviewing: applications.filter(app => app.status === 'Interviewing').length,
      rejected: applications.filter(app => app.status === 'Rejected').length
    };
  }, [applications]);
  
  // Add this function before the return statement
  const getVisiblePages = (currentPage: number, totalPages: number) => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };
  
  // Loading states
  if (isLoading) {
    return (
      <div className="w-full p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">My Applications</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
            <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="p-4 sm:p-5">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-md bg-gray-200 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-300 px-4 py-3 bg-gray-50">
                <div className="flex justify-end">
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="w-full p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">My Applications</h1>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div>
            <h3 className="text-lg font-medium text-red-800 mb-1">Error Loading Applications</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (applications.length === 0) {
    return (
      <div className="w-full p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">My Applications</h1>
          <Link href="/jobs">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Apply to Jobs
            </Button>
          </Link>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">No Applications Yet</h2>
          <p className="text-blue-700 mb-6 max-w-md mx-auto">
            Start applying to jobs to keep track of your applications in one place.
          </p>
          <Link href="/jobs">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="mt-1 text-sm text-gray-500">Track and manage your job applications in one place</p>
          </div>
        <Link href="/jobs">
            <Button className="bg-teal-600 hover:bg-teal-700 shadow-sm w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Apply to Jobs
          </Button>
        </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by job title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full h-11 text-base bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
      </div>
      
      <ApplicationFilters 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={filterCounts}
      />
        </div>
      </div>
      
      {filteredApplications.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-8 text-center">
          <p className="text-gray-600">
            {searchQuery 
              ? "No applications found matching your search."
              : "No applications found matching your current filter."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {currentApplications.map(application => (
              <ApplicationCard 
                key={application.id}
                application={application}
                onDelete={handleDeleteApplication}
                onStatusChange={handleStatusChange}
                // onApply={handleApply}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex items-center gap-1" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-md border text-sm font-medium ${
                    currentPage === 1 
                      ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' 
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                  aria-label="Previous page"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {getVisiblePages(currentPage, totalPages).map((pageNum, idx) => (
                  pageNum === '...' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  ) : (
                  <button
                      key={`page-${pageNum}`}
                      onClick={() => setCurrentPage(Number(pageNum))}
                      className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md min-w-[2.5rem] justify-center ${
                      currentPage === pageNum
                          ? 'z-10 bg-teal-50 border-teal-500 text-teal-600 hover:bg-teal-100'
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                  )
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-md border text-sm font-medium ${
                    currentPage === totalPages 
                      ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' 
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                  aria-label="Next page"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 