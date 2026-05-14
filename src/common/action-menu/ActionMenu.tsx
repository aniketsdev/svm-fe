import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: string;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  ariaLabel?: string;
}

export function ActionMenu({ items, ariaLabel = 'Actions' }: ActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAnchorEl(null);
  };

  const handleItemClick = (e: React.MouseEvent, onClick: () => void) => {
    e.stopPropagation();
    setAnchorEl(null);
    onClick();
  };

  return (
    <>
      <IconButton size="small" aria-label={ariaLabel} onClick={handleOpen}>
        <MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 140,
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
              '& .MuiMenuItem-root': {
                fontSize: '12px',
                py: 0.75,
                px: 1.5,
                minHeight: 'unset',
              },
            },
          },
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={(e) => handleItemClick(e, item.onClick)}
            disabled={item.disabled}
            sx={{ color: item.color || 'text.primary' }}
          >
            {item.icon && (
              <ListItemIcon sx={{ minWidth: '24px !important', color: item.color || 'text.secondary', '& .MuiSvgIcon-root': { fontSize: 14 } }}>
                {item.icon}
              </ListItemIcon>
            )}
            <Typography sx={{ fontSize: '18px', lineHeight: 1.4 }}>{item.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
