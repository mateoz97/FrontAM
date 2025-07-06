// src/components/business/BusinessManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardActions,
  Grid, Typography, Button, Box, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction,
  IconButton, Chip, LinearProgress, Divider, Switch, FormControlLabel
} from '@mui/material';
import {
  Business, Delete, Add, Refresh, People, Settings,
  Assessment, Security, CloudSync, Warning, CheckCircle,
  Error, Info, PersonAdd, ExitToApp, Visibility
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import businessService from '../../services/business.service';
import BusinessDeletionModal from './BusinessDeletionModal';

const BusinessManagement = () => {
  const { user, getUserBusiness } = useAuth();
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  
  // Estados para modales
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [logsModal, setLogsModal] = useState(false);
  
  // Estados para formularios
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'employee',
    message: ''
  });
  const [joinForm, setJoinForm] = useState({
    businessId: '',
    searchQuery: ''
  });
  const [searchResults, setSearchResults] = useState([]);

  const currentBusiness = getUserBusiness();

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    setLoading(true);
    try {
      const [
        businessesData,
        statsData,
        requestsData,
        invitationsData,
        logsData
      ] = await Promise.allSettled([
        businessService.getUserBusinesses(),
        businessService.getBusinessStats(),
        businessService.getJoinRequests(),
        businessService.getInvitations(),
        businessService.getMaintenanceLogs({ limit: 10 })
      ]);

      setBusinesses(businessesData.status === 'fulfilled' ? businessesData.value : []);
      setStats(statsData.status === 'fulfilled' ? statsData.value : null);
      setJoinRequests(requestsData.status === 'fulfilled' ? requestsData.value : []);
      setInvitations(invitationsData.status === 'fulfilled' ? invitationsData.value : []);
      setMaintenanceLogs(logsData.status === 'fulfilled' ? logsData.value : []);
    } catch (error) {
      console.error('Error cargando datos del negocio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBusiness = (business) => {
    setSelectedBusiness(business);
    setDeleteModal(true);
  };

  const handleInviteUser = async () => {
    try {
      await businessService.inviteUser(inviteForm);
      setInviteModal(false);
      setInviteForm({ email: '', role: 'employee', message: '' });
      await loadBusinessData();
    } catch (error) {
      console.error('Error enviando invitación:', error);
    }
  };

  const handleSearchBusinesses = async () => {
    if (!joinForm.searchQuery.trim()) return;
    
    try {
      const results = await businessService.searchBusinesses(joinForm.searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error buscando negocios:', error);
    }
  };

  const handleJoinBusiness = async (businessId) => {
    try {
      await businessService.joinBusinessRequest(businessId, 'Solicitud desde la aplicación');
      setJoinModal(false);
      await loadBusinessData();
    } catch (error) {
      console.error('Error enviando solicitud:', error);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await businessService.approveJoinRequest(requestId);
      await loadBusinessData();
    } catch (error) {
      console.error('Error aprobando solicitud:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await businessService.rejectJoinRequest(requestId);
      await loadBusinessData();
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
    }
  };

  const handleCleanupSchemas = async () => {
    try {
      setLoading(true);
      await businessService.cleanupOrphanedSchemas();
      await loadBusinessData();
    } catch (error) {
      console.error('Error limpiando esquemas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business />
          Gestión de Negocios
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setJoinModal(true)}
            sx={{ mr: 1 }}
          >
            Unirse a Negocio
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setInviteModal(true)}
          >
            Invitar Usuario
          </Button>
        </Box>
      </Box>

      {/* Estadísticas */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.total_orders || 0}
                </Typography>
                <Typography color="text.secondary">
                  Órdenes Totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {stats.active_users || 0}
                </Typography>
                <Typography color="text.secondary">
                  Usuarios Activos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  ${stats.revenue || 0}
                </Typography>
                <Typography color="text.secondary">
                  Ingresos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {stats.pending_requests || 0}
                </Typography>
                <Typography color="text.secondary">
                  Solicitudes Pendientes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Mis Negocios */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Mis Negocios"
              action={
                <IconButton onClick={loadBusinessData}>
                  <Refresh />
                </IconButton>
              }
            />
            <CardContent>
              {businesses.length === 0 ? (
                <Alert severity="info">No tienes negocios asociados</Alert>
              ) : (
                <List>
                  {businesses.map((business) => (
                    <ListItem key={business.id}>
                      <ListItemIcon>
                        <Business />
                      </ListItemIcon>
                      <ListItemText
                        primary={business.name}
                        secondary={
                          <Box>
                            <Chip
                              label={business.role || 'Miembro'}
                              size="small"
                              color={business.role === 'Owner' ? 'primary' : 'default'}
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={business.is_active ? 'Activo' : 'Inactivo'}
                              size="small"
                              color={getStatusColor(business.is_active ? 'active' : 'inactive')}
                            />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        {business.role === 'Owner' && (
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteBusiness(business)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Solicitudes Pendientes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Solicitudes de Unión" />
            <CardContent>
              {joinRequests.length === 0 ? (
                <Alert severity="info">No hay solicitudes pendientes</Alert>
              ) : (
                <List>
                  {joinRequests.map((request) => (
                    <ListItem key={request.id}>
                      <ListItemIcon>
                        <People />
                      </ListItemIcon>
                      <ListItemText
                        primary={request.user_email || request.user_name}
                        secondary={`Solicitud: ${new Date(request.created_at).toLocaleDateString()}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => handleApproveRequest(request.id)}
                          color="success"
                          size="small"
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          onClick={() => handleRejectRequest(request.id)}
                          color="error"
                          size="small"
                        >
                          <Error />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Herramientas de Administración */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Herramientas de Administración" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Assessment />}
                    onClick={() => setLogsModal(true)}
                  >
                    Ver Logs
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Security />}
                    onClick={handleCleanupSchemas}
                    disabled={loading}
                  >
                    Limpiar Esquemas
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CloudSync />}
                    onClick={loadBusinessData}
                    disabled={loading}
                  >
                    Sincronizar
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Settings />}
                  >
                    Configuraciones
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal de Eliminación de Negocio */}
      <BusinessDeletionModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        business={selectedBusiness}
        onSuccess={loadBusinessData}
      />

      {/* Modal de Invitación */}
      <Dialog open={inviteModal} onClose={() => setInviteModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invitar Usuario</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email del Usuario"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={inviteForm.role}
                  label="Rol"
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                >
                  <MenuItem value="employee">Empleado</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mensaje (opcional)"
                value={inviteForm.message}
                onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleInviteUser}>
            Enviar Invitación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Unirse a Negocio */}
      <Dialog open={joinModal} onClose={() => setJoinModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Unirse a un Negocio</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Buscar Negocios"
              value={joinForm.searchQuery}
              onChange={(e) => setJoinForm({ ...joinForm, searchQuery: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchBusinesses()}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSearchBusinesses}
              sx={{ mb: 3 }}
            >
              Buscar
            </Button>
            
            {searchResults.length > 0 && (
              <List>
                {searchResults.map((business) => (
                  <ListItem key={business.id}>
                    <ListItemText
                      primary={business.name}
                      secondary={business.description || business.business_type}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        onClick={() => handleJoinBusiness(business.id)}
                      >
                        Solicitar Unión
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Loading Overlay */}
      {loading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      )}
    </Box>
  );
};

export default BusinessManagement;