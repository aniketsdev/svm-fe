import { palette } from '../../../theme/palette';

export const errorStyle = {
  color: palette.negative.main, // Error Red from Figma
  fontSize: "12px",
  marginTop: "4px",
  fontWeight: 400,
  lineHeight: "1.2",
};

export const customInputStyles = {
  textFieldRoot: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "8px 12px", // Reduced vertical padding from 16px to 8px
    gap: "8px",
    width: "100%",
    minHeight: "36px", // Reduced from 48px to make it smaller
    background: palette.solid.white,
    border: `1px solid ${palette.neutral['10']}`, // Neutral/10 from Figma
    boxShadow: "none", // Removed shadow to match Figma
    borderRadius: "6px",
    "&:hover": {
      borderColor: palette.neutral['20'], // Neutral/20 from Figma
      boxShadow: "none", // Explicitly remove shadow on hover
    },
    "&:focus-within": {
      boxShadow: "none",
    },
    "&.disabled": {
      backgroundColor: palette.neutral['05'], // Neutral/5 from Figma
      borderColor: palette.neutral['10'], // Neutral/10 from Figma
      cursor: "not-allowed",
    },
  },
  textFieldInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    // "&:focus-visible": {
    //   outline: `2px solid ${palette.primary.main}`,
    //   outlineOffset: "-2px",
    // },
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px", // Increased from 14px to match Figma
    lineHeight: "1.5", // 150% line height
    color: palette.text.primary, // Neutral/80 from Figma
    width: "100%",
    minWidth: 0, // Prevent overflow
    boxSizing: "border-box",
    "&::placeholder": {
      color: palette.neutral['40'], // Neutral/40 from Figma
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "1.5",
      opacity: 1, // Ensure placeholder is visible
    },
    "&.disabled": {
      color: palette.neutral['40'], // Neutral/40 from Figma
      cursor: "not-allowed",
    },
    // For single-line inputs (not textarea), prevent placeholder overflow
    "&:not(textarea)": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      "&::placeholder": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
  },
  textFieldError: {
    borderColor: palette.negative.main, // Error Red from Figma
    "&:focus-within": {
      borderColor: palette.negative.main, // Error Red from Figma
      boxShadow: "none",
    },
    "&:hover": {
      borderColor: palette.negative.main, // Error Red from Figma
      boxShadow: "none",
    },
  },
  iconStyle: {
    width: "20px", // Increased from 18px to match Figma
    height: "20px",
    color: palette.text.primary, // Neutral/80 from Figma
    flexShrink: 0,
  },
  // Additional styles for different states
  // textFieldFocus: {
  //   borderColor: "#439322", // Primary Green from Figma
  //   "& input": {
  //     // color: "#439322", // Primary Green text when focused
  //   },
  // },
  textFieldDisabled: {
    backgroundColor: palette.neutral['05'], // Neutral/5 from Figma
    borderColor: palette.neutral['10'], // Neutral/10 from Figma
    cursor: "not-allowed",
    "& input": {
      color: palette.neutral['40'], // Neutral/40 from Figma
      cursor: "not-allowed",
    },
    "& .iconStyle": {
      color: palette.neutral['40'], // Neutral/40 from Figma
    },
  },
};
