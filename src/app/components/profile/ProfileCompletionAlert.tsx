import { FC, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/app/contexts/ProfileContext';
import { FieldName } from '@/app/types/profile';

export type ProfileCompletionState = 'complete' | 'partial' | 'incomplete';

interface ProfileCompletionAlertProps {
  state: ProfileCompletionState;
  onContinue?: () => void;
  onCompleteProfile?: () => void;
}

const iconMap = {
  complete: (
    <span className="flex items-center justify-center w-12 h-12 aspect-square rounded-full bg-green-100 shadow-sm ring-1 ring-inset ring-gray-100">
      <CheckCircle2 className="h-6 w-6 text-green-600" />
    </span>
  ),
  partial: (
    <span className="flex items-center justify-center w-12 h-12 aspect-square rounded-full bg-amber-100 shadow-sm ring-1 ring-inset ring-gray-100">
      <AlertTriangle className="h-6 w-6 text-amber-600" />
    </span>
  ),
  incomplete: (
    <span className="flex items-center justify-center w-12 h-12 aspect-square rounded-full bg-red-100 shadow-sm ring-1 ring-inset ring-gray-100">
      <AlertCircle className="h-6 w-6 text-red-600" />
    </span>
  ),
};

const titleMap = {
  complete: 'Profile Complete',
  partial: 'Profile Partially Complete',
  incomplete: 'Profile Incomplete',
};

const descMap = {
  complete: 'Your profile is ready for application submission.',
  partial: 'Some profile details are missing. Your application may not be as accurate as possible.',
  incomplete: 'Please complete your profile before applying to jobs.',
};

const ProfileCompletionAlert: FC<ProfileCompletionAlertProps> = ({
  state,
  onContinue,
  onCompleteProfile,
}) => {
  const router = useRouter();
  const { updateProfile } = useProfile();
  const [ignoreNotification, setIgnoreNotification] = useState(false);

  const handleCompleteProfile = () => {
    if (onCompleteProfile) {
      onCompleteProfile();
    } else {
      router.push('/profile');
    }
  };

  const handleContinueAnyway = async () => {
    // Save the ignore preference if checkbox is checked
    if (ignoreNotification && state === 'partial') {
      try {
        await updateProfile({
          [FieldName.IGNORE_PARTIAL_PROFILE_ALERT]: true
        });
      } catch (error) {
        console.error('Error saving notification preference:', error);
      }
    }
    
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <DialogContent className="sm:max-w-lg bg-white rounded-xl shadow-lg border border-gray-100 p-0">
      <DialogHeader className="flex flex-row items-center gap-4 px-6 pt-6 pb-2">
        {iconMap[state]}
        <div>
          <DialogTitle className="text-lg font-semibold text-gray-900 leading-tight">
            {titleMap[state]}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-base mt-1">
            {descMap[state]}
          </DialogDescription>
        </div>
      </DialogHeader>
      
            {state === 'partial' && (
        <div className="px-6">
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="ignore-notification"
                  checked={ignoreNotification}
                  onCheckedChange={(checked) => setIgnoreNotification(Boolean(checked))}
                  className="h-4 w-4 border-2 border-gray-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor="ignore-notification"
                  className="text-sm text-gray-700 cursor-pointer font-medium"
                >
                  Don&apos;t show this notification again for partial profiles
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {state !== 'complete' && (
        <DialogFooter className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <div className="flex gap-2">
            {state === 'partial' && (
              <Button
                variant="outline"
                size="lg"
                className="border-gray-200 bg-white hover:bg-gray-50"
                onClick={handleContinueAnyway}
              >
                Continue Anyway
              </Button>
            )}
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleCompleteProfile}
            >
              <User className="h-5 w-5 mr-2" />
              {state === 'partial' ? 'Complete Profile' : 'Complete Profile'}
            </Button>
          </div>
        </DialogFooter>
      )}
    </DialogContent>
  );
};

export default ProfileCompletionAlert; 