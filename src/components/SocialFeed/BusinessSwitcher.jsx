// src/components/SocialFeed/BusinessSwitcher.jsx
import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Chip, 
  Skeleton, 
  Paper,
  useTheme,
  alpha,
  Stack
} from '@mui/material';
import { 
  BusinessCenter, 
  SupervisorAccount, 
  Person, 
  Star,
  Verified
} from '@mui/icons-material';

/**
 * Componente que muestra los negocios del usuario permitiendo cambiar entre ellos
 */
const BusinessSwitcher = ({ businesses, activeBusinessId, onSelectBusiness, loading = false }) => {
  const theme = useTheme();

  // Función para formatear el nombre del negocio (convertir guiones bajos a espacios)
  const formatBusinessName = (name) => {
    if (!name) return '';
    // Convertir guiones bajos a espacios y capitalizar cada palabra
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
    
    if (roleLower.includes('admin')) {
      return { 
        label: 'Administrador', 
        color: 'error', 
        icon: <SupervisorAccount fontSize="small" />,
        variant: 'filled'
      };
    }
    if (roleLower.includes('gerente') || roleLower.includes('manager')) {
      return { 
        label: 'Gerente', 
        color: 'warning', 
        icon: <SupervisorAccount fontSize="small" />,
        variant: 'filled'
      };
    }
    if (roleLower.includes('mesero') || roleLower.includes('waiter')) {
      return { 
        label: 'Mesero', 
        color: 'success', 
        icon: <Person fontSize="small" />,
        variant: 'outlined'
      };
    }
    if (roleLower.includes('cocinero') || roleLower.includes('chef')) {
      return { 
        label: 'Cocinero', 
        color: 'info', 
        icon: <Person fontSize="small" />,
        variant: 'outlined'
      };
    }
    
    return { 
      label: role || 'Usuario', 
      color: 'default', 
      icon: <Person fontSize="small" />,
      variant: 'outlined'
    };
  };

  // Si no hay negocios y no está cargando, no mostrar nada
  if (!loading && (!businesses || businesses.length === 0)) {
    return null;
  }

  return (
    <Box
      sx={{
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
        pb: 1,
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
              width: 280, 
              minWidth: 280, 
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.8)}, ${alpha(theme.palette.grey[50], 0.9)})`
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Skeleton variant="text" width="70%" height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 2 }} />
              </Box>
              <Skeleton variant="text" width="50%" height={20} sx={{ borderRadius: 1 }} />
            </Stack>
          </Paper>
        ))
      ) : (
        // Mostrar los negocios
        businesses.map((business) => {
          const badgeInfo = getRoleBadge(business.role, business.isOwner);
          const isActive = activeBusinessId === business.id;
          const formattedName = formatBusinessName(business.name);
          
          return (
            <Paper
              key={business.id}
              elevation={isActive ? 8 : 2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 3,
                width: 280,
                minWidth: 280,
                cursor: 'pointer',
                borderRadius: 3,
                border: isActive ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                background: isActive 
                  ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.05)})`
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
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                } : {},
                '&:hover': { 
                  transform: isActive ? 'translateY(-6px) scale(1.03)' : 'translateY(-2px) scale(1.01)',
                  boxShadow: theme.shadows[12],
                  '& .business-name': {
                    color: theme.palette.primary.main
                  }
                },
              }}
              onClick={() => onSelectBusiness(business.id)}
            >
              {/* Header con nombre y badge */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                mb: 2,
                minHeight: 60
              }}>
                <Box sx={{ flex: 1, mr: 1 }}>
                  <Typography 
                    variant="h6" 
                    className="business-name"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      lineHeight: 1.3,
                      color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                      transition: 'color 0.3s ease',
                      wordBreak: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {formattedName}
                  </Typography>
                </Box>
                
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
                    '& .MuiChip-icon': {
                      fontSize: '0.9rem'
                    },
                    boxShadow: badgeInfo.variant === 'filled' ? theme.shadows[2] : 'none'
                  }}
                />
              </Box>
              
              {/* Descripción */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessCenter 
                  fontSize="small" 
                  sx={{ 
                    color: alpha(theme.palette.text.secondary, 0.7),
                    fontSize: '1rem'
                  }} 
                />
                <Typography 
                  variant="body2" 
                  sx={{
                    color: alpha(theme.palette.text.secondary, 0.8),
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    lineHeight: 1.4
                  }}
                >
                  {business.description || 'Sede Principal'}
                </Typography>
              </Box>
              
              {/* Indicador activo */}
              {isActive && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mt: 2,
                  pt: 2,
                  borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}>
                  <Verified 
                    fontSize="small" 
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontSize: '1rem'
                    }} 
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: theme.palette.primary.main,
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
        })
      )}
    </Box>
  );
};

export default BusinessSwitcher;