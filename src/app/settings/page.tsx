'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/app/services/firebase/auth';
import { User } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { AlertCircle, KeyRound, Trash2, User as UserIcon, Bell } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/app/components/ui/dialog';
import { useNotification } from '@/app/contexts/NotificationContext';
import { useProfile } from '@/app/contexts/ProfileContext';
import { FieldName } from '@/app/types/profile';
import MembershipPanel from '@/app/components/settings/MembershipPanel';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import { SettingsPageSkeleton } from '@/app/components/loading/SettingsPageSkeleton';
import stripeService from '@/app/services/api/stripe';

function SettingsPageContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountError, setAccountError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [deleteAccountError, setDeleteAccountError] = useState('');
  
  // Profile hook for notification preferences
  const { profile, updateProfile, isLoading: profileLoading, deleteUser } = useProfile();
  const isPro = profile?.[FieldName.IS_PRO_MEMBER] || false;
  
  // Form states
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [accountCurrentPassword, setAccountCurrentPassword] = useState('');
  const [passwordCurrentPassword, setPasswordCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Dialog states
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  
  // Global notification hook
  const { showSuccess } = useNotification();
  
  // Fetch user data on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.isLoggedIn();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        
        setUser(currentUser);
        setEmail(currentUser.email || '');
        setDisplayName(currentUser.displayName || '');
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleUpdateEmail = async () => {
    if (!user) return;
    
    try {
      setAccountError('');
      
      if (!email) {
        setAccountError('Email cannot be empty');
        return;
      }
      
      // Check if user signed in with Google
      const isGoogleUser = user.providerData.some(provider => provider.providerId === 'google.com');
      
      if (!isGoogleUser && !accountCurrentPassword) {
        setAccountError('Please enter your current password to confirm this change');
        return;
      }
      
      // Re-authenticate user first
      const reAuthResult = await authService.reauthenticate(accountCurrentPassword);
      if ('error' in reAuthResult) {
        setAccountError(reAuthResult.message);
        return;
      }
      
      // Update email
      const updateResult = await authService.updateEmail(email);
      if (updateResult && 'error' in updateResult) {
        setAccountError(updateResult.message);
        return;
      }
      
      // Update display name in auth service
      const displayNameResult = await authService.updateDisplayName(displayName);
      if (displayNameResult && 'error' in displayNameResult) {
        setAccountError(displayNameResult.message);
        return;
      }
      
      showSuccess('Account information updated successfully!');
      setAccountCurrentPassword('');
    } catch (err) {
      setAccountError('Failed to update account information. Please try again.');
      console.error('Error updating account info:', err);
    }
  };
  
  const handleUpdatePassword = async () => {
    if (!user) return;
    
    try {
      setPasswordError('');
      
      if (!passwordCurrentPassword) {
        setPasswordError('Current password is required');
        return;
      }
      
      if (!newPassword) {
        setPasswordError('New password cannot be empty');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }
      
      if (newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters');
        return;
      }
      
      // Re-authenticate user first
      const reAuthResult = await authService.reauthenticate(passwordCurrentPassword);
      if ('error' in reAuthResult) {
        setPasswordError(reAuthResult.message);
        return;
      }
      
      // Update password
      const updateResult = await authService.updatePassword(newPassword);
      if (updateResult && 'error' in updateResult) {
        setPasswordError(updateResult.message);
        return;
      }
      
      showSuccess('Password updated successfully!');
      setPasswordCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError('Failed to update password. Please try again.');
      console.error('Error updating password:', err);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      setDeleteAccountError('');
      
      // Check if user signed in with Google
      const isGoogleUser = user?.providerData.some(provider => provider.providerId === 'google.com');
      
      // For email/password users, require password input
      if (!isGoogleUser && !deleteAccountPassword) {
        setDeleteAccountError('Please enter your password to confirm account deletion');
        return;
      }
      
      // Re-authenticate user (Google users will get popup, email users need password)
      const reAuthResult = await authService.reauthenticate(deleteAccountPassword);
      if ('error' in reAuthResult) {
        setDeleteAccountError(reAuthResult.message);
        return;
      }
      
      // Delete customer from Stripe and Firestore if user has subscription
      if (isPro && user) {
        try {
          await stripeService.deleteCustomer(user.uid);
        } catch (stripeError) {
          console.error('Error deleting Stripe customer:', stripeError);
          // Continue with account deletion even if Stripe deletion fails
        }
      }
      
      // Delete user profile and applications from Firestore
      await deleteUser();
      
      // Delete Firebase Auth account
      const deleteResult = await authService.deleteAccount();
      if (deleteResult && 'error' in deleteResult) {
        setDeleteAccountError(deleteResult.message);
        return;
      }
      
      // If successful, redirect to home page
      router.push('/');
    } catch (err) {
      setDeleteAccountError('Failed to delete account. Please try again.');
      console.error('Error deleting account:', err);
    }
  };
  
  if (loading || profileLoading) {
    return <SettingsPageSkeleton />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="space-y-4">
        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-2xl">
              <Bell className="mr-2 h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Manage how and when ApplyWise contacts you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-job-matches">Send new job matches to email</Label>
                <p className="text-sm text-gray-500">Receive emails when new job matches are found</p>
              </div>
              <Switch
                id="new-job-matches"
                checked={profile?.[FieldName.NEW_JOB_MATCHES] || false}
                onCheckedChange={(checked) => {
                  updateProfile({ [FieldName.NEW_JOB_MATCHES]: checked });
                  showSuccess(checked ? 'Email notifications enabled!' : 'Email notifications disabled!');
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-apply">Auto apply without reviewing application</Label>
                <p className="text-sm text-gray-500">Skip review step for faster job applications</p>
              </div>
              <Switch
                id="auto-apply"
                checked={profile?.[FieldName.AUTO_APPLY_WITHOUT_REVIEW] || false}
                onCheckedChange={(checked) => {
                  updateProfile({ [FieldName.AUTO_APPLY_WITHOUT_REVIEW]: checked });
                  showSuccess(checked ? 'Auto apply enabled!' : 'Auto apply disabled!');
                }}
              />
            </div>
            
            {/* Auto apply offline section commented out
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Label htmlFor="auto-apply-offline">Auto apply while offline</Label>
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    Premium
                  </span>
                </div>
                <p className="text-sm text-gray-500">ApplyWise will apply to your top 20 matches daily</p>
              </div>
              <Switch
                id="auto-apply-offline"
                checked={autoApplyOffline}
                onCheckedChange={setAutoApplyOffline}
                disabled={!isSubscribed}
              />
            </div>
            
            {!isSubscribed && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTitle className="text-amber-800">Premium Feature</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Auto apply while offline is a premium feature. 
                  <Button variant="link" className="p-0 h-auto font-semibold text-teal-600 ml-1">
                    Upgrade Now
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            */}
          </CardContent>
        </Card>
        
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-2xl">
              <UserIcon className="mr-2 h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Manage your account details
            </CardDescription>
            {accountError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mt-2 text-sm">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span>{accountError}</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="Add a display name" 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {user && !user.providerData.some(provider => provider.providerId === 'google.com') && (
              <div className="space-y-1">
                <Label htmlFor="account-password">Current Password</Label>
                <Input 
                  id="account-password" 
                  type="password" 
                  value={accountCurrentPassword} 
                  onChange={(e) => setAccountCurrentPassword(e.target.value)}
                  placeholder="Enter current password to confirm changes" 
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleUpdateEmail} className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
          </CardFooter>
        </Card>
        
        {/* Password Security - Only show for email/password users */}
        {user && !user.providerData.some(provider => provider.providerId === 'google.com') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-2xl">
                <KeyRound className="mr-2 h-5 w-5" />
                Password
              </CardTitle>
              <CardDescription>
                Update your password
              </CardDescription>
              {passwordError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mt-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span>{passwordError}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="current-password">Current Password</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  value={passwordCurrentPassword}
                  onChange={(e) => setPasswordCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleUpdatePassword} className="bg-teal-600 hover:bg-teal-700">Update Password</Button>
            </CardFooter>
          </Card>
        )}

        {/* Membership Panel - Above Delete Account */}
        <MembershipPanel />
        
        {/* Delete Account - At the bottom */}
        <Card className="border-red-100">
          <CardHeader className="border-b border-red-100">
            <CardTitle className="flex items-center text-base sm:text-lg text-red-600">
              <Trash2 className="mr-2 h-5 w-5" />
              Delete Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This action <span className="font-semibold">cannot be undone</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex justify-end">
            <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="mt-2">Delete My Account</Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="text-red-600">Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action is irreversible. All your data will be permanently deleted.
                    {isPro && (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <p className="text-amber-800 font-medium text-sm">
                          ⚠️ You have an active Pro membership. Deleting your account will:
                        </p>
                        <ul className="text-amber-700 text-sm mt-1 ml-4 list-disc">
                          <li>Cancel your membership immediately</li>
                          <li>Remove access to all Pro features</li>
                          <li>Delete your subscription from our records</li>
                        </ul>
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {user && !user.providerData.some(provider => provider.providerId === 'google.com') ? (
                    <>
                      <p className="text-sm text-gray-500">
                        Please enter your password to confirm:
                      </p>
                      <Input 
                        type="password" 
                        placeholder="Enter your password"
                        value={deleteAccountPassword}
                        onChange={(e) => setDeleteAccountPassword(e.target.value)}
                      />
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      You will be asked to sign in with Google again to confirm this action.
                    </p>
                  )}
                  {deleteAccountError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <span>{deleteAccountError}</span>
                    </div>
                  )}
                </div>
                <DialogFooter className="flex justify-end space-x-2">
                  <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50" onClick={() => {
                    setConfirmDeleteDialogOpen(false);
                    setDeleteAccountError('');
                    setDeleteAccountPassword('');
                  }}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    {user && user.providerData.some(provider => provider.providerId === 'google.com') 
                      ? 'Confirm & Delete Account' 
                      : 'Delete Account'
                    }
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedPage>
      <SettingsPageContent />
    </ProtectedPage>
  );
} 