import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { lazyWithPreload } from '../utils/lazyWithPreload';
import ProtectedRoute from './ProtectedRoute';
import UnprotectedRoute from './UnprotectedRoute';
import ProtectedLayout from './ProtectedLayout';
import PlaceholderPage from './PlaceholderPage';

// ── Lazy auth pages ─────────────────────────────────────────────────────────
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

// ── Lazy feature pages ──────────────────────────────────────────────────────
const UsersPage = lazyWithPreload(() =>
  import('../features/users/pages/UsersPage').then((m) => ({ default: m.UsersPage })),
);
const ProfilePage = lazyWithPreload(() =>
  import('../features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const ActivityLogPage = lazyWithPreload(() =>
  import('../features/activity-log/pages/ActivityLogPage').then((m) => ({
    default: m.ActivityLogPage,
  })),
);
const RolesPermissionsPage = lazyWithPreload(() =>
  import('../features/roles-permissions/pages/RolesPermissionsPage').then((m) => ({
    default: m.RolesPermissionsPage,
  })),
);
const RoleDetailPage = lazyWithPreload(() =>
  import('../features/roles-permissions/pages/RoleDetailPage').then((m) => ({
    default: m.RoleDetailPage,
  })),
);
const MastersPage = lazyWithPreload(() =>
  import('../features/masters/pages/MastersPage').then((m) => ({ default: m.MastersPage })),
);
const VendorsPage = lazyWithPreload(() =>
  import('../features/masters/pages/VendorsPage').then((m) => ({ default: m.VendorsPage })),
);
const CouriersPage = lazyWithPreload(() =>
  import('../features/masters/pages/CouriersPage').then((m) => ({ default: m.CouriersPage })),
);
const RmCategoriesPage = lazyWithPreload(() =>
  import('../features/masters/pages/RmCategoriesPage').then((m) => ({
    default: m.RmCategoriesPage,
  })),
);
const ProductsPage = lazyWithPreload(() =>
  import('../features/masters/pages/ProductsPage').then((m) => ({ default: m.ProductsPage })),
);
const RawMaterialsPage = lazyWithPreload(() =>
  import('../features/masters/pages/RawMaterialsPage').then((m) => ({
    default: m.RawMaterialsPage,
  })),
);
const DoctorsPage = lazyWithPreload(() =>
  import('../features/masters/pages/DoctorsPage').then((m) => ({ default: m.DoctorsPage })),
);
const DoctorAliasesPage = lazyWithPreload(() =>
  import('../features/masters/pages/DoctorAliasesPage').then((m) => ({
    default: m.DoctorAliasesPage,
  })),
);
const DoctorPricingPage = lazyWithPreload(() =>
  import('../features/masters/pages/DoctorPricingPage').then((m) => ({
    default: m.DoctorPricingPage,
  })),
);
const BomsPage = lazyWithPreload(() =>
  import('../features/masters/pages/BomsPage').then((m) => ({ default: m.BomsPage })),
);
const InventoryPage = lazyWithPreload(() =>
  import('../features/inventory/pages/InventoryPage').then((m) => ({
    default: m.InventoryPage,
  })),
);
const MaterialsPage = lazyWithPreload(() =>
  import('../features/inventory/pages/MaterialsPage').then((m) => ({ default: m.MaterialsPage })),
);
const StoresPage = lazyWithPreload(() =>
  import('../features/inventory/pages/StoresPage').then((m) => ({ default: m.StoresPage })),
);
const ProcessingPage = lazyWithPreload(() =>
  import('../features/processing/pages/ProcessingPage').then((m) => ({ default: m.ProcessingPage })),
);

// ── Placeholder pages for routes whose features aren't built yet ────────────
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
      {/* Default → dashboard (ProtectedRoute bounces signed-out users to /login). */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public auth routes — flat, no prefix. */}
      <Route
        path="login"
        element={
          <UnprotectedRoute>
            <Suspense fallback={<PageLoader />}>
              <SignInPage />
            </Suspense>
          </UnprotectedRoute>
        }
      />
      <Route
        path="forgot-password"
        element={
          <UnprotectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ForgotPasswordPage />
            </Suspense>
          </UnprotectedRoute>
        }
      />
      <Route
        path="enter-otp"
        element={
          <UnprotectedRoute>
            <Suspense fallback={<PageLoader />}>
              <EnterOtpPage />
            </Suspense>
          </UnprotectedRoute>
        }
      />
      <Route
        path="set-password"
        element={
          <UnprotectedRoute>
            <Suspense fallback={<PageLoader />}>
              <SetNewPasswordPage />
            </Suspense>
          </UnprotectedRoute>
        }
      />

      {/* Protected app routes — flat, share the layout via a pathless parent. */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPlaceholder />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="activity-log" element={<ActivityLogPage />} />
        <Route path="roles-permissions" element={<RolesPermissionsPage />} />
        <Route path="roles-permissions/:roleUuid" element={<RoleDetailPage />} />
        <Route path="masters" element={<MastersPage />} />
        <Route path="masters/vendors" element={<VendorsPage />} />
        <Route path="masters/courier-partners" element={<CouriersPage />} />
        <Route path="masters/rm-categories" element={<RmCategoriesPage />} />
        <Route path="masters/products" element={<ProductsPage />} />
        <Route path="masters/raw-materials" element={<RawMaterialsPage />} />
        <Route path="masters/doctors" element={<DoctorsPage />} />
        <Route path="masters/doctor-aliases" element={<DoctorAliasesPage />} />
        <Route path="masters/doctor-pricing" element={<DoctorPricingPage />} />
        <Route path="masters/boms" element={<BomsPage />} />
        <Route path="masters/materials" element={<MaterialsPage />} />
        <Route path="masters/stores" element={<StoresPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="processing" element={<ProcessingPage />} />
        <Route path="scheduling" element={<SchedulingPlaceholder />} />
        <Route path="clients" element={<ClientsPlaceholder />} />
        <Route path="clients/:clientUuid" element={<ClientDetailPlaceholder />} />
        <Route path="assessments" element={<AssessmentsPlaceholder />} />
        <Route path="diagnostic-generator" element={<DiagnosticGeneratorPlaceholder />} />
        <Route path="settings" element={<SettingsPlaceholder />} />
        <Route path="settings/user/:uuid" element={<UserProfilePlaceholder />} />
        <Route
          path="profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          }
        />
      </Route>

      {/* Catch-all → dashboard (ProtectedRoute handles signed-out users). */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
