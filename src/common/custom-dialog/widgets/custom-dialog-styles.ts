import { palette } from '../../../../theme/palette';

export const customDialogStyles = {
  dialog: {
    "& .MuiDialogContent-root": {
      padding: 10,
      backgroundColor: palette.solid.white,
    },
    "& .MuiDialogActions-root": {
      padding: 10,
      backgroundColor: palette.solid.white,
    },
    "& .MuiDialog-paper": {
      borderRadius: "12px",
      boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
      border: `1px solid ${palette.outline.decorative as string}`,
    },
  },
  dialogTitle: {
    color: palette.neutral['80'],
    fontSize: "20px",
    fontWeight: 700,
    padding: "20px 24px 16px",
    "& .MuiTypography-root": {
      fontWeight: 600,
      fontSize: "20px",
        color: palette.neutral['80'],
      lineHeight: 1.2,
    },
  },

  closeIcon: {
    color: palette.neutral['80'],
    marginTop: "-10px",
    marginRight: "-15px",
    "&:hover": {
      backgroundColor: palette.neutral['00'],
      borderRadius: "18px",
    },
  },
};
