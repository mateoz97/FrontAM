// src/components/business/BusinessDeletionModal.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, TextField, Alert, Box,
  Stepper, Step, StepLabel, CircularProgress,
  Checkbox, FormControlLabel, List, ListItem, ListItemText
} from '@mui/material';
import { Warning, Delete, CheckCircle } from '@mui/icons-material';
import businessService from '../../services/business.service';

const BusinessDeletionModal = ({ open, onClose, business, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [confirmationText, setConfirmationText] = useState('');
  const [jsConfirmation, setJsConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schemaInfo, setSchemaInfo] = useState(null);

  const steps = [
    'Verificación de Información',
    'Confirmación de Texto',
    'Confirmación JavaScript',
    'Eliminación en Progreso'
  ];

  const requiredText = `ELIMINAR ${business?.name?.toUpperCase() || ''}`;

  const handleNext = async () => {
    if (activeStep === 0) {
      // Verificar estado del esquema
      try {
        setLoading(true);
        const info = await businessService.getSchemaStatus(business.id);
        setSchemaInfo(info);
        setActiveStep(1);
      } catch (err) {
        setError('Error al verificar el estado del negocio');
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      if (confirmationText === requiredText) {
        setActiveStep(2);
      } else {
        setError(`Debes escribir exactamente: ${requiredText}`);
      }
    } else if (activeStep === 2) {
      if (jsConfirmation) {
        setActiveStep(3);
        await handleDelete();
      } else {
        setError('Debes confirmar marcando la casilla');
      }
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await businessService.deleteBusiness(business.id);
      
      // Simular progreso
      setTimeout(() => {
        setLoading(false);
        onSuccess();
        handleClose();
      }, 2000);
      
    } catch (err) {
      setError('Error al eliminar el negocio: ' + (err.response?.data?.detail || err.message));
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setConfirmationText('');
    setJsConfirmation(false);
    setError(null);
    setSchemaInfo(null);
    onClose();
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0: return true;
      case 1: return confirmationText === requiredText;
      case 2: return jsConfirmation;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Esta acción eliminará permanentemente el negocio y todos sus datos.
            </Alert>
            <Typography variant="h6" gutterBottom>
              Información del Negocio:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Nombre" secondary={business?.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Tipo" secondary={business?.business_type} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Estado" secondary={business?.is_active ? 'Activo' : 'Inactivo'} />
              </ListItem>
            </List>
            {schemaInfo && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Estado del Esquema:</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tablas: {schemaInfo.table_count} | Estado: {schemaInfo.status}
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Alert severity="error" sx={{ mb: 2 }}>
              Para confirmar la eliminación, escribe exactamente el siguiente texto:
            </Alert>
            <Typography variant="h6" sx={{ mb: 2, fontFamily: 'monospace', color: 'error.main' }}>
              {requiredText}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Escribe el texto de confirmación aquí"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
                setError(null);
              }}
              error={Boolean(error)}
              helperText={error}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Confirmación final requerida
            </Alert>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Esta es tu última oportunidad de cancelar. Una vez que confirmes, 
              el negocio será eliminado permanentemente.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={jsConfirmation}
                  onChange={(e) => {
                    setJsConfirmation(e.target.checked);
                    setError(null);
                  }}
                  color="error"
                />
              }
              label="Confirmo que entiendo que esta acción es irreversible"
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {loading ? (
              <>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6">Eliminando negocio...</Typography>
                <Typography variant="body2" color="text.secondary">
                  Por favor espera mientras procesamos la eliminación
                </Typography>
              </>
            ) : (
              <>
                <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" color="success.main">
                  Negocio eliminado exitosamente
                </Typography>
              </>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={activeStep === 3 ? undefined : handleClose}
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="error" />
        Eliminar Negocio - {business?.name}
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}
      </DialogContent>

      <DialogActions>
        {activeStep < 3 && (
          <>
            <Button onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color={activeStep === 2 ? "error" : "primary"}
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              startIcon={activeStep === 2 ? <Delete /> : undefined}
            >
              {loading ? <CircularProgress size={20} /> : 
                activeStep === 2 ? 'Eliminar Negocio' : 'Continuar'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BusinessDeletionModal;