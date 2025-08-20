import apiService from './api';

// Request interfaces
export interface CancelSubscriptionRequest {
  user_id: string;
}

export interface UpdateSubscriptionRequest {
  user_id: string;
  new_price_id?: string;
  quantity?: number;
  proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export interface PendingUpdate {
  new_plan_name: string;
  new_price: number;
  effective_date: string;
  currency: string;
}

export interface GetSubscriptionInfoRequest {
  user_id: string;
}

// Response interfaces
export interface CancelSubscriptionResponse {
  subscription_id: string;
  status: string;
  canceled_at: string;
  message: string;
}

export interface UpdateSubscriptionResponse {
  subscription_id: string;
  status: string;
  message: string;
}

export interface RenewSubscriptionResponse {
  subscription_id: string;
  status: string;
  message: string;
}



export interface GetSubscriptionInfoResponse {
  subscription_id: string;
  status: string;
  renewal_date: string; // Format: MM/DD/YYYY
  price: number;
  currency: string;
  plan_name?: string;
  cancel_at_period_end: boolean;
  has_pending_update?: boolean;
  pending_update?: PendingUpdate;
  message: string;
}

class SubscriptionService {
  /**
   * Cancel a user's subscription
   */
  async cancelSubscription(userId: string): Promise<CancelSubscriptionResponse> {
    try {
      const response = await apiService.post<CancelSubscriptionResponse>('/stripe/subscription/cancel', {
        user_id: userId,
      });
      
      return response;
    } catch (error: unknown) {
      console.error('Error canceling subscription:', error);
      // Preserve the original error message from API if available
      throw error instanceof Error ? error : new Error('Failed to cancel subscription');
    }
  }

  /**
   * Update a user's subscription
   */
  async updateSubscription(request: UpdateSubscriptionRequest): Promise<UpdateSubscriptionResponse> {
    try {
      const response = await apiService.fetch('/stripe/subscription/update', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      console.log(response)
      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = 'Failed to update subscription';
        const errorData = await response.json();
        // Show custom error message from backend if its not 500.
        if (response.status !== 500) {
          errorMessage = errorData.detail || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error: unknown) {
      console.error('Error updating subscription:', error);
      throw error; // Re-throw the error with original message
    }
  }

  /**
   * Renew a cancelled subscription
   */
  async renewSubscription(userId: string): Promise<RenewSubscriptionResponse> {
    try {
      const response = await apiService.post<RenewSubscriptionResponse>('/stripe/subscription/renew', {
        user_id: userId,
      });
      
      return response;
    } catch (error: unknown) {
      console.error('Error renewing subscription:', error);
      // Preserve the original error message from API if available
      throw error instanceof Error ? error : new Error('Failed to renew subscription');
    }
  }



  /**
   * Get subscription information for a user
   */
  async getSubscriptionInfo(): Promise<GetSubscriptionInfoResponse> {
    try {
      const response = await apiService.get<GetSubscriptionInfoResponse>('/stripe/subscription/info');
      
      return response;
    } catch (error) {
      console.error('Error getting subscription info:', error);
      throw new Error('Failed to get subscription information');
    }
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
