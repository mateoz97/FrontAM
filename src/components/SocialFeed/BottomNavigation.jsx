// src/components/SocialFeed/BottomNavigation.jsx
import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Home, RestaurantMenu, Receipt, BarChart, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const { activeBusinessId } = useAuth();

  const navItems = [
    { icon: <Home />, label: 'Inicio', path: '/feed' },
    { icon: <RestaurantMenu />, label: 'Menú', path: '/menu' },
    { icon: <Receipt />, label: 'Pedidos', path: '/orders' },
    { icon: <BarChart />, label: 'Reportes', path: '/reports' },
    { icon: <Settings />, label: 'Gestión', path: `/dashboard/${activeBusinessId}` },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-around',
        py: 0.5,
        zIndex: 100,
      }}
    >
      {navItems.map((item) => (
        <Box
          key={item.label}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate(item.path)}
        >
          <IconButton size="small" sx={{ p: 0.5 }}>
            {item.icon}
          </IconButton>
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default BottomNavigation;