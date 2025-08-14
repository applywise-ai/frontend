import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { User } from 'firebase/auth';

export interface HelpSubmission {
  id?: string;
  type: 'bug_report' | 'feature_suggestion';
  title: string;
  description: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt?: unknown;
  updatedAt?: unknown;
  // Optional metadata
  browserInfo?: string;
  deviceInfo?: string;
  pageUrl?: string;
}

export interface CreateHelpSubmissionData {
  type: 'bug_report' | 'feature_suggestion';
  title: string;
  description: string;
  browserInfo?: string;
  deviceInfo?: string;
  pageUrl?: string;
}

class HelpService {
  private getHelpCollectionRef() {
    return collection(db, 'help');
  }

  /**
   * Submit a bug report or feature suggestion
   */
  async submitHelpRequest(user: User, data: CreateHelpSubmissionData): Promise<string> {
    try {
      const helpRef = this.getHelpCollectionRef();
      
      const submission: Omit<HelpSubmission, 'id'> = {
        type: data.type,
        title: data.title.trim(),
        description: data.description.trim(),
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || 'Anonymous User',
        status: 'open',
        priority: data.type === 'bug_report' ? 'medium' : 'low',
        browserInfo: data.browserInfo || this.getBrowserInfo(),
        deviceInfo: data.deviceInfo || this.getDeviceInfo(),
        pageUrl: data.pageUrl || (typeof window !== 'undefined' ? window.location.href : ''),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(helpRef, submission);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting help request:', error);
      throw new Error('Failed to submit help request');
    }
  }

  /**
   * Get browser information for debugging
   */
  private getBrowserInfo(): string {
    if (typeof window === 'undefined') return 'Server-side';
    
    const userAgent = navigator.userAgent;
    const browserName = this.getBrowserName(userAgent);
    const browserVersion = this.getBrowserVersion(userAgent);
    
    return `${browserName} ${browserVersion}`;
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): string {
    if (typeof window === 'undefined') return 'Server-side';
    
    const screen = window.screen;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return `${isMobile ? 'Mobile' : 'Desktop'} - ${screen.width}x${screen.height}`;
  }

  /**
   * Extract browser name from user agent
   */
  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  /**
   * Extract browser version from user agent
   */
  private getBrowserVersion(userAgent: string): string {
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/(\d+)/);
    return match ? match[2] : 'Unknown';
  }
}

const helpService = new HelpService();
export default helpService; 