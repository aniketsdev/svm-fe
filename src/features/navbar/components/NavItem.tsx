import { startTransition, memo, useCallback } from 'react';
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { routePreloadMap } from '@/utils/routePreloadMap';

interface NavItemProps {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const NavItem = memo(function NavItem({ label, path, icon }: NavItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname.startsWith(path);

  const handlePreload = useCallback(() => {
    routePreloadMap[path]?.preload();
  }, [path]);

  return (
    <Button
      onMouseEnter={handlePreload}
      onFocus={handlePreload}
      onClick={(e) => {
        (e.currentTarget as HTMLElement).blur();
        startTransition(() => navigate(path));
      }}
      startIcon={icon}
      disableRipple
      sx={{
        color: isActive ? 'primary.main' : '#ffffff',
        textTransform: "none",
        fontSize: { xs: '14px !important', md: '15px !important', lg: '16px !important' },
        lineHeight: '1.2 !important',
        fontWeight: isActive ? 500 : 300,
        borderRadius: "5px",
        px: { md: 1.5, lg: 2 },
        py: 0.75,
        minWidth: "auto",
        whiteSpace: "nowrap",
        bgcolor: isActive ? "#f8f3f3" : "transparent",
        border: isActive
          ? "1px solid rgba(255, 255, 255, 0.35)"
          : "1px solid transparent",
        // "&:hover": {
        //   bgcolor: isActive
        //     ? "rgb(255, 255, 255)"
        //     : "rgba(255, 255, 255, 0.08)",
        // },
        "&:focus-visible": {
          outline: "2px solid white",
          outlineOffset: "-2px",
        },
      }}
    >
      {label}
    </Button>
  );
});
