// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, Avatar, TextField, Button,
  Divider, Grid, Chip, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Edit, Save, Cancel, AccountCircle, Business, Badge } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/auth.service';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode === false) {
      // Reset form if canceling edit
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await authService.updateUserProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });
      
      // Update user in context
      await updateUser();
      
      setSnackbar({
        open: true,
        message: 'Perfil actualizado correctamente',
        severity: 'success'
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar el perfil',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Profile Header */}
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
            {getInitials()}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {user.business_info && (
                <Chip
                  icon={<Business fontSize="small" />}
                  label={user.business_info.name}
                  size="small"
                  color="primary"
                />
              )}
              {user.role_info && (
                <Chip
                  icon={<Badge fontSize="small" />}
                  label={user.role_info.name}
                  size="small"
                  color="secondary"
                />
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
              {editMode ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Profile Form */}
        <Grid container spacing={3}>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!editMode}
              variant={editMode ? "outlined" : "filled"}
              margin="normal"
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!editMode}
              variant={editMode ? "outlined" : "filled"}
              margin="normal"
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre de usuario"
              name="username"
              value={formData.username}
              disabled={true} // Username cannot be changed
              variant="filled"
              margin="normal"
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
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
              value={formData.phone}
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
              value={formData.address}
              onChange={handleChange}
              disabled={!editMode}
              variant={editMode ? "outlined" : "filled"}
              margin="normal"
            />
          </Grid>
        </Grid>

        {editMode && (
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

      {/* User Stats Card */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Estadísticas de Usuario
        </Typography>
        <Grid container spacing={3}>
          <Grid xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="primary.main">
                {user.posts_count || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Publicaciones
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="primary.main">
                {user.orders_count || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pedidos
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="primary.main">
                {user.days_active || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Días Activo
              </Typography>
            </Box>
          </Grid>
        </Grid>
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

export default UserProfile;