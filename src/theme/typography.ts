export const typography = {
  fontFamily: '"Figtree", sans-serif',

  h1: {
    fontSize: '3rem',       // 48px
    lineHeight: '4rem',     // 64px
    fontWeight: 600,
    '@media (max-width:1200px)': {
      fontSize: '2.5rem',    // 40px
      lineHeight: '3.625rem', // 58px
    },
  },
  h2: {
    fontSize: '2.5rem',     // 40px
    lineHeight: '3.625rem', // 58px
    fontWeight: 600,
    '@media (max-width:1200px)': {
      fontSize: '2rem',      // 32px
      lineHeight: '3.25rem', // 52px
    },
  },
  h3: {
    fontSize: '2rem',       // 32px
    lineHeight: '3.25rem',  // 52px
    fontWeight: 600,
    '@media (max-width:1200px)': {
      fontSize: '1.5rem',    // 24px
      lineHeight: '2.75rem', // 44px
    },
  },
  h4: {
    fontSize: '1.5rem',     // 24px
    lineHeight: '2.75rem',  // 44px
    fontWeight: 600,
    '@media (max-width:1200px)': {
      fontSize: '1.25rem',   // 20px
      lineHeight: '2.5rem',  // 40px
    },
  },
  body1: {
    fontSize: '1.75rem',    // 28px
    lineHeight: '2.5rem',   // 40px
    fontWeight: 400,
    '@media (max-width:1200px)': {
      fontSize: '1.5rem',    // 24px
      lineHeight: '2.25rem', // 36px
    },
  },
  body2: {
    fontSize: '1.5rem',     // 24px
    lineHeight: '2.25rem',  // 36px
    fontWeight: 400,
    '@media (max-width:1200px)': {
      fontSize: '1.25rem',   // 20px
      lineHeight: '2rem',    // 32px
    },
  },
  subtitle1: {
    fontSize: '1.25rem',    // 20px (Body 3)
    lineHeight: '2rem',     // 32px
    fontWeight: 400,
    '@media (max-width:1200px)': {
      fontSize: '1.125rem',  // 18px
      lineHeight: '1.75rem', // 28px
    },
  },
  caption: {
    fontSize: '1.125rem',   // 18px (Caption 1)
    lineHeight: '1.75rem',  // 28px
    fontWeight: 400,
    '@media (max-width:1200px)': {
      fontSize: '1rem',      // 16px
      lineHeight: '1.5rem',  // 24px
    },
  },
  overline: {
    fontSize: '1rem',       // 16px (Caption 2)
    lineHeight: '1.5rem',   // 24px
    fontWeight: 400,
    '@media (max-width:1200px)': {
      fontSize: '0.875rem',  // 14px
      lineHeight: '1.375rem', // 22px
    },
  },
  button: {
    fontSize: '1.125rem',   // 18px
    lineHeight: '1.125rem', // 18px
    fontWeight: 500,
    textTransform: 'none',
    '@media (max-width:1200px)': {
      fontSize: '1rem',      // 16px
      lineHeight: '1.125rem', // 18px
    },
  },
};
