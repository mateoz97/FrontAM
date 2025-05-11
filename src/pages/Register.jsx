import React, { useState } from 'react';
import { 
  Box, Container, Paper, TextField, Button, Typography, 
  Stepper, Step, StepLabel, InputAdornment, IconButton,
  CircularProgress, Slide, Fade
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowForward, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PersonalInfoStep from '../components/Register/PersonalInfoStep';
import UserTypeStep from '../components/Register/UserTypeStep';
import BusinessConfigStep from '../components/Register/BusinessConfigStep';
import authService from '../services/auth.service';

const steps = ['Datos personales', 'Tipo de usuario', 'Configuración'];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    searchBusiness: ''
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  // CAMBIO 1: Simplemente avanza al siguiente paso sin crear el usuario
  const handlePersonalInfoNext = () => {
    // Validación básica
    if (!formData.username || !formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setError('');
    handleNext();
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    handleNext();
  };

  // CAMBIO 2: Función que maneja el registro completo al final
  const handleCompleteRegistration = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 1. Registrar usuario
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      // 2. Si es crear negocio, crear el negocio
      if (userType === 'create' && formData.businessName) {
        await authService.createBusiness({
          name: formData.businessName,
          address: formData.businessAddress,
          phone: formData.businessPhone
        });
      }
      
      // 3. Si es unirse a negocio, hacer la solicitud
      if (userType === 'join' && formData.selectedBusinessId) {
        await authService.joinBusinessRequest(formData.selectedBusinessId);
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al completar el registro');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoStep
            formData={formData}
            handleChange={handleChange}
            error={error}
            loading={loading}
            onSubmit={handlePersonalInfoNext}  // CAMBIO 3: Usa la nueva función
            onBack={() => navigate('/login')}
          />
        );
      case 1:
        return (
          <UserTypeStep
            onSelectType={handleUserTypeSelection}
          />
        );
      case 2:
        return (
          <BusinessConfigStep
            userType={userType}
            formData={formData}
            handleChange={handleChange}
            onBack={handleBack}
            onComplete={handleCompleteRegistration}  // CAMBIO 4: Usa la función de registro completo
            loading={loading}
            error={error}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {getStepContent(activeStep)}
        </Paper>
      </Container>
    </Fade>
  );
};

export default Register;