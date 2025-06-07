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
  Stack,
  Divider,
  Paper,
  alpha
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
  Badge as BadgeIcon,
  Star,
  Verified
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TopHeader = ({ onDrawerToggle, open }) => {
  const { user, logout, getUserBusiness, getUserRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
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

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const getUserFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'Usuario';
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name[0].toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  // Función para formatear el nombre del negocio
  const formatBusinessName = (name) => {
    if (!name) return '';
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        boxShadow: theme.shadows[4],
        // CAMBIO: Altura fija para el AppBar
        minHeight: { xs: 64, sm: 70 }, // Altura consistente
      }}
    >
      <Toolbar sx={{ 
          justifyContent: 'space-between', 
          px: { xs: 2, sm: 3 },
          // CAMBIO: Altura mínima del Toolbar
          minHeight: { xs: 64, sm: 70 } // Coincidir con AppBar
        }}
      >
        {/* Sección izquierda: Menú, logo y nombre */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label={open ? "close drawer" : "open drawer"}
            edge="start"
            onClick={onDrawerToggle}
            sx={{ 
              mr: 2,
              transition: theme.transitions.create(['transform', 'background-color'], {
                duration: theme.transitions.duration.shorter,
              }),
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                transform: open ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'
              }
            }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          
          <Restaurant 
            sx={{ 
              color: 'white', 
              fontSize: 32,
              animation: 'pulse 3s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.8, transform: 'scale(1.05)' },
                '100%': { opacity: 1, transform: 'scale(1)' }
              },
              mr: 2,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 700,
              mr: 3,
              background: 'linear-gradient(45deg, #fff, #f0f8ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
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
          transform: 'translateX(-50%)',
          gap: 1
        }}>
          {businessInfo && (
            <Button 
              color="inherit" 
              startIcon={<Dashboard />}
              onClick={() => navigate('/dashboard')}
              sx={{ 
                mx: 1,
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
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
              borderRadius: 2,
              px: 2,
              fontWeight: location.pathname === '/' ? 700 : 500,
              backgroundColor: location.pathname === '/' ? alpha(theme.palette.common.white, 0.15) : 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Feed
          </Button>
        </Box>
        
        {/* Sección derecha: Notificaciones, usuario y negocio */}
        <Fade in={!open} timeout={300}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Mostrar información de negocio y rol en el header */}
            {businessInfo && !isTablet && (
              <Chip 
                icon={<BusinessIcon />}
                label={formatBusinessName(businessInfo.name)}
                size="small"
                sx={{ 
                  display: { xs: 'none', sm: 'flex' },
                  backgroundColor: alpha(theme.palette.common.white, 0.15),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            )}
            {roleInfo && !isTablet && (
              <Chip 
                icon={<BadgeIcon />}
                label={roleInfo.name}
                size="small"
                sx={{ 
                  display: { xs: 'none', sm: 'flex' },
                  backgroundColor: alpha(theme.palette.secondary.main, 0.9),
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            )}
            
            {/* Nombre de usuario */}
            <Typography 
              variant="body2" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontWeight: 500,
                color: alpha(theme.palette.common.white, 0.9)
              }}
            >
              {getUserFullName()}
            </Typography>
            
            
            {/* Avatar del usuario */}
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.secondary.main,
                cursor: 'pointer',
                ml: 1,
                border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  border: `2px solid ${alpha(theme.palette.common.white, 0.8)}`,
                  boxShadow: theme.shadows[8]
                }
              }}
              onClick={handleMenuOpen}
            >
              {getInitials()}
            </Avatar>
            
            {/* Menú desplegable mejorado */}
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
              PaperProps={{
                elevation: 16,
                sx: {
                  mt: 1.5,
                  minWidth: 280,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.light, 0.02)})`,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '& .MuiMenuItem-root': {
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateX(4px)'
                    }
                  }
                }
              }}
            >
              {/* Header del menú con información del usuario */}
              <Box sx={{ 
                px: 3, 
                py: 2, 
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.05)})`,
                borderRadius: '12px 12px 0 0'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      width: 48,
                      height: 48
                    }}
                  >
                    {getInitials()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {getUserFullName()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Chips de negocio y rol */}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  {businessInfo && (
                    <Chip 
                      icon={businessInfo.is_owner ? <Star fontSize="small" /> : <BusinessIcon fontSize="small" />}
                      label={formatBusinessName(businessInfo.name)}
                      size="small"
                      color="primary"
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  {roleInfo && (
                    <Chip 
                      icon={<BadgeIcon fontSize="small" />}
                      label={roleInfo.name}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Opciones del menú */}
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <AccountCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Mi Perfil" 
                  secondary="Configurar información personal"
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </MenuItem>
              
              {businessInfo && (
                <MenuItem onClick={handleDashboard}>
                  <ListItemIcon>
                    <Dashboard color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dashboard" 
                    secondary="Panel de control del negocio"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </MenuItem>
              )}
              
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <Settings color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Configuración" 
                  secondary="Ajustes de la aplicación"
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </MenuItem>
              
              <Divider sx={{ my: 1 }} />
              
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.error.main
                    },
                    '& .MuiListItemText-primary': {
                      color: theme.palette.error.main
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText 
                  primary="Cerrar Sesión" 
                  secondary="Salir de la aplicación"
                  secondaryTypographyProps={{ variant: 'caption' }}
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