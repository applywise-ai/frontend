'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/app/utils/firebase/auth';
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
import MembershipPanel from '@/app/components/settings/MembershipPanel';
import ProtectedPage from '@/app/components/auth/ProtectedPage';

function SettingsPageContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountError, setAccountError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [deleteAccountError, setDeleteAccountError] = useState('');
  
  // Mock user subscription status - replace with actual data
  const isPro = false; // Change to true to test pro member view
  
  // Form states
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [accountCurrentPassword, setAccountCurrentPassword] = useState('');
  const [passwordCurrentPassword, setPasswordCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification preferences
  const [newJobMatches, setNewJobMatches] = useState(true);
  const [autoApplyWithoutReview, setAutoApplyWithoutReview] = useState(false);
  
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
        
        // Here you would also fetch user preferences from your database
        // For now we'll use mock data
        // setIsSubscribed(false); // Mock data - replace with actual subscription status
        
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
      
      if (!accountCurrentPassword) {
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
      
      // Here you would also update the display name in your database
      // For now, we're just handling the Firebase auth update
      
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
      
      if (!deleteAccountPassword) {
        setDeleteAccountError('Please enter your password to confirm account deletion');
        return;
      }
      
      // Re-authenticate user first
      const reAuthResult = await authService.reauthenticate(deleteAccountPassword);
      if ('error' in reAuthResult) {
        setDeleteAccountError(reAuthResult.message);
        return;
      }
      
      // Delete account
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
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse">Loading settings...</div>
      </div>
    );
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
                checked={newJobMatches}
                onCheckedChange={(checked) => {
                  setNewJobMatches(checked);
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
                checked={autoApplyWithoutReview}
                onCheckedChange={(checked) => {
                  setAutoApplyWithoutReview(checked);
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
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleUpdateEmail} className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
          </CardFooter>
        </Card>
        
        {/* Password Security */}
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

        {/* Membership Panel - Above Delete Account */}
        <MembershipPanel isPro={isPro} />
        
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
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-gray-500">
                    Please enter your password to confirm:
                  </p>
                  <Input 
                    type="password" 
                    placeholder="Enter your password"
                    value={deleteAccountPassword}
                    onChange={(e) => setDeleteAccountPassword(e.target.value)}
                  />
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
                    Delete Account
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