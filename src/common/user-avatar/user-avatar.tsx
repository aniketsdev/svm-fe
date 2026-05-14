import { useEffect, useReducer } from 'react';
import { Avatar, Box, CircularProgress, type SxProps, type Theme } from '@mui/material';
import { palette } from '../../../theme/palette';

export type UserAvatarVariant = 'solid' | 'soft';

export interface UserAvatarProps {
  /** Presigned image URL. If omitted/null, renders initials. */
  src?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  /** Square size in px. Default 28 (table rows). */
  size?: number;
  /**
   * Color style. 'solid' (default) = dark blue bg + white text.
   * 'soft' = light blue bg + dark blue text (used by the navbar only).
   */
  variant?: UserAvatarVariant;
  /** Extra sx overrides. */
  sx?: SxProps<Theme>;
  /** Click handler (e.g. to open detail). */
  onClick?: () => void;
}

function initialsOf(first?: string | null, last?: string | null): string {
  const f = (first || '').trim()[0] || '';
  const l = (last || '').trim()[0] || '';
  return (f + l).toUpperCase() || '?';
}

function fontSizeFor(size: number): string {
  if (size <= 32) return '12px';
  if (size <= 64) return '16px';
  if (size <= 88) return '22px';
  return '28px';
}

function variantColors(variant: UserAvatarVariant): { bgcolor: string; color: string } {
  if (variant === 'soft') {
    return { bgcolor: palette.primary['01'], color: palette.primary.main };
  }
  return { bgcolor: palette.primary.main, color: '#ffffff' };
}

interface ImgState {
  readySrc: string | null;
  loading: boolean;
}

type ImgAction =
  | { type: 'START_LOAD' }
  | { type: 'LOADED'; src: string }
  | { type: 'RESET' };

function imgReducer(_state: ImgState, action: ImgAction): ImgState {
  switch (action.type) {
    case 'START_LOAD':
      return { readySrc: null, loading: true };
    case 'LOADED':
      return { readySrc: action.src, loading: false };
    case 'RESET':
      return { readySrc: null, loading: false };
  }
}

export function UserAvatar({
  src,
  firstName,
  lastName,
  size = 28,
  variant = 'solid',
  sx,
  onClick,
}: UserAvatarProps) {
  const [{ readySrc, loading }, dispatch] = useReducer(imgReducer, {
    readySrc: null,
    loading: false,
  });

  useEffect(() => {
    if (!src) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({ type: 'START_LOAD' });

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      dispatch({ type: 'LOADED', src });
    };
    img.onerror = () => {
      if (cancelled) return;
      dispatch({ type: 'RESET' });
    };
    img.src = src;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  const spinnerSize = Math.max(14, Math.floor(size / 3));
  const colors = variantColors(variant);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : undefined,
      }}
      onClick={onClick}
    >
      <Avatar
        src={readySrc || undefined}
        sx={{
          width: size,
          height: size,
          bgcolor: colors.bgcolor,
          color: colors.color,
          fontSize: fontSizeFor(size),
          fontWeight: 600,
          ...sx,
        }}
      >
        {initialsOf(firstName, lastName)}
      </Avatar>

      {loading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.55)',
            pointerEvents: 'none',
          }}
        >
          <CircularProgress size={spinnerSize} thickness={4} sx={{ color: palette.primary.main }} />
        </Box>
      )}
    </Box>
  );
}

export default UserAvatar;
