import { palette } from '../../../theme/palette';

/** Shared header cell styles for data tables */
export const headerCellSx = {
  fontSize: '14px',
  fontWeight: 600,
  color: palette.neutral['50'],
  whiteSpace: 'nowrap',
  border: 'none',
  padding: '8px 12px',
  backgroundColor: palette.neutral['00'],
} as const;

/** Shared body cell styles for data tables */
export const bodyCellSx = {
  border: 'none',
  padding: '8px 12px',
  fontSize: '15px',
  whiteSpace: 'nowrap',
} as const;
