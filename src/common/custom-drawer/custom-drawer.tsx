import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  Drawer,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { drawerHeader, gridHeader } from "./custom-drawer.widgets";
import { palette } from '../../../theme/palette';

interface DrawerProps {
  anchor: "left" | "top" | "right" | "bottom";
  open: boolean;
  title?: string;
  drawerWidth?: string | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>>;
  drawermargin?: string;
  drawerPadding?: string;
  headerPadding?: string; // Separate padding for header
  onClose?: () => void;
  headerStyle?: string;
  titleStyle?: React.CSSProperties;
}

const CustomDrawer = (props: React.PropsWithChildren<DrawerProps>) => {
  const theme = useTheme();
  const { drawerWidth, drawermargin, drawerPadding, headerPadding } = props;
  const belowLg = useMediaQuery(theme.breakpoints.down("lg")) && !drawerWidth;
  const below768 = useMediaQuery("(max-width:768px)");
  const below480 = useMediaQuery("(max-width:480px)");

  // Calculate responsive width
  const getDrawerWidth = () => {
    if (props.drawerWidth) return props.drawerWidth;
    if (props.anchor === 'right' || props.anchor === 'left') {
      if (below480) return '100vw'; // Full width on very small screens
      if (below768) return '90vw';  // 90% width on mobile
      if (belowLg) return '50vw';   // 50% width on tablet
      return '40vw';                // 40% width on desktop
    }
    return 'auto';
  };

  return (
    <Drawer
      anchor={props.anchor}
      open={props.open}
      variant="temporary"
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
        // Avoid "Blocked aria-hidden on focused element" a11y warning when focus is inside drawer content
        disableEnforceFocus: true,
      }}
      slotProps={{
        root: {
          "aria-hidden": false,
        },
      }}
      sx={{
        zIndex: theme.zIndex.drawer + 200,
        '& .MuiDrawer-paper': {
          zIndex: theme.zIndex.drawer + 200,
          position: 'fixed',
          top: 0,
          height: '100vh',
          width: getDrawerWidth(),
          maxWidth: '100vw', // Ensure it never exceeds viewport width
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth width transition
          // Mobile-specific improvements
          '@media (max-width: 768px)': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)', // Enhanced shadow for mobile
          },
          '@media (max-width: 480px)': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)', // Even stronger shadow for very small screens
          },
        },
        '& .MuiBackdrop-root': {
          zIndex: theme.zIndex.drawer + 199,
          // Enhanced backdrop for mobile
          '@media (max-width: 768px)': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker backdrop on mobile
          },
        }
      }}
    >
      <Grid
        container
        flexDirection={"column"}
        height={"100%"}
        flexWrap={"nowrap"}
        sx={{ margin: drawermargin }}
      >
        {props.title && (
          <Grid
            container
            sx={{
              ...gridHeader,
              alignItems: "center",
              justifyContent: "space-between",
              mt: props.headerStyle,
              paddingLeft: below768 ? "15px" : (headerPadding || drawerPadding || "24px"),
              paddingRight: below768 ? "15px" : (headerPadding || drawerPadding || "24px"),
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            <Grid>
              <Typography
                sx={{
                  ...drawerHeader,
                  fontSize: { xs: '17px !important', sm: '18px !important', md: '20px !important' },
                  lineHeight: '1.3 !important',
                  letterSpacing: '0.0075em',
                  fontWeight: 600,
                  color: palette.text.primary,
                  ...props.titleStyle,
                }}
              >
                {props.title}
              </Typography>
            </Grid>
            <Grid>
              <IconButton 
                onClick={props.onClose}
                sx={{
                  padding: "4px",
                  color: palette.text.secondary,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <CloseOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}
        <Box
          sx={{
            mt: 2,
            flex: 1,
            width: "100%", // Use full width of the drawer
            paddingX: below768
              ? "15px"
              : drawerPadding
                ? drawerPadding
                : "50px",
            overflowX: "hidden",
            overflowY: "auto",
            height: "calc(100vh - 120px)", // Account for header height
            boxSizing: "border-box", // Include padding in width calculation
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth transition for content
          }}
        >
          {props.children}
        </Box>
      </Grid>
    </Drawer>
  );
};

export default CustomDrawer;
