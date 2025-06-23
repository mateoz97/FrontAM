import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Button,
  Stack,
  Slide,
  Fade,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * Sistema de notificaciones accesible y fácil de entender
 * - Mensajes grandes y claros
 * - Colores de alto contraste
 * - Tiempos de visualización apropiados
 * - Acciones claras cuando sea necesario
 */
const NotificationSystem = ({ notifications, onRemove }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <SuccessIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  const getSeverity = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const handleClose = (id, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onRemove(id);
  };

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: 500,
        width: '100%',
      }}
    >
      <Stack spacing={2}>
        {notifications.map((notification) => (
          <Slide
            key={notification.id}
            direction="left"
            in={true}
            timeout={300}
          >
            <Snackbar
              open={true}
              autoHideDuration={notification.autoHide ? notification.duration : null}
              onClose={(event, reason) => handleClose(notification.id, reason)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                position: 'relative',
                transform: 'none !important',
                left: 'auto !important',
                right: 'auto !important',
                top: 'auto !important',
              }}
            >
              <Alert
                severity={getSeverity(notification.type)}
                variant="filled"
                icon={getIcon(notification.type)}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {notification.actions && notification.actions.map((action, index) => (
                      <Button
                        key={index}
                        color="inherit"
                        size="small"
                        onClick={() => {
                          if (action.action) {
                            action.action();
                          }
                          onRemove(notification.id);
                        }}
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          textDecoration: 'underline',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={() => onRemove(notification.id)}
                      aria-label="Cerrar notificación"
                      sx={{
                        padding: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
                sx={{
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: 500,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                  },
                  '& .MuiAlert-message': {
                    flex: 1,
                    paddingRight: 2,
                  },
                }}
              >
                {notification.title && (
                  <AlertTitle 
                    sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: notification.message ? 1 : 0,
                    }}
                  >
                    {notification.title}
                  </AlertTitle>
                )}
                {notification.message && (
                  <Box sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
                    {notification.message}
                  </Box>
                )}
                {notification.showProgress && (
                  <Box sx={{ mt: 1 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 4,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          backgroundColor: 'white',
                          borderRadius: 2,
                          animation: 'pulse 1.5s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%': {
                              width: '0%',
                            },
                            '50%': {
                              width: '100%',
                            },
                            '100%': {
                              width: '0%',
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Alert>
            </Snackbar>
          </Slide>
        ))}
      </Stack>
    </Box>
  );
};

NotificationSystem.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
      title: PropTypes.string,
      message: PropTypes.string,
      duration: PropTypes.number,
      autoHide: PropTypes.bool,
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          action: PropTypes.func,
        })
      ),
      showProgress: PropTypes.bool,
    })
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default NotificationSystem;