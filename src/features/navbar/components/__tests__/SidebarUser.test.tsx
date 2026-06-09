import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const navigateMock = vi.fn();
const logoutMutate = vi.fn();

vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));
vi.mock('../../../../sdk/authentication', () => ({
  useAuthLogout: () => ({ mutate: logoutMutate, isPending: false }),
}));
vi.mock('../../../auth/hooks/useAuth', () => ({
  useAuth: () => ({ user: { email: 'jyoti.varade@example.com', role: 'admin' }, signOut: vi.fn() }),
}));

import { SidebarUser } from '../SidebarUser';

describe('SidebarUser', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    logoutMutate.mockReset();
  });

  it('navigates to /profile when the user block is clicked', async () => {
    const user = userEvent.setup();
    render(<SidebarUser />);
    await user.click(screen.getByRole('button', { name: /open profile/i }));
    expect(navigateMock).toHaveBeenCalledWith('/profile');
  });

  it('does not navigate when the logout control is activated', async () => {
    const user = userEvent.setup();
    render(<SidebarUser />);
    await user.click(screen.getByRole('button', { name: /logout/i }));
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('keeps profile and logout as separate controls', () => {
    render(<SidebarUser />);
    expect(screen.getByRole('button', { name: /open profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});
