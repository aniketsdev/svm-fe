import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomLabel } from '../../../common/custom-label';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFCheckbox } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { AuthLayout } from '../components/AuthLayout';
import { useAuthLogin } from '../../../sdk/authentication';
import { useSignInForm, type SignInFormValues } from '../hooks/useSignInForm';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../../../api/client';
import signInImage from '../../../assets/auth-sign-in.svg';

export function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const { control, handleSubmit, setError } = useSignInForm();
  const { handleApiError } = useFormApiErrors(setError);
  const [pending, setPending] = useState(false);

  const loginMutation = useAuthLogin({
    mutation: {
      onSuccess: (response) => {
        // The generated mutator wraps responses as {data, status, headers}.
        // For a 200 response, `response.data` is the LoginResponse body.
        // Server has already set __Host-access / __Host-refresh / csrf_token
        // cookies; we just prime the in-memory user.
        const loginBody = (response as { data: { user: { id: number; email: string; role: 'admin' | 'staff' | 'user' } } }).data;
        signIn({ ...loginBody.user, is_active: true });
        toast({ severity: 'success', message: 'Welcome back!' });
        setTimeout(() => navigate('/dashboard'), 300);
      },
      onError: (error) => {
        // Backend returns a uniform 401 `{detail: "Invalid credentials"}` for
        // unknown email + wrong password + deactivated. Map to a single message.
        if (error instanceof ApiError && error.status === 401) {
          toast({ severity: 'error', message: 'Invalid email or password.' });
          setError('password', { type: 'manual', message: 'Incorrect email or password' });
          return;
        }
        const general = handleApiError(error);
        if (general) toast({ severity: 'error', message: general });
      },
      onSettled: () => setPending(false),
    },
  });

  const onSubmit = (data: SignInFormValues) => {
    setPending(true);
    loginMutation.mutate({
      data: { username: data.username, password: data.password },
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
            onClick={() => navigate('/forgot-password')}
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
