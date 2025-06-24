// src/layouts/MainLayout.jsx - Versión actualizada
import React, { useState } from 'react';
import {
  Box,
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
  IconButton,
  Typography,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  RssFeed as FeedIcon, 
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import TopHeader from '../components/SocialFeed/TopHeader';

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
  const { user, logout, getUserBusiness, getUserRole, hasPermission } = useAuth();
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
        alwaysShow: true, // Siempre se muestra
        permission: null
      }
    ];
    
    // Solo añadir estos elementos si el usuario tiene un negocio
    if (businessInfo) {
      items.push(
        { 
          text: 'Dashboard', 
          icon: <DashboardIcon />, 
          path: '/dashboard',
          description: 'Panel principal',
          permission: 'can_view_dashboard'
        },
        { 
          text: 'Pedidos', 
          icon: <ReceiptIcon />, 
          path: '/orders',
          description: 'Tablero de pedidos en tiempo real',
          permission: 'can_view_orders'
        },
        { 
          text: 'Inventario', 
          icon: <InventoryIcon />, 
          path: '/inventory',
          description: 'Gestión de productos',
          permission: 'can_view_inventory'
        }
      );
    }
    
    // Si no hay businessInfo pero el usuario es owner, también mostrar las opciones
    else if (roleInfo?.name?.toLowerCase() === 'owner' || user?.role_info?.name?.toLowerCase() === 'owner') {
      items.push(
        { 
          text: 'Dashboard', 
          icon: <DashboardIcon />, 
          path: '/dashboard',
          description: 'Panel principal',
          permission: null // Sin permiso para owners
        },
        { 
          text: 'Pedidos', 
          icon: <ReceiptIcon />, 
          path: '/orders',
          description: 'Tablero de pedidos en tiempo real',
          permission: null
        },
        { 
          text: 'Inventario', 
          icon: <InventoryIcon />, 
          path: '/inventory',
          description: 'Gestión de productos',
          permission: null
        }
      );
    }
    
    // Administración de usuarios - solo para usuarios con permisos
    if (businessInfo && (hasPermission('can_manage_users') || businessInfo.is_owner)) {
      items.push({
        text: 'Usuarios', 
        icon: <PeopleIcon />, 
        path: '/users',
        description: 'Gestión de usuarios',
        permission: 'can_manage_users'
      });
    }
    
    // Configuración - siempre disponible
    items.push({
      text: 'Configuración', 
      icon: <SettingsIcon />, 
      path: '/settings',
      description: 'Ajustes del sistema',
      alwaysShow: true,
      permission: null
    });
    
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

  // Función para verificar si un item debe mostrarse
  const shouldShowItem = (item) => {
    // Si tiene alwaysShow, siempre mostrar
    if (item.alwaysShow) return true;
    
    // Si no tiene permiso requerido, mostrar
    if (!item.permission) return true;
    
    // Si el usuario es owner del negocio, mostrar todo
    if (businessInfo?.is_owner) return true;
    
    // Si el usuario tiene el rol de owner, mostrar todo
    if (roleInfo?.name?.toLowerCase() === 'owner') return true;
    
    // Si tiene permiso requerido, verificar si el usuario lo tiene
    return hasPermission(item.permission);
  };

  // Función para obtener el badge de notificación
  const getNotificationBadge = () => {
    // TODO: Implementar conteo real de notificaciones desde el backend
    return null;
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
        {menuItems.filter(shouldShowItem).map((item, index) => (
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
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
                  {getNotificationBadge()}
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
      {/* Usar el TopHeader con los props necesarios */}
      <TopHeader 
        onDrawerToggle={handleDrawerToggle} 
        open={open} 
      />

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