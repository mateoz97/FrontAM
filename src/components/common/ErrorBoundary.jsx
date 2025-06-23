import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Stack,
  Container,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Home as HomeIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';

/**
 * Boundary de errores optimizado para usuarios de todas las edades
 * - Mensajes claros y tranquilizadores
 * - Opciones de recuperación simples
 * - Diseño no intimidante
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent } = this.props;
      
      // Si se proporciona un componente fallback personalizado
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            onRetry={this.handleRetry}
            onGoHome={this.handleGoHome}
          />
        );
      }

      // Componente de error por defecto
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Card 
            elevation={3}
            sx={{ 
              textAlign: 'center',
              p: 4,
              backgroundColor: 'background.paper',
              border: '2px solid',
              borderColor: 'error.light',
            }}
          >
            <CardContent>
              <Box sx={{ mb: 4 }}>
                <BugReportIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: 'error.main',
                    mb: 2,
                  }} 
                />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    color: 'error.main',
                  }}
                >
                  ¡Ups! Algo no salió bien
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '1.2rem',
                    mb: 3,
                    color: 'text.secondary',
                    maxWidth: 600,
                    mx: 'auto',
                    lineHeight: 1.6,
                  }}
                >
                  No te preocupes, esto puede pasar. Nuestro equipo ya está al tanto 
                  y está trabajando para solucionarlo. Mientras tanto, puedes probar 
                  algunas de estas opciones:
                </Typography>
              </Box>

              <Alert 
                severity="info" 
                sx={{ 
                  mb: 4,
                  textAlign: 'left',
                  fontSize: '1rem',
                  '& .MuiAlert-message': {
                    width: '100%',
                  },
                }}
              >
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Qué puedes hacer:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  <li>Recargar la página</li>
                  <li>Volver al inicio</li>
                  <li>Intentar de nuevo en unos minutos</li>
                  <li>Contactar soporte si el problema persiste</li>
                </Box>
              </Alert>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                sx={{ mb: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRetry}
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Intentar de nuevo
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={this.handleGoHome}
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Ir al inicio
                </Button>

                <Button
                  variant="text"
                  size="large"
                  onClick={this.handleReload}
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Recargar página
                </Button>
              </Stack>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box 
                  sx={{ 
                    mt: 4,
                    p: 2,
                    backgroundColor: 'grey.100',
                    borderRadius: 2,
                    textAlign: 'left',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Información técnica (solo en desarrollo):
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="pre" 
                    sx={{ 
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      color: 'error.main',
                    }}
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </Typography>
                </Box>
              )}

              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 3 }}
              >
                Si necesitas ayuda, contacta a soporte técnico con el código de error: 
                <Box 
                  component="span" 
                  sx={{ 
                    fontFamily: 'monospace',
                    backgroundColor: 'grey.200',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    ml: 1,
                  }}
                >
                  ERR-{Date.now().toString(36).toUpperCase()}
                </Box>
              </Typography>
            </CardContent>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;