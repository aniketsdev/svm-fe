import { styled } from '@mui/material/styles';
import { Box, FormControlLabel } from '@mui/material';
import { palette } from '../../../theme/palette';

const colors = {
  primary: {
    main: palette.primary.main as string,
    light: palette.primary['00'] as string,
    dark: palette.primary.dark as string,
  },
  neutral: {
    1: palette.neutral['00'] as string,
    5: palette.neutral['05'] as string,
    40: palette.neutral['40'] as string,
    60: palette.neutral['50'] as string,
    80: palette.text.primary as string,
  },
  white: palette.solid.white as string,
};

// Size variants
const sizes = {
  sm: {
    radio: 16,
    borderRadius: 8, // Fully rounded for radio buttons
    dotSize: 6,
  },
  md: {
    radio: 20,
    borderRadius: 10, // Fully rounded for radio buttons
    dotSize: 8,
  },
};

// Base radio button container
export const RadioContainer = styled(Box)<{
  size: 'sm' | 'md';
  checked: boolean;
  disabled: boolean;
  focused: boolean;
  hovered: boolean;
}>(({ size, checked, disabled, focused, hovered }) => {
  const sizeConfig = sizes[size];
  
  let backgroundColor = colors.white;
  let borderColor = colors.neutral[40];
  let boxShadow = 'none';
  
  if (disabled) {
    backgroundColor = colors.neutral[1];
    borderColor = colors.neutral[5];
  } else if (checked) {
    backgroundColor = colors.primary.light;
    borderColor = colors.primary.main;
  } else if (hovered) {
    backgroundColor = colors.primary.light;
    borderColor = colors.primary.dark;
  }
  
  if (focused) {
    boxShadow = `0px 0px 0px 4px rgba(251, 255, 247, 1)`;
  }
  
  return {
    width: sizeConfig.radio,
    height: sizeConfig.radio,
    borderRadius: sizeConfig.borderRadius,
    border: `1px solid ${borderColor}`,
    backgroundColor,
    boxShadow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
  };
});

// Radio button dot (inner circle)
export const RadioDot = styled(Box)<{
  size: 'sm' | 'md';
  checked: boolean;
  disabled: boolean;
}>(({ size, checked, disabled }) => {
  const sizeConfig = sizes[size];
  
  let backgroundColor = colors.primary.main;
  if (disabled) {
    backgroundColor = colors.neutral[5];
  }
  
  return {
    width: sizeConfig.dotSize,
    height: sizeConfig.dotSize,
    borderRadius: '50%',
    backgroundColor,
    opacity: checked ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out',
  };
});

// Custom FormControlLabel
export const CustomFormControlLabel = styled(FormControlLabel)<{
  size: 'sm' | 'md';
  disabled: boolean;
}>(({ size, disabled }) => {
  const gap = size === 'sm' ? 8 : 12;
  
  return {
    marginTop: 0,
    alignItems: 'flex-start',
    gap: gap,
    '& .MuiFormControlLabel-label': {
      fontSize: size === 'sm' ? '14px' : '16px',
      lineHeight: size === 'sm' ? 1.6 : 1.6,
      color: disabled ? colors.neutral[40] : colors.neutral[80],
      margin: 0,
      paddingTop: size === 'sm' ? '2px' : '0px',
    },
  };
});

// Supporting text container
export const SupportingTextContainer = styled(Box)<{
  size: 'sm' | 'md';
  disabled: boolean;
}>(({ size, disabled }) => {
  return {
    fontSize: size === 'sm' ? '14px' : '16px',
    lineHeight: size === 'sm' ? 1.6 : 1.6,
    color: disabled ? colors.neutral[40] : colors.neutral[60],
    marginTop: size === 'sm' ? '2px' : '2px',
  };
});

// Main container for radio with text
export const RadioWithTextContainer = styled(Box)<{
  size: 'sm' | 'md';
}>(({ size }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: size === 'sm' ? '2px' : '2px',
    marginTop: "-5px"
  };
});
