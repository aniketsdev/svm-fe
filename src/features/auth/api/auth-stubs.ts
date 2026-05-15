import type { AuthUser } from '../context/AuthContext';

// ── Behavior switch (module-level state) ────────────────────────────────────

export interface AuthStubErrorPayload {
  message?: string;
  field_errors?: { field: string; message: string }[];
}

export const AuthStubBehavior: {
  mode: 'success' | 'error';
  latencyMs: number;
  errorPayload?: AuthStubErrorPayload;
} = {
  mode: 'success',
  latencyMs: 800,
};

const DEFAULT_ERROR_PAYLOAD: AuthStubErrorPayload = {
  message: 'Invalid credentials.',
  field_errors: [{ field: 'username', message: 'Incorrect email or password' }],
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function delivery<T>(success: T): Promise<T> {
  await sleep(AuthStubBehavior.latencyMs);
  if (AuthStubBehavior.mode === 'error') {
    const payload = AuthStubBehavior.errorPayload ?? DEFAULT_ERROR_PAYLOAD;
    throw {
      response: { data: payload },
      // also surface as top-level so useFormApiErrors's fallback picks it up
      data: payload,
    };
  }
  return success;
}

// ── Per-endpoint request/response shapes ────────────────────────────────────

export interface LoginBody {
  email: string;
  password: string;
  remember_me: boolean;
}
export interface LoginResponse {
  message?: string;
  user?: AuthUser;
}

export interface ForgotPasswordBody { email: string }
export interface ForgotPasswordResponse {
  message?: string;
  otp_expiry?: number; // seconds until OTP expires
}

export interface VerifyOtpBody { email: string; otp: string }
export interface VerifyOtpResponse {
  message?: string;
  token?: string;
}

export interface SetPasswordBody {
  token: string;
  password: string;
  confirm_password: string;
}
export interface SetPasswordResponse { message?: string }

// ── Sample success payloads ─────────────────────────────────────────────────

const SAMPLE_USER: AuthUser = {
  id: 1,
  uuid: 'stub-clinician-uuid',
  first_name: 'Sample',
  last_name: 'Clinician',
  email: 'clinician@example.com',
  role_name: 'clinician',
};

// ── TanStack-Query-compatible mutation factories ────────────────────────────
// Each factory's shape matches what the eventual generated SDK emits, so
// every consumer's call site is a one-line swap when the SDK lands:
//   import { authLoginCreateMutation } from '../api/auth-stubs';      // stub
//   import { authLoginCreateMutation } from '../../../sdk/@tanstack/react-query.gen';  // real

export function authLoginCreateMutation() {
  return {
    mutationFn: async (vars: { body: LoginBody }): Promise<LoginResponse> => {
      void vars; // (the stub ignores the body; replace with real fetch when SDK lands)
      return delivery({ message: 'Login successful!', user: SAMPLE_USER });
    },
  };
}

export function authForgotPasswordCreateMutation() {
  return {
    mutationFn: async (vars: { body: ForgotPasswordBody }): Promise<ForgotPasswordResponse> => {
      void vars;
      return delivery({ message: 'OTP sent successfully!', otp_expiry: 120 });
    },
  };
}

export function authVerifyOtpCreateMutation() {
  return {
    mutationFn: async (vars: { body: VerifyOtpBody }): Promise<VerifyOtpResponse> => {
      void vars;
      return delivery({ message: 'OTP verified successfully!', token: 'stub-reset-token' });
    },
  };
}

export function authSetPasswordCreateMutation() {
  return {
    mutationFn: async (vars: { body: SetPasswordBody }): Promise<SetPasswordResponse> => {
      void vars;
      return delivery({ message: 'Password set successfully!' });
    },
  };
}

// ── Test helper ─────────────────────────────────────────────────────────────

/**
 * Set behavior, run `fn`, then restore. Lets tests exercise success/error
 * paths without leaking module-level state across cases.
 */
export async function withStubBehavior<T>(
  next: Partial<typeof AuthStubBehavior>,
  fn: () => Promise<T> | T,
): Promise<T> {
  const prev = { ...AuthStubBehavior };
  Object.assign(AuthStubBehavior, next);
  try {
    return await fn();
  } finally {
    Object.assign(AuthStubBehavior, prev);
  }
}
