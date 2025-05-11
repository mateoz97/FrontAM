import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, List, ListItem,
  ListItemAvatar, ListItemText, Avatar, Paper, 
  InputAdornment, CircularProgress
} from '@mui/material';
import { Search, CheckCircle, Home } from '@mui/icons-material';
import authService from '../../services/auth.service';

const BusinessConfigStep = ({ userType, formData, handleChange, onBack, onComplete, loading, error }) => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    if (userType === 'join') {
      loadBusinesses();
    }
  }, [userType]);

  const loadBusinesses = async (search = '') => {
    setSearchLoading(true);
    try {
      const data = await authService.getBusinesses(search);
      setBusinesses(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    handleChange(e);
    const searchValue = e.target.value;
    if (searchValue.length >= 2 || searchValue.length === 0) {
      loadBusinesses(searchValue);
    }
  };

  // CAMBIO 5: Función para seleccionar un negocio
  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business);
    // Guardar el ID del negocio seleccionado en formData
    handleChange({
      target: {
        name: 'selectedBusinessId',
        value: business.id
      }
    });
  };

  // Crear negocio
  if (userType === 'create') {
    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Información de tu negocio
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <TextField
          fullWidth
          label="Nombre del negocio"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Dirección"
          name="businessAddress"
          value={formData.businessAddress}
          onChange={handleChange}
          margin="normal"
        />
        
        <TextField
          fullWidth
          label="Teléfono"
          name="businessPhone"
          value={formData.businessPhone}
          onChange={handleChange}
          margin="normal"
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant="outlined" onClick={onBack}>
            Atrás
          </Button>
          
          <Button
            variant="contained"
            onClick={onComplete}
            disabled={loading || !formData.businessName}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta y negocio'}
          </Button>
        </Box>
      </Box>
    );
  }

  // Unirse a negocio
  if (userType === 'join') {
    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Buscar negocio
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <TextField
          fullWidth
          label="Buscar negocio"
          name="searchBusiness"
          value={formData.searchBusiness}
          onChange={handleSearchChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        {selectedBusiness && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography>Negocio seleccionado: {selectedBusiness.name}</Typography>
          </Box>
        )}
        
        <List sx={{ mt: 3 }}>
          {searchLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : businesses.map((business) => (
            <Paper 
              key={business.id} 
              elevation={2} 
              sx={{ 
                mb: 2,
                bgcolor: selectedBusiness?.id === business.id ? 'action.selected' : 'background.paper'
              }}
            >
              <ListItem sx={{ py: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    {business.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={business.name}
                  secondary={`${business.member_count || 0} miembros`}
                />
                <Button
                  variant={selectedBusiness?.id === business.id ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleSelectBusiness(business)}
                >
                  {selectedBusiness?.id === business.id ? "Seleccionado" : "Seleccionar"}
                </Button>
              </ListItem>
            </Paper>
          ))}
        </List>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant="outlined" onClick={onBack}>
            Atrás
          </Button>
          
          <Button
            variant="contained"
            onClick={onComplete}
            disabled={loading || !selectedBusiness}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta y solicitar unirse'}
          </Button>
        </Box>
      </Box>
    );
  }

  // Cliente
  if (userType === 'client') {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          ¡Ya casi terminamos!
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Haz clic en el botón para completar tu registro como cliente.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={onComplete}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Home />}
        >
          {loading ? 'Creando cuenta...' : 'Completar registro'}
        </Button>
      </Box>
    );
  }

  return null;
};

export default BusinessConfigStep;