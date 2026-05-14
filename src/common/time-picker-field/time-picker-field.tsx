import { Stack, Typography } from "@mui/material";
import {
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { palette } from '../../../theme/palette';
import { errorStyle } from "../custom-input/custom-input-styles";
import { prefixItWithZero } from "./utils";

type TimePickerFieldProps = {
  onChange: (value: string) => void;
  width?: string;
  value: string;
  hasError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
};

const TimePickerField = (props: TimePickerFieldProps) => {
  const { onChange, hasError, errorMessage, width, value, disabled } = props;
  const [timeValue, setTimeValue] = useState<string>(value);

  // Check if TimePicker is inside a drawer
  const isInsideDrawer = useMemo(() => 
    document.querySelector('.MuiDrawer-root') !== null,
    []
  );

  useEffect(() => {
    setTimeValue(value);
  }, [value]);

  const handleTimeChange = useCallback((
    value: Dayjs | null,
  ) => {
    if (value) {
      const selectedDate = new Date(value.toISOString());
      const formattedTime = `${prefixItWithZero(
        selectedDate.getHours().toString(),
      )}:${prefixItWithZero(selectedDate.getMinutes().toString())}`;
      setTimeValue(formattedTime);
      onChange(formattedTime);
    } else {
      // Handle clear button click
      setTimeValue("");
      onChange("");
    }
  }, [onChange]);

  const timePickerValue = useMemo(() => {
    return timeValue ? dayjs(`2023-01-01T${timeValue}`) : null;
  }, [timeValue]);

  const timePickerStyles = useMemo(
    () => ({
      "& .MuiInputBase-input": {
        fontSize: "16px", // Match custom input font size
        padding: "8px 12px", // Match custom input padding
        borderRadius: "6px", // Match custom input border radius
        color: palette.neutral['80'], // Match custom input text color
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        "&:focus": {
          outline: "none",
        },
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: "6px", // Match custom input border radius
        minHeight: "36px", // Match custom input min height
        height: "45px", // Set exact height to match custom input
        backgroundColor: palette.solid.white, // White background
        border: hasError ? `1px solid ${errorStyle.color}` : `1px solid ${palette.neutral['10'] as string}`, // Match custom input border
        borderWidth: "1px !important", // Keep border width constant
        boxShadow: "none",
        outline: "none",
        "&:hover": {
          borderColor: hasError ? errorStyle.color : palette.neutral['10'], // Match custom input hover
          borderWidth: "1px !important", // Keep border width constant on hover
        },
        "&.Mui-focused": {
          borderColor: hasError ? errorStyle.color : palette.neutral['10'], // Match custom input focus
          borderWidth: "1px !important", // Keep border width constant on focus
          boxShadow: "none",
          outline: "none",
        },
        "& fieldset": {
          border: "none !important", // Remove default fieldset border
          borderWidth: "0 !important", // Ensure no border width
        },
      },
      "& .MuiPickersInputBase-root": {
        height: "45px",
        borderRadius: "6px",
        backgroundColor: palette.solid.white, // White background
        border: hasError ? `1px solid ${errorStyle.color}` : `1px solid ${palette.neutral['10'] as string}`, // Match custom input border
        borderWidth: "1px !important", // Keep border width constant
        boxShadow: "none",
        outline: "none",
        "&:hover": {
          borderColor: hasError ? errorStyle.color : palette.neutral['10'], // Match custom input hover
          borderWidth: "1px !important", // Keep border width constant on hover
        },
        "&.Mui-focused": {
          borderColor: hasError ? errorStyle.color : palette.neutral['10'], // Match custom input focus
          borderWidth: "1px !important", // Keep border width constant on focus
          boxShadow: "none",
          outline: "none",
        },
        "& fieldset": {
          border: "none !important", // Remove default fieldset border
          borderWidth: "0 !important", // Ensure no border width
        },
      },
      "& .MuiOutlinedInput-root.Mui-error": {
        "& fieldset": {
          border: "none !important", // Remove fieldset border even on error
          borderWidth: "0 !important",
        },
      },
      "& .MuiPickersInputBase-root.Mui-error": {
        "& fieldset": {
          border: "none !important", // Remove fieldset border even on error
          borderWidth: "0 !important",
        },
      },
    }),
    [hasError]
  );

  return (
    <Stack width={width || "100%"}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          onChange={handleTimeChange}
          value={timePickerValue}
          disabled={disabled}
          sx={timePickerStyles}
          slotProps={{
            field: { clearable: true },
            openPickerIcon: { children: <AccessTimeIcon /> },
            inputAdornment: {
              position: "start",
            },
            popper: {
              sx: {
                zIndex: 1500, // Reasonable z-index
              },
              disablePortal: isInsideDrawer, // Disable portal when inside drawer
            },
          }}
        />
      </LocalizationProvider>
      <Typography 
        sx={{
          ...errorStyle,
          fontSize: "0.75rem",
          lineHeight: 1.66,
          letterSpacing: "0.03333em",
        }}
      >
        {hasError ? errorMessage : ""}
      </Typography>
    </Stack>
  );
};

export default TimePickerField;
