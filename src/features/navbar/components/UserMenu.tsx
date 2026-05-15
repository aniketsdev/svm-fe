import { useState, memo } from 'react';
import { Box, IconButton, Menu, MenuItem, Typography, Divider } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  authLogoutCreateMutation,
  authProfileRetrieveOptions,
} from '../../../sdk/@tanstack/react-query.gen';
import { useAuth } from '../../auth/hooks/useAuth';
import ConfirmationPopUp from '../../../components/common/confirmation-pop-up/confirmation-pop-up';
import { UserAvatar } from '../../../components/common';

export const UserMenu = memo(function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const logoutMutation = useMutation({
    ...authLogoutCreateMutation(),
    onSuccess: () => {
      logout();
    },
    onError: () => {
      logout();
    },
  });

  const { data: profile } = useQuery({
    ...authProfileRetrieveOptions(),
    enabled: isAuthenticated,
    staleTime: 60 * 60 * 1000,
  });

  const handleLogoutClick = () => {
    setAnchorEl(null);
    setLogoutConfirmOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutConfirmOpen(false);
    logoutMutation.mutate({});
  };

  const firstName = profile?.first_name ?? user?.first_name ?? '';
  const lastName = profile?.last_name ?? user?.last_name ?? '';
  const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'User';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="User menu"
        sx={{ p: 0, gap: 0.5, '&:focus-visible': { outline: '2px solid white', outlineOffset: '2px' } }}
      >
        <UserAvatar
          src={profile?.avatar_thumb_url}
          firstName={firstName}
          lastName={lastName}
          size={32}
          variant="soft"
        />
        <KeyboardArrowDownIcon sx={{ color: 'solid.white', fontSize: 18 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
              '& .MuiMenuItem-root': {
                fontSize: '16px !important',
                lineHeight: '1.4 !important',
                py: 0.75,
                px: 1.5,
                minHeight: 'unset',
              },
            },
          },
        }}
      >
        <MenuItem disabled sx={{ opacity: '0.7 !important' }}>
          <Typography sx={{ fontSize: '16px !important', lineHeight: '1.4 !important', fontWeight: 500 }}>
            {displayName}
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin/profile'); }}>
          <PersonOutlineIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '16px !important', lineHeight: '1.4 !important' }}>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogoutClick} disabled={logoutMutation.isPending}>
          <LogoutIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '16px !important', lineHeight: '1.4 !important' }}>
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </Typography>
        </MenuItem>
      </Menu>

      <ConfirmationPopUp
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogoutConfirm}
        message="Do you really want to logout?"
      />
    </Box>
  );
});
