import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CustomLabel } from '../../../common/custom-label';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { AuthLayout } from '../components/AuthLayout';
import { authForgotPasswordCreateMutation } from '../api/auth-stubs';
import { useForgotPasswordForm, type ForgotPasswordFormValues } from '../hooks/useForgotPasswordForm';
import { storeOtpExpiry } from '../hooks/useOtpTimer';
import forgotPasswordImage from '../../../assets/auth-forgot-password.svg';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { control, handleSubmit, getValues, setError } = useForgotPasswordForm();
  const { handleApiError } = useFormApiErrors(setError);

  const forgotPasswordMutation = useMutation({
    ...authForgotPasswordCreateMutation(),
    onSuccess: (data) => {
      const response = data as { message?: string; otp_expiry?: number };
      if (response.otp_expiry) storeOtpExpiry(response.otp_expiry);
      toast({ severity: 'success', message: response.message || 'OTP sent successfully!' });
      setTimeout(
        () => navigate('/clinician/enter-otp', { state: { email: getValues('email') } }),
        500,
      );
    },
    onError: (error) => {
      const general = handleApiError(error);
      if (general) toast({ severity: 'error', message: general });
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate({ body: { email: data.email } });
  };

  return (
    <AuthLayout imageSrc={forgotPasswordImage} imageAlt="Forgot-password illustration">
      <h1 className="mb-1 text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
        Forgot Your Password
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Enter your registered email to receive an OTP.
      </p>

      <div className="mb-6">
        <CustomLabel htmlFor="email" isRequired label="Email" />
        <RHFInput<ForgotPasswordFormValues>
          name="email"
          control={control}
          placeholder="Enter Email ID"
          isEmail
        />
      </div>

      <CustomButton
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        loading={forgotPasswordMutation.isPending}
        onClick={handleSubmit(onSubmit)}
      >
        Send OTP
      </CustomButton>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
