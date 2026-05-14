import { palette } from '../../../../theme/palette';

export const customSelectStyles = {
  headerLabel: {},
};

export const selectInputStyle = {
  border: `1px solid ${palette.neutral['20']}`, // Default border - show always
  outline: "none",
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    paddingRight: "32px !important",
    padding: "8px 12px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .MuiSelect-icon": {
    right: "8px",
    pointerEvents: "none",
  },
  ".MuiOutlinedInput-notchedOutline": {
    border: "none !important", // Remove MUI default border completely
    boxShadow: "none !important",
    outline: "none !important",
  },
  height: "40px", // Match DatePicker / CustomInput height
  width: "100%",
  borderRadius: "6px", // Match CustomInput border radius
  boxShadow: "none", // Remove shadow to match CustomInput
  "&:hover": {
    border: `1px solid ${palette.neutral['30']}`, // Keep same border on hover
    outline: "none",
  },
  "&.Mui-focused": {
    outline: "none",
  },
  "&:focus-visible": {
    outline: `2px solid ${palette.primary.main}`,
    outlineOffset: "-2px",
  },

  "& .MuiInputBase-input": {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px !important",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "1.5",
    color: palette.text.primary,
    border: "none !important",
    outline: "none !important",
  },
  "&.Mui-error": {
    border: `0.5px solid ${palette.negative.main}`, // Match CustomInput error border
    padding: "0px!important",
    outline: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none !important", // Remove MUI focus border
    boxShadow: "none !important",
    outline: "none !important",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "none !important", // Remove MUI hover border
    boxShadow: "none !important",
    outline: "none !important",
  },
  // Apply border to the root input element
  "& .MuiOutlinedInput-root": {
    border: `1px solid ${palette.neutral['30']} !important`, // Show border always
    outline: "none !important",
    borderRadius: "6px", // Match border radius
    "&:hover": {
      border: `1px solid ${palette.neutral['30']} !important`, // Keep same border on hover
      outline: "none !important",
    },
    "&.Mui-focused": {
      border: `1px solid ${palette.neutral['30']} !important`, // Keep border on focus
      outline: "none !important",
    },
  },
};

export const someStyle = {
  ".MuiOutlinedInput-notchedOutline": { border: 0 },
  border: `1px solid ${palette.neutral['30']}`,
  height: "44px !important", // Matches button medium size height
  width: "100%",
  borderRadius: "8px",
  ".Mui-readOnly": {
    borderRadius: "8px",
    border: `1px solid ${palette.neutral['30']}`,
    padding: "10px !important",
  },
  ".css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
    display: "flex",
    alignItems: "center",
  },
};
