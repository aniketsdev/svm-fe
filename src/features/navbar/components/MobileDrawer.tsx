import { startTransition } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export function MobileDrawer({ open, onClose, navLinks }: MobileDrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    startTransition(() => navigate(path));
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: 'primary.dark',
          color: 'solid.white',
          width: { xs: '80vw', sm: 260 },
          maxWidth: 320,
        },
      }}
    >
      <Box sx={{ pt: 2 }}>
        <List>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.path}
              onClick={() => handleNav(link.path)}
              selected={location.pathname.startsWith(link.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  sx: { fontSize: '14px !important', lineHeight: '1.4 !important', fontWeight: 500 },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
