// src/components/SocialFeed/TopHeader.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Avatar, 
  Badge, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Notifications, 
  Message, 
  Restaurant, 
  AccountCircle,
  Dashboard,
  Settings,
  ExitToApp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TopHeader = () => {
  const { user, logout, getUserBusiness } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  
  const businessInfo = getUserBusiness();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleDashboard = () => {
    handleMenuClose();
    navigate('/dashboard');
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate('/settings');
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          maxWidth: 'md',
          mx: 'auto'
        }}
      >
        {/* Logo y nombre */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Restaurant 
            sx={{ 
              color: 'primary.main', 
              fontSize: 28,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.6 },
                '100%': { opacity: 1 }
              }
            }} 
          />
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            RestControl
          </Typography>
        </Box>
        
        {/* Área de notificaciones y perfil */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Mostrar nombre de usuario en pantallas medianas o mayores */}
          {!isMobile && (
            <Typography variant="body1" sx={{ mr: 1 }}>
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'Usuario'}
            </Typography>
          )}
          
          {/* Iconos de notificaciones */}
          <IconButton size="small">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <IconButton size="small">
            <Badge badgeContent={1} color="error">
              <Message />
            </Badge>
          </IconButton>
          
          {/* Avatar del usuario */}
          <IconButton 
            onClick={handleMenuOpen}
            size="small"
            sx={{ 
              ml: 1,
              border: openMenu ? '2px solid' : 'none',
              borderColor: 'primary.main'
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.875rem'
              }}
            >
              {getInitials()}
            </Avatar>
          </IconButton>
          
          {/* Menú desplegable */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Mi Perfil"
                secondary={user?.email || ''}
              />
            </MenuItem>
            
            {businessInfo && (
              <MenuItem onClick={handleDashboard}>
                <ListItemIcon>
                  <Dashboard fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </MenuItem>
            )}
            
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Configuración" />
            </MenuItem>
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Cerrar Sesión" 
                primaryTypographyProps={{ color: 'error' }}
              />
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default TopHeader;