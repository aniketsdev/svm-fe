import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/cn';
import { CustomButton } from '../../../common/custom-buttons';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { AuthLayout } from '../components/AuthLayout';
import { OtpInput } from '../components/OtpInput';
import {
  authForgotPasswordCreateMutation,
  authVerifyOtpCreateMutation,
} from '../api/auth-stubs';
import { useEnterOtpForm, type EnterOtpFormValues } from '../hooks/useEnterOtpForm';
import { clearOtpExpiry, useOtpTimer } from '../hooks/useOtpTimer';
import enterOtpImage from '../../../assets/auth-enter-otp.svg';

export function EnterOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || '';
  const { toast } = useToast();
  const { setValue, handleSubmit, setError } = useEnterOtpForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { isExpired, display, resetTimer } = useOtpTimer();

  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = () => {
    setResendCooldown(30);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const isOtpComplete = otpDigits.every((d) => d !== '');

  const handleOtpChange = (digits: string[]) => {
    setOtpDigits(digits);
    setValue('otp', digits.join(''), { shouldValidate: true });
  };

  const verifyOtpMutation = useMutation({
    ...authVerifyOtpCreateMutation(),
    onSuccess: (data) => {
      const response = data as { message?: string; token?: string };
      clearOtpExpiry();
      toast({ severity: 'success', message: response.message || 'OTP verified successfully!' });
      setTimeout(
        () => navigate('/clinician/set-password', { state: { email, token: response.token } }),
        500,
      );
    },
    onError: (error) => {
      const general = handleApiError(error);
      if (general) toast({ severity: 'error', message: general });
    },
  });

  const resendOtpMutation = useMutation({
    ...authForgotPasswordCreateMutation(),
    onSuccess: (data) => {
      const response = data as { message?: string; otp_expiry?: number };
      if (response.otp_expiry) resetTimer(response.otp_expiry);
      toast({ severity: 'success', message: response.message || 'OTP resent successfully!' });
      startCooldown();
    },
    onError: (error) => {
      const general = handleApiError(error);
      if (general) toast({ severity: 'error', message: general });
    },
  });

  const onSubmit = (data: EnterOtpFormValues) => {
    verifyOtpMutation.mutate({ body: { email, otp: data.otp } });
  };

  const handleResendOtp = () => {
    if (resendOtpMutation.isPending || !isExpired || resendCooldown > 0) return;
    resendOtpMutation.mutate({ body: { email } });
  };

  return (
    <AuthLayout imageSrc={enterOtpImage} imageAlt="Enter-OTP illustration">
      <h1 className="mb-1 text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
        Enter OTP
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:mb-8">
        We've sent a 6-digit verification code to your registered email.
      </p>

      <div className="mb-6">
        <OtpInput value={otpDigits} onChange={handleOtpChange} />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-1 text-sm">
        {isExpired ? (
          <>
            <span className="text-muted-foreground">Didn't receive the code?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendOtpMutation.isPending || resendCooldown > 0}
              className={cn(
                'font-semibold text-foreground',
                resendOtpMutation.isPending || resendCooldown > 0
                  ? 'cursor-default opacity-60'
                  : 'cursor-pointer hover:underline',
              )}
            >
              Resend OTP
            </button>
          </>
        ) : (
          <span className="text-muted-foreground">
            Resend OTP in <span className="font-semibold text-foreground">{display}</span>
          </span>
        )}
      </div>

      <CustomButton
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        loading={verifyOtpMutation.isPending}
        disabled={!isOtpComplete}
        onClick={handleSubmit(onSubmit)}
      >
        Verify &amp; Continue
      </CustomButton>
    </AuthLayout>
  );
}

export default EnterOtpPage;
