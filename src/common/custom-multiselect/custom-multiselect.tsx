import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import { TextField, Typography } from "@mui/material";
import { palette } from '../../../theme/palette';
import { customSelectStyles, selectInputStyle } from "../custom-select/widgets/custom-select-widgets";

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 10;
const VISIBLE_ITEMS = 5;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * VISIBLE_ITEMS + ITEM_PADDING_TOP + 50, // 50px extra for search field
    },
  },
};

type CustomMultiSelectProps = {
  options: { key: string; value: string }[];
  value: string[];
  onChange: (selectedValues: string[]) => void;
  bgWhite?: boolean;
  placeholder: string;
  enableSearch?: boolean;
  fontSize?: string;
};

const CustomMultiSelect = (props: CustomMultiSelectProps) => {
  const { options, value, onChange, bgWhite, placeholder, enableSearch, fontSize: customFontSize } = props;
  const resolvedFontSize = customFontSize || "14px";

  const optionKeys = options?.map((opt) => opt.key) || [];
  const optionValues = options?.map((opt) => opt.value) || [];
  const preSelectedCleanValues = value
    .filter((val) => optionKeys.includes(val))
    .map((val) => options.find((opt) => opt.key === val)?.value || "")
    .filter((val) => val);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>(
    preSelectedCleanValues,
  );
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOptions = optionValues.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const areArraysSame = (arr1: string[], arr2: string[]) => {
    const filteredArr1 = arr1.filter((item) => !arr2.includes(item));
    const filteredArr2 = arr2.filter((item) => !arr1.includes(item));
    return filteredArr1.length === 0 && filteredArr2.length === 0;
  };

  React.useEffect(() => {
    if (!areArraysSame(selectedOptions, preSelectedCleanValues)) {
      setSelectedOptions(preSelectedCleanValues);
    }
  }, [preSelectedCleanValues, selectedOptions]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    const selectedValArr = value as string[];
    setSelectedOptions(selectedValArr);
    onChange(
      selectedValArr
        .map((value) => options.find((opt) => opt.value === value)?.key || "")
        .filter((val) => val),
    );
  };

  return (
    <div>
      
      <Select
        sx={{
          ...selectInputStyle,
          backgroundColor: bgWhite === true ? "inherit" : "white",
        }}
        multiple
        size="small"
        displayEmpty
        value={selectedOptions}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => (
          <Typography
            variant="body2"
            className={`${customSelectStyles.headerLabel}`}
            sx={{
              color:
                selected.length > 0
                  ? palette.text.primary
                  : palette.neutral['40'],
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: resolvedFontSize,
            }}
          >
            {selected.length === 0
              ? placeholder
              : selected.length === 1
                ? selected[0]
                : `${selected.length} selected`}
          </Typography>
        )}
        MenuProps={MenuProps}
      >
        {enableSearch && (
          <MenuItem disableRipple>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.stopPropagation()}
              sx={{ '& .MuiInputBase-input': { fontSize: resolvedFontSize } }}
            />
          </MenuItem>
        )}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((optVal) => (
            <MenuItem key={optVal} value={optVal} sx={{ padding: 0 }}>
              <Checkbox checked={selectedOptions.indexOf(optVal) > -1} size="small" />
              <ListItemText primary={optVal} primaryTypographyProps={{ fontSize: resolvedFontSize }} />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No results found</MenuItem>
        )}
      </Select>
    </div>
  );
};

export default CustomMultiSelect;
