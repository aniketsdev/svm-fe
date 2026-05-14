import { palette } from '../../../../theme/palette';

export const btnContainer = {
  height: "40px",
  marginBottom: "20px",
  justifyContent: "space-between",
};

export const filterSearchBox = {
  gap: "10px",
  display: "flex",
};

export const searchBar = {
  border: `0.8px solid ${palette.neutral['10'] as string}`,
  borderRadius: "10px",
  backgroundColor: palette.solid.white,
  "& fieldset": {
    border: "none",
  },
  ".MuiInputLabel-root": {
    top: "-6px",
    fontSize: "14px",
    color: palette.neutral['40'],
  },
  ".MuiOutlinedInput-root": {
    padding: "0px 0px 0px 8px  !important",
    height: "auto !important",
  },
  ".MuiChip-root": {
    height: "28px !important",
  },
};

export const searchIcon = {
  color: palette.neutral['40'],
};

export const btnStyle = {
  border: `0.8px solid ${palette.neutral['10'] as string}`,
  borderRadius: "10px",
  height: "40px",
};
