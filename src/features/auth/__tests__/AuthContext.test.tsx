import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { useAuth } from '../hooks/useAuth'
import type { AuthUser } from '../context/AuthContext'

// Mock window.location.href setter so logout doesn't throw
const mockLocation = { href: '' }
vi.stubGlobal('location', mockLocation)

const testUser: AuthUser = {
  id: 1,
  uuid: 'test-uuid-1234',
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'jane@example.com',
  role_name: 'clinician',
}

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext + useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    mockLocation.href = ''
  })

  it('starts unauthenticated when localStorage is empty', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('isLoading is false', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isLoading).toBe(false)
  })

  it('restores user from localStorage on mount', () => {
    localStorage.setItem('userData', JSON.stringify(testUser))
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toEqual(testUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('login() sets user and saves to localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.login(testUser)
    })

    expect(result.current.user).toEqual(testUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(JSON.parse(localStorage.getItem('userData') ?? 'null')).toEqual(testUser)
  })

  it('checkUserIdMatch returns true when UUID matches', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.login(testUser)
    })

    expect(result.current.checkUserIdMatch('test-uuid-1234')).toBe(true)
  })

  it('checkUserIdMatch returns false when UUID does not match', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.login(testUser)
    })

    expect(result.current.checkUserIdMatch('wrong-uuid')).toBe(false)
  })

  it('checkUserIdMatch returns false when not authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.checkUserIdMatch('test-uuid-1234')).toBe(false)
  })

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('userData', 'not-valid-json{{{')
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('throws when useAuth is used outside AuthProvider', () => {
    // Suppress console error for expected throw
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider',
    )
    consoleError.mockRestore()
  })
})
