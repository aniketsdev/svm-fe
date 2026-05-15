import { useState } from 'react';
import { AppBar, Toolbar, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { NavItem } from './NavItem';
import { UserMenu } from './UserMenu';
import { MobileDrawer } from './MobileDrawer';
import { GlobalSearch } from './GlobalSearch';
import { NAVBAR_HEIGHT } from '../constants';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <HomeIcon fontSize="small" /> },
  { label: 'All Clients', path: '/admin/clients', icon: <PeopleIcon fontSize="small" /> },
  { label: 'Assessments', path: '/admin/assessments', icon: <AssignmentIcon fontSize="small" /> },
  // { label: 'Schedule', path: '/admin/scheduling', icon: <CalendarMonthIcon fontSize="small" /> },
  { label: 'Settings', path: '/admin/settings', icon: <SettingsIcon fontSize="small" /> },
];

export function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'primary.08',
          height: NAVBAR_HEIGHT,
          justifyContent: 'center',
        }}
      >
        <Toolbar
          sx={{
            minHeight: `${NAVBAR_HEIGHT}px !important`,
            px: { xs: 1, md: 2 },
            gap: 2,
          }}
        >
          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'solid.white', '&:focus-visible': { outline: '2px solid white', outlineOffset: '2px' } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box
            component="img"
            src="/logo-dark-bg.svg"
            alt="Mind Health Group"
            sx={{
              height: 34,
              width: 'auto',
              flexShrink: 0,
            }}
          />

          {/* Desktop nav items — centered */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                gap: 2,
              }}
            >
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.path}
                  label={link.label}
                  path={link.path}
                  icon={link.icon}
                />
              ))}
            </Box>
          )}

          {/* Spacer on mobile */}
          {isMobile && <Box sx={{ flex: 1 }} />}

          {/* Right section: Search + User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1, md: 1.5, lg: 2 }, flexShrink: 0 }}>
            <GlobalSearch />
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      {isMobile && (
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          navLinks={NAV_LINKS}
        />
      )}
    </>
  );
}
