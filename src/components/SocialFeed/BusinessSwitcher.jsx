// src/components/SocialFeed/BusinessSwitcher.jsx
import React from 'react';
import { Box, Card, Typography, Chip, Skeleton } from '@mui/material';
import { BusinessCenter, SupervisorAccount, Person } from '@mui/icons-material';

/**
 * Componente que muestra los negocios del usuario permitiendo cambiar entre ellos
 * @param {Object} props 
 * @param {Array} props.businesses - Lista de negocios del usuario
 * @param {number} props.activeBusinessId - ID del negocio activo
 * @param {Function} props.onSelectBusiness - Función a llamar al seleccionar un negocio
 * @param {boolean} props.loading - Indica si está cargando los datos
 */
const BusinessSwitcher = ({ businesses, activeBusinessId, onSelectBusiness, loading = false }) => {
  // Función para obtener el estilo y color del badge de rol
  const getRoleBadge = (role, isOwner) => {
    if (isOwner) return { label: 'Propietario', color: 'primary', icon: <BusinessCenter fontSize="small" /> };
    
    const roleLower = role?.toLowerCase() || '';
    
    if (roleLower.includes('admin')) {
      return { label: 'Admin', color: 'warning', icon: <SupervisorAccount fontSize="small" /> };
    }
    if (roleLower.includes('gerente') || roleLower.includes('manager')) {
      return { label: 'Gerente', color: 'warning', icon: <SupervisorAccount fontSize="small" /> };
    }
    if (roleLower.includes('mesero') || roleLower.includes('waiter')) {
      return { label: 'Mesero', color: 'success', icon: <Person fontSize="small" /> };
    }
    if (roleLower.includes('cocinero') || roleLower.includes('chef')) {
      return { label: 'Cocinero', color: 'info', icon: <Person fontSize="small" /> };
    }
    
    return { 
      label: role || 'Usuario', 
      color: 'default', 
      icon: <Person fontSize="small" /> 
    };
  };

  // Si no hay negocios y no está cargando, no mostrar nada
  if (!loading && (!businesses || businesses.length === 0)) {
    return null;
  }

  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        gap: 2,
        pb: 1,
      }}
    >
      {loading ? (
        // Mostrar skeletons mientras carga
        Array.from(new Array(3)).map((_, index) => (
          <Card key={`skeleton-${index}`} sx={{ width: 230, minWidth: 230, p: 2 }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rectangular" width={60} height={24} />
            </Box>
          </Card>
        ))
      ) : (
        // Mostrar los negocios
        businesses.map((business) => {
          const badgeInfo = getRoleBadge(business.role, business.isOwner);
          const isActive = activeBusinessId === business.id;
          
          return (
            <Card
              key={business.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                width: 230,
                minWidth: 230,
                cursor: 'pointer',
                border: isActive ? '2px solid' : '1px solid',
                borderColor: isActive ? 'primary.main' : 'divider',
                backgroundColor: isActive ? 'primary.light' : 'background.paper',
                color: isActive ? 'primary.contrastText' : 'text.primary',
                '&:hover': { 
                  borderColor: isActive ? 'primary.dark' : 'primary.light',
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                },
                transition: 'all 0.2s ease-in-out',
                boxShadow: isActive ? 3 : 1,
                scrollSnapAlign: 'start',
              }}
              onClick={() => onSelectBusiness(business.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  {business.name}
                </Typography>
                <Chip
                  icon={badgeInfo.icon}
                  label={badgeInfo.label}
                  size="small"
                  color={badgeInfo.color}
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '0.7rem',
                    height: 24
                  }}
                />
              </Box>
              <Typography 
                variant="body2" 
                color={isActive ? 'primary.contrastText' : 'text.secondary'}
                sx={{ 
                  opacity: isActive ? 0.9 : 0.7,
                  fontWeight: 400,
                  fontSize: '0.85rem'
                }}
              >
                {business.description || 'Sede Principal'}
              </Typography>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default BusinessSwitcher;