import type { SxProps, Theme } from "@mui/material/styles";
import theme from '../../../theme';
import { palette } from '../../../theme/palette';

// Main container for the pagination component
export const paginatorContainerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  width: "100%",
  padding: "10px 16px",
  borderRadius: "0px 0px 10px 10px",
  backgroundColor: theme.palette.common.white,
  gap: "16px",
  [theme.breakpoints.down('md')]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "12px",
    padding: "8px 12px",
  },
};

// Container for pagination controls (rows per page + pagination)
export const paginationControlsStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  [theme.breakpoints.down('md')]: {
    width: "100%",
    justifyContent: "space-between",
    gap: "8px",
    flexDirection: "column",
    alignItems: "center",
  },
};

// Rows per page container
export const rowsPerPageContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "0px 4px",
  minWidth: "135px",
  width: "auto",
  backgroundColor: theme.palette.common.white,
  borderRadius: "2px",
  flexShrink: 0,
  // Responsive design for small screens
  [theme.breakpoints.down('sm')]: {
    minWidth: "120px",
    gap: "2px",
  },
};

// Pagination main container
export const paginationMainStyles: SxProps<Theme> = {
  display: "inline-flex",
  border: `1px solid ${palette.neutral['10']}`,
  borderRadius: "4px",
  backgroundColor: theme.palette.common.white,
  overflow: "hidden",
  "& .MuiPagination-ul": {
    gap: 0,
    margin: 0,
    padding: 0,
    display: "flex",
    "& li": {
      margin: 0,
      padding: 0,
      "&:not(:last-child) .MuiPaginationItem-root": {
        borderRight: `1px solid ${palette.neutral['10']}`,
      },
      "&:first-of-type .MuiPaginationItem-root": {
        borderRadius: "4px 0 0 4px !important",
      },
      "&:last-of-type .MuiPaginationItem-root": {
        borderRadius: "0 4px 4px 0 !important",
      },
    },
  },
  // Responsive design for small screens
  [theme.breakpoints.down('sm')]: {
    "& .MuiPagination-ul": {
      gap: 0,
    },
  },
};

// Individual pagination item styles
export const paginationItemStyles: SxProps<Theme> = {
  width: "40px",
  height: "40px",
  minWidth: "40px",
  borderRadius: 0,
  border: "none",
  margin: 0,
  padding: 0,
  fontSize: "14px !important",
  lineHeight: "19.92px !important",
  "&.Mui-selected": {
    backgroundColor: palette.primary['00'],
    color: palette.neutral['80'],
    fontFamily: '"Figtree", sans-serif',
    fontWeight: 400,
    fontSize: "14px !important",
    lineHeight: "19.92px !important",
    letterSpacing: "0.4px",
    "&:hover": {
      backgroundColor: palette.primary['00'],
    },
  },
  "&:not(.Mui-selected)": {
    backgroundColor: "transparent",
    color: palette.neutral['80'],
    fontFamily: '"Figtree", sans-serif',
    fontWeight: 400,
    fontSize: "14px !important",
    lineHeight: "19.92px !important",
    letterSpacing: "0.4px",
    "&:hover": {
      backgroundColor: theme.palette.grey[50],
    },
  },
  // Responsive design for small screens
  [theme.breakpoints.down('sm')]: {
    width: "32px",
    height: "32px",
    minWidth: "32px",
    "&.Mui-selected": {
      fontSize: "12px !important",
    },
    "&:not(.Mui-selected)": {
      fontSize: "12px !important",
    },
  },
};

// Navigation button styles (Previous/Next)
export const navigationButtonStyles: SxProps<Theme> = {
  width: "40px",
  height: "40px",
  minWidth: "40px",
  borderRadius: 0,
  border: "none",
  margin: 0,
  padding: 0,
  backgroundColor: "transparent",
  "&.Mui-disabled": {
    opacity: 0.38,
    cursor: "not-allowed",
    pointerEvents: "auto",
    backgroundColor: "transparent",
    "& svg": {
      fill: palette.neutral['40'],
    },
  },
  "&:not(.Mui-disabled)": {
    "&:hover": {
      backgroundColor: theme.palette.grey[50],
    },
    "& svg": {
      fill: palette.neutral['60'],
    },
  },
  // Responsive design for small screens
  [theme.breakpoints.down('sm')]: {
    width: "32px",
    height: "32px",
    minWidth: "32px",
    "& svg": {
      width: "16px",
      height: "16px",
    },
  },
};

// Rows per page select styles
export const recordsSelectStyles: SxProps<Theme> = {
  "& .MuiSelect-select": {
    padding: "0 24px 0 0 !important",
    border: "none",
    fontSize: "14px !important",
    fontFamily: '"Figtree", sans-serif',
    fontWeight: 500,
    lineHeight: "20px !important",
    color: palette.neutral['80'],
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSelect-icon": {
    color: palette.neutral['80'],
    right: 0,
    top: "calc(50% - 12px)",
  },
};

// Rows per page label styles
export const rowsPerPageLabelStyles: SxProps<Theme> = {
  fontSize: "14px !important",
  fontFamily: '"Figtree", sans-serif',
  fontWeight: 400,
  lineHeight: "1.4 !important",
  color: palette.neutral['80'],
  whiteSpace: "nowrap",
  flexShrink: 0,
};

// Entries text styles (Showing X to Y of Z entries)
export const entriesTextStyles: SxProps<Theme> = {
  fontSize: "14px !important",
  fontFamily: '"Figtree", sans-serif',
  fontWeight: 400,
  lineHeight: "1.4 !important",
  color: palette.neutral['80'],
  "& span": {
    fontWeight: 700,
    color: palette.text.primary,
  },
};
