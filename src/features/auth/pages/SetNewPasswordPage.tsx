import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CustomLabel } from '../../../common/custom-label';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { AuthLayout } from '../components/AuthLayout';
import { authSetPasswordCreateMutation } from '../api/auth-stubs';
import {
  useSetNewPasswordForm,
  type SetNewPasswordFormValues,
} from '../hooks/useSetNewPasswordForm';
import setPasswordImage from '../../../assets/auth-set-password.svg';

const PASSWORD_REQUIREMENTS = [
  'Must be at least 8 characters long',
  'Must not exceed 128 characters',
  'Must contain at least one lowercase letter (a-z)',
  'Must contain at least one uppercase letter (A-Z)',
  'Must contain at least one number, symbol, or whitespace',
];

export function SetNewPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // Token from forgot-password flow (state) or invitation link (URL query).
  const token =
    (location.state as { token?: string })?.token || searchParams.get('token') || '';

  const { toast } = useToast();
  const { control, handleSubmit, setError } = useSetNewPasswordForm();
  const { handleApiError } = useFormApiErrors(setError);

  const setPasswordMutation = useMutation({
    ...authSetPasswordCreateMutation(),
    onSuccess: (data) => {
      const response = data as { message?: string };
      toast({ severity: 'success', message: response.message || 'Password set successfully!' });
      setTimeout(() => navigate('/login'), 1000);
    },
    onError: (error) => {
      const general = handleApiError(error);
      if (general) toast({ severity: 'error', message: general });
    },
  });

  const onSubmit = (data: SetNewPasswordFormValues) => {
    if (!token) {
      toast({
        severity: 'error',
        message: 'Invalid session. Please restart the password reset process.',
      });
      return;
    }
    setPasswordMutation.mutate({
      body: { token, password: data.newPassword, confirm_password: data.confirmPassword },
    });
  };

  return (
    <AuthLayout imageSrc={setPasswordImage} imageAlt="Set-new-password illustration">
      <h1 className="mb-1 text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
        Set Your New Password
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Create a strong password to secure your account.
      </p>

      <div className="mb-4">
        <CustomLabel htmlFor="newPassword" isRequired label="New Password" />
        <RHFInput<SetNewPasswordFormValues>
          name="newPassword"
          control={control}
          placeholder="Enter New Password"
          isPassword
        />
      </div>

      <div className="mb-6">
        <CustomLabel htmlFor="confirmPassword" isRequired label="Confirm Password" />
        <RHFInput<SetNewPasswordFormValues>
          name="confirmPassword"
          control={control}
          placeholder="Confirm New Password"
          isPassword
        />
      </div>

      <CustomButton
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        loading={setPasswordMutation.isPending}
        onClick={handleSubmit(onSubmit)}
      >
        Set Password
      </CustomButton>

      <div className="mt-4">
        <p className="mb-1 text-xs font-semibold text-muted-foreground">Password Requirements:</p>
        <ul className="list-disc pl-5 text-xs leading-relaxed text-muted-foreground">
          {PASSWORD_REQUIREMENTS.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </AuthLayout>
  );
}

export default SetNewPasswordPage;
