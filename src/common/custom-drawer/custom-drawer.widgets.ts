import { palette } from '../../../theme/palette';

export const gridHeader = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 55px",
  borderBottom: `1px solid ${palette.neutral['10']}`,
  "@media (max-width: 768px)": {
    padding: "8px 15px",
  },
  "@media (max-width: 480px)": {
    padding: "8px 10px",
  },
};

export const drawerHeader = {
  color: `${palette.neutral['70']} !important`,
  fontFamily: '"Figtree", sans-serif !important',
  fontStyle: "normal !important",
  fontWeight: "500 !important",
  lineHeight: "150% !important",
  letterSpacing: "0.1px !important",
};
