import type { Components, Theme } from '@mui/material/styles';
import { palette } from './palette';

export const components: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      arrow: true,
      enterDelay: 150,
      leaveDelay: 0,
    },
    styleOverrides: {
      tooltip: {
        backgroundColor: '#FFFFFF',
        color: palette.neutral['80'],
        fontSize: '12px',
        lineHeight: 1.5,
        fontWeight: 500,
        padding: '8px 12px',
        borderRadius: 8,
        border: `1px solid ${palette.neutral['10']}`,
        boxShadow: '0 4px 12px rgba(39, 49, 63, 0.12)',
        maxWidth: 260,
      },
      arrow: {
        color: '#FFFFFF',
        '&::before': {
          border: `1px solid ${palette.neutral['10']}`,
          backgroundColor: '#FFFFFF',
          boxSizing: 'border-box',
        },
      },
    },
  },
};
