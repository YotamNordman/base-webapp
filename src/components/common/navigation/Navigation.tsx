import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useTheme,
  Tooltip,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  alpha,
  Stack,
  InputBase,
  styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

// Custom styled search component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: `1px solid ${theme.palette.divider}`,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '30px',
    backgroundColor: theme.palette.primary.main,
    borderBottomLeftRadius: '50%',
    borderBottomRightRadius: '50%',
    transform: 'translateY(15px)',
    zIndex: -1,
  },
}));

const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for notifications menu
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  // State for profile menu
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const menuItems = [
    { text: 'לוח בקרה', icon: <DashboardIcon />, path: '/' },
    { text: 'אימונים', icon: <FitnessCenterIcon />, path: '/workouts' },
    { text: 'מתאמנים', icon: <PeopleIcon />, path: '/clients' },
    { text: 'יומן', icon: <CalendarTodayIcon />, path: '/calendar' },
    { text: 'דוחות', icon: <BarChartIcon />, path: '/reports' },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, message: 'שם המתאמן השלים אימון', time: 'לפני 10 דקות' },
    { id: 2, message: 'פגישה חדשה בלוח השנה', time: 'לפני שעה' },
    { id: 3, message: 'תזכורת: לעדכן תוכנית אימון', time: 'לפני 3 שעות' },
  ];

  const drawer = (
    <div>
      <DrawerHeader>
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            mb: 2, 
            bgcolor: 'primary.dark',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)' 
          }}
        >
          {user?.name?.charAt(0) || 'B'}
        </Avatar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Base
        </Typography>
        {user && (
          <Typography variant="subtitle2" align="center" sx={{ mt: 1, color: 'primary.contrastText' }}>
            {user.name}
          </Typography>
        )}
      </DrawerHeader>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List component="nav" sx={{ py: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                '&.Mui-selected': {
                  bgcolor: 'primary.lighter',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    right: 0,
                    height: '80%',
                    width: '4px',
                    backgroundColor: 'primary.main',
                    borderRadius: '4px',
                  },
                },
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                  minWidth: '40px',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: isActive(item.path) ? 600 : 400 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List component="nav">
          <ListItemButton
            onClick={() => handleNavigation('/settings')}
            selected={isActive('/settings')}
            sx={{
              borderRadius: '10px',
              mb: 0.5,
              color: isActive('/settings') ? 'primary.main' : 'text.primary',
              '&.Mui-selected': {
                bgcolor: 'primary.lighter',
                '&:hover': {
                  bgcolor: 'primary.lighter',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  right: 0,
                  height: '80%',
                  width: '4px',
                  backgroundColor: 'primary.main',
                  borderRadius: '4px',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive('/settings') ? 'primary.main' : 'text.secondary',
                minWidth: '40px',
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="הגדרות"
              primaryTypographyProps={{ fontWeight: isActive('/settings') ? 600 : 400 }}
            />
          </ListItemButton>
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: '10px',
              color: 'text.primary',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            <ListItemIcon sx={{ color: 'text.secondary', minWidth: '40px' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="התנתק" />
          </ListItemButton>
        </List>
      </Box>
    </div>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: 'background.paper', 
          color: 'text.primary', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { sm: 'none' }, 
                mr: 1,
                borderRadius: '8px', 
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } 
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h5" 
              noWrap 
              component="div" 
              sx={{ 
                display: { xs: 'none', sm: 'block' }, 
                fontWeight: 700, 
                color: 'primary.main',
                mr: 2
              }}
            >
              Base
            </Typography>

            <Search sx={{ display: { xs: 'none', md: 'flex' } }}>
              <SearchIconWrapper>
                <SearchIcon color="action" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="חיפוש..."
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="עזרה">
              <IconButton
                size="medium"
                color="inherit"
                sx={{ 
                  borderRadius: '8px', 
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } 
                }}
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="התראות">
              <IconButton
                size="medium"
                color="inherit"
                onClick={handleNotificationsOpen}
                sx={{ 
                  borderRadius: '8px', 
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } 
                }}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '8px',
                cursor: 'pointer',
                p: 0.5,
                px: 1,
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
              }}
              onClick={handleProfileOpen}
            >
              <Avatar 
                alt={user?.name || 'User'} 
                src="/placeholder-avatar.jpg"
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="subtitle2" component="span">
                  {user?.name || 'המשתמש'}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5, color: 'text.secondary' }} />
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Notification menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            borderRadius: '10px',
            minWidth: 300,
            maxWidth: 360,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">התראות</Typography>
        </Box>
        <Divider />
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <MenuItem 
                key={notification.id}
                onClick={handleNotificationsClose}
                sx={{ 
                  py: 1.5, 
                  px: 2,
                  '&:hover': { bgcolor: 'primary.lighter' } 
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" noWrap>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Button 
                size="small" 
                onClick={handleNotificationsClose}
                sx={{ fontWeight: 500, fontSize: '0.8rem' }}
              >
                הצג את כל ההתראות
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              אין התראות חדשות
            </Typography>
          </Box>
        )}
      </Menu>

      {/* Profile menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            borderRadius: '10px',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleProfileClose(); handleNavigation('/profile'); }}>
          הפרופיל שלי
        </MenuItem>
        <MenuItem onClick={() => { handleProfileClose(); handleNavigation('/settings'); }}>
          הגדרות
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleProfileClose(); logout(); }}>
          התנתק
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navigation;