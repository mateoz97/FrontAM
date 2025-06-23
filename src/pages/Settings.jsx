// src/pages/Settings.jsx - Versión final optimizada
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  RestoreFromTrash as RestoreIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../contexts/ThemeContext';

// Componente de Tab Panel
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings = () => {
  useAuth();
  const { mode, toggleTheme, setThemeMode, isDark } = useTheme();
  const {
    userSettings,
    businessSettings,
    notificationTemplates,
    settingsSummary,
    loading,
    error,
    lastUpdated,
    isDataLoaded,
    // User actions
    patchUserSettings,
    resetUserSettings,
    // Business actions
    patchBusinessSettings,
    resetBusinessSettings,
    // Template actions
    createDefaultTemplates,
    deleteNotificationTemplate,
    // Bulk actions
    exportAndDownloadSettings,
    resetAllSettings,
    refreshSummary,
    // Local helpers
    updateUserSettingsLocal,
    updateBusinessSettingsLocal,
    clearError,
  } = useSettings();

  // Estados locales
  const [tabValue, setTabValue] = useState(0);
  const [saving, setSaving] = useState(false);
  const [resetDialog, setResetDialog] = useState({ open: false, type: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Utilidades
  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // =================== USER SETTINGS HANDLERS ===================

  const handleSaveUserSettings = async () => {
    if (!userSettings) return;
    
    setSaving(true);
    const result = await patchUserSettings(userSettings);
    setSaving(false);
    
    if (result.success) {
      showMessage('Configuraciones de usuario guardadas exitosamente');
    } else {
      showMessage(result.error, 'error');
    }
  };

  const handleResetUserSettings = async () => {
    setSaving(true);
    const result = await resetUserSettings();
    setSaving(false);
    setResetDialog({ open: false, type: '' });
    
    if (result.success) {
      showMessage('Configuraciones de usuario restauradas exitosamente');
    } else {
      showMessage(result.error, 'error');
    }
  };

  // =================== BUSINESS SETTINGS HANDLERS ===================

  const handleSaveBusinessSettings = async () => {
    if (!businessSettings) return;
    
    setSaving(true);
    const result = await patchBusinessSettings(businessSettings);
    setSaving(false);
    
    if (result.success) {
      showMessage('Configuraciones del negocio guardadas exitosamente');
    } else {
      showMessage(result.error, 'error');
    }
  };

  const handleResetBusinessSettings = async () => {
    setSaving(true);
    const result = await resetBusinessSettings();
    setSaving(false);
    setResetDialog({ open: false, type: '' });
    
    if (result.success) {
      showMessage('Configuraciones del negocio restauradas exitosamente');
    } else {
      showMessage(result.error, 'error');
    }
  };

  // =================== NOTIFICATION TEMPLATE HANDLERS ===================

  const handleCreateDefaultTemplates = async () => {
    setSaving(true);
    const result = await createDefaultTemplates();
    setSaving(false);
    
    if (result.success) {
      showMessage('Plantillas por defecto creadas exitosamente');
    } else {
      showMessage(result.error, 'error');
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    const result = await deleteNotificationTemplate(templateId);
    
    if (result.success) {
      showMessage('Plantilla eliminada exitosamente');
    } else {
      showMessage(result.error, 'error');
    }
  };

  // =================== BULK OPERATIONS HANDLERS ===================

  const handleExportSettings = async () => {
    const result = await exportAndDownloadSettings();
    
    if (result.success) {
      showMessage('Configuraciones exportadas y descargadas exitosamente');
    } else {
      showMessage(result.error, 'error');
    }
  };

  const handleResetAllSettings = async () => {
    setSaving(true);
    const result = await resetAllSettings();
    setSaving(false);
    setResetDialog({ open: false, type: '' });
    
    if (result.success) {
      showMessage('Todas las configuraciones restauradas exitosamente');
    } else {
      showMessage(result.error, 'error');
    }
  };

  const handleRefreshSummary = async () => {
    const result = await refreshSummary();
    
    if (result.success) {
      showMessage('Resumen actualizado');
    } else {
      showMessage(result.error, 'error');
    }
  };

  // =================== DIALOG HANDLERS ===================

  const openResetDialog = (type) => {
    setResetDialog({ open: true, type });
  };

  const closeResetDialog = () => {
    setResetDialog({ open: false, type: '' });
  };

  const handleConfirmReset = () => {
    switch (resetDialog.type) {
      case 'user':
        handleResetUserSettings();
        break;
      case 'business':
        handleResetBusinessSettings();
        break;
      case 'all':
        handleResetAllSettings();
        break;
      default:
        closeResetDialog();
    }
  };

  // =================== RENDER HELPERS ===================

  const getResetDialogContent = () => {
    switch (resetDialog.type) {
      case 'user':
        return {
          title: '¿Restaurar configuraciones de usuario?',
          content: 'Esta acción restaurará todas las configuraciones de usuario a sus valores por defecto.'
        };
      case 'business':
        return {
          title: '¿Restaurar configuraciones del negocio?',
          content: 'Esta acción restaurará todas las configuraciones del negocio a sus valores por defecto.'
        };
      case 'all':
        return {
          title: '¿Restaurar todas las configuraciones?',
          content: 'Esta acción restaurará TODAS las configuraciones (usuario y negocio) a sus valores por defecto.'
        };
      default:
        return { title: '', content: '' };
    }
  };

  // =================== LOADING & ERROR STATES ===================

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando configuraciones...
        </Typography>
      </Box>
    );
  }

  if (error && !isDataLoaded) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={clearError}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // =================== MAIN RENDER ===================

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Configuraciones
        </Typography>
        
        <Box display="flex" gap={1}>
          <IconButton onClick={handleRefreshSummary} title="Actualizar">
            <RefreshIcon />
          </IconButton>
          {lastUpdated && (
            <Chip 
              label={`Actualizado: ${lastUpdated.toLocaleTimeString()}`} 
              size="small" 
              variant="outlined" 
            />
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Usuario" />
          <Tab icon={<BusinessIcon />} label="Negocio" />
          <Tab icon={<NotificationsIcon />} label="Notificaciones" />
          <Tab icon={<SecurityIcon />} label="Seguridad" />
          <Tab icon={<BackupIcon />} label="Respaldo" />
        </Tabs>

        {/* Tab Panel 1: Configuraciones de Usuario */}
        <TabPanel value={tabValue} index={0}>
          {userSettings ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Apariencia" 
                    action={
                      <Button
                        size="small"
                        color="warning"
                        onClick={() => openResetDialog('user')}
                      >
                        Restaurar
                      </Button>
                    }
                  />
                  <CardContent>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Tema</InputLabel>
                      <Select
                        value={mode}
                        onChange={(e) => {
                          // Actualizar el tema en el contexto global
                          if (e.target.value === 'light' || e.target.value === 'dark') {
                            setThemeMode(e.target.value);
                          }
                          // También actualizar en configuraciones locales si existe
                          if (updateUserSettingsLocal) {
                            updateUserSettingsLocal({ theme: e.target.value });
                          }
                        }}
                      >
                        <MenuItem value="light">Claro</MenuItem>
                        <MenuItem value="dark">Oscuro</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isDark}
                          onChange={toggleTheme}
                        />
                      }
                      label={`Modo ${isDark ? 'oscuro' : 'claro'}`}
                      sx={{ mt: 2 }}
                    />

                    <FormControl fullWidth margin="normal">
                      <InputLabel>Idioma</InputLabel>
                      <Select
                        value={userSettings.language || 'es'}
                        onChange={(e) => updateUserSettingsLocal({ language: e.target.value })}
                      >
                        <MenuItem value="es">Español</MenuItem>
                        <MenuItem value="en">Inglés</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={userSettings.compact_view || false}
                          onChange={(e) => updateUserSettingsLocal({ compact_view: e.target.checked })}
                        />
                      }
                      label="Vista compacta"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Preferencias" />
                  <CardContent>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Zona Horaria</InputLabel>
                      <Select
                        value={userSettings.timezone || 'America/Bogota'}
                        onChange={(e) => updateUserSettingsLocal({ timezone: e.target.value })}
                      >
                        <MenuItem value="America/Bogota">Bogotá (GMT-5)</MenuItem>
                        <MenuItem value="America/Mexico_City">Ciudad de México (GMT-6)</MenuItem>
                        <MenuItem value="America/Lima">Lima (GMT-5)</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={userSettings.auto_save || false}
                          onChange={(e) => updateUserSettingsLocal({ auto_save: e.target.checked })}
                        />
                      }
                      label="Guardado automático"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={userSettings.privacy_profile_visible !== false}
                          onChange={(e) => updateUserSettingsLocal({ privacy_profile_visible: e.target.checked })}
                        />
                      }
                      label="Perfil visible"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={userSettings.email_notifications !== false}
                          onChange={(e) => updateUserSettingsLocal({ email_notifications: e.target.checked })}
                        />
                      }
                      label="Notificaciones por email"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={userSettings.push_notifications !== false}
                          onChange={(e) => updateUserSettingsLocal({ push_notifications: e.target.checked })}
                        />
                      }
                      label="Notificaciones push"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="contained"
                    onClick={handleSaveUserSettings}
                    disabled={saving}
                  >
                    {saving ? <CircularProgress size={20} /> : 'Guardar Cambios'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="info">No se encontraron configuraciones de usuario</Alert>
          )}
        </TabPanel>

        {/* Tab Panel 2: Configuraciones de Negocio */}
        <TabPanel value={tabValue} index={1}>
          {businessSettings ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Información del Negocio"
                    action={
                      <Button
                        size="small"
                        color="warning"
                        onClick={() => openResetDialog('business')}
                      >
                        Restaurar
                      </Button>
                    }
                  />
                  <CardContent>
                    <TextField
                      fullWidth
                      label="Nombre del Negocio"
                      value={businessSettings.business_name || ''}
                      onChange={(e) => updateBusinessSettingsLocal({ business_name: e.target.value })}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Dirección"
                      value={businessSettings.business_address || ''}
                      onChange={(e) => updateBusinessSettingsLocal({ business_address: e.target.value })}
                      margin="normal"
                      multiline
                      rows={2}
                    />
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={businessSettings.business_phone || ''}
                      onChange={(e) => updateBusinessSettingsLocal({ business_phone: e.target.value })}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={businessSettings.business_email || ''}
                      onChange={(e) => updateBusinessSettingsLocal({ business_email: e.target.value })}
                      margin="normal"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Configuraciones Operativas" />
                  <CardContent>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Moneda</InputLabel>
                      <Select
                        value={businessSettings.currency || 'COP'}
                        onChange={(e) => updateBusinessSettingsLocal({ currency: e.target.value })}
                      >
                        <MenuItem value="COP">Peso Colombiano (COP)</MenuItem>
                        <MenuItem value="USD">Dólar (USD)</MenuItem>
                        <MenuItem value="EUR">Euro (EUR)</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Tasa de Impuesto (%)"
                      type="number"
                      value={businessSettings.tax_rate || 19.0}
                      onChange={(e) => updateBusinessSettingsLocal({ tax_rate: parseFloat(e.target.value) || 0 })}
                      margin="normal"
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />

                    <TextField
                      fullWidth
                      label="Umbral de Stock Bajo"
                      type="number"
                      value={businessSettings.low_stock_threshold || 10}
                      onChange={(e) => updateBusinessSettingsLocal({ low_stock_threshold: parseInt(e.target.value) || 0 })}
                      margin="normal"
                      inputProps={{ min: 0 }}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={businessSettings.allow_online_orders !== false}
                          onChange={(e) => updateBusinessSettingsLocal({ allow_online_orders: e.target.checked })}
                        />
                      }
                      label="Permitir pedidos en línea"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={businessSettings.inventory_alerts !== false}
                          onChange={(e) => updateBusinessSettingsLocal({ inventory_alerts: e.target.checked })}
                        />
                      }
                      label="Alertas de inventario"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={businessSettings.require_order_confirmation !== false}
                          onChange={(e) => updateBusinessSettingsLocal({ require_order_confirmation: e.target.checked })}
                        />
                      }
                      label="Requerir confirmación de pedidos"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="contained"
                    onClick={handleSaveBusinessSettings}
                    disabled={saving}
                  >
                    {saving ? <CircularProgress size={20} /> : 'Guardar Cambios'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="info">No se encontraron configuraciones del negocio</Alert>
          )}
        </TabPanel>

        {/* Tab Panel 3: Plantillas de Notificación */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardHeader 
              title="Plantillas de Notificación"
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateDefaultTemplates}
                  disabled={saving}
                >
                  Crear Plantillas por Defecto
                </Button>
              }
            />
            <CardContent>
              {notificationTemplates.length > 0 ? (
                <List>
                  {notificationTemplates.map((template) => (
                    <ListItem key={template.id} divider>
                      <ListItemText
                        primary={template.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Tipo: {template.template_type}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Asunto: {template.subject}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          size="small" 
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end"
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  No hay plantillas de notificación. Puedes crear las plantillas por defecto.
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Tab Panel 4: Seguridad */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardHeader title="Configuraciones de Seguridad" />
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Gestiona la seguridad de tu cuenta y datos
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Button variant="outlined" sx={{ mr: 2, mb: 2 }}>
                  Cambiar Contraseña
                </Button>
                <Button variant="outlined" sx={{ mr: 2, mb: 2 }}>
                  Activar 2FA
                </Button>
                <Button variant="outlined" sx={{ mr: 2, mb: 2 }}>
                  Ver Sesiones Activas
                </Button>
              </Box>

              {settingsSummary && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Resumen de Configuraciones
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            {settingsSummary.user_settings_count || 0}
                          </Typography>
                          <Typography variant="body2">
                            Configuraciones de Usuario
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            {settingsSummary.business_settings_count || 0}
                          </Typography>
                          <Typography variant="body2">
                            Configuraciones de Negocio
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            {settingsSummary.notification_templates_count || 0}
                          </Typography>
                          <Typography variant="body2">
                            Plantillas de Notificación
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            {settingsSummary.last_updated ? 'Actualizado' : 'Sin datos'}
                          </Typography>
                          <Typography variant="body2">
                            Estado
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Tab Panel 5: Respaldo y Restauración */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Exportar Configuraciones" />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Descarga un archivo con todas tus configuraciones actuales
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportSettings}
                    sx={{ mt: 2 }}
                  >
                    Exportar y Descargar
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Restaurar Configuraciones" />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Restaura las configuraciones a sus valores por defecto
                  </Typography>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<RestoreIcon />}
                    onClick={() => openResetDialog('all')}
                    sx={{ mt: 2 }}
                  >
                    Restaurar Todas las Configuraciones
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Dialog de confirmación para reset */}
      <Dialog open={resetDialog.open} onClose={closeResetDialog}>
        <DialogTitle>{getResetDialogContent().title}</DialogTitle>
        <DialogContent>
          <Typography>
            {getResetDialogContent().content}
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResetDialog}>Cancelar</Button>
          <Button 
            onClick={handleConfirmReset} 
            color="warning" 
            variant="contained"
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;