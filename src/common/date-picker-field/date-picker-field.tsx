import { Typography } from "@mui/material";
import {
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DateRangeIcon } from "@mui/x-date-pickers/icons";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { palette } from '../../../theme/palette';
import { errorStyle } from "../custom-input/custom-input-styles";

// Enable custom parse format plugin
dayjs.extend(customParseFormat);

export interface DatePickerProps {
  /** Field name for form handling */
  name?: string;
  /** Custom styles for the component */
  styles?: React.CSSProperties;
  /** Whether to use custom styling */
  useCustomStyle?: boolean;
  /** Current selected date value */
  value?: Dayjs | null;
  /** Maximum selectable date */
  maxDate?: Dayjs;
  /** Minimum selectable date */
  minDate?: Dayjs;
  /** Callback fired when date changes */
  onChange: (date: Dayjs | null) => void;
  /** Whether field has validation error */
  hasError?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Disable future dates */
  disableFuture?: boolean;
  /** Field label/placeholder */
  label?: string;
  /** Disable past dates */
  disablePast?: boolean;
  /** Use white background */
  bgWhite?: boolean;
  /** Date format string */
  format?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether to show clear icon */
  showClearIcon?: boolean;
}
const DatePickerField = (props: DatePickerProps) => {
  const {
    hasError = false,
    onChange,
    value,
    useCustomStyle = false,
    maxDate,
    disableFuture = false,
    disablePast = false,
    label,
    minDate,
    format = "MM-DD-YYYY",
    errorMessage,
    disabled = false,
    showClearIcon = true,
  } = props;

  const [cleared, setCleared] = useState(false);
  const [internalValue, setInternalValue] = useState<Dayjs | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [cleared]);

  // Sync internal value with external value
  useEffect(() => {
    if (value) {
      setInternalValue(dayjs(value));
      // Clear validation error when value is set externally (e.g., form reset)
      setValidationError(null);
    } else {
      setInternalValue(null);
      setValidationError(null);
    }
  }, [value]);

  const inputValue = useMemo(() => {
    return internalValue;
  }, [internalValue]);

  const validateDate = useCallback((
    dateValue: Dayjs | null,
  ): string | null => {
    if (!dateValue) {
      return null; // Allow null/empty values
    }

    if (!dateValue.isValid()) {
      return "Invalid date format";
    }

    const today = dayjs().startOf('day');
    const dateToCheck = dateValue.startOf('day');

    // Check disablePast
    if (disablePast && dateToCheck.isBefore(today)) {
      return "Past dates are not allowed";
    }

    // Check disableFuture
    if (disableFuture && dateToCheck.isAfter(today)) {
      return "Future dates are not allowed";
    }

    // Check minDate
    if (minDate) {
      const minDateToCheck = dayjs(minDate).startOf('day');
      if (dateToCheck.isBefore(minDateToCheck)) {
        return `Date must be on or after ${minDateToCheck.format(format)}`;
      }
    }

    // Check maxDate
    if (maxDate) {
      const maxDateToCheck = dayjs(maxDate).startOf('day');
      if (dateToCheck.isAfter(maxDateToCheck)) {
        return `Date must be on or before ${maxDateToCheck.format(format)}`;
      }
    }

    return null; // No validation error
  }, [disablePast, disableFuture, minDate, maxDate, format]);

  const handleChange = useCallback((
    newValue: Dayjs | null,
  ) => {
    // Update internal value immediately for UI responsiveness
    setInternalValue(newValue);
    
    // Validate the date
    const error = validateDate(newValue);
    setValidationError(error);

    // Only call onChange if we have a valid date with no validation errors
    if (newValue && newValue.isValid() && !error) {
      onChange(newValue);
    } else if (newValue === null) {
      // Allow clearing the field
      setValidationError(null);
      onChange(null);
    } else if (error) {
      // If there's a validation error, don't call onChange
      // This prevents invalid dates from being accepted
    }
  }, [onChange, validateDate]);


  const textFieldProps = useMemo(() => {
    const props: Record<string, unknown> = { 
      fullWidth: true,
      InputProps: {
        readOnly: false, // Enable manual date entry
      }
    };
    if (!useCustomStyle) props["placeholder"] = "Select Date";
    if (label) props["placeholder"] = label;
    return props;
  }, [useCustomStyle, label]);


  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          value={inputValue}
          closeOnSelect={true}
          onChange={handleChange}
          format={format}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          minDate={minDate ? dayjs(minDate) : undefined}
          disableFuture={disableFuture}
          disablePast={disablePast}
          disabled={disabled}
          // Don't show error icon while typing
          onError={() => {}}
          slotProps={{
            textField: {
              ...textFieldProps,
              error: hasError || !!validationError,
              // helperText: hasError ? errorMessage : undefined,
            },
            field: { 
              clearable: showClearIcon, 
              onClear: () => {
                setCleared(true);
                setInternalValue(null);
                onChange(null);
              },
            },
            openPickerIcon: { children: <DateRangeIcon /> },
            inputAdornment: {
              position: "start",
            },
            popper: {
              sx: {
                zIndex: 1500,
                // Scale down calendar text to match compact form styling
                '& .MuiPickersCalendarHeader-label': {
                  fontSize: '14px',
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  fontSize: '12px',
                },
                '& .MuiPickersDay-root': {
                  fontSize: '13px',
                },
                '& .MuiPickersYear-yearButton': {
                  fontSize: '13px',
                },
              },
            },
          }}
          sx={useMemo(
            () => {
              const showError = hasError || !!validationError;
              return {
                width: '100%',
                "& .MuiInputBase-input": {
                  fontSize: "16px", // Match custom input font size (16px per custom-input-styles)
                  padding: "8px 12px", // Match custom input padding
                  borderRadius: "6px", // Match custom input border radius
                  color: palette.neutral['80'], // Match custom input text color
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  "&::placeholder": {
                    fontSize: "16px",
                    color: palette.neutral['40'],
                    opacity: 1,
                  },
                  "&:focus": {
                    outline: "none"
                  },
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px", // Match custom input border radius
                  minHeight: "36px", // Match custom input min height
                  height: "40px", // Set exact height to match custom input
                  backgroundColor: palette.solid.white, // White background
                  border: showError ? `1px solid ${errorStyle.color}` : `1px solid ${palette.neutral['10'] as string}`, // Match custom input border
                  borderWidth: "1px !important", // Keep border width constant
                  boxShadow: "none",
                  outline: "none",
                  "&:hover": {
                    borderColor: showError ? errorStyle.color : palette.neutral['10'], // Match custom input hover
                    borderWidth: "1px !important", // Keep border width constant on hover
                  },
                  "&.Mui-focused": {
                    borderColor: showError ? errorStyle.color : palette.neutral['10'], // Match custom input focus
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
                  fontSize: "16px", // Override default 24px to match CustomInput
                  height: "45px !important",
                  borderRadius: "6px",
                  padding: "0px 12px", // Match custom input padding
                  backgroundColor: palette.solid.white, // White background
                  border: showError ? `1px solid ${errorStyle.color}` : `1px solid ${palette.neutral['10'] as string}`, // Match custom input border
                  borderWidth: "1px !important", // Keep border width constant
                  boxShadow: "none",
                  outline: "none",
                  "&:hover": {
                    borderColor: showError ? errorStyle.color : palette.neutral['10'], // Match custom input hover
                    borderWidth: "1px !important", // Keep border width constant on hover
                  },
                  "&.Mui-focused": {
                    borderColor: showError ? errorStyle.color : palette.neutral['10'], // Match custom input focus
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
                "& .MuiPickersInputBase-sectionContent": {
                  fontSize: "16px", // Match custom input font size
                  color: palette.neutral['80'],
                },
                "& .MuiPickersSectionList-sectionSeparator": {
                  fontSize: "16px",
                  color: palette.neutral['80'],
                },
                "& .MuiPickersInputBase-root.Mui-error": {
                  "& fieldset": {
                    border: "none !important", // Remove fieldset border even on error
                    borderWidth: "0 !important",
                  },
                },
              };
            },
            [hasError, validationError]
          )}
        />
      </LocalizationProvider>
      {(hasError || validationError) && (errorMessage || validationError) && (
        <Typography
          sx={{
            ...errorStyle,
            fontSize: "0.75rem",
            lineHeight: 1.50,
            letterSpacing: "0.03333em",
          }}
        >
          {validationError || errorMessage}
        </Typography>
      )}
    </>
  );
}

export default memo(DatePickerField);
