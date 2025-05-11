import React, { useState } from 'react';
import { 
  Box, Container, Paper, TextField, Button, Typography, 
  InputAdornment, IconButton, Divider, CircularProgress,
  Avatar, Grow
} from '@mui/material';
import { 
  Visibility, VisibilityOff, Restaurant, Login as LoginIcon 
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/material/styles';

// Componente animado personalizado
const AnimatedBox = styled(Box)(({ delay = 0 }) => ({
  animation: `fadeInUp 0.8s ease-out ${delay}ms forwards`,
  opacity: 0,
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // CAMBIO 1: Cambiamos 'email' por 'identifier' para aceptar username o email
    identifier: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // CAMBIO 2: Ahora pasamos el identifier que puede ser username o email
      await login({
        username: formData.identifier,
        password: formData.password
      });
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
        <AnimatedBox delay={0} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              animation: 'pulse 2s infinite'
            }}
          >
            <Restaurant sx={{ fontSize: 40 }} />
          </Avatar>
        </AnimatedBox>
        
        <AnimatedBox delay={200}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            sx={{ fontWeight: 'bold' }}
          >
            Bienvenido
          </Typography>
        </AnimatedBox>
        
        <AnimatedBox delay={400}>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ mb: 4, color: 'text.secondary' }}
          >
            Sistema de Control de Restaurantes
          </Typography>
        </AnimatedBox>

        <AnimatedBox delay={600} component="form" onSubmit={handleSubmit}>
          {error && (
            <Grow in={!!error} timeout={300}>
              <Typography 
                color="error" 
                align="center" 
                sx={{ mb: 2, fontSize: 14 }}
              >
                {error}
              </Typography>
            </Grow>
          )}

          {/* CAMBIO 3: Actualizamos el label y name del TextField */}
          <TextField
            fullWidth
            label="Usuario o Correo electrónico"
            name="identifier"
            type="text"
            value={formData.identifier}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Contraseña"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
          
          <Divider sx={{ my: 3 }}>O</Divider>
          
          <Button
            fullWidth
            variant="outlined"
            size="large"
            component={Link}
            to="/register"
            sx={{ py: 1.5 }}
          >
            Crear una cuenta
          </Button>
        </AnimatedBox>
      </Paper>
    </Container>
  );
};

export default Login;