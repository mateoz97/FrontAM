import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Alert,
  Stack,
  Fade,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  Restaurant as RestaurantIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibleForm } from '../hooks/useAccessibleForm';
import { useNotifications } from '../hooks/useNotifications';
import AccessibleButton from '../components/common/AccessibleButton';
import SimpleFormField from '../components/common/SimpleFormField';
import NotificationSystem from '../components/common/NotificationSystem';
import { MESSAGES, VALIDATION } from '../config/constants';

/**
 * Página de login completamente accesible y optimizada para todas las edades
 * - Formularios grandes y fáciles de leer
 * - Mensajes claros y comprensibles
 * - Navegación simplificada
 * - Soporte completo de teclado y lector de pantalla
 */
const AccessibleLogin = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { login, loading: authLoading, error: authError, clearError } = useAuth();
  const notifications = useNotifications();
  
  // Configuración del formulario con validación
  const form = useAccessibleForm(
    {
      identifier: '',
      password: '',
    },
    {
      identifier: {
        label: 'Usuario o Correo',
        required: true,
        minLength: 3,
        helperText: 'Ingresa tu nombre de usuario o correo electrónico',
      },
      password: {
        label: 'Contraseña',
        required: true,
        minLength: VALIDATION.MIN_PASSWORD_LENGTH,
        helperText: 'Ingresa tu contraseña',
      },
    }
  );

  // Limpiar errores cuando se monta el componente
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Mostrar errores de autenticación como notificaciones
  useEffect(() => {
    if (authError) {
      notifications.showError(authError, {
        title: 'Error al iniciar sesión',
        duration: 8000,
      });
      clearError();
    }
  }, [authError, notifications, clearError]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await login({
        username: values.identifier,
        password: values.password,
      });

      if (result.success) {
        notifications.showSuccess(MESSAGES.SUCCESS.LOGIN, {
          title: '¡Perfecto!',
        });
        
        // Dar tiempo para que se vea la notificación antes de navegar
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        notifications.showError(
          result.error || 'No se pudo iniciar sesión. Verifica tus datos.',
          {
            title: 'Error al iniciar sesión',
          }
        );
      }
    } catch (error) {
      notifications.showError(
        'Hubo un problema al iniciar sesión. Intenta nuevamente.',
        {
          title: 'Error inesperado',
        }
      );
    }
  });

  const handleGoToRegister = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    notifications.showInfo(
      'Contacta al administrador del sistema para recuperar tu contraseña.',
      {
        title: 'Recuperar contraseña',
        duration: 8000,
      }
    );
  };

  return (
    <>
      <NotificationSystem 
        notifications={notifications.notifications}
        onRemove={notifications.removeNotification}
      />
      
      <Container 
        maxWidth="sm" 
        sx={{ 
          py: 4,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Fade in timeout={600}>
          <Paper 
            elevation={3}
            sx={{ 
              p: isMobile ? 3 : 5,
              borderRadius: 3,
              width: '100%',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
            role="main"
            aria-labelledby="login-title"
          >
            {/* Header con logo y título */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'primary.main',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                role="img"
                aria-label="Logo del restaurante"
              >
                <RestaurantIcon 
                  sx={{ 
                    fontSize: 40, 
                    color: 'white',
                  }} 
                />
              </Box>
              
              <Typography 
                id="login-title"
                variant="h3" 
                align="center" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  color: 'text.primary',
                  fontSize: isMobile ? '2rem' : '2.5rem',
                }}
              >
                Bienvenido
              </Typography>
              
              <Typography 
                variant="h6" 
                align="center" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                Inicia sesión para acceder a tu cuenta
              </Typography>
            </Box>

            {/* Formulario de login */}
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: '100%' }}
              role="form"
              aria-label="Formulario de inicio de sesión"
            >
              <Stack spacing={3}>
                <SimpleFormField
                  {...form.getFieldProps('identifier')}
                  label="Usuario o Correo electrónico"
                  placeholder="tu_usuario o tu@email.com"
                  type="text"
                  startIcon={<PersonIcon />}
                  autoComplete="username"
                  example="juan123 o juan@restaurante.com"
                  ariaLabel="Ingresa tu nombre de usuario o correo electrónico"
                />

                <SimpleFormField
                  {...form.getFieldProps('password')}
                  label="Contraseña"
                  placeholder="Tu contraseña"
                  type="password"
                  startIcon={<LockIcon />}
                  autoComplete="current-password"
                  ariaLabel="Ingresa tu contraseña"
                />

                <AccessibleButton
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  loading={authLoading || form.formState.isSubmitting}
                  disabled={!form.formState.canSubmit}
                  startIcon={<LoginIcon />}
                  ariaLabel="Iniciar sesión con los datos ingresados"
                  sx={{ 
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                >
                  {authLoading || form.formState.isSubmitting 
                    ? MESSAGES.LOADING.LOGIN 
                    : 'Iniciar Sesión'
                  }
                </AccessibleButton>
              </Stack>
            </Box>

            {/* Enlaces adicionales */}
            <Box sx={{ mt: 4 }}>
              <Stack spacing={2}>
                <AccessibleButton
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={handleGoToRegister}
                  ariaLabel="Ir a la página de registro para crear una cuenta nueva"
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Crear una cuenta nueva
                </AccessibleButton>

                <AccessibleButton
                  variant="text"
                  size="large"
                  fullWidth
                  onClick={handleForgotPassword}
                  ariaLabel="Obtener ayuda para recuperar contraseña"
                  sx={{ 
                    py: 1,
                    fontSize: '1rem',
                    textDecoration: 'underline',
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </AccessibleButton>
              </Stack>
            </Box>

            {/* Información de ayuda */}
            <Alert 
              severity="info" 
              variant="outlined"
              sx={{ 
                mt: 4,
                fontSize: '1rem',
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                ¿Necesitas ayuda?
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                Si tienes problemas para acceder, contacta al administrador 
                o pide ayuda a un compañero. Tu información está segura.
              </Typography>
            </Alert>
          </Paper>
        </Fade>
      </Container>
    </>
  );
};

export default AccessibleLogin;