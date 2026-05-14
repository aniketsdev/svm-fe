import {
  Box,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { palette } from '../../../theme/palette';
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import {
  paginatorContainerStyles,
  paginationControlsStyles,
  paginationMainStyles,
  paginationItemStyles,
  navigationButtonStyles,
  recordsSelectStyles,
  entriesTextStyles,
  rowsPerPageContainerStyles,
  rowsPerPageLabelStyles,
} from "./pagination-styles";

export type PaginatorProps = {
  page: number;
  totalPages: number;
  totalRecord: number;
  onPageChange: (event: ChangeEvent<unknown> | null, page: number) => void;
  onRecordsPerPageChange?: (recordsPerPage: number) => void;
  defaultSize?: number;
};

const Paginator = (props: PaginatorProps) => {
  const { onPageChange, onRecordsPerPageChange, defaultSize, totalRecord } =
    props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(props.page);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(props.totalPages);

  useEffect(() => {
    if (defaultSize) {
      setSize(defaultSize);
    }
  }, [defaultSize]);

  useEffect(() => {
    setTotalPages(props.totalPages);
  }, [props.totalPages]);

  useEffect(() => {
    setPage(props.page);
  }, [props.page]);

  const startRecord = page * size + 1;
  const endRecord = Math.min((page + 1) * size, totalRecord);

  return (
    <>
      {totalPages !== 0 && (
        <Box sx={paginatorContainerStyles}>
          <Box>
            {!isSmallScreen ? (
              <Typography sx={entriesTextStyles}>
                <Box component="span" sx={{ fontWeight: 700 }}>
                  {startRecord}-{endRecord}
                </Box>{" "}
                of{" "}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  {totalRecord}
                </Box>{" "}
                Rows
              </Typography>
            ) : (
              ""
            )}
          </Box>
          <Box sx={paginationControlsStyles}>
            {onRecordsPerPageChange && !isMobile && (
              <Box sx={rowsPerPageContainerStyles}>
                <Typography sx={rowsPerPageLabelStyles}>
                  Rows per page:
                </Typography>
                <Select
                  size="small"
                  value={size}
                  aria-label="Rows per page"
                  onChange={(e) => {
                    onRecordsPerPageChange(+e.target.value);
                    onPageChange(null, 0);
                    setSize(e.target.value as number);
                  }}
                  sx={recordsSelectStyles}
                  variant="standard"
                  disableUnderline
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        mt: 0.5,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        '& .MuiMenuItem-root': {
                          fontSize: '14px !important',
                          lineHeight: '1.4 !important',
                          fontFamily: '"Figtree", sans-serif',
                          fontWeight: 400,
                          color: palette.neutral['80'],
                          py: 1,
                          px: 2,
                          minHeight: 'auto',
                          '&.Mui-selected': {
                            backgroundColor: 'transparent',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: palette.neutral['00'],
                            },
                          },
                          '&:hover': {
                            backgroundColor: palette.neutral['00'],
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value={5}>05</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </Box>
            )}
            <Box sx={paginationMainStyles}>
              <Pagination
                page={page + 1}
                count={totalPages}
                variant="text"
                shape="rounded"
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 1 : 1}
                renderItem={(item) => (
                  <PaginationItem
                    sx={{
                      ...(item.type === "previous" || item.type === "next"
                        ? navigationButtonStyles
                        : paginationItemStyles) as SxProps<Theme>,
                      width: { xs: "44px", sm: "40px" },
                      height: { xs: "44px", sm: "40px" },
                      minWidth: { xs: "44px", sm: "40px" },
                      fontSize: { xs: "12px", sm: "14px" },
                    }}
                    components={{
                      previous: PreviousBtn,
                      next: NextBtn,
                    }}
                    {...item}
                  />
                )}
                onChange={(e, page) => onPageChange(e, +page - 1)}
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Paginator;

const PreviousBtn = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <ChevronLeft
      sx={{
        width: isSmallScreen ? "16px" : "18px",
        height: isSmallScreen ? "16px" : "18px",
        fill: palette.neutral['60'],
      }}
    />
  );
};

const NextBtn = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ChevronRight
      sx={{
        width: isSmallScreen ? "16px" : "18px",
        height: isSmallScreen ? "16px" : "18px",
        fill: palette.neutral['60'],
      }}
    />
  );
};
