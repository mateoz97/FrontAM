// src/components/SocialFeed/CreatePost.jsx
import React from 'react';
import { 
  Box, Paper, Avatar, Typography, Button, useTheme, alpha, Fade
} from '@mui/material';
import { 
  Photo, VideoCall, LocationOn, TrendingUp, 
  EmojiEmotions, Create 
} from '@mui/icons-material';

const CreatePost = ({ onOpenModal, user }) => {
  const theme = useTheme();

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const quickActions = [
    {
      icon: <Photo fontSize="small" />,
      label: 'Foto',
      color: theme.palette.primary.main,
      hoverColor: alpha(theme.palette.primary.main, 0.1)
    },
    {
      icon: <VideoCall fontSize="small" />,
      label: 'Video',
      color: theme.palette.error.main,
      hoverColor: alpha(theme.palette.error.main, 0.1)
    },
    {
      icon: <LocationOn fontSize="small" />,
      label: 'Ubicación',
      color: theme.palette.success.main,
      hoverColor: alpha(theme.palette.success.main, 0.1)
    },
    {
      icon: <EmojiEmotions fontSize="small" />,
      label: 'Sentimiento',
      color: theme.palette.warning.main,
      hoverColor: alpha(theme.palette.warning.main, 0.1)
    }
  ];

  return (
    <Fade in timeout={600}>
      <Paper 
        elevation={2}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[6],
            transform: 'translateY(-2px)'
          }
        }}
      >
        {/* Sección principal - Avatar y campo de texto */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              border: `3px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            {getInitials()}
          </Avatar>
          
          <Box
            onClick={onOpenModal}
            sx={{
              flex: 1,
              bgcolor: alpha(theme.palette.grey[100], 0.7),
              borderRadius: 6,
              p: 2,
              cursor: 'pointer',
              border: `2px solid transparent`,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                bgcolor: alpha(theme.palette.grey[100], 1),
                borderColor: alpha(theme.palette.primary.main, 0.3),
                transform: 'translateY(-1px)',
                '&::before': {
                  transform: 'translateX(100%)'
                }
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
                transition: 'transform 0.6s ease',
                transform: 'translateX(-100%)'
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                color="text.secondary"
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Create fontSize="small" sx={{ opacity: 0.7 }} />
                ¿Qué hay de nuevo en tu restaurante?
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Separador con gradiente */}
        <Box 
          sx={{ 
            height: 1, 
            background: `linear-gradient(90deg, transparent, ${theme.palette.divider}, transparent)`,
            mb: 2 
          }} 
        />
        
        {/* Acciones rápidas */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {quickActions.map((action, index) => (
            <Button
              key={action.label}
              onClick={onOpenModal}
              startIcon={action.icon}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                color: action.color,
                borderRadius: 2,
                px: 2,
                py: 1,
                minWidth: 'auto',
                flex: { xs: '1 1 calc(50% - 8px)', sm: '0 1 auto' },
                justifyContent: { xs: 'center', sm: 'flex-start' },
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: action.hoverColor,
                  color: action.color,
                  transform: 'translateY(-1px)',
                  '& .MuiButton-startIcon': {
                    transform: 'scale(1.1)'
                  }
                },
                '& .MuiButton-startIcon': {
                  transition: 'transform 0.2s ease',
                  marginRight: { xs: 0.5, sm: 1 }
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {action.label}
              </Typography>
              {/* Mostrar solo en móvil */}
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.7rem',
                  display: { xs: 'block', sm: 'none' }
                }}
              >
                {action.label}
              </Typography>
            </Button>
          ))}
        </Box>

        {/* Indicador sutil de actividad */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 2,
          opacity: 0.6 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: 'text.secondary'
          }}>
            <TrendingUp sx={{ fontSize: 16 }} />
            <Typography variant="caption">
              Comparte las novedades de tu negocio
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default CreatePost;