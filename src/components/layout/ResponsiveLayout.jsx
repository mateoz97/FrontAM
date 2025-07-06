// src/components/layout/ResponsiveLayout.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  SwipeableDrawer,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBusinessTypeColor, getBusinessTypeIcon } from '../../utils/businessTypes';
import AdaptiveNavigation from '../navigation/AdaptiveNavigation';

const ResponsiveLayout = ({ 
  children, 
  onCreateAction,
  hideCreateButton = false,
  customHeader,
  bottomNavigation = true,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  const { user, activeBusiness } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);

  const businessColor = activeBusiness 
    ? getBusinessTypeColor(activeBusiness.business_type || activeBusiness.type)
    : theme.palette.primary.main;

  // Update bottom nav value based on current route
  useEffect(() => {
    const pathToNavValue = {
      '/': 0,
      '/dashboard': 1,
      '/search': 2,
      '/profile': 3,
    };
    
    const currentValue = pathToNavValue[location.pathname];
    if (currentValue !== undefined) {
      setBottomNavValue(currentValue);
    }
  }, [location.pathname]);

  // Handle drawer behavior on screen size change
  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    } else {
      setMobileDrawerOpen(false);
    }
  }, [isMobile]);

  const drawerWidth = 280;

  const navigationItems = [
    { label: 'Inicio', icon: <HomeIcon />, path: '/', value: 0 },
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', value: 1 },
    { label: 'Búsqueda', icon: <SearchIcon />, path: '/search', value: 2 },
    { label: 'Perfil', icon: <PersonIcon />, path: '/profile', value: 3 },
  ];

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
    const item = navigationItems.find(item => item.value === newValue);
    if (item) {
      navigate(item.path);
    }
  };

  const DesktopHeader = () => (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
        ml: drawerOpen ? `${drawerWidth}px` : 0,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar>
        {!drawerOpen && (
          <IconButton
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {customHeader || (
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {activeBusiness?.name || 'Mi Negocio'}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: businessColor,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/profile')}
          >
            {user?.first_name?.charAt(0)}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );

  const MobileHeader = () => (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 56 }}>
        <IconButton
          edge="start"
          onClick={() => setMobileDrawerOpen(true)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {activeBusiness && (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: alpha(businessColor, 0.1),
                color: businessColor,
                mr: 1,
              }}
            >
              {getBusinessTypeIcon(activeBusiness.business_type || activeBusiness.type)}
            </Avatar>
          )}
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {activeBusiness?.name || 'Mi Negocio'}
          </Typography>
        </Box>
        
        <IconButton>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  const CreateActionButton = () => {
    if (hideCreateButton || !onCreateAction) return null;

    if (isMobile) {
      return (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: bottomNavigation ? 80 : 16,
            right: 16,
            bgcolor: businessColor,
            '&:hover': {
              bgcolor: alpha(businessColor, 0.8),
            },
            zIndex: theme.zIndex.speedDial,
          }}
          onClick={onCreateAction}
        >
          <AddIcon />
        </Fab>
      );
    }

    return null;
  };

  const MobileBottomNav = () => {
    if (!isMobile || !bottomNavigation) return null;

    return (
      <BottomNavigation
        value={bottomNavValue}
        onChange={handleBottomNavChange}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          zIndex: theme.zIndex.appBar,
          '& .MuiBottomNavigationAction-root': {
            '&.Mui-selected': {
              color: businessColor,
            },
          },
        }}
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            icon={item.icon}
            value={item.value}
          />
        ))}
      </BottomNavigation>
    );
  };

  const SideNavigation = () => (
    <AdaptiveNavigation
      open={isMobile ? mobileDrawerOpen : drawerOpen}
      onClose={() => {
        if (isMobile) {
          setMobileDrawerOpen(false);
        } else {
          setDrawerOpen(false);
        }
      }}
      width={drawerWidth}
    />
  );

  const mainContentStyles = {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(isMobile
      ? {
          mt: 7, // Mobile header height
          mb: bottomNavigation ? 7 : 0, // Bottom navigation height
        }
      : {
          mt: 8, // Desktop header height
          ml: drawerOpen ? 0 : `-${drawerWidth}px`,
          width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
        }),
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      {isMobile ? <MobileHeader /> : <DesktopHeader />}
      
      {/* Side Navigation */}
      <SideNavigation />
      
      {/* Main Content */}
      <Box component="main" sx={mainContentStyles}>
        <Box
          sx={{
            height: '100%',
            overflow: 'auto',
            bgcolor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Box>
      
      {/* Create Action Button */}
      <CreateActionButton />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </Box>
  );
};

export default ResponsiveLayout;