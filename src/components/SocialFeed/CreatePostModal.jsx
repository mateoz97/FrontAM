// src/components/SocialFeed/CreatePostModal.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Button, TextField, IconButton, Avatar, Typography
} from '@mui/material';
import { Close, Photo, VideoCall, LocationOn } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import postService from '../../services/post.service';

const CreatePostModal = ({ open, onClose, onPostCreated, activeBusinessId }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const newPost = await postService.createPost({
        content,
        businessId: activeBusinessId
      });
      onPostCreated(newPost);
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
        <Typography variant="h6">Crear publicación</Typography>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
        >
          Publicar
        </Button>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {getInitials()}
          </Avatar>
          <Box>
            <Typography fontWeight="bold">
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Publicando como: {activeBusinessId ? 'Negocio' : 'Personal'}
            </Typography>
          </Box>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={6}
          placeholder="¿Qué hay de nuevo en tu restaurante?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: 'none' }
            }
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button startIcon={<Photo />} sx={{ textTransform: 'none' }}>
            Foto/Video
          </Button>
          <Button startIcon={<LocationOn />} sx={{ textTransform: 'none' }}>
            Ubicación
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal; // Esta línea es importante