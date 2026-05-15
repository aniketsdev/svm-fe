/**
 * Shared form-level sx overrides.
 *
 * Use these constants anywhere CustomSelect or DatePicker appears beside
 * CustomInput fields so their visual heights stay aligned.
 */

/**
 * Forces a CustomSelect wrapper to match the 40px height of CustomInput
 * and reserves the same bottom space as an error message <Typography>.
 */
export const selectAlignSx = {
  '& .MuiInputBase-root': {
    height: '40px !important',
    minHeight: '40px !important',
    boxSizing: 'border-box',
    '& .MuiSelect-select': {
      padding: '8px 12px !important',
      display: 'flex',
      alignItems: 'center',
    },
  },
  '&::after': {
    content: '""',
    display: 'block',
    height: '20px',
  },
} as const;

/**
 * Forces a DatePicker wrapper to match CustomInput 40px height.
 */
export const datePickerAlignSx = {
  '& .MuiOutlinedInput-root': { height: '40px !important', minHeight: '36px !important' },
  '& .MuiPickersInputBase-root': { height: '40px !important' },
} as const;

/**
 * Responsive form row: side-by-side on sm+, stacked on xs.
 */
export const formRowSx = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 2,
} as const;

/**
 * Bordered section card used for fieldset-like groupings in forms.
 */
export const sectionCardSx = {
  border: '1px solid',
  borderColor: 'neutral.10',
  borderRadius: '8px',
  p: 2.5,
} as const;

/**
 * Floating section label positioned over a sectionCardSx border.
 */
export const sectionLabelSx = {
  fontSize: '13px',
  fontWeight: 500,
  color: 'text.secondary',
  bgcolor: 'solid.white',
  px: 1,
  position: 'relative',
  top: -22,
  left: 4,
  display: 'inline-block',
} as const;

/**
 * Responsive density overrides for drawer form content.
 *
 * Apply on a wrapper Box inside a drawer to scale fonts/paddings down at
 * smaller viewports so forms fit on 13-14" laptops without excessive scroll.
 * At lg (≥1200px) values match the pre-existing desktop design.
 *
 * Scope: only affects descendants — doesn't leak to page-level forms.
 */
export const drawerResponsiveSx = {
  // Native <input> used inside CustomInput primitive.
  '& input:not([type="checkbox"]):not([type="radio"])': {
    fontSize: { xs: '13px', md: '14px', lg: '16px' },
  },
  '& input::placeholder': {
    fontSize: { xs: '13px', md: '14px', lg: '16px' },
  },
  // MUI inputs (Select, DatePicker) — picks up via MuiInputBase-input.
  '& .MuiInputBase-input': {
    fontSize: { xs: '13px', md: '14px', lg: '16px' },
  },
  '& .MuiInputBase-input::placeholder': {
    fontSize: { xs: '13px', md: '14px', lg: '16px' },
    opacity: 1,
  },
} as const;
