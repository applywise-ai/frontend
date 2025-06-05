import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  UserCredential,
  User,
  updateEmail,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { auth, db } from './config';

// Define a type for the error response
export type AuthErrorResponse = {
  error: boolean;
  message: string;
};

class FirebaseAuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
  }

  /**
   * Process Firebase errors and return user-friendly messages
   * @param error - The Firebase error
   * @returns User-friendly error message
   */
  private handleAuthError(error: unknown): AuthErrorResponse {
    const firebaseError = error as FirebaseError;
    console.error('Firebase Auth Error:', firebaseError.code, firebaseError.message);
    
    let message = 'An unexpected error occurred. Please try again.';
    
    switch (firebaseError.code) {
      // Email/password signup errors
      case 'auth/email-already-in-use':
        message = 'This email is already registered. Please use a different email or log in.';
        break;
      case 'auth/invalid-email':
        message = 'The email address is not valid. Please check and try again.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. Please use a stronger password.';
        break;
      case 'auth/operation-not-allowed':
        message = 'This operation is not allowed. Please contact support.';
        break;
        
      // Login errors
      case 'auth/user-not-found':
        message = 'No account found with this email. Please check your email or sign up.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again or reset your password.';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid login credentials. Please check your email and password and try again.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later or reset your password.';
        break;
        
      // Google sign-in errors
      case 'auth/popup-closed-by-user':
        message = 'Sign-in popup was closed before completing the sign in. Please try again.';
        break;
      case 'auth/popup-blocked':
        message = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
        break;
      case 'auth/account-exists-with-different-credential':
        message = 'An account already exists with the same email but different sign-in credentials.';
        break;
        
      // Network errors
      case 'auth/network-request-failed':
        message = 'Network error. Please check your internet connection and try again.';
        break;
        
      // Default case for other errors
      default:
        message = 'An error occurred during authentication. Please try again.';
        break;
    }
    
    return {
      error: true,
      message
    };
  }

  /**
   * Register a new user with email and password
   * @param email - User's email
   * @param password - User's password
   * @param fullName - User's full name
   * @returns Promise with UserCredential or AuthErrorResponse
   */
  async register(email: string, password: string, fullName: string): Promise<UserCredential | AuthErrorResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        profile: {
          fullName: fullName,
          email: email
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return userCredential;
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Login with email and password
   * @param email - User's email
   * @param password - User's password
   * @returns Promise with UserCredential or AuthErrorResponse
   */
  async login(email: string, password: string): Promise<UserCredential | AuthErrorResponse> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Sign in or register with Google
   * @returns Promise with UserCredential or AuthErrorResponse
   */
  async googleAuth(): Promise<UserCredential | AuthErrorResponse> {
    try {
      const userCredential = await signInWithPopup(auth, this.googleProvider);
      
      // Check if this is a new user and create document if needed
      if (userCredential.user) {
        // For Google sign-in, we'll create/update the user document
        // Using merge: true to avoid overwriting existing data
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          profile: {
            fullName: userCredential.user.displayName || 'Google User',
            email: userCredential.user.email || ''
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      
      return userCredential;
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Logout the current user
   * @returns Promise<void | AuthErrorResponse>
   */
  async logout(): Promise<void | AuthErrorResponse> {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Check if a user is logged in
   * @returns Promise with User or null
   */
  isLoggedIn(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  /**
   * Get the current user
   * @returns User object or null
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Subscribe to auth state changes
   * @param callback - Function to call when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Reauthenticate the user with their credentials
   * @param password - Current password
   * @returns Promise with UserCredential or AuthErrorResponse
   */
  async reauthenticate(password: string): Promise<UserCredential | AuthErrorResponse> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return {
          error: true,
          message: 'No authenticated user found'
        };
      }

      const credential = EmailAuthProvider.credential(user.email, password);
      return await reauthenticateWithCredential(user, credential);
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Update the current user's email
   * @param newEmail - New email address
   * @returns Promise with void or AuthErrorResponse
   */
  async updateEmail(newEmail: string): Promise<void | AuthErrorResponse> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          error: true,
          message: 'No authenticated user found'
        };
      }

      await updateEmail(user, newEmail);
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Update the current user's password
   * @param newPassword - New password
   * @returns Promise with void or AuthErrorResponse
   */
  async updatePassword(newPassword: string): Promise<void | AuthErrorResponse> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          error: true,
          message: 'No authenticated user found'
        };
      }

      await updatePassword(user, newPassword);
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Delete the current user's account
   * @returns Promise with void or AuthErrorResponse
   */
  async deleteAccount(): Promise<void | AuthErrorResponse> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          error: true,
          message: 'No authenticated user found'
        };
      }

      await deleteUser(user);
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Send a password reset email
   * @param email - User's email
   * @returns Promise with void or AuthErrorResponse
   */
  async sendPasswordResetEmail(email: string): Promise<void | AuthErrorResponse> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Verify the password reset code
   * @param code - Password reset code from email
   * @returns Promise with email or AuthErrorResponse
   */
  async verifyPasswordResetCode(code: string): Promise<string | AuthErrorResponse> {
    try {
      return await verifyPasswordResetCode(auth, code);
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }

  /**
   * Confirm password reset with code
   * @param code - Password reset code from email
   * @param newPassword - New password
   * @returns Promise with void or AuthErrorResponse
   */
  async confirmPasswordReset(code: string, newPassword: string): Promise<void | AuthErrorResponse> {
    try {
      await confirmPasswordReset(auth, code, newPassword);
    } catch (error: unknown) {
      return this.handleAuthError(error);
    }
  }
}

// Create a singleton instance
const authService = new FirebaseAuthService();
export default authService; 