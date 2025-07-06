// src/components/settings/BusinessConfigurationSystem.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Avatar,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Tabs,
  Tab,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Business as BusinessIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { 
  getBusinessTypeConfig, 
  getBusinessTypeLabel, 
  getBusinessTypeIcon, 
  getBusinessTypeColor,
  getBusinessModules,
  getBusinessPaymentTypes 
} from '../../utils/businessTypes';
import { PAYMENTS, BUSINESS } from '../../config/constants';

const BusinessConfigurationSystem = ({
  businessType = 'restaurant',
  currentConfig = {},
  onConfigChange,
  onSaveConfig,
  loading = false,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [config, setConfig] = useState({
    modules: {},
    features: {},
    payments: {},
    notifications: {},
    appearance: {},
    integration: {},
    ...currentConfig,
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const businessConfig = getBusinessTypeConfig(businessType);
  const businessLabel = getBusinessTypeLabel(businessType);
  const businessIcon = getBusinessTypeIcon(businessType);
  const businessColor = getBusinessTypeColor(businessType);
  const availableModules = getBusinessModules(businessType);
  const availablePayments = getBusinessPaymentTypes(businessType);

  const tabs = [
    { label: 'Módulos', icon: <BusinessIcon />, key: 'modules' },
    { label: 'Pagos', icon: <PaymentIcon />, key: 'payments' },
    { label: 'Notificaciones', icon: <NotificationsIcon />, key: 'notifications' },
    { label: 'Apariencia', icon: <PaletteIcon />, key: 'appearance' },
    { label: 'Integraciones', icon: <StorageIcon />, key: 'integration' },
  ];

  useEffect(() => {
    setUnsavedChanges(JSON.stringify(config) !== JSON.stringify(currentConfig));
  }, [config, currentConfig]);

  const handleConfigUpdate = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    
    if (onConfigChange) {
      onConfigChange(section, key, value);
    }
  };

  const handleSave = async () => {
    if (onSaveConfig) {
      await onSaveConfig(config);
      setUnsavedChanges(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const BusinessTypeHeader = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(businessColor, 0.1),
              color: businessColor,
              width: 56,
              height: 56,
              mr: 2,
              fontSize: '1.5rem',
            }}
          >
            {businessIcon}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Configuración de {businessLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Personaliza tu negocio según tus necesidades específicas
            </Typography>
          </Box>
        </Box>
        
        {unsavedChanges && (
          <Alert 
            severity="warning" 
            action={
              <Button color="inherit" size="small" onClick={handleSave}>
                Guardar
              </Button>
            }
          >
            Tienes cambios sin guardar
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const ModulesTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Módulos Disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Activa o desactiva los módulos según las necesidades de tu {businessLabel.toLowerCase()}
        </Typography>
      </Grid>

      {availableModules.map((module) => {
        const moduleConfig = getModuleConfig(module);
        const isEnabled = config.modules[module] ?? true;
        
        return (
          <Grid item xs={12} sm={6} md={4} key={module}>
            <Card
              sx={{
                border: isEnabled ? `2px solid ${businessColor}` : '1px solid',
                borderColor: isEnabled ? businessColor : 'divider',
                bgcolor: isEnabled ? alpha(businessColor, 0.05) : 'background.paper',
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '1.5rem', mr: 1 }}>
                      {moduleConfig.icon}
                    </Typography>
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                        {moduleConfig.label}
                      </Typography>
                      {moduleConfig.required && (
                        <Chip label="Requerido" size="small" color="primary" sx={{ height: 20 }} />
                      )}
                    </Box>
                  </Box>
                  
                  <Switch
                    checked={isEnabled}
                    onChange={(e) => handleConfigUpdate('modules', module, e.target.checked)}
                    disabled={moduleConfig.required}
                    color="primary"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {moduleConfig.description}
                </Typography>
                
                {moduleConfig.features && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {moduleConfig.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 24 }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  const PaymentsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Métodos de Pago
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configura los métodos de pago disponibles para tu {businessLabel.toLowerCase()}
        </Typography>
      </Grid>

      {availablePayments.map((paymentMethod) => {
        const isEnabled = config.payments[paymentMethod] ?? true;
        const methodConfig = PAYMENTS.METHOD_LABELS[paymentMethod];
        const methodIcon = PAYMENTS.METHOD_ICONS[paymentMethod];
        
        return (
          <Grid item xs={12} sm={6} key={paymentMethod}>
            <Card
              sx={{
                border: isEnabled ? `2px solid ${businessColor}` : '1px solid',
                borderColor: isEnabled ? businessColor : 'divider',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '1.5rem', mr: 2 }}>
                      {methodIcon}
                    </Typography>
                    <Typography variant="h6">
                      {methodConfig}
                    </Typography>
                  </Box>
                  
                  <Switch
                    checked={isEnabled}
                    onChange={(e) => handleConfigUpdate('payments', paymentMethod, e.target.checked)}
                    color="primary"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
      
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Configuración Adicional
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Moneda Principal</InputLabel>
                  <Select
                    value={config.payments?.currency || 'MXN'}
                    onChange={(e) => handleConfigUpdate('payments', 'currency', e.target.value)}
                    label="Moneda Principal"
                  >
                    {Object.entries(PAYMENTS.CURRENCIES).map(([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {PAYMENTS.CURRENCY_SYMBOLS[value]} {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.payments?.allowTips ?? true}
                      onChange={(e) => handleConfigUpdate('payments', 'allowTips', e.target.checked)}
                    />
                  }
                  label="Permitir Propinas"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.payments?.autoReceipts ?? true}
                      onChange={(e) => handleConfigUpdate('payments', 'autoReceipts', e.target.checked)}
                    />
                  }
                  label="Recibos Automáticos"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const NotificationsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Configuración de Notificaciones
        </Typography>
      </Grid>

      {getNotificationCategories().map((category) => (
        <Grid item xs={12} key={category.key}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => toggleSection(category.key)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {category.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {category.label}
                  </Typography>
                </Box>
                
                <IconButton>
                  {expandedSections[category.key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              
              <Collapse in={expandedSections[category.key]}>
                <Box sx={{ mt: 2 }}>
                  {category.notifications.map((notification) => (
                    <FormControlLabel
                      key={notification.key}
                      control={
                        <Switch
                          checked={config.notifications[notification.key] ?? notification.default}
                          onChange={(e) => handleConfigUpdate('notifications', notification.key, e.target.checked)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1">{notification.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {notification.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}
                    />
                  ))}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const AppearanceTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Personalización Visual
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Color Principal
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {getColorOptions().map((color) => (
                  <Box
                    key={color.value}
                    onClick={() => handleConfigUpdate('appearance', 'primaryColor', color.value)}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: color.value,
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: config.appearance?.primaryColor === color.value ? '3px solid' : '1px solid',
                      borderColor: config.appearance?.primaryColor === color.value ? 'text.primary' : 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {config.appearance?.primaryColor === color.value && (
                      <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={config.appearance?.darkMode ?? false}
                  onChange={(e) => handleConfigUpdate('appearance', 'darkMode', e.target.checked)}
                />
              }
              label="Modo Oscuro"
            />
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Configuración Regional
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Idioma</InputLabel>
              <Select
                value={config.appearance?.language || 'es'}
                onChange={(e) => handleConfigUpdate('appearance', 'language', e.target.value)}
                label="Idioma"
              >
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Zona Horaria</InputLabel>
              <Select
                value={config.appearance?.timezone || 'America/Mexico_City'}
                onChange={(e) => handleConfigUpdate('appearance', 'timezone', e.target.value)}
                label="Zona Horaria"
              >
                <MenuItem value="America/Mexico_City">Ciudad de México</MenuItem>
                <MenuItem value="America/New_York">Nueva York</MenuItem>
                <MenuItem value="Europe/Madrid">Madrid</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const getModuleConfig = (module) => {
    const moduleConfigs = {
      orders: { 
        icon: '📋', 
        label: 'Pedidos', 
        description: 'Gestión completa de pedidos y órdenes',
        features: ['Crear pedidos', 'Seguimiento', 'Estados'],
        required: businessConfig.hasOrders 
      },
      inventory: { 
        icon: '📦', 
        label: 'Inventario', 
        description: 'Control de stock y productos',
        features: ['Stock', 'Alertas', 'Reportes'],
        required: businessConfig.hasInventory 
      },
      reservations: { 
        icon: '📅', 
        label: 'Reservas', 
        description: 'Sistema de reservas y citas',
        features: ['Calendario', 'Confirmaciones', 'Recordatorios'] 
      },
      menu: { 
        icon: '🍽️', 
        label: 'Menú', 
        description: 'Gestión de menús y productos',
        features: ['Categorías', 'Precios', 'Disponibilidad'] 
      },
      delivery: { 
        icon: '🚚', 
        label: 'Delivery', 
        description: 'Sistema de entregas a domicilio',
        features: ['Zonas', 'Tarifas', 'Seguimiento'] 
      },
    };
    
    return moduleConfigs[module] || { 
      icon: '⚙️', 
      label: module, 
      description: `Módulo ${module}`,
      features: []
    };
  };

  const getNotificationCategories = () => [
    {
      key: 'orders',
      label: 'Pedidos',
      icon: <BusinessIcon />,
      notifications: [
        { key: 'newOrder', label: 'Nuevo pedido', description: 'Cuando se recibe un nuevo pedido', default: true },
        { key: 'orderConfirmed', label: 'Pedido confirmado', description: 'Cuando se confirma un pedido', default: true },
        { key: 'orderReady', label: 'Pedido listo', description: 'Cuando un pedido está listo', default: true },
      ],
    },
    {
      key: 'payments',
      label: 'Pagos',
      icon: <PaymentIcon />,
      notifications: [
        { key: 'paymentReceived', label: 'Pago recibido', description: 'Cuando se recibe un pago', default: true },
        { key: 'paymentFailed', label: 'Pago fallido', description: 'Cuando falla un pago', default: true },
      ],
    },
    {
      key: 'system',
      label: 'Sistema',
      icon: <SettingsIcon />,
      notifications: [
        { key: 'systemMaintenance', label: 'Mantenimiento', description: 'Notificaciones de mantenimiento', default: false },
        { key: 'securityAlerts', label: 'Alertas de seguridad', description: 'Alertas importantes de seguridad', default: true },
      ],
    },
  ];

  const getColorOptions = () => [
    { label: 'Azul', value: '#1976d2' },
    { label: 'Verde', value: '#388e3c' },
    { label: 'Rojo', value: '#d32f2f' },
    { label: 'Naranja', value: '#f57c00' },
    { label: 'Púrpura', value: '#7b1fa2' },
    { label: 'Índigo', value: '#303f9f' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return <ModulesTab />;
      case 1: return <PaymentsTab />;
      case 2: return <NotificationsTab />;
      case 3: return <AppearanceTab />;
      case 4: return <Box><Typography>Integraciones en desarrollo...</Typography></Box>;
      default: return <ModulesTab />;
    }
  };

  return (
    <Box>
      <BusinessTypeHeader />
      
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: businessColor,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
              sx={{
                '&.Mui-selected': {
                  color: businessColor,
                },
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mb: 4 }}>
        {renderTabContent()}
      </Box>

      {/* Save Button */}
      <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {unsavedChanges ? 'Cambios pendientes de guardar' : 'Configuración guardada'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setConfig(currentConfig)}
              disabled={!unsavedChanges}
            >
              Descartar
            </Button>
            
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!unsavedChanges || loading}
              sx={{ bgcolor: businessColor }}
            >
              {loading ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessConfigurationSystem;