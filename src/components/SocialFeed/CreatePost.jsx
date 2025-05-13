// src/components/SocialFeed/CreatePost.jsx
import React from 'react';
import { Box, Paper, Avatar, Typography, IconButton } from '@mui/material';
import { Photo, VideoCall, LocationOn } from '@mui/icons-material';

const CreatePost = ({ onOpenModal, user }) => {
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main',
            width: 40,
            height: 40
          }}
        >
          {getInitials()}
        </Avatar>
        <Box
          onClick={onOpenModal}
          sx={{
            flex: 1,
            bgcolor: '#f0f2f5',
            borderRadius: 6,
            p: 1.5,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: '#e4e6eb'
            },
            transition: 'background-color 0.2s'
          }}
        >
          <Typography color="text.secondary">
            ¿Qué hay de nuevo?
          </Typography>
        </Box>
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          borderTop: '1px solid #e0e0e0', 
          pt: 1.5
        }}
      >
        <Box 
          onClick={onOpenModal}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            cursor: 'pointer',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
            transition: 'color 0.2s'
          }}
        >
          <Photo fontSize="small" />
          <Typography variant="body2" fontWeight={500}>
            Foto
          </Typography>
        </Box>
        
        <Box 
          onClick={onOpenModal}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            cursor: 'pointer',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
            transition: 'color 0.2s'
          }}
        >
          <VideoCall fontSize="small" />
          <Typography variant="body2" fontWeight={500}>
            Video
          </Typography>
        </Box>
        
        <Box 
          onClick={onOpenModal}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            cursor: 'pointer',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
            transition: 'color 0.2s'
          }}
        >
          <LocationOn fontSize="small" />
          <Typography variant="body2" fontWeight={500}>
            Ubicación
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePost;