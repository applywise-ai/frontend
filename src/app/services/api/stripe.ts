import apiService from './api';

interface StripeCustomerResponse {
  customer_id: string;
}



interface SessionInfoResponse {
  is_paid: boolean;
  session_id: string;
}

export interface DeleteCustomerResponse {
  user_id: string;
  stripe_deleted: boolean;
  firestore_deleted: boolean;
  message: string;
}

class StripeService {
  /**
   * Get or create a Stripe customer for the authenticated user
   */
  async getOrCreateCustomer(email: string): Promise<string> {
    try {
      const response = await apiService.post<StripeCustomerResponse>('/stripe/customer', {
        email,
      });
      
      return response.customer_id;
    } catch (error) {
      console.error('Error getting/creating Stripe customer:', error);
      throw new Error('Failed to create Stripe customer');
    }
  }

  /**
   * Get session payment status from Stripe
   */
  async getSessionInfo(sessionId: string): Promise<SessionInfoResponse> {
    try {
      const response = await apiService.post<SessionInfoResponse>('/stripe/session/info', {
        session_id: sessionId,
      });
      
      return response;
    } catch (error) {
      console.error('Error getting session info:', error);
      throw new Error('Failed to get session information');
    }
  }

  /**
   * Delete customer from Stripe and Firestore
   */
  async deleteCustomer(userId: string): Promise<DeleteCustomerResponse> {
    try {
      const response = await apiService.fetch('/stripe/customer', {
        method: 'DELETE',
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
      
      return await response.json();
    } catch (error: unknown) {
      console.error('Error deleting customer:', error);
      // Preserve the original error message from API if available
      throw error instanceof Error ? error : new Error('Failed to delete customer');
    }
  }
}

const stripeService = new StripeService();
export default stripeService;
