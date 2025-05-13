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
  useMediaQuery,
  AppBar,
  Toolbar,
  Button,
  Fade,
  Chip,
  Stack
} from '@mui/material';
import { 
  Notifications, 
  Message, 
  Restaurant, 
  AccountCircle,
  Dashboard,
  Settings,
  ExitToApp,
  Menu as MenuIcon,
  Close as CloseIcon,
  RssFeed as FeedIcon, 
  Business as BusinessIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TopHeader = ({ onDrawerToggle, open }) => {
  const { user, logout, getUserBusiness, getUserRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  
  const businessInfo = getUserBusiness();
  const roleInfo = getUserRole();

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

  const getUserFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'Usuario';
  };

  const getInitials = () => {
    if (user?.first_name) {
      return user.first_name[0].toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
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
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Sección izquierda: Menú, logo y nombre */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label={open ? "close drawer" : "open drawer"}
            edge="start"
            onClick={onDrawerToggle}
            sx={{ 
              mr: 1.5,
              transition: theme.transitions.create(['transform', 'color'], {
                duration: theme.transitions.duration.shorter,
              }),
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          
          <Restaurant 
            sx={{ 
              color: 'white', 
              fontSize: 28,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.8 },
                '100%': { opacity: 1 }
              },
              mr: 1.5
            }} 
          />
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 'bold',
              mr: 3
            }}
          >
            Control de Restaurante
          </Typography>
        </Box>
        
        {/* Sección central: Botones de navegación */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          {/* Mostrar Dashboard solo si el usuario tiene un negocio */}
          {businessInfo && (
            <Button 
              color="inherit" 
              startIcon={<Dashboard />}
              onClick={() => navigate('/dashboard')}
              sx={{ mx: 1 }}
            >
              Dashboard
            </Button>
          )}
          <Button 
            color="inherit" 
            startIcon={<FeedIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              mx: 1,
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              textDecoration: location.pathname === '/' ? 'underline' : 'none'
            }}
          >
            Feed
          </Button>
        </Box>
        
        {/* Sección derecha: Notificaciones, usuario y negocio */}
        <Fade in={!open} timeout={300}>
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Mostrar información de negocio y rol en el header (solo en pantallas más grandes) */}
            {businessInfo && !isTablet && (
              <Chip 
                icon={<BusinessIcon />}
                label={businessInfo.name}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              />
            )}
            {roleInfo && !isTablet && (
              <Chip 
                icon={<BadgeIcon />}
                label={roleInfo.name}
                size="small"
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              />
            )}
            
            {/* Nombre de usuario (solo en pantallas medianas y grandes) */}
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {getUserFullName()}
            </Typography>
            
            {/* Iconos de notificaciones y mensajes */}
            <IconButton size="small" color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            <IconButton size="small" color="inherit">
              <Badge badgeContent={1} color="error">
                <Message />
              </Badge>
            </IconButton>
            
            {/* Avatar del usuario */}
            <Avatar 
              sx={{ 
                bgcolor: 'secondary.main', 
                cursor: 'pointer',
                ml: 0.5
              }}
              onClick={handleMenuOpen}
            >
              {getInitials()}
            </Avatar>
            
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
          </Stack>
        </Fade>
      </Toolbar>
    </AppBar>
  );
};

export default TopHeader;