// src/components/onboarding/BusinessOnboardingWizard.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Slide,
  Fade,
  useTheme,
  alpha,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import BusinessTypeSelector from '../business/BusinessTypeSelector';
import { 
  getBusinessTypeConfig, 
  getBusinessTypeLabel, 
  getBusinessTypeIcon, 
  getBusinessTypeColor,
  getBusinessTypeFormFields 
} from '../../utils/businessTypes';
import { useAuth } from '../../contexts/AuthContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BusinessOnboardingWizard = ({ open, onClose, onComplete }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [businessData, setBusinessData] = useState({
    name: '',
    business_type: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    modules: [],
    features: {},
  });
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      label: 'Bienvenida',
      title: '¡Bienvenido a la Plataforma Social de Negocios!',
      subtitle: 'Te ayudaremos a configurar tu negocio paso a paso',
      icon: <CampaignIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Tipo de Negocio',
      title: 'Selecciona el tipo de tu negocio',
      subtitle: 'Esto nos ayudará a configurar las funciones más relevantes',
      icon: <BusinessIcon />,
      color: theme.palette.info.main,
    },
    {
      label: 'Información',
      title: 'Información básica',
      subtitle: 'Completa los datos principales de tu negocio',
      icon: <SettingsIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: 'Configuración',
      title: 'Configura tus módulos',
      subtitle: 'Selecciona las funcionalidades que necesitas',
      icon: <GroupIcon />,
      color: theme.palette.success.main,
    },
  ];

  const features = [
    {
      id: 'social_feed',
      name: 'Feed Social',
      description: 'Comparte actualizaciones con la comunidad',
      icon: '📱',
      enabled: true,
      required: true,
    },
    {
      id: 'customer_management',
      name: 'Gestión de Clientes',
      description: 'Administra tu base de clientes',
      icon: '👥',
      enabled: true,
    },
    {
      id: 'analytics',
      name: 'Análisis y Reportes',
      description: 'Métricas y estadísticas del negocio',
      icon: '📊',
      enabled: true,
    },
    {
      id: 'notifications',
      name: 'Notificaciones',
      description: 'Mantente informado de la actividad',
      icon: '🔔',
      enabled: true,
    },
  ];

  useEffect(() => {
    if (businessData.business_type) {
      const typeConfig = getBusinessTypeConfig(businessData.business_type);
      setBusinessData(prev => ({
        ...prev,
        modules: typeConfig.modules || [],
        features: typeConfig,
      }));
    }
  }, [businessData.business_type]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleComplete();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onComplete) {
        onComplete(businessData);
      }
      onClose();
    } catch (error) {
      console.error('Error creating business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return true;
      case 1:
        return businessData.business_type !== '';
      case 2:
        return businessData.name.trim() !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  const WelcomeStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Avatar
        sx={{
          width: 120,
          height: 120,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          mx: 'auto',
          mb: 3,
          fontSize: '3rem',
        }}
      >
        🚀
      </Avatar>
      
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        ¡Hola {user?.first_name || 'Usuario'}!
      </Typography>
      
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
        Estás a punto de crear tu presencia en nuestra plataforma social de negocios
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <StarIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Conecta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Únete a una comunidad de negocios activa
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <TrendingUpIcon sx={{ fontSize: 48, color: theme.palette.success.main, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Crece
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aumenta la visibilidad de tu negocio
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <PeopleIcon sx={{ fontSize: 48, color: theme.palette.info.main, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Gestiona
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Herramientas completas para tu negocio
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const BusinessTypeStep = () => (
    <Box sx={{ py: 2 }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        Selecciona el tipo que mejor describe tu negocio. Esto nos ayudará a configurar automáticamente 
        las funciones más relevantes para ti.
      </Typography>
      
      <BusinessTypeSelector
        selectedType={businessData.business_type}
        onTypeSelect={(type) => handleInputChange('business_type', type)}
        gridColumns={{ xs: 1, sm: 2, md: 3 }}
      />

      {businessData.business_type && (
        <Fade in timeout={500}>
          <Card sx={{ mt: 3, p: 3, bgcolor: alpha(getBusinessTypeColor(businessData.business_type), 0.05) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(getBusinessTypeColor(businessData.business_type), 0.1),
                  color: getBusinessTypeColor(businessData.business_type),
                  mr: 2,
                }}
              >
                {getBusinessTypeIcon(businessData.business_type)}
              </Avatar>
              <Typography variant="h6">
                {getBusinessTypeLabel(businessData.business_type)}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tu negocio tendrá acceso a las siguientes funcionalidades:
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {businessData.modules.map(module => (
                <Chip
                  key={module}
                  label={module.charAt(0).toUpperCase() + module.slice(1)}
                  size="small"
                  sx={{
                    bgcolor: alpha(getBusinessTypeColor(businessData.business_type), 0.1),
                    color: getBusinessTypeColor(businessData.business_type),
                  }}
                />
              ))}
            </Box>
          </Card>
        </Fade>
      )}
    </Box>
  );

  const BusinessInfoStep = () => {
    const formFields = getBusinessTypeFormFields(businessData.business_type);
    
    return (
      <Box sx={{ py: 2 }}>
        <Grid container spacing={3}>
          {formFields.map((field) => (
            <Grid item xs={12} sm={field.type === 'textarea' ? 12 : 6} key={field.key}>
              {field.type === 'select' ? (
                <FormControl fullWidth required={field.required}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={businessData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    label={field.label}
                  >
                    {field.options?.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  multiline={field.type === 'textarea'}
                  rows={field.type === 'textarea' ? 3 : 1}
                  required={field.required}
                  value={businessData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const ConfigurationStep = () => (
    <Box sx={{ py: 2 }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        Estas funciones adicionales te ayudarán a gestionar mejor tu negocio y conectar con más clientes.
      </Typography>

      <Grid container spacing={2}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} key={feature.id}>
            <Card
              sx={{
                p: 2,
                cursor: feature.required ? 'default' : 'pointer',
                border: feature.enabled ? `2px solid ${theme.palette.primary.main}` : '1px solid',
                borderColor: feature.enabled ? theme.palette.primary.main : 'divider',
                bgcolor: feature.enabled ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                opacity: feature.required ? 1 : (feature.enabled ? 1 : 0.7),
                transition: 'all 0.3s ease',
                '&:hover': feature.required ? {} : {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
              onClick={() => {
                if (!feature.required) {
                  handleInputChange('feature_' + feature.id, !feature.enabled);
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                  <Box sx={{ fontSize: '2rem', mr: 2 }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {feature.name}
                      {feature.required && (
                        <Chip
                          label="Requerido"
                          size="small"
                          sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
                {feature.enabled && (
                  <CheckIcon sx={{ color: theme.palette.primary.main }} />
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {businessData.business_type && (
        <Card sx={{ mt: 3, p: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <CheckIcon sx={{ mr: 1, color: theme.palette.success.main }} />
            ¡Todo listo!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tu negocio estará configurado con todas las herramientas necesarias para conectar 
            con clientes y hacer crecer tu presencia en línea.
          </Typography>
        </Card>
      )}
    </Box>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return <BusinessTypeStep />;
      case 2:
        return <BusinessInfoStep />;
      case 3:
        return <ConfigurationStep />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '70vh',
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${steps[activeStep].color}, ${alpha(steps[activeStep].color, 0.8)})`,
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha('#fff', 0.2),
                color: 'white',
                mr: 2,
              }}
            >
              {steps[activeStep].icon}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {steps[activeStep].title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {steps[activeStep].subtitle}
              </Typography>
            </Box>
          </Box>
          
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Progress */}
        <LinearProgress
          variant="determinate"
          value={(activeStep / (steps.length - 1)) * 100}
          sx={{
            height: 4,
            bgcolor: alpha(steps[activeStep].color, 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: steps[activeStep].color,
            },
          }}
        />

        {/* Stepper */}
        <Box sx={{ p: 3, pb: 0 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content */}
        <DialogContent sx={{ p: 3, minHeight: 400 }}>
          <Fade in timeout={300} key={activeStep}>
            <Box>
              {renderStepContent()}
            </Box>
          </Fade>
        </DialogContent>

        {/* Actions */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBackIcon />}
          >
            Anterior
          </Button>

          <Typography variant="body2" color="text.secondary">
            Paso {activeStep + 1} de {steps.length}
          </Typography>

          <Button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            variant="contained"
            endIcon={activeStep === steps.length - 1 ? <CheckIcon /> : <ArrowForwardIcon />}
            sx={{
              bgcolor: steps[activeStep].color,
              '&:hover': {
                bgcolor: alpha(steps[activeStep].color, 0.8),
              },
            }}
          >
            {loading ? 'Creando...' : (activeStep === steps.length - 1 ? 'Completar' : 'Siguiente')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default BusinessOnboardingWizard;