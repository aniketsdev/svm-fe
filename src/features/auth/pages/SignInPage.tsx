import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomLabel } from '../../../common/custom-label';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFCheckbox } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { AuthLayout } from '../components/AuthLayout';
import { authLoginCreateMutation } from '../api/auth-stubs';
import { useSignInForm, type SignInFormValues } from '../hooks/useSignInForm';
import { useAuth } from '../hooks/useAuth';
import signInImage from '../../../assets/auth-sign-in.svg';

export function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const { control, handleSubmit, setError } = useSignInForm();
  const { handleApiError } = useFormApiErrors(setError);
  const [pending, setPending] = useState(false);

  const loginMutation = useMutation({
    ...authLoginCreateMutation(),
    onSuccess: (data) => {
      const response = data as {
        message?: string;
        user?: {
          uuid: string;
          first_name: string;
          last_name: string;
          email: string;
          role_name?: string;
        };
      };
      if (response.user) {
        login(response.user);
        // Storage back-compat (per contracts/auth-context.md): preserve the
        // legacy per-field writes for one release so any downstream consumer
        // that hasn't migrated to reading `userData` keeps working.
        localStorage.setItem('userId', response.user.uuid);
        localStorage.setItem('email', response.user.email);
        localStorage.setItem('firstName', response.user.first_name);
        localStorage.setItem('lastName', response.user.last_name);
      }
      toast({ severity: 'success', message: response.message || 'Login successful!' });
      setTimeout(() => navigate('/admin/dashboard'), 500);
    },
    onError: (error) => {
      const general = handleApiError(error);
      if (general) toast({ severity: 'error', message: general });
    },
    onSettled: () => setPending(false),
  });

  const onSubmit = (data: SignInFormValues) => {
    setPending(true);
    loginMutation.mutate({
      body: { email: data.username, password: data.password, remember_me: data.rememberMe },
    });
  };

  return (
    <AuthLayout imageSrc={signInImage} imageAlt="Therapy session illustration">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <h1 className="mb-1 text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
          Welcome to Test
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          Please sign in using credentials provided.
        </p>

        <div className="mb-4">
          <CustomLabel htmlFor="username" isRequired label="Email" />
          <RHFInput<SignInFormValues>
            name="username"
            control={control}
            placeholder="Enter Email"
          />
        </div>

        <div className="mb-3">
          <CustomLabel htmlFor="password" isRequired label="Password" />
          <RHFInput<SignInFormValues>
            name="password"
            control={control}
            placeholder="Enter Password"
            isPassword
          />
        </div>

        <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <RHFCheckbox<SignInFormValues>
            name="rememberMe"
            control={control}
            label="Remember Me"
            size="sm"
          />
          <button
            type="button"
            onClick={() => navigate('/clinician/forgot-password')}
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <CustomButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={pending || loginMutation.isPending}
        >
          Login
        </CustomButton>
      </form>
    </AuthLayout>
  );
}

export default SignInPage;
