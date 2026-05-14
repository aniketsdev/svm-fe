import {
  Grid,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useMemo, useRef, useState, useEffect } from "react";
import { errorStyle } from "../custom-input/custom-input-styles";
import {
  customSelectStyles,
  selectInputStyle,
} from "./widgets/custom-select-widgets";
import { palette } from '../../../theme/palette';

interface CustomSelectProps {
  placeholder: string;
  name: string;
  value: string | undefined;
  items: {
    value: string;
    label: string;
    disabled?: boolean;
    child?: React.ReactElement;
  }[];
  onChange: (e: SelectChangeEvent<string>) => void;
  onOpen?: () => void;
  hasError?: boolean;
  loading?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  bgWhite?: boolean;
  enableDeselect?: boolean;
  statusPillMode?: boolean;
  height?: string | number;
  fontSize?: string;
  menuProps?: {
    PaperProps?: {
      style?: {
        maxHeight: number;
        width: number | string;
        zIndex?: number;
      };
    };
  };
}

function CustomSelect(props: CustomSelectProps) {
  const { items, bgWhite, enableDeselect, height, fontSize: customFontSize } = props;
  const resolvedFontSize = customFontSize || "16px";

  const handleValue = (e: SelectChangeEvent<string>) => {
    const selectedLabel = e.target.value;
    const selectedKey =
      props.items.find((item) => item.label === selectedLabel)?.value || "";
    e.target.value = selectedKey;

    props.onChange(e);
  };

  const getLabel = (value: string) => {
    const item = items?.find((item) => item.value === value);
    return item ? item.label : "";
  };

  // Detect if this select is inside a drawer by walking up the DOM tree from the actual element
  const selectRef = useRef<HTMLDivElement>(null);
  const [isInsideDrawer, setIsInsideDrawer] = useState(false);

  useEffect(() => {
    if (selectRef.current) {
      setIsInsideDrawer(selectRef.current.closest('.MuiDrawer-root') !== null);
    }
  }, []);

  // Default MenuProps with proper z-index and positioning
  // Always use portal (disablePortal: false) so dropdown isn't clipped by overflow containers.
  // Set z-index above drawer (1400) when inside one.
  const defaultMenuProps = useMemo(() => ({
    PaperProps: {
      style: {
        maxHeight: props.menuProps?.PaperProps?.style?.maxHeight ?? 300,
        maxWidth: props.menuProps?.PaperProps?.style?.width ?? 250,
        backgroundColor: 'white',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        ...(props.menuProps?.PaperProps?.style?.zIndex && { zIndex: props.menuProps.PaperProps.style.zIndex }),
      },
      sx: {
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": { display: "none" },
        "& .MuiList-root": {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      },
    },
    BackdropProps: {
      style: {
        backgroundColor: 'transparent',
      },
    },
    ...(isInsideDrawer && { sx: { zIndex: 1500 } }),
  }), [isInsideDrawer, props.menuProps]);

  const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
    UNDER_REVIEW: { bg: palette.informative['05'], color: palette.informative['50'] },
    COMPLETED: { bg: palette.positive['05'], color: palette.positive['50'] },
    REJECTED: { bg: palette.negative['05'], color: palette.negative['50'] },
    DRAFT: { bg: palette.neutral['05'], color: palette.neutral['50'] },
    DOCS_PENDING: { bg: palette.warning['05'], color: palette.warning['50'] },
    ONBOARDING_IN_PROGRESS: { bg: palette.informative['05'], color: palette.informative['50'] },
    REQUESTED: { bg: palette.informative['05'], color: palette.informative['40'] },
  };

  return (
    <>
      <Select
        ref={selectRef}
        disabled={props.isDisabled && props.isDisabled}
        MenuProps={defaultMenuProps}
        onOpen={props.onOpen}
        sx={{
          ...selectInputStyle,
          backgroundColor: bgWhite ? "white" : "inherit",
          ...(height && { height }), // Apply custom height when provided
        }}
        displayEmpty
        name={props?.name}
        value={getLabel(props.value ?? "")}
        onChange={handleValue}
        error={props.hasError}
        renderValue={(selected) => (
          <Typography
            className={`${customSelectStyles.headerLabel}`}
            sx={{
              color: selected
                ? palette.text.primary
                : palette.neutral['40'],
              fontWeight: 400,
              fontSize: `${resolvedFontSize} !important`,
              lineHeight: "1.5 !important",
              letterSpacing: "normal",
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              maxWidth: '100%',
              mr: 3,
            }}
          >
            {selected || props?.placeholder}
          </Typography>
        )}
      >
        {enableDeselect && (
          <MenuItem value="">
            <Typography
              className={`${customSelectStyles.headerLabel}`}
              sx={{
                fontWeight: 400,
                fontSize: `${resolvedFontSize} !important`,
                lineHeight: "1.5 !important",
                letterSpacing: "normal",
                color: palette.neutral['40'],
                fontStyle: 'italic',
              }}
            >
              None
            </Typography>
          </MenuItem>
        )}
        {props?.items?.length > 0 &&
          props.items.map((option) => (
            <MenuItem
              key={option.value}
              value={option.label}
              disabled={option.disabled}
            >
              {option.child && <Grid width={"100%"}>{option.child}</Grid>}
              {!option.child && (
                props.statusPillMode && STATUS_STYLES[option.value] ? (
                  <Typography
                    sx={{
                      px: 1.25,
                      py: 0.5,
                      borderRadius: "999px",
                      fontSize: "12px !important",
                      lineHeight: "1.4 !important",
                      fontWeight: 500,
                      width: "fit-content",
                      backgroundColor: STATUS_STYLES[option.value].bg,
                      color: STATUS_STYLES[option.value].color,
                    }}
                  >
                    {option.label}
                  </Typography>
                ) : (
                  <Typography
                    className={`${customSelectStyles.headerLabel}`}
                    sx={{
                      fontWeight: 400,
                      fontSize: `${resolvedFontSize} !important`,
                      lineHeight: "1.5 !important",
                      letterSpacing: "normal",
                      color: palette.text.primary,
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      maxWidth: "100%",
                    }}
                  >
                    {option.label}
                  </Typography>
                )
              )}

            </MenuItem>
          ))}
      </Select>
      {props.hasError && (
        <Typography
          sx={{
            ...errorStyle,
            fontSize: "12px", // Match CustomInput error font size
            lineHeight: "1.2", // Match CustomInput error line height
            letterSpacing: "normal",
            fontWeight: 400,
          }}
        >
          {props.hasError ? props.errorMessage : ""}
        </Typography>
      )}
    </>
  );
}

export default CustomSelect;
