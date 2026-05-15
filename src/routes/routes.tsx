import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { lazyWithPreload } from '../utils/lazyWithPreload';
import ProtectedRoute from './ProtectedRoute';
import UnprotectedRoute from './UnprotectedRoute';
import ProtectedLayout from './ProtectedLayout';
import PlaceholderPage from './PlaceholderPage';

// ── Lazy auth pages (the ones implemented in feature 002) ──────────────────
const SignInPage = lazyWithPreload(() =>
  import('../features/auth/pages/SignInPage').then((m) => ({ default: m.SignInPage })),
);
const ForgotPasswordPage = lazyWithPreload(() =>
  import('../features/auth/pages/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const EnterOtpPage = lazyWithPreload(() =>
  import('../features/auth/pages/EnterOtpPage').then((m) => ({ default: m.EnterOtpPage })),
);
const SetNewPasswordPage = lazyWithPreload(() =>
  import('../features/auth/pages/SetNewPasswordPage').then((m) => ({
    default: m.SetNewPasswordPage,
  })),
);

// ── Placeholder pages for routes whose features aren't built on this branch ─
// Each gets a real lazy import + named feature when its own feature lands.
const DashboardPlaceholder = () => <PlaceholderPage title="Dashboard" />;
const ClientsPlaceholder = () => <PlaceholderPage title="Clients" />;
const ClientDetailPlaceholder = () => <PlaceholderPage title="Client Detail" />;
const SchedulingPlaceholder = () => <PlaceholderPage title="Scheduling" />;
const AssessmentsPlaceholder = () => <PlaceholderPage title="Assessments" />;
const SettingsPlaceholder = () => <PlaceholderPage title="Settings" />;
const UserProfilePlaceholder = () => <PlaceholderPage title="User Profile" />;
const DiagnosticGeneratorPlaceholder = () => <PlaceholderPage title="Diagnostic Generator" />;

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-9 animate-spin text-primary" aria-hidden />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default → admin dashboard (ProtectedRoute bounces signed-out users to login). */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Public auth routes — each wrapped in UnprotectedRoute + Suspense. */}
      <Route
        path="clinician/login"
        element={
          <UnprotectedRoute>
            <Suspense fallback={<PageLoader />}>
              <SignInPage />
            </Suspense>
          </UnprotectedRoute>
        }
      />
      <Route
        path="clinician/forgot-password"
        element={
          <UnprotectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ForgotPasswordPage />
            </Suspense>
          </UnprotectedRoute>
        }
      />
      <Route
        path="clinician/enter-otp"
        element={
          <UnprotectedRoute>
            <Suspense fallback={<PageLoader />}>
              <EnterOtpPage />
            </Suspense>
          </UnprotectedRoute>
        }
      />
      <Route
        path="clinician/set-password"
        element={
          <UnprotectedRoute>
            <Suspense fallback={<PageLoader />}>
              <SetNewPasswordPage />
            </Suspense>
          </UnprotectedRoute>
        }
      />

      {/* Protected app routes (placeholders until each feature is built). */}
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPlaceholder />} />
        <Route path="scheduling" element={<SchedulingPlaceholder />} />
        <Route path="clients" element={<ClientsPlaceholder />} />
        <Route path="clients/:clientUuid" element={<ClientDetailPlaceholder />} />
        <Route path="assessments" element={<AssessmentsPlaceholder />} />
        <Route path="diagnostic-generator" element={<DiagnosticGeneratorPlaceholder />} />
        <Route path="settings" element={<SettingsPlaceholder />} />
        <Route path="settings/user/:uuid" element={<UserProfilePlaceholder />} />
        <Route path="profile" element={<UserProfilePlaceholder />} />
      </Route>

      {/* Catch-all — ProtectedRoute on /admin/dashboard handles signed-out users. */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
