// src/components/SocialFeed/BusinessSwitcher.jsx
import React from 'react';
import { Box, Card, Typography, Chip } from '@mui/material';

const BusinessSwitcher = ({ businesses, activeBusinessId, onSelectBusiness }) => {
  const getRoleBadge = (role, isOwner) => {
    if (isOwner) return { label: 'Owner', color: 'primary' };
    
    switch (role) {
      case 'admin':
      case 'Administrador':
        return { label: 'Admin', color: 'warning' };
      case 'Mesero':
      case 'waiter':
        return { label: 'Mesero', color: 'success' };
      default:
        return { label: role, color: 'default' };
    }
  };

  return (
    <Box
      sx={{
        mb: 2,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {businesses.map((business) => {
        const badgeInfo = getRoleBadge(business.role, business.isOwner);
        
        return (
          <Card
            key={business.id}
            sx={{
              display: 'inline-block',
              mr: 1.5,
              p: 1.5,
              minWidth: 200,
              cursor: 'pointer',
              border: activeBusinessId === business.id ? '2px solid' : '2px solid transparent',
              borderColor: activeBusinessId === business.id ? 'primary.main' : 'transparent',
              backgroundColor: activeBusinessId === business.id ? 'primary.light' : 'white',
              '&:hover': { borderColor: 'primary.light' },
              transition: 'all 0.2s',
            }}
            onClick={() => onSelectBusiness(business.id)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {business.name}
              </Typography>
              <Chip
                label={badgeInfo.label}
                size="small"
                color={badgeInfo.color}
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {business.description || 'Sede Principal'}
            </Typography>
          </Card>
        );
      })}
    </Box>
  );
};

export default BusinessSwitcher;