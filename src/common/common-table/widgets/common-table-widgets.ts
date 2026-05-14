import { tableCellClasses } from "@mui/material/TableCell";
import { palette } from '../../../../theme/palette';

// Table header styling - aligned with Leads table column names (color, font)
export const heading = {
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: palette.neutral['00'],
    color: palette.neutral['70'],
    cursor: "pointer",
    padding: "10px 18px",
    height: "auto",
    fontWeight: 600,
    fontSize: "13.5px",
    lineHeight: "1.2",
    borderBottom: `1px solid ${palette.outline.decorative as string}`,
  },
  // Regular table cell styling
  [`&.${tableCellClasses.body}`]: {
    padding: "8px 16px", // Reduced padding for smaller row height
    borderBottom: `1px solid ${palette.neutral['00'] as string}`, // Neutral/5 from Figma
    fontSize: "14px",
    lineHeight: "1.2",
    letterSpacing: "0.8%",
    color: palette.neutral['70'], // Neutral/80 from Figma
    // textAlign: "center", // Center align all table cell content
    verticalAlign: "middle", // Center align vertically
  },
};

export const tableCellCss = {
  "& .MuiTableCell-head": {
    backgroundColor: palette.neutral['00'],
    borderBottom: `1px solid ${palette.outline.decorative as string}`,
    color: palette.neutral['70'],
    padding: "12px 16px !important",
  },
  "& .MuiTableCell-body": {
    borderBottom: `1px solid ${palette.neutral['00'] as string}`, // Neutral/5
    padding: "8px 16px !important", // Reduced padding for smaller row height
    verticalAlign: "middle", // Center align vertically
  },
};

export const linkCss = {
  textDecoration: "none",
  textOverflow: "ellipsis",
  width: "100%",
  overflow: "hidden",
  cursor: "pointer",
  color: "inherit",
};

export const typographyCss = {
  color: palette.neutral['70'], // Neutral/80 from Figma
};

// Typography for client names (primary text)
export const primaryTextCss = {
  color: palette.neutral['70'], // Neutral/90 from Figma
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "1.15",
  letterSpacing: "0.8%",
};

// Typography for secondary text (like organization names)
export const secondaryTextCss = {
  color: palette.secondary.main, // Primary/70 Main from Figma
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "1.2",
  letterSpacing: "1.2%",
};

// Typography for tertiary text (like emails)
export const tertiaryTextCss = {
  color: palette.neutral['40'], // Neutral/50 from Figma
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "1.2",
  letterSpacing: "1.2%",
};

export const linkCssWithDecoration = {
  textDecoration: "underline",
};

export const typographyCssForLink = {
  color: palette.primary.dark,
};

export const linkForLink = {
  color: palette.primary.main,
};

// Checkbox styling to match Figma design
export const checkboxCss = {
  padding: 0,
  width: 16,
  height: 16,
  borderRadius: "4px",
  border: `1px solid ${palette.neutral['40'] as string}`, // Neutral/40
  backgroundColor: palette.solid.white,
  "&.Mui-checked": {
    backgroundColor: palette.secondary.main, // Primary color
    borderColor: palette.secondary.main,
    color: palette.solid.white,
  },
};

// Action button styling to match Figma design
export const actionButtonCss = {
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "1.15",
  textTransform: "none",
  minWidth: "auto",
  gap: "8px",
};

// Deny button styling
export const denyButtonCss = {
  ...actionButtonCss,
  color: palette.negative.main, // Error/60
  backgroundColor: palette.solid.white,
  border: "1px solid transparent",
  "&:hover": {
    backgroundColor: palette.negative['01'],
  },
};

// Approve button styling
export const approveButtonCss = {
  ...actionButtonCss,
  color: palette.positive.main, // Success/70
  backgroundColor: palette.solid.white,
  border: "1px solid transparent",
  "&:hover": {
    backgroundColor: palette.positive['01'],
  },
};

// Avatar styling
export const avatarCss = {
  width: 32,
  height: 32,
  marginRight: "12px",
};

// Table container styling
export const tableContainerCss = {
  "& .MuiTable-root": {
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  "& .MuiTableHead-root": {
    "& .MuiTableCell-root": {
      backgroundColor: palette.neutral['00'], // Neutral/5
      borderBottom: `1px solid ${palette.outline.decorative as string}`, // Neutral/10
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      "&:hover": {
        backgroundColor: palette.neutral['00'],
      },
    },
    "& .MuiTableCell-root": {
      borderBottom: `1px solid ${palette.neutral['00'] as string}`, // Neutral/5
    },
  },
};

// Skeleton loading styles
export const skeletonRowCss = {
  "&:hover": {
    backgroundColor: "transparent !important", // Disable hover effect during loading
  },
};

export const skeletonCellCss = {
  ...heading,
  [`&.${tableCellClasses.body}`]: {
    padding: "12px 24px",
    borderBottom: `1px solid ${palette.neutral['00'] as string}`,
  },
};
