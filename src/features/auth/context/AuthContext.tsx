/* eslint-disable react-refresh/only-export-components */
// This module intentionally co-locates the `AuthContext` object with its
// `AuthProvider` component. Splitting them across files for fast-refresh's
// sake would create one-file-per-export churn for no runtime benefit.
import { createContext, useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { clearAuthStorage } from '../utils/clearAuthStorage';

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const IDLE_CHECK_INTERVAL_MS = 60 * 1000; // check every minute
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'touchstart'] as const;
const BROADCAST_CHANNEL_NAME = 'auth_logout';

export interface AuthUser {
  id?: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  role_name?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: AuthUser) => void;
  logout: () => void;
  checkUserIdMatch: (userId: string) => boolean;
}

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // localStorage read is the canonical bootstrap pattern. Allowed by the
    // current lint rules (useState initializer runs at mount, not render).
    const data = localStorage.getItem('userData');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  });

  // eslint-disable-next-line react-hooks/purity -- timestamp is the semantic intent of useRef-as-mutable-clock
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    window.location.href = '/clinician/login';
  }, []);

  const login = useCallback((userData: AuthUser) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    lastActivityRef.current = Date.now();
    setUser(userData);
  }, []);

  // Idle timeout: track activity + auto-logout + cross-tab sync
  useEffect(() => {
    if (!user) return;

    const resetActivity = () => {
      lastActivityRef.current = Date.now();
    };

    // Broadcast logout to other open tabs
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (e) => {
        if (e.data === 'logout') logout();
      };
    } catch {
      // BroadcastChannel not supported in all environments
    }

    const broadcastLogout = () => {
      try {
        channel?.postMessage('logout');
      } catch {
        // ignore
      }
      logout();
    };

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetActivity, { passive: true }));

    const intervalId = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= IDLE_TIMEOUT_MS) {
        broadcastLogout();
      }
    }, IDLE_CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetActivity));
      clearInterval(intervalId);
      channel?.close();
    };
  }, [user, logout]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      login,
      logout,
      checkUserIdMatch: (userId: string) => user?.uuid === userId,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
