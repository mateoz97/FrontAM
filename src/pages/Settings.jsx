// src/pages/Settings.jsx
import React, { useState } from 'react';
import {
  Container, Paper, Typography, Box, Tabs, Tab, Switch,
  FormControlLabel, Button, Divider, Grid, Card, CardContent,
  IconButton, Avatar, Chip, Alert, TextField, Select, MenuItem,
  FormControl, InputLabel, useTheme, alpha, Stack
} from '@mui/material';
import {
  Notifications, Security, Language, Palette, Business,
  Save, Edit, Delete, Brightness4, Brightness7, VolumeUp,
  Email, Sms, NotificationsActive, AccountCircle, Lock, Visibility,
  VisibilityOff, Restaurant, Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, getUserBusiness, getUserRole } = useAuth();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
//   const [darkMode, setDarkMode] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
  // Estados para configuraciones
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      orderUpdates: true,
      inventoryAlerts: true,
      systemNotifications: false
    },
    privacy: {
      profileVisible: true,
      showActivity: false,
      allowMessages: true
    },
    business: {
      autoLogout: 30,
      sessionTimeout: 60,
      requireTwoFactor: false
    },
    appearance: {
      theme: 'light',
      language: 'es',
      fontSize: 'medium',
      compactMode: false
    }
  });

  const businessInfo = getUserBusiness();
  const roleInfo = getUserRole();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    console.log('Guardando configuraciones:', settings);
    // Aquí conectaremos con el backend
  };

  const tabsData = [
    { label: 'General', icon: <SettingsIcon /> },
    { label: 'Notificaciones', icon: <Notifications /> },
    { label: 'Privacidad', icon: <Security /> },
    { label: 'Negocio', icon: <Business /> },
    { label: 'Apariencia', icon: <Palette /> }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Configuración
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Personaliza tu experiencia y configura las preferencias de tu cuenta
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Tabs */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.primary.main, 0.02)
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500
              }
            }}
          >
            {tabsData.map((tab, index) => (
              <Tab 
                key={index}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
                sx={{ gap: 1 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* General Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Información del usuario */}
            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AccountCircle color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Información Personal</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
                      {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {user?.first_name} {user?.last_name} 
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {businessInfo && (
                          <Chip label={businessInfo.name} size="small" color="primary" />
                        )}
                        {roleInfo && (
                          <Chip label={roleInfo.name} size="small" color="secondary" />
                        )}
                      </Stack>
                    </Box>
                  </Box>
                  
                  <Button variant="outlined" startIcon={<Edit />} fullWidth>
                    Editar Perfil
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Configuración de sesión */}
            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Lock color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Sesión y Seguridad</Typography>
                  </Box>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Tiempo de inactividad</InputLabel>
                    <Select
                      value={settings.business.autoLogout}
                      onChange={(e) => handleSettingChange('business', 'autoLogout', e.target.value)}
                    >
                      <MenuItem value={15}>15 minutos</MenuItem>
                      <MenuItem value={30}>30 minutos</MenuItem>
                      <MenuItem value={60}>1 hora</MenuItem>
                      <MenuItem value={120}>2 horas</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.business.requireTwoFactor}
                        onChange={(e) => handleSettingChange('business', 'requireTwoFactor', e.target.checked)}
                      />
                    }
                    label="Autenticación de dos factores"
                  />
                  
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<Lock />}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Cambiar Contraseña
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Actividad reciente */}
            <Grid item xs={12}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Actividad Reciente
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Últimas actividades en tu cuenta
                  </Alert>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      Último acceso: Hoy a las 14:30
                    </Typography>
                    <Button size="small">Ver historial completo</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notificaciones Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Canales de Notificación
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email color="primary" sx={{ mr: 2 }} />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.email}
                          onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                        />
                      }
                      label="Notificaciones por email"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <NotificationsActive color="primary" sx={{ mr: 2 }} />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.push}
                          onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                        />
                      }
                      label="Notificaciones push"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Sms color="primary" sx={{ mr: 2 }} />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.sms}
                          onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                        />
                      }
                      label="Notificaciones SMS"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tipos de Notificación
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.orderUpdates}
                        onChange={(e) => handleSettingChange('notifications', 'orderUpdates', e.target.checked)}
                      />
                    }
                    label="Actualizaciones de pedidos"
                    sx={{ display: 'flex', mb: 1 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.inventoryAlerts}
                        onChange={(e) => handleSettingChange('notifications', 'inventoryAlerts', e.target.checked)}
                      />
                    }
                    label="Alertas de inventario"
                    sx={{ display: 'flex', mb: 1 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.systemNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'systemNotifications', e.target.checked)}
                      />
                    }
                    label="Notificaciones del sistema"
                    sx={{ display: 'flex', mb: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Privacidad Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Configuración de Privacidad
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacy.profileVisible}
                        onChange={(e) => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                      />
                    }
                    label="Perfil visible para otros usuarios"
                    sx={{ display: 'flex', mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacy.showActivity}
                        onChange={(e) => handleSettingChange('privacy', 'showActivity', e.target.checked)}
                      />
                    }
                    label="Mostrar actividad reciente"
                    sx={{ display: 'flex', mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacy.allowMessages}
                        onChange={(e) => handleSettingChange('privacy', 'allowMessages', e.target.checked)}
                      />
                    }
                    label="Permitir mensajes de otros usuarios"
                    sx={{ display: 'flex', mb: 2 }}
                  />

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom color="error">
                    Zona Peligrosa
                  </Typography>
                  
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<Delete />}
                    sx={{ mr: 2 }}
                  >
                    Eliminar Cuenta
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    color="warning"
                  >
                    Descargar Datos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Negocio Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card elevation={1}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Restaurant color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Configuración del Negocio</Typography>
                  </Box>

                  {businessInfo ? (
                    <>
                      <Alert severity="info" sx={{ mb: 3 }}>
                        Estás conectado al negocio: <strong>{businessInfo.name}</strong>
                      </Alert>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Nombre del negocio"
                            value={businessInfo.name}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Tu rol"
                            value={roleInfo?.name || 'Sin rol'}
                            disabled
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3 }} />

                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Tiempo de sesión del negocio</InputLabel>
                        <Select
                          value={settings.business.sessionTimeout}
                          onChange={(e) => handleSettingChange('business', 'sessionTimeout', e.target.value)}
                        >
                          <MenuItem value={30}>30 minutos</MenuItem>
                          <MenuItem value={60}>1 hora</MenuItem>
                          <MenuItem value={120}>2 horas</MenuItem>
                          <MenuItem value={240}>4 horas</MenuItem>
                        </Select>
                      </FormControl>

                      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button variant="outlined" color="warning">
                          Salir del Negocio
                        </Button>
                        {businessInfo.is_owner && (
                          <Button variant="outlined" color="primary">
                            Configurar Negocio
                          </Button>
                        )}
                      </Box>
                    </>
                  ) : (
                    <Alert severity="warning">
                      No tienes un negocio asignado. 
                      <Button sx={{ ml: 1 }}>Unirse a un negocio</Button>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Apariencia Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tema y Apariencia
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Tema</InputLabel>
                    <Select
                      value={settings.appearance.theme}
                      onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                    >
                      <MenuItem value="light">Claro</MenuItem>
                      <MenuItem value="dark">Oscuro</MenuItem>
                      <MenuItem value="auto">Automático</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Idioma</InputLabel>
                    <Select
                      value={settings.appearance.language}
                      onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                    >
                      <MenuItem value="es">Español</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Tamaño de fuente</InputLabel>
                    <Select
                      value={settings.appearance.fontSize}
                      onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                    >
                      <MenuItem value="small">Pequeño</MenuItem>
                      <MenuItem value="medium">Mediano</MenuItem>
                      <MenuItem value="large">Grande</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.appearance.compactMode}
                        onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                      />
                    }
                    label="Modo compacto"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Vista previa
                  </Typography>
                  <Box 
                    sx={{ 
                      p: 2, 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 1,
                      bgcolor: settings.appearance.theme === 'dark' ? 'grey.900' : 'background.paper'
                    }}
                  >
                    <Typography variant="h6">Ejemplo de tarjeta</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Así se verá el contenido con la configuración seleccionada
                    </Typography>
                    <Button size="small" sx={{ mt: 1 }}>
                      Botón de ejemplo
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Botones de acción */}
        <Box sx={{ p: 3, bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined">
              Restablecer
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Save />}
              onClick={handleSaveSettings}
            >
              Guardar Cambios
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;