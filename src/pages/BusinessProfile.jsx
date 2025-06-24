// src/pages/BusinessProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button, Divider,
  Grid, CircularProgress, Snackbar, Alert, Tabs, Tab, Avatar,
  Card, CardContent, IconButton, Tooltip
} from '@mui/material';
import {
  Edit, Save, Cancel, Business, LocationOn, Phone, Email,
  Language, QueryStats, Store, Restaurant, AccessTime
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import businessService from '../services/business.service';
import { useNavigate } from 'react-router-dom';

const BusinessProfile = () => {
  const { user, getUserBusiness, hasPermission } = useAuth();
  const navigate = useNavigate();
  const businessInfo = getUserBusiness();
  
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [tabValue, setTabValue] = useState(0);
  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });

  // Check if user has access
  useEffect(() => {
    const checkAccess = async () => {
      if (!businessInfo) {
        // No business associated
        navigate('/');
        return;
      }

      const canAccess = hasPermission('can_manage_roles') || 
                         businessInfo.is_owner || 
                         (user.role_info && 
                          (user.role_info.name.toLowerCase().includes('admin') || 
                           user.role_info.name.toLowerCase().includes('gerente')));
      
      if (!canAccess) {
        setSnackbar({
          open: true,
          message: 'No tienes permisos para acceder a esta página',
          severity: 'error'
        });
        navigate('/');
      }
    };
    
    checkAccess();
  }, [businessInfo, hasPermission, navigate, user]);

  // Load business data
  useEffect(() => {
    const loadBusinessData = async () => {
      setLoading(true);
      try {
        if (businessInfo && businessInfo.id) {
          const data = await businessService.getBusinessById(businessInfo.id);
          setBusinessData({
            name: data.name || '',
            description: data.description || '',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || ''
          });
        }
      } catch (error) {
        console.error('Error loading business data:', error);
        setSnackbar({
          open: true,
          message: 'Error al cargar datos del negocio',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadBusinessData();
  }, [businessInfo]);

  const handleChange = (e) => {
    setBusinessData({
      ...businessData,
      [e.target.name]: e.target.value
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode === false) {
      // Reset form if canceling edit
      if (businessInfo) {
        setBusinessData({
          name: businessInfo.name || '',
          description: businessInfo.description || '',
          address: businessInfo.address || '',
          phone: businessInfo.phone || '',
          email: businessInfo.email || '',
          website: businessInfo.website || ''
        });
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (businessInfo && businessInfo.id) {
        await businessService.updateBusiness(businessInfo.id, businessData);
        
        setSnackbar({
          open: true,
          message: 'Negocio actualizado correctamente',
          severity: 'success'
        });
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating business:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar el negocio',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !businessData.name) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Business Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
              mr: 3
            }}
          >
            <Restaurant fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {businessData.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {businessData.description || 'Sin descripción'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              {businessData.address && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {businessData.address}
                  </Typography>
                </Box>
              )}
              {businessData.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {businessData.phone}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Button
              startIcon={editMode ? <Cancel /> : <Edit />}
              variant={editMode ? "outlined" : "contained"}
              color={editMode ? "error" : "primary"}
              onClick={handleEditToggle}
            >
              {editMode ? 'Cancelar' : 'Editar Negocio'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Business Tabs */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            centered
          >
            <Tab icon={<Business />} label="Información" />
            <Tab icon={<QueryStats />} label="Estadísticas" />
            <Tab icon={<Store />} label="Sucursales" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ mt: 3 }}>
          {/* Information Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre del Negocio"
                  name="name"
                  value={businessData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  variant={editMode ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  name="address"
                  value={businessData.address}
                  onChange={handleChange}
                  disabled={!editMode}
                  variant={editMode ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  value={businessData.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  variant={editMode ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={businessData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  variant={editMode ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sitio web"
                  name="website"
                  value={businessData.website}
                  onChange={handleChange}
                  disabled={!editMode}
                  variant={editMode ? "outlined" : "filled"}
                  margin="normal"
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  name="description"
                  value={businessData.description}
                  onChange={handleChange}
                  disabled={!editMode}
                  variant={editMode ? "outlined" : "filled"}
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          )}

          {/* Statistics Tab */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="text.secondary">Ventas del Mes</Typography>
                      <Tooltip title="Actualizado hoy">
                        <AccessTime color="action" />
                      </Tooltip>
                    </Box>
                    <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
                      $12,450
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      ↑ 8.2% desde el mes pasado
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="text.secondary">Pedidos</Typography>
                      <Tooltip title="Actualizado hoy">
                        <AccessTime color="action" />
                      </Tooltip>
                    </Box>
                    <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
                      243
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      ↑ 12.4% desde el mes pasado
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="text.secondary">Clientes</Typography>
                      <Tooltip title="Actualizado hoy">
                        <AccessTime color="action" />
                      </Tooltip>
                    </Box>
                    <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
                      128
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      ↑ 5.7% desde el mes pasado
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12}>
                <Paper sx={{ p: 3, mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Ventas de los Últimos 6 Meses
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Gráfico de ventas (aquí iría un componente de gráficos)
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Branches Tab */}
          {tabValue === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Sucursales</Typography>
                <Button variant="contained" color="primary">
                  Añadir Sucursal
                </Button>
              </Box>
              
              {/* If no branches */}
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No hay sucursales disponibles. Añade una nueva sucursal para empezar.
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Save Button when in edit mode */}
        {editMode && tabValue === 0 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BusinessProfile;