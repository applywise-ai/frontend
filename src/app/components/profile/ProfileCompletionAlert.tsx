import { FC } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, User } from 'lucide-react';
import { Button } from '../ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { useRouter } from 'next/navigation';

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

  const handleCompleteProfile = () => {
    if (onCompleteProfile) {
      onCompleteProfile();
    } else {
      router.push('/profile');
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
      {state !== 'complete' && (
        <DialogFooter className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <div className="flex gap-2">
            {state === 'partial' && (
              <Button
                variant="outline"
                size="lg"
                className="border-gray-200"
                onClick={handleCompleteProfile}
              >
                <User className="h-5 w-5 mr-2" />
                Complete Profile
              </Button>
            )}
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={state === 'partial' ? onContinue : handleCompleteProfile}
            >
              {state === 'partial' ? 'Continue Anyway' : (
                <><User className="h-5 w-5 mr-2" />Complete Profile</>
              )}
            </Button>
          </div>
        </DialogFooter>
      )}
    </DialogContent>
  );
};

export default ProfileCompletionAlert; 