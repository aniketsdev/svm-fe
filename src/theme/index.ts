import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { components } from './components';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: typeof palette.neutral;
    informative: typeof palette.informative;
    positive: typeof palette.positive;
    negative: typeof palette.negative;
    solid: typeof palette.solid;
    outline: typeof palette.outline;
  }
  interface PaletteOptions {
    neutral?: typeof palette.neutral;
    informative?: typeof palette.informative;
    positive?: typeof palette.positive;
    negative?: typeof palette.negative;
    solid?: typeof palette.solid;
    outline?: typeof palette.outline;
  }
  interface PaletteColor {
    '00'?: string;
    '01'?: string;
    '02'?: string;
    '03'?: string;
    '04'?: string;
    '05'?: string;
    '06'?: string;
    '07'?: string;
    '08'?: string;
    '09'?: string;
    '10'?: string;
    '20'?: string;
    '30'?: string;
    '40'?: string;
    '50'?: string;
    '60'?: string;
    '70'?: string;
    '80'?: string;
    '90'?: string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      ...palette.primary,
    },
    secondary: {
      ...palette.secondary,
    },
    error: {
      light: palette.negative.light,
      main: palette.negative.main,
      dark: palette.negative.dark,
      contrastText: palette.negative.contrastText,
    },
    warning: {
      light: palette.warning.light,
      main: palette.warning.main,
      dark: palette.warning.dark,
      contrastText: palette.warning.contrastText,
    },
    info: {
      light: palette.informative.light,
      main: palette.informative.main,
      dark: palette.informative.dark,
      contrastText: palette.informative.contrastText,
    },
    success: {
      light: palette.positive.light,
      main: palette.positive.main,
      dark: palette.positive.dark,
      contrastText: palette.positive.contrastText,
    },
    text: palette.text,
    background: palette.background,
    neutral: palette.neutral,
    informative: palette.informative,
    positive: palette.positive,
    negative: palette.negative,
    solid: palette.solid,
    outline: palette.outline,
  },
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
});

export { palette } from './palette';
export { typography } from './typography';
export default theme;
