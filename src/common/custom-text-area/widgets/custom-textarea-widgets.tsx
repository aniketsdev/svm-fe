import { palette } from '../../../../theme/palette';

export const editTextAreaStyle = {
  textArea: {
    border: `1px solid ${palette.neutral['20']}`,
    height: "40px",
    padding: "10px 12px",
    width: "100%",
    color: palette.text.primary,
    fontSize: "14px",
    fontWeight: "400 ",
    lineHeight: "150% ",
    letterSpacing: "0.25px ",
    borderRadius: "8px ",

    "&::placeholder": {
      fontWeight: "400",
      fontSize: "15px",
      letterSpacing: "0.25%",
      lineHeight: "150%",
    },
  },
  errorMessage: {
    border: `1px solid ${palette.negative.main}`,
  },
};
