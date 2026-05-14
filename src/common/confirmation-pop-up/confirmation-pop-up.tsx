import { Button, Grid, Typography } from "@mui/material";
import CustomDialog from "../custom-dialog/custom-dialog";
import React from "react";
import { palette } from '../../../theme/palette';

type ConfirmationPopUpProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string | React.ReactNode;
  sx?: object;
  /** Disable the confirm button when true */
  confirmDisabled?: boolean;
  /** Optional error/helper message shown under the main message */
  errorMessage?: string | null;
};

const ConfirmationPopUp = (props: ConfirmationPopUpProps) => {
  const { open, onClose, onConfirm, message, sx } = props;
  const { confirmDisabled, errorMessage } = props;
  return (
    <CustomDialog
      width={{ xs: '90vw', sm: 480 }}
      title={"Confirm"}
      open={open}
      onClose={() => onClose()}
      sx={sx}
    >
      <Grid container flexDirection={"column"} rowGap={2}>
        <Typography variant="subtitle1">
          {message || "Do you really want to go ahead with this operation?"}
        </Typography>
        {errorMessage ? (
          <Typography variant="body2" sx={{ color: "error.main" }}>
            {errorMessage}
          </Typography>
        ) : null}
        <Grid
          container
          width={"100%"}
          justifyContent={"flex-end"}
          columnGap={1}
        >
          <Button
            variant="contained"
            onClick={() => onConfirm()}
            disabled={!!confirmDisabled}
            sx={{
              backgroundColor: palette.primary.main,
              color: palette.solid.white,
              border: "none",
              borderRadius: "6px",
              padding: "4px 14px",
              minWidth: "auto",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "16px",
              height: "38px",
              "&:hover": {
                backgroundColor: palette.primary.dark,
              },
              "&:focus-visible": {
                outline: `2px solid ${palette.primary.main}`,
                outlineOffset: "2px",
              },
              "&:disabled": {
                backgroundColor: palette.neutral["20"],
                color: palette.solid.white,
              },
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            onClick={() => onClose()}
            sx={{
              backgroundColor: palette.solid.white,
              color: palette.neutral["60"],
              border: `1px solid ${palette.neutral["20"]}`,
              borderRadius: "6px",
              padding: "4px 14px",
              minWidth: "auto",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "16px",
              height: "38px",
              "&:hover": {
                backgroundColor: palette.neutral["00"],
                borderColor: palette.neutral["40"],
              },
              "&:focus-visible": {
                outline: `2px solid ${palette.primary.main}`,
                outlineOffset: "2px",
              },
            }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </CustomDialog>
  );
};

export default ConfirmationPopUp;
