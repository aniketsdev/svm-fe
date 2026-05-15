import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationPopUp } from '../../../common/confirmation-pop-up';
import { UserAvatar } from '../../../common/user-avatar';
import { cn } from '../../../lib/cn';
import {
  authLogoutCreateMutation,
  authProfileRetrieveOptions,
} from '../../auth/api/auth-stubs';
import { useAuth } from '../../auth/hooks/useAuth';

export const UserMenu = memo(function UserMenu() {
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const logoutMutation = useMutation({
    ...authLogoutCreateMutation(),
    onSuccess: () => logout(),
    onError: () => logout(), // best-effort — still clears local state.
  });

  const { data: profile } = useQuery({
    ...authProfileRetrieveOptions(),
    enabled: isAuthenticated,
    staleTime: 60 * 60 * 1000,
  });

  const handleLogoutConfirm = () => {
    setLogoutConfirmOpen(false);
    logoutMutation.mutate({});
  };

  const firstName = profile?.first_name ?? user?.first_name ?? '';
  const lastName = profile?.last_name ?? user?.last_name ?? '';
  const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'User';
  const avatarSrc = (profile as { avatar_thumb_url?: string })?.avatar_thumb_url;

  return (
    <div className="flex items-center" data-slot="user-menu">
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button
            type="button"
            aria-label="User menu"
            className={cn(
              'inline-flex items-center gap-1 rounded-full p-0.5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
            )}
          >
            <UserAvatar
              src={avatarSrc}
              firstName={firstName}
              lastName={lastName}
              size={32}
              variant="soft"
            />
            <ChevronDown aria-hidden className="size-4 text-white" />
          </button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            align="end"
            sideOffset={8}
            className={cn(
              'z-50 min-w-[180px] overflow-hidden rounded-lg border border-border bg-background p-1 shadow-lg',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
            )}
          >
            <div className="px-3 py-2 text-sm font-medium text-foreground/80">{displayName}</div>
            <div className="my-1 h-px bg-border" />
            <DropdownMenuPrimitive.Item
              onSelect={() => navigate('/admin/profile')}
              className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-secondary"
            >
              <UserRound aria-hidden className="size-4 text-muted-foreground" />
              <span>Profile</span>
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item
              onSelect={(e) => {
                e.preventDefault();
                setLogoutConfirmOpen(true);
              }}
              disabled={logoutMutation.isPending}
              className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 data-[highlighted]:bg-secondary"
            >
              <LogOut aria-hidden className="size-4 text-muted-foreground" />
              <span>{logoutMutation.isPending ? 'Logging out…' : 'Logout'}</span>
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>

      <ConfirmationPopUp
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogoutConfirm}
        message="Do you really want to logout?"
      />
    </div>
  );
});
