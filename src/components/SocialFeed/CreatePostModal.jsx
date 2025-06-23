// src/components/SocialFeed/CreatePostModal.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Button, TextField, IconButton, Avatar, Typography,
  Fade, Slide, Stack, Chip, Divider, useTheme, alpha,
  LinearProgress, Alert
} from '@mui/material';
import { 
  Close, Photo, VideoCall, LocationOn, Send,
  Business, EmojiEmotions, AttachFile
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import postService from '../../services/post.service';

// Componente de transición personalizada
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreatePostModal = ({ open, onClose, onPostCreated, activeBusinessId }) => {
  const { user, getUserBusiness } = useAuth();
  const theme = useTheme();
  const businessInfo = getUserBusiness();
  
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleSubmit = async () => {
    if (!content.trim() && !selectedFile) {
      setError('Por favor escribe algo o selecciona una imagen');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const postData = {
        content: content.trim(),
        businessId: activeBusinessId
      };

      // Si hay archivo seleccionado, añadirlo
      if (selectedFile) {
        postData.image = selectedFile;
      }

      const newPost = await postService.createPost(postData);

      onPostCreated({
        content: content.trim(),
        image: selectedFile,
        createdPost: newPost
      });
      
      // Limpiar formulario
      setContent('');
      setSelectedFile(null);
      setFilePreview(null);
      setError('');
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.detail || 'Error al crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten imágenes');
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no puede ser mayor a 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const getUserFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'Usuario';
  };

  const canPost = (content.trim().length > 0 || selectedFile) && !loading;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
        // Pasar el post ya creado del servidor
          borderRadius: 3,
          minHeight: '400px',
          maxHeight: '80vh',
          boxShadow: theme.shadows[12]
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'transparent', // Sin oscurecimiento
          backdropFilter: 'none', // Sin blur
        }
      }}
    >
      {/* Header del modal */}
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant="h6" component="div" fontWeight={600}>
          Crear publicación
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={{ 
            '&:hover': { 
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      {/* Indicador de progreso */}
      {loading && (
        <LinearProgress 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1
          }} 
        />
      )}

      <DialogContent sx={{ pt: 3 }}>
        {/* Información del usuario */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            {getInitials()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {getUserFullName()}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              {businessInfo && (
                <Chip
                  icon={<Business fontSize="small" />}
                  label={businessInfo.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              )}
              <Typography variant="caption" color="text.secondary">
                Publicando como: {businessInfo ? 'Negocio' : 'Personal'}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* Mostrar error si existe */}
        {error && (
          <Fade in={Boolean(error)}>
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          </Fade>
        )}
        
        {/* Campo de texto principal */}
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="¿Qué hay de nuevo en tu restaurante?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': { 
                borderColor: alpha(theme.palette.divider, 0.5) 
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main
              }
            },
            '& .MuiInputBase-input': {
              fontSize: '1rem',
              lineHeight: 1.5
            }
          }}
        />

        {/* Preview de imagen */}
        {filePreview && (
          <Fade in={Boolean(filePreview)}>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Box
                component="img"
                src={filePreview}
                alt="Preview"
                sx={{
                  width: '100%',
                  maxHeight: 300,
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: `2px solid ${alpha(theme.palette.divider, 0.3)}`
                }}
              />
              <IconButton
                onClick={removeFile}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main
                  }
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Fade>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        {/* Opciones de multimedia */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleFileSelect}
            disabled={loading}
          />
          <label htmlFor="image-upload">
            <Button
              component="span"
              startIcon={<Photo />}
              disabled={loading}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08)
                }
              }}
            >
              Foto/Video
            </Button>
          </label>
          
          <Button 
            startIcon={<EmojiEmotions />} 
            disabled={loading}
            sx={{ 
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.secondary.main, 0.08)
              }
            }}
          >
            Emoji
          </Button>
          
          <Button 
            startIcon={<LocationOn />} 
            disabled={loading}
            sx={{ 
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.success.main, 0.08)
              }
            }}
          >
            Ubicación
          </Button>
        </Box>

        {/* Contador de caracteres */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography 
            variant="caption" 
            color={content.length > 500 ? 'error' : 'text.secondary'}
          >
            {content.length}/500
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{ 
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canPost}
          startIcon={loading ? null : <Send />}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            },
            '&:disabled': {
              background: alpha(theme.palette.action.disabled, 0.3)
            }
          }}
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostModal;