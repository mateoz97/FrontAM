import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/auth.service';
import businessService from '../../services/business.service';

/**
 * Componente de debug para probar el login con el usuario "teo"
 */
const LoginDebug = () => {
  const { user, login, getUserBusiness, getUserRole, hasPermission, activeBusinessId, activateUserBusiness } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testLogin = async () => {
    try {
      setLoading(true);
      setMessage('Iniciando sesión con usuario teo...');
      
      const result = await login({
        username: 'teo',
        password: 'teo'
      });
      
      console.log('Login result:', result);
      setMessage('Login exitoso! Verificando datos del usuario...');
      
      // Esperar un poco para que se actualice el contexto
      setTimeout(async () => {
        try {
          // Obtener información fresca del usuario
          const userInfo = await authService.getUserInfo();
          console.log('User info from API:', userInfo);
          
          // Obtener negocios del usuario
          const businesses = await businessService.getUserBusinesses();
          console.log('User businesses:', businesses);
          
          // Preparar información de debug
          const debug = {
            loginResult: result,
            userFromContext: user,
            userFromAPI: userInfo,
            businessFromContext: getUserBusiness(),
            roleFromContext: getUserRole(),
            activeBusinessId: activeBusinessId,
            userBusinesses: businesses,
            permissions: {
              can_view_dashboard: hasPermission('can_view_dashboard'),
              can_view_orders: hasPermission('can_view_orders'),
              can_view_inventory: hasPermission('can_view_inventory'),
              can_manage_users: hasPermission('can_manage_users'),
            },
            businessInfo: userInfo?.business_info,
            roleInfo: userInfo?.role_info,
          };
          
          setDebugInfo(debug);
          setMessage('Información de debug actualizada');
          
        } catch (error) {
          console.error('Error getting debug info:', error);
          setMessage('Error obteniendo información de debug: ' + error.message);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Error en login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testBusinessSwitch = async () => {
    try {
      setLoading(true);
      setMessage('Probando cambio de negocio...');
      
      if (debugInfo.userBusinesses && debugInfo.userBusinesses.length > 0) {
        const firstBusiness = debugInfo.userBusinesses[0];
        console.log('Switching to business:', firstBusiness);
        
        const result = await businessService.switchBusiness(firstBusiness.id);
        console.log('Switch business result:', result);
        
        setMessage('Cambio de negocio exitoso');
      } else {
        setMessage('No hay negocios disponibles para cambiar');
      }
    } catch (error) {
      console.error('Business switch error:', error);
      setMessage('Error cambiando negocio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testAutoActivate = async () => {
    try {
      setLoading(true);
      setMessage('Probando activación automática de negocio...');
      
      const result = await activateUserBusiness();
      console.log('Auto activate result:', result);
      
      if (result.success) {
        setMessage('Negocio activado automáticamente: ' + result.business.name);
        
        // Actualizar debug info
        setTimeout(() => {
          const debug = {
            ...debugInfo,
            autoActivateResult: result,
            activeBusinessId: result.business_id,
          };
          setDebugInfo(debug);
        }, 500);
      } else {
        setMessage('Fallo la activación automática');
      }
    } catch (error) {
      console.error('Auto activate error:', error);
      setMessage('Error en activación automática: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Debug Login - Usuario Teo
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={testLogin}
            disabled={loading}
          >
            {loading ? 'Probando...' : 'Probar Login (teo/teo)'}
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={testBusinessSwitch}
            disabled={loading || !debugInfo.userBusinesses?.length}
          >
            Probar Cambio de Negocio
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={testAutoActivate}
            disabled={loading}
            color="secondary"
          >
            Activación Automática
          </Button>
        </Box>
        
        {message && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>

      {Object.keys(debugInfo).length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Información de Debug
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Usuario del Contexto</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(debugInfo.userFromContext, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Usuario de la API</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(debugInfo.userFromAPI, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Información de Negocio</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify({
                  businessFromContext: debugInfo.businessFromContext,
                  businessInfo: debugInfo.businessInfo,
                  activeBusinessId: debugInfo.activeBusinessId,
                  userBusinesses: debugInfo.userBusinesses,
                }, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Información de Rol y Permisos</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify({
                  roleFromContext: debugInfo.roleFromContext,
                  roleInfo: debugInfo.roleInfo,
                  permissions: debugInfo.permissions,
                }, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>
        </Paper>
      )}
    </Box>
  );
};

export default LoginDebug;