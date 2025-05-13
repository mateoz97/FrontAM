// src/components/SocialFeed/BusinessSwitcher.jsx
import React from 'react';
import { Box, Card, Typography, Chip } from '@mui/material';

const BusinessSwitcher = ({ businesses, activeBusinessId, onSelectBusiness }) => {
  // Función para obtener el estilo y color del badge de rol
  const getRoleBadge = (role, isOwner) => {
    if (isOwner) return { label: 'Owner', color: 'primary' };
    
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'administrador':
        return { label: 'Admin', color: 'warning' };
      case 'mesero':
      case 'waiter':
        return { label: 'Mesero', color: 'success' };
      case 'cocinero':
      case 'chef':
        return { label: 'Cocinero', color: 'info' };
      default:
        return { label: role || 'Usuario', color: 'default' };
    }
  };

  if (!businesses || businesses.length === 0) {
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
      {businesses.map((business) => {
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
      })}
    </Box>
  );
};

export default BusinessSwitcher;