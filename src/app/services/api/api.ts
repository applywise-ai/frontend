import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiService {
  /**
   * Get the current Firebase auth token
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        return null;
      }
      
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Create headers for API requests
   */
  private async createHeaders(options: ApiRequestOptions = {}): Promise<Headers> {
    const headers = new Headers();
    
    // Set default content type
    headers.set('Content-Type', 'application/json');
    
    // Add auth token if required
    if (options.requiresAuth !== false) {
      const token = await this.getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
    // Add any custom headers from options
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }
    
    return headers;
  }

  /**
   * Make an authenticated GET request
   */
  async get<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.createHeaders(options);
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make an authenticated POST request
   */
  async post<T = any>(endpoint: string, data?: any, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.createHeaders(options);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make an authenticated PUT request
   */
  async put<T = any>(endpoint: string, data?: any, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.createHeaders(options);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make an authenticated PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.createHeaders(options);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make an authenticated DELETE request
   */
  async delete<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.createHeaders(options);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make a raw fetch request with authentication
   */
  async fetch<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.createHeaders(options);
    
    return fetch(url, {
      ...options,
      headers,
    });
  }
}

const apiService = new ApiService();
export default apiService; 