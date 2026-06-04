import { LogOut } from 'lucide-react';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { UserAvatar } from '../../../common/user-avatar';
import { useAuthLogout } from '../../../sdk/auth';
import { useAuth } from '../../auth/hooks/useAuth';

/** Light-styled sidebar footer: avatar + name/role + logout (mirrors UserMenu's
 *  logout flow without the dark-bar styling). */
export const SidebarUser = memo(function SidebarUser() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const logoutMutation = useAuthLogout({
    mutation: {
      onSuccess: () => {
        signOut();
        navigate('/login', { replace: true });
      },
      onError: () => {
        signOut();
        navigate('/login', { replace: true });
      },
    },
  });

  const name = user?.email ? user.email.split('@', 1)[0] : 'User';
  const initialsFirst = name.charAt(0).toUpperCase();
  const initialsLast = name.charAt(1)?.toUpperCase() ?? '';

  return (
    <div className="flex items-center gap-2 rounded-lg px-1.5 py-1">
      <UserAvatar firstName={initialsFirst} lastName={initialsLast} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        {user?.role && <p className="truncate text-xs capitalize text-muted-foreground">{user.role}</p>}
      </div>
      <button
        type="button"
        aria-label="Logout"
        onClick={() => setConfirmOpen(true)}
        disabled={logoutMutation.isPending}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        <LogOut aria-hidden className="size-4" />
      </button>

      <ConfirmationPopUp
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          logoutMutation.mutate(undefined);
        }}
        message="Do you really want to logout?"
      />
    </div>
  );
});
