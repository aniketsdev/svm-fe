import { Box, Skeleton } from '@mui/material';

export function GlobalSearchSkeleton() {
  return (
    <Box sx={{ p: 1 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 1,
          }}
        >
          <Skeleton variant="circular" width={32} height={32} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" sx={{ fontSize: 14 }} />
            <Skeleton variant="text" width="40%" sx={{ fontSize: 11 }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
