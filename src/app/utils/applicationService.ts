import { Application } from "@/app/types/application";

// Mock data for applications
const mockApplications: Application[] = [
  {
    id: "app-1",
    jobId: 101,
    jobTitle: "Senior Software Engineer",
    company: "TechNova Solutions",
    logo: "https://placehold.co/100/4338ca/ffffff?text=T",
    status: "Applied",
    appliedDate: "2023-11-15T10:30:00Z",
    lastUpdated: "2023-11-15T10:30:00Z"
  },
  {
    id: "app-2",
    jobId: 102,
    jobTitle: "Product Manager",
    company: "InnovateX",
    logo: "https://placehold.co/100/065f46/ffffff?text=I",
    status: "Draft",
    appliedDate: "2023-11-10T14:20:00Z",
    lastUpdated: "2023-11-14T09:15:00Z"
  },
  {
    id: "app-3",
    jobId: 103,
    jobTitle: "UX Designer",
    company: "Creative Design Co.",
    logo: "https://placehold.co/100/9f1239/ffffff?text=C",
    status: "Saved",
    appliedDate: "2023-11-05T11:45:00Z",
    lastUpdated: "2023-11-05T11:45:00Z"
  },
  {
    id: "app-4",
    jobId: 104,
    jobTitle: "Data Scientist",
    company: "DataMinds Inc.",
    logo: "https://placehold.co/100/1e3a8a/ffffff?text=D",
    status: "Interviewing",
    appliedDate: "2023-10-28T09:00:00Z",
    lastUpdated: "2023-10-28T09:00:00Z"
  },
  {
    id: "app-5",
    jobId: 105,
    jobTitle: "Marketing Specialist",
    company: "BrandBoost Media",
    logo: "https://placehold.co/100/701a75/ffffff?text=B",
    status: "Rejected",
    appliedDate: "2023-10-20T15:30:00Z",
    lastUpdated: "2023-10-20T15:30:00Z"
  },
  {
    id: "app-6",
    jobId: 106,
    jobTitle: "Frontend Developer",
    company: "WebCraft Solutions",
    logo: "https://placehold.co/100/0e7490/ffffff?text=W",
    status: "Draft",
    appliedDate: "2023-11-12T13:15:00Z",
    lastUpdated: "2023-11-13T16:40:00Z"
  },
  {
    id: "app-7",
    jobId: 107,
    jobTitle: "Backend Developer",
    company: "CloudTech Systems",
    logo: "https://placehold.co/100/4c1d95/ffffff?text=C",
    status: "Applied",
    appliedDate: "2023-11-14T09:30:00Z",
    lastUpdated: "2023-11-14T09:30:00Z"
  },
  {
    id: "app-8",
    jobId: 108,
    jobTitle: "DevOps Engineer",
    company: "InfraScale",
    logo: "https://placehold.co/100/0f766e/ffffff?text=I",
    status: "Interviewing",
    appliedDate: "2023-11-08T11:20:00Z",
    lastUpdated: "2023-11-08T11:20:00Z"
  },
  {
    id: "app-9",
    jobId: 109,
    jobTitle: "Mobile Developer",
    company: "AppWorks",
    logo: "https://placehold.co/100/7e22ce/ffffff?text=A",
    status: "Saved",
    appliedDate: "2023-11-11T14:45:00Z",
    lastUpdated: "2023-11-11T14:45:00Z"
  },
  {
    id: "app-10",
    jobId: 110,
    jobTitle: "Full Stack Developer",
    company: "CodeCraft",
    logo: "https://placehold.co/100/be185d/ffffff?text=C",
    status: "Draft",
    appliedDate: "2023-11-13T16:00:00Z",
    lastUpdated: "2023-11-13T16:00:00Z"
  },
  {
    id: "app-11",
    jobId: 111,
    jobTitle: "AI Engineer",
    company: "NeuralNet",
    logo: "https://placehold.co/100/0369a1/ffffff?text=N",
    status: "Applied",
    appliedDate: "2023-11-09T10:15:00Z",
    lastUpdated: "2023-11-09T10:15:00Z"
  },
  {
    id: "app-12",
    jobId: 112,
    jobTitle: "Security Engineer",
    company: "CyberShield",
    logo: "https://placehold.co/100/be123c/ffffff?text=C",
    status: "Rejected",
    appliedDate: "2023-11-07T13:30:00Z",
    lastUpdated: "2023-11-07T13:30:00Z"
  },
  {
    id: "app-13",
    jobId: 113,
    jobTitle: "QA Engineer",
    company: "TestPro",
    logo: "https://placehold.co/100/166534/ffffff?text=T",
    status: "Interviewing",
    appliedDate: "2023-11-06T15:45:00Z",
    lastUpdated: "2023-11-06T15:45:00Z"
  },
  {
    id: "app-14",
    jobId: 114,
    jobTitle: "Blockchain Developer",
    company: "ChainTech",
    logo: "https://placehold.co/100/854d0e/ffffff?text=C",
    status: "Saved",
    appliedDate: "2023-11-04T09:00:00Z",
    lastUpdated: "2023-11-04T09:00:00Z"
  },
  {
    id: "app-15",
    jobId: 115,
    jobTitle: "Game Developer",
    company: "PlayTech",
    logo: "https://placehold.co/100/9f1239/ffffff?text=P",
    status: "Draft",
    appliedDate: "2023-11-03T11:30:00Z",
    lastUpdated: "2023-11-03T11:30:00Z"
  }
];

/**
 * Service for handling application-related operations
 */
export const ApplicationService = {
  /**
   * Get all applications
   * @returns Array of Application objects
   */
  getAllApplications: (): Promise<Application[]> => {
    // Simulate API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockApplications);
      }, 800);
    });
  },

  /**
   * Get application by ID
   * @param id Application ID
   * @returns Application or null if not found
   */
  getApplicationById: (id: string): Promise<Application | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const application = mockApplications.find(app => app.id === id) || null;
        resolve(application);
      }, 500);
    });
  },

  /**
   * Delete application by ID
   * @param id Application ID
   * @returns Success indicator
   */
  deleteApplication: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would call an API to delete the application
        console.log(`Deleting application with ID: ${id}`);
        resolve(true);
      }, 500);
    });
  },

  /**
   * Update application status
   * @param id Application ID
   * @param status New status
   * @returns Updated application
   */
  updateApplicationStatus: (id: string, status: Application['status']): Promise<Application> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would call an API to update the application status
        console.log(`Updating application ${id} status to: ${status}`);
        
        // Find and update the application in mock data
        const application = mockApplications.find(app => app.id === id);
        if (application) {
          application.status = status;
          application.lastUpdated = new Date().toISOString();
          resolve(application);
        } else {
          throw new Error('Application not found');
        }
      }, 500);
    });
  }
}; 