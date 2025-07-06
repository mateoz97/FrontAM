// src/components/SocialFeed/EnhancedBusinessSwitcher.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Chip, 
  Skeleton, 
  Paper,
  useTheme,
  alpha,
  Stack,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { 
  BusinessCenter, 
  SupervisorAccount, 
  Person, 
  Star,
  Verified,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { 
  getBusinessTypeLabel, 
  getBusinessTypeIcon, 
  getBusinessTypeColor,
  hasBusinessFeature,
  getBusinessTypeConfig 
} from '../../utils/businessTypes';

const EnhancedBusinessSwitcher = ({ 
  businesses, 
  activeBusinessId, 
  onSelectBusiness, 
  onCreateBusiness,
  onManageBusiness,
  loading = false,
  showStats = true,
  showActions = true,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBusinessForMenu, setSelectedBusinessForMenu] = useState(null);

  // Función para formatear el nombre del negocio
  const formatBusinessName = (name) => {
    if (!name) return '';
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Función para obtener el estilo y color del badge de rol
  const getRoleBadge = (role, isOwner) => {
    if (isOwner) {
      return { 
        label: 'Propietario', 
        color: 'primary', 
        icon: <Star fontSize="small" />,
        variant: 'filled'
      };
    }
    
    const roleLower = role?.toLowerCase() || '';
    
    const roleMap = {
      admin: { label: 'Admin', color: 'error', icon: <SupervisorAccount fontSize="small" />, variant: 'filled' },
      manager: { label: 'Gerente', color: 'warning', icon: <SupervisorAccount fontSize="small" />, variant: 'filled' },
      waiter: { label: 'Mesero', color: 'success', icon: <Person fontSize="small" />, variant: 'outlined' },
      chef: { label: 'Chef', color: 'info', icon: <Person fontSize="small" />, variant: 'outlined' },
    };

    for (const [key, value] of Object.entries(roleMap)) {
      if (roleLower.includes(key) || roleLower.includes(value.label.toLowerCase())) {
        return value;
      }
    }
    
    return { 
      label: role || 'Usuario', 
      color: 'default', 
      icon: <Person fontSize="small" />,
      variant: 'outlined'
    };
  };

  const handleMenuOpen = (event, business) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedBusinessForMenu(business);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBusinessForMenu(null);
  };

  const handleMenuAction = (action) => {
    handleMenuClose();
    if (action === 'settings' && onManageBusiness) {
      onManageBusiness(selectedBusinessForMenu);
    }
  };

  // Mock stats for demonstration
  const getBusinessStats = (business) => ({
    orders: Math.floor(Math.random() * 100),
    revenue: Math.floor(Math.random() * 10000),
    growth: Math.floor(Math.random() * 30) - 10,
  });

  // Si no hay negocios y no está cargando, mostrar botón de crear
  if (!loading && (!businesses || businesses.length === 0)) {
    return (
      <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.02)})`,
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
            maxWidth: 400,
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mx: 'auto',
              mb: 2,
            }}
          >
            <BusinessCenter sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            ¡Bienvenido a la plataforma!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Crea tu primer negocio para comenzar a usar todas las funcionalidades
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateBusiness}
            sx={{ borderRadius: 2 }}
          >
            Crear Mi Negocio
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        pt: 2,
        pb: 1,
        mb: 3,
        display: 'flex',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        '&::-webkit-scrollbar': { 
          height: 6,
          borderRadius: 3
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: alpha(theme.palette.grey[300], 0.3),
          borderRadius: 3
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(theme.palette.primary.main, 0.6),
          borderRadius: 3,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.8)
          }
        },
        gap: 2,
        px: 0.5
      }}
    >
      {loading ? (
        // Mostrar skeletons mientras carga
        Array.from(new Array(3)).map((_, index) => (
          <Paper 
            key={`skeleton-${index}`} 
            elevation={2}
            sx={{ 
              width: 320, 
              minWidth: 320, 
              p: 3,
              borderRadius: 3,
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={32} />
                  <Skeleton variant="text" width="50%" height={20} />
                </Box>
                <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 2 }} />
              </Box>
              {showStats && (
                <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Skeleton variant="text" width="100%" height={20} />
                </Box>
              )}
            </Stack>
          </Paper>
        ))
      ) : (
        <>
          {/* Mostrar los negocios */}
          {businesses.map((business) => {
            const badgeInfo = getRoleBadge(business.role, business.isOwner);
            const isActive = activeBusinessId === business.id;
            const formattedName = formatBusinessName(business.name);
            const businessType = business.business_type || business.type || 'restaurant';
            const businessTypeLabel = getBusinessTypeLabel(businessType);
            const businessTypeIcon = getBusinessTypeIcon(businessType);
            const businessTypeColor = getBusinessTypeColor(businessType);
            const businessConfig = getBusinessTypeConfig(businessType);
            const stats = showStats ? getBusinessStats(business) : null;
            
            return (
              <Paper
                key={business.id}
                elevation={isActive ? 8 : 2}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                  width: 320,
                  minWidth: 320,
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: isActive ? `2px solid ${businessTypeColor}` : '1px solid transparent',
                  background: isActive 
                    ? `linear-gradient(135deg, ${alpha(businessTypeColor, 0.1)}, ${alpha(businessTypeColor, 0.05)})`
                    : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.grey[50], 0.8)})`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isActive ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': isActive ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${businessTypeColor}, ${alpha(businessTypeColor, 0.7)})`,
                  } : {},
                  '&:hover': { 
                    transform: isActive ? 'translateY(-6px) scale(1.03)' : 'translateY(-2px) scale(1.01)',
                    boxShadow: theme.shadows[12],
                    '& .business-name': {
                      color: businessTypeColor
                    }
                  },
                  boxShadow: isActive ? theme.shadows[8] : theme.shadows[2],
                }}
                onClick={() => onSelectBusiness(business.id)}
              >
                {/* Header con avatar del tipo de negocio, nombre y acciones */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  mb: 2,
                  gap: 2
                }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(businessTypeColor, 0.1),
                      color: businessTypeColor,
                      fontSize: '1.2rem',
                      width: 48,
                      height: 48,
                    }}
                  >
                    {businessTypeIcon}
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                        <Typography 
                          variant="h6" 
                          className="business-name"
                          sx={{ 
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            color: isActive ? businessTypeColor : theme.palette.text.primary,
                            transition: 'color 0.3s ease',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 0.5,
                          }}
                        >
                          {formattedName}
                        </Typography>
                        <Chip
                          label={businessTypeLabel}
                          size="small"
                          sx={{
                            bgcolor: alpha(businessTypeColor, 0.1),
                            color: businessTypeColor,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: 24,
                          }}
                        />
                      </Box>
                      
                      {showActions && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, business)}
                          sx={{ mt: -0.5 }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Rol del usuario */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={badgeInfo.icon}
                    label={badgeInfo.label}
                    size="small"
                    color={badgeInfo.color}
                    variant={badgeInfo.variant}
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 28,
                      borderRadius: 2,
                    }}
                  />
                </Box>

                {/* Estadísticas del negocio */}
                {showStats && stats && (
                  <Box sx={{ 
                    pt: 2, 
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Resumen del mes
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUpIcon 
                          fontSize="small" 
                          sx={{ 
                            color: stats.growth > 0 ? 'success.main' : 'error.main',
                            fontSize: '0.9rem'
                          }} 
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: stats.growth > 0 ? 'success.main' : 'error.main',
                            fontWeight: 600 
                          }}
                        >
                          {stats.growth > 0 ? '+' : ''}{stats.growth}%
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      {businessConfig.hasOrders && (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: businessTypeColor }}>
                            {stats.orders}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Pedidos
                          </Typography>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: businessTypeColor }}>
                          ${stats.revenue.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ingresos
                        </Typography>
                      </Box>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (stats.revenue / 15000) * 100)}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: alpha(businessTypeColor, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: businessTypeColor,
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>
                )}
                
                {/* Indicador activo */}
                {isActive && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mt: 2,
                    pt: 2,
                    borderTop: `1px solid ${alpha(businessTypeColor, 0.2)}`
                  }}>
                    <Verified 
                      fontSize="small" 
                      sx={{ 
                        color: businessTypeColor,
                        fontSize: '1rem'
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: businessTypeColor,
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    >
                      Negocio Activo
                    </Typography>
                  </Box>
                )}
              </Paper>
            );
          })}

          {/* Botón para crear nuevo negocio */}
          {showActions && onCreateBusiness && (
            <Paper
              elevation={1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                width: 320,
                minWidth: 320,
                cursor: 'pointer',
                borderRadius: 3,
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                background: alpha(theme.palette.primary.main, 0.02),
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  background: alpha(theme.palette.primary.main, 0.05),
                  transform: 'translateY(-2px)',
                }
              }}
              onClick={onCreateBusiness}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              >
                <AddIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Crear Negocio
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Agrega un nuevo negocio a tu cuenta
              </Typography>
            </Paper>
          )}
        </>
      )}

      {/* Menu contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 180 }
        }}
      >
        <MenuItem onClick={() => handleMenuAction('settings')}>
          <SettingsIcon sx={{ mr: 1, fontSize: 20 }} />
          Configurar
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMenuAction('leave')} sx={{ color: 'error.main' }}>
          <ExitIcon sx={{ mr: 1, fontSize: 20 }} />
          Salir del Negocio
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EnhancedBusinessSwitcher;