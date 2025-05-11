// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/material/styles';

const drawerWidth = 260;

// Estilización personalizada para el Drawer
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

// Animación para el ícono del menú
const AnimatedMenuIcon = styled(IconButton)(({ theme, open }) => ({
  transition: theme.transitions.create(['transform', 'color'], {
    duration: theme.transitions.duration.shorter,
  }),
  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

// Header del drawer con animación
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Pedidos', icon: <ReceiptIcon />, path: '/orders' },
  { text: 'Inventario', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Usuarios', icon: <PeopleIcon />, path: '/users' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' },
];

function MainLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  // Función para obtener el nombre completo del usuario
  const getUserFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'Usuario';
  };

  // Función para obtener la inicial del avatar
  const getAvatarInitial = () => {
    if (user?.first_name) {
      return user.first_name[0].toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      handleDrawerClose();
    }
  };

  const drawer = (
    <Box>
      <DrawerHeader>
        <Fade in={open} timeout={300}>
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            Mi Restaurante
          </Typography>
        </Fade>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <Collapse
            key={item.text}
            in={open}
            timeout={300 + (index * 100)}
            unmountOnExit
          >
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: 'center',
                    transition: 'color 0.3s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: location.pathname === item.path ? 'bold' : 'medium',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Collapse>
        ))}
      </List>
      <Divider />
      <List>
        <Collapse in={open} timeout={600}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                px: 2.5,
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.dark',
                  '& .MuiListItemIcon-root': {
                    color: 'error.dark',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: 'center' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </ListItem>
        </Collapse>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <AnimatedMenuIcon
            color="inherit"
            aria-label={open ? "close drawer" : "open drawer"}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
            open={open}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </AnimatedMenuIcon>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Control de Restaurante
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {getUserFullName()}
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {getAvatarInitial()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <StyledDrawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 0,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        {drawer}
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: open ? `${drawerWidth}px` : 0,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;