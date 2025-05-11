// src/components/SocialFeed/CreatePost.jsx
import React from 'react';
import { Box, Paper, Avatar, Button, Typography } from '@mui/material';
import { Photo, VideoCall, LocationOn } from '@mui/icons-material';

const CreatePost = ({ onOpenModal, user }) => {
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {getInitials()}
        </Avatar>
        <Box
          sx={{
            flex: 1,
            bgcolor: '#f0f2f5',
            borderRadius: 6,
            p: 1.5,
            cursor: 'pointer'
          }}
          onClick={onOpenModal}
        >
          <Typography color="text.secondary">
            ¿Qué hay de nuevo en tu restaurante?
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, borderTop: '1px solid #e0e0e0', pt: 1 }}>
        <Button
          startIcon={<Photo />}
          sx={{ flex: 1, textTransform: 'none' }}
          onClick={onOpenModal}
        >
          Foto
        </Button>
        <Button
          startIcon={<VideoCall />}
          sx={{ flex: 1, textTransform: 'none' }}
          onClick={onOpenModal}
        >
          Video
        </Button>
        <Button
          startIcon={<LocationOn />}
          sx={{ flex: 1, textTransform: 'none' }}
          onClick={onOpenModal}
        >
          Ubicación
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePost;