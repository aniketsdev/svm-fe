# Simple Routing System

This project has a basic routing system with protected and unprotected routes.

## Files Created

### 1. ProtectedRoute (`src/components/ProtectedRoute.tsx`)
- Simple component that checks if user is logged in
- If not logged in → redirects to `/login`
- If logged in → shows the protected content

### 2. UnprotectedRoute (`src/components/UnprotectedRoute.tsx`)
- For public pages like login
- If user is logged in → redirects to `/dashboard`
- If not logged in → shows the public content

### 3. ProtectedLayout (`src/components/ProtectedLayout.tsx`)
- Wraps protected routes with a layout
- Includes basic navigation
- Uses `<Outlet />` to show child routes

### 4. Routes (`src/routes/routes.tsx`)
- Defines all the app routes
- Public routes: `/login`
- Protected routes: `/dashboard/*` and `/profile`

## How to Use

### Add a new protected page:
```tsx
<Route 
  path="/new-page" 
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  } 
/>
```

### Add a new public page:
```tsx
<Route 
  path="/about" 
  element={
    <UnprotectedRoute>
      <AboutPage />
    </UnprotectedRoute>
  } 
/>
```

### Add a page with layout:
```tsx
<Route path="/admin/new-page" element={<div>New Page</div>} />
```

## Current Routes

- `/` → redirects to `/login`
- `/login` → Login page (public)
- `/admin/dashboard` → Dashboard (protected with navbar)
- `/admin/scheduling` → Scheduling page (protected with navbar)
- `/admin/clients` → Clients page (protected with navbar)
- `/admin/groups` → Groups page (protected with navbar)
- `/admin/treatments` → Treatments page (protected with navbar)
- `/admin/billing` → Billing page (protected with navbar)
- `/admin/referral` → Referral page (protected with navbar)
- `/admin/reports` → Reports page (protected with navbar)
- `/admin/forms` → Forms page (protected with navbar)
- `/admin/enroll` → Enroll page (protected with navbar)
- `/admin/intake` → Intake page (protected with navbar)
- `/admin/payment` → Payment page (protected with navbar)
- `/admin/settings` → Admin settings page (protected with navbar)
- `/admin/profile` → Profile page (protected with navbar)
- `/*` → redirects to `/login`
