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
  Chip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  RssFeed as FeedIcon, // Usando RssFeed en lugar de Feed
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
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

// Componente para mostrar información de usuario
const UserInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2),
}));

function MainLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, getUserBusiness, getUserRole } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  // Obtener información del negocio y rol del usuario
  const businessInfo = getUserBusiness();
  const roleInfo = getUserRole();

  // Función para generar elementos del menú basados en el estado del usuario
  const getMenuItems = () => {
    const items = [
      { 
        text: 'Feed', 
        icon: <FeedIcon />, 
        path: '/',
        description: 'Publicaciones y novedades',
        alwaysShow: true // Siempre se muestra
      }
    ];
    
    // Solo añadir estos elementos si el usuario tiene un negocio
    if (businessInfo) {
      items.push(
        { 
          text: 'Dashboard', 
          icon: <DashboardIcon />, 
          path: '/dashboard',
          description: 'Panel principal'
        },
        { 
          text: 'Pedidos', 
          icon: <ReceiptIcon />, 
          path: '/orders',
          description: 'Gestión de pedidos'
        },
        { 
          text: 'Inventario', 
          icon: <InventoryIcon />, 
          path: '/inventory',
          description: 'Gestión de productos'
        }
      );
    }
    
    // Estos ítems siempre se muestran
    items.push(
      { 
        text: 'Usuarios', 
        icon: <PeopleIcon />, 
        path: '/users',
        description: 'Gestión de usuarios'
      },
      { 
        text: 'Configuración', 
        icon: <SettingsIcon />, 
        path: '/settings',
        description: 'Ajustes del sistema'
      }
    );
    
    return items;
  };

  const menuItems = getMenuItems();

  const getUserFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'Usuario';
  };

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
            {businessInfo?.name || 'Mi Aplicación'}
          </Typography>
        </Fade>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      
      {/* Información del usuario */}
      {open && (
        <UserInfo>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
              {getAvatarInitial()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {getUserFullName()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
          
          {/* Mostrar negocio y rol */}
          <Box sx={{ mt: 2 }}>
            {businessInfo && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {businessInfo.name}
                </Typography>
              </Box>
            )}
            
            {roleInfo && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BadgeIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                <Chip 
                  label={roleInfo.name} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
        </UserInfo>
      )}
      
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
                <Box>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: location.pathname === item.path ? 'bold' : 'medium',
                    }}
                  />
                  {item.description && (
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                  )}
                </Box>
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
          
          {/* Botones de navegación rápida */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }}>
            {/* Mostrar Dashboard solo si el usuario tiene un negocio */}
            {businessInfo && (
              <Button 
                color="inherit" 
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{ mr: 1 }}
              >
                Dashboard
              </Button>
            )}
            <Button 
              color="inherit" 
              startIcon={<FeedIcon />}
              onClick={() => navigate('/')}
              sx={{ 
                fontWeight: location.pathname === '/' ? 'bold' : 'normal',
                textDecoration: location.pathname === '/' ? 'underline' : 'none'
              }}
            >
              Feed
            </Button>
          </Box>
          
          <Fade in={!open} timeout={300}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Mostrar información de negocio y rol en el header */}
              {businessInfo && (
                <Chip 
                  icon={<BusinessIcon />}
                  label={businessInfo.name}
                  color="primary"
                  variant="outlined"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                />
              )}
              {roleInfo && (
                <Chip 
                  icon={<BadgeIcon />}
                  label={roleInfo.name}
                  size="small"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                />
              )}
              <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {getUserFullName()}
              </Typography>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {getAvatarInitial()}
              </Avatar>
            </Box>
          </Fade>
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