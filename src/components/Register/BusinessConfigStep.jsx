import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, List, ListItem,
  ListItemAvatar, ListItemText, Avatar, Paper, 
  InputAdornment, CircularProgress
} from '@mui/material';
import { Search, CheckCircle, Home } from '@mui/icons-material';
import authService from '../../services/auth.service';

const BusinessConfigStep = ({ userType, formData, handleChange, onBack, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

  const handleBusinessCreation = async () => {
    setLoading(true);
    try {
      await authService.createBusiness({
        name: formData.businessName,
        address: formData.businessAddress,
        phone: formData.businessPhone
      });
      onComplete();
    } catch (error) {
      console.error('Error creating business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessJoin = async (businessId) => {
    setLoading(true);
    try {
      await authService.joinBusinessRequest(businessId);
      onComplete();
    } catch (error) {
      console.error('Error joining business:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear negocio
  if (userType === 'create') {
    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Información de tu negocio
        </Typography>
        
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
            onClick={handleBusinessCreation}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {loading ? 'Creando negocio...' : 'Crear negocio'}
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
        
        <List sx={{ mt: 3 }}>
          {searchLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : businesses.map((business) => (
            <Paper key={business.id} elevation={2} sx={{ mb: 2 }}>
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
                  variant="outlined"
                  color="primary"
                  onClick={() => handleBusinessJoin(business.id)}
                  disabled={loading}
                >
                  Solicitar unirse
                </Button>
              </ListItem>
            </Paper>
          ))}
        </List>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
          <Button variant="outlined" onClick={onBack}>
            Atrás
          </Button>
        </Box>
      </Box>
    );
  }

  // Cliente
  if (userType === 'client') {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        
        <Typography variant="h5" gutterBottom>
          ¡Bienvenido!
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Tu cuenta ha sido creada exitosamente.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={onComplete}
          startIcon={<Home />}
        >
          Ir al inicio
        </Button>
      </Box>
    );
  }

  return null;
};

export default BusinessConfigStep;