import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Fade,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Componente de carga mejorado con múltiples variantes
 * - Mensajes claros y reconfortantes
 * - Indicadores visuales apropiados para cada contexto
 * - Skeleton loaders para mejor experiencia de usuario
 */
const EnhancedLoading = ({
  variant = 'circular',
  message = 'Cargando...',
  fullHeight = true,
  size = 'medium',
  showProgress = false,
  progress = 0,
  transparent = false,
  skeletonCount = 3,
  color = 'primary',
  description,
  ...props
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 60;
      default: return 48;
    }
  };

  const containerSx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    p: 4,
    ...(fullHeight && {
      minHeight: '200px',
      height: '100%',
    }),
    ...(transparent && {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
    }),
  };

  if (variant === 'skeleton') {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Skeleton 
              variant="rectangular" 
              height={60} 
              sx={{ borderRadius: 2, mb: 1 }}
              animation="wave"
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === 'card') {
    return (
      <Fade in timeout={300}>
        <Card 
          elevation={0}
          sx={{ 
            maxWidth: 400, 
            mx: 'auto',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent>
            <Box sx={containerSx}>
              <CircularProgress 
                size={getSize()} 
                color={color}
                thickness={4}
              />
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    mb: description ? 1 : 0,
                  }}
                >
                  {message}
                </Typography>
                {description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ maxWidth: 280 }}
                  >
                    {description}
                  </Typography>
                )}
              </Box>
              {showProgress && (
                <Box sx={{ width: '100%', maxWidth: 200 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress}
                    color={color}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'grey.200',
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 1 }}
                  >
                    {Math.round(progress)}%
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Fade>
    );
  }

  if (variant === 'linear') {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {message}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        <LinearProgress 
          color={color}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'grey.200',
          }}
        />
        {showProgress && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            align="center"
            sx={{ mt: 1 }}
          >
            {Math.round(progress)}%
          </Typography>
        )}
      </Box>
    );
  }

  // Variant 'circular' (default)
  return (
    <Fade in timeout={300}>
      <Box sx={containerSx} {...props}>
        <CircularProgress 
          size={getSize()} 
          color={color}
          thickness={4}
          aria-label="Cargando contenido"
        />
        <Box sx={{ textAlign: 'center', maxWidth: 300 }}>
          <Typography 
            variant={size === 'large' ? 'h5' : 'h6'} 
            sx={{ 
              fontWeight: 600,
              mb: description ? 1 : 0,
            }}
          >
            {message}
          </Typography>
          {description && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {description}
            </Typography>
          )}
        </Box>
        {showProgress && (
          <Box sx={{ width: '100%', maxWidth: 200 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress}
              color={color}
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: 'grey.200',
              }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

EnhancedLoading.propTypes = {
  variant: PropTypes.oneOf(['circular', 'linear', 'skeleton', 'card']),
  message: PropTypes.string,
  fullHeight: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showProgress: PropTypes.bool,
  progress: PropTypes.number,
  transparent: PropTypes.bool,
  skeletonCount: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info']),
  description: PropTypes.string,
};

export default EnhancedLoading;