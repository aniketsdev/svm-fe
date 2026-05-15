import { useRef, useEffect, memo } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Avatar,
  ClickAwayListener,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { listClientsOptions } from '@/sdk/@tanstack/react-query.gen';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
import { GlobalSearchSkeleton } from './GlobalSearchSkeleton';
import { NAVBAR_HEIGHT } from '../constants';

export const GlobalSearch = memo(function GlobalSearch() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isExpanded,
    searchTerm,
    debouncedTerm,
    isQueryEnabled,
    showDropdown,
    expand,
    collapse,
    handleSearchChange,
  } = useGlobalSearch();

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        collapse();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, collapse]);

  const { data, isLoading, isError } = useQuery({
    ...listClientsOptions({
      query: { search: debouncedTerm, page_size: 5 },
    }),
    enabled: isQueryEnabled,
  });

  const results = data?.results ?? [];

  const handleResultClick = (uuid: string) => {
    collapse();
    navigate(`/admin/clients/${uuid}`);
  };

  const handleViewAll = () => {
    const term = searchTerm;
    collapse();
    navigate(`/admin/clients?search=${encodeURIComponent(term)}`);
  };

  // Show skeleton while debounce hasn't caught up yet or query is loading
  const isSearchPending = isLoading || (searchTerm !== debouncedTerm && searchTerm.length >= 1);

  const getInitials = (firstName: string, lastName: string) => {
    const f = firstName.charAt(0) || '?';
    const l = lastName.charAt(0) || '?';
    return `${f}${l}`.toUpperCase();
  };

  return (
    <ClickAwayListener onClickAway={() => { if (isExpanded) collapse(); }}>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Collapsed: search icon (always rendered so layout stays stable) */}
        {!isExpanded && (
          <Box
            onClick={expand}
            sx={{
              color: 'solid.white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
            role="button"
            aria-label="Search clients"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') expand(); }}
          >
            <SearchIcon />
          </Box>
        )}

        {/* Expanded: input. On xs, becomes a fixed full-navbar overlay so it doesn't crowd UserMenu. */}
        {isExpanded && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: { xs: 'primary.08', sm: 'rgba(255,255,255,0.15)' },
              border: { sm: '1px solid rgba(255,255,255,0.3)' },
              borderRadius: { xs: 0, sm: '6px' },
              px: { xs: 1, sm: 1.5 },
              py: { xs: 0, sm: 0.5 },
              height: { xs: NAVBAR_HEIGHT, sm: 'auto' },
              width: { xs: '100vw', sm: 240, md: 260, lg: 280 },
              position: { xs: 'fixed', sm: 'static' },
              top: { xs: 0, sm: 'auto' },
              left: { xs: 0, sm: 'auto' },
              right: { xs: 0, sm: 'auto' },
              zIndex: { xs: (theme) => theme.zIndex.appBar + 1, sm: 'auto' },
              transition: 'width 0.2s ease-in-out',
            }}
          >
            <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20, mr: 1, flexShrink: 0 }} />
            <InputBase
              inputRef={inputRef}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search clients..."
              role="combobox"
              aria-label="Search clients"
              aria-expanded={showDropdown}
              sx={{
                flex: 1,
                minWidth: 0,
                color: 'solid.white',
                fontSize: '14px !important',
                lineHeight: '1.4 !important',
                '& input': {
                  fontSize: '14px !important',
                  lineHeight: '1.4 !important',
                  p: 0,
                },
                '& ::placeholder': {
                  color: 'rgba(255,255,255,0.7)',
                  opacity: 1,
                },
              }}
            />
            {/* Close button — only visible on mobile overlay */}
            <IconButton
              onClick={collapse}
              size="small"
              aria-label="Close search"
              sx={{
                display: { xs: 'inline-flex', sm: 'none' },
                color: 'solid.white',
                ml: 0.5,
                flexShrink: 0,
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        )}

        {/* Results dropdown */}
        {showDropdown && (
          <Paper
            elevation={8}
            sx={{
              position: { xs: 'fixed', sm: 'absolute' },
              top: { xs: NAVBAR_HEIGHT, sm: '100%' },
              right: { xs: 0, sm: 0 },
              left: { xs: 0, sm: 'auto' },
              mt: { sm: 1 },
              width: { xs: '100vw', sm: 320, md: 340 },
              maxHeight: { xs: `calc(100vh - ${NAVBAR_HEIGHT}px)`, sm: 420 },
              overflowY: 'auto',
              borderRadius: { xs: 0, sm: '8px' },
              zIndex: (theme) => theme.zIndex.appBar + 2,
            }}
            role="listbox"
          >
            {isSearchPending ? (
              <GlobalSearchSkeleton />
            ) : isError ? (
              <Typography
                sx={{
                  p: 2,
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontSize: '14px !important',
                  lineHeight: '1.4 !important',
                }}
              >
                Something went wrong
              </Typography>
            ) : results.length === 0 ? (
              <Typography
                sx={{
                  p: 2,
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontSize: '14px !important',
                  lineHeight: '1.4 !important',
                }}
              >
                No clients found
              </Typography>
            ) : (
              <Box>
                {results.map((client) => (
                  <Box
                    key={client.uuid}
                    onClick={() => handleResultClick(client.uuid)}
                    role="option"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: '13px !important',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(client.first_name, client.last_name)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        noWrap
                        sx={{
                          fontSize: '14px !important',
                          lineHeight: '1.3 !important',
                          fontWeight: 500,
                          color: 'text.primary',
                        }}
                      >
                        {client.first_name} {client.last_name}
                      </Typography>
                      <Typography
                        noWrap
                        sx={{
                          fontSize: '11px !important',
                          lineHeight: '1.3 !important',
                          color: 'text.secondary',
                        }}
                      >
                        MRN: {client.mrn ?? '—'}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                {/* View all results link */}
                <Box
                  onClick={handleViewAll}
                  sx={{
                    px: 2,
                    py: 1.5,
                    textAlign: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '13px !important',
                      lineHeight: '1.4 !important',
                      color: 'primary.main',
                      fontWeight: 500,
                    }}
                  >
                    View all results
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
});
