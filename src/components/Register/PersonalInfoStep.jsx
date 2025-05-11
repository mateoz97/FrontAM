import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, InputAdornment, IconButton,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowForward } from '@mui/icons-material';

const PersonalInfoStep = ({ formData, handleChange, error, loading, onSubmit, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Crear cuenta
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Nombre"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Apellido"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </Box>
      
      <TextField
        fullWidth
        label="Nombre de usuario"
        name="username"
        value={formData.username}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Correo electrónico"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
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
      
      <TextField
        fullWidth
        label="Confirmar contraseña"
        name="confirmPassword"
        type={showPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
        >
          Volver
        </Button>
        
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
        >
          {loading ? 'Registrando...' : 'Continuar'}
        </Button>
      </Box>
    </Box>
  );
};

export default PersonalInfoStep;