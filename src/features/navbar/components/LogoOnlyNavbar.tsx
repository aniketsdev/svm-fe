import { AppBar, Toolbar, Box } from '@mui/material';
import { NAVBAR_HEIGHT } from '../constants';

export function LogoOnlyNavbar() {
  return (
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
        }}
      >
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
      </Toolbar>
    </AppBar>
  );
}
