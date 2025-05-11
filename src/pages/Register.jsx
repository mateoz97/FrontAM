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

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      handleNext();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    handleNext();
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
            onSubmit={handleRegister}
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
            onComplete={() => navigate('/dashboard')}
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