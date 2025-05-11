// src/components/SocialFeed/TopHeader.jsx
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Notifications, Message, Restaurant } from '@mui/icons-material';

const TopHeader = () => {
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Restaurant sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            RestControl
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton>
            <Notifications />
          </IconButton>
          <IconButton>
            <Message />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TopHeader;