import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import businessService from '../../services/business.service';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';

/**
 * Componente para configurar automáticamente el negocio para usuarios owner
 */
const BusinessSetup = ({ children }) => {
  const { 
    user, 
    getUserBusiness, 
    getUserRole, 
    activeBusinessId, 
    switchBusiness,
    activateUserBusiness,
    isInitialized,
    loading 
  } = useAuth();
  
  const [setupStatus, setSetupStatus] = useState('checking');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const setupBusiness = async () => {
      // Esperar a que la autenticación esté inicializada
      if (!isInitialized || loading || !user) {
        return;
      }

      try {
        setSetupStatus('checking');
        console.log('=== BUSINESS SETUP DEBUG ===');
        console.log('User:', user);
        console.log('User business_info:', user?.business_info);
        console.log('User role_info:', user?.role_info);
        console.log('Active business ID:', activeBusinessId);
        console.log('Get user business:', getUserBusiness());
        console.log('Get user role:', getUserRole());

        const businessInfo = getUserBusiness();
        const roleInfo = getUserRole();
        
        // Verificar si el usuario es owner o tiene cualquier rol que requiera negocio
        const isOwner = roleInfo?.name?.toLowerCase() === 'owner' || 
                       user?.role_info?.name?.toLowerCase() === 'owner' ||
                       businessInfo?.is_owner;

        console.log('Is owner?', isOwner);
        console.log('User authenticated?', !!user);

        // Si el usuario está autenticado, intentar configurar negocios
        if (user) {
          // Si no hay negocio activo pero el usuario tiene business_info
          if (!activeBusinessId && user?.business_info?.id) {
            console.log('Setting up business from user business_info:', user.business_info.id);
            setSetupStatus('setting_up');
            
            try {
              await switchBusiness(user.business_info.id);
              console.log('Business setup completed successfully');
              setSetupStatus('completed');
            } catch (error) {
              console.error('Error setting up business from user info:', error);
              setError('No se pudo configurar el negocio automáticamente');
              setSetupStatus('error');
            }
          } else if (activeBusinessId || businessInfo) {
            console.log('Business already active');
            setSetupStatus('completed');
          } else {
            // Intentar activar negocio del usuario automáticamente
            try {
              console.log('Trying to activate user business automatically...');
              setSetupStatus('setting_up');
              
              const result = await activateUserBusiness();
              
              if (result.success) {
                console.log('Business activated successfully:', result);
                setSetupStatus('completed');
              } else {
                console.log('No businesses found for user or activation failed');
                setSetupStatus('no_business');
              }
            } catch (error) {
              console.error('Error activating user business:', error);
              
              // Fallback: intentar usar switchBusiness con el método anterior
              try {
                console.log('Fallback: trying traditional business setup...');
                const businesses = await businessService.getUserBusinesses();
                console.log('User businesses (fallback):', businesses);
                
                if (businesses.length > 0) {
                  const ownerBusiness = businesses.find(b => b.isOwner === true || b.role === 'Owner');
                  const businessToActivate = ownerBusiness || businesses[0];
                  
                  console.log('Setting up business (fallback):', businessToActivate);
                  await switchBusiness(businessToActivate.id);
                  console.log('Business setup completed (fallback)');
                  setSetupStatus('completed');
                } else {
                  console.log('No businesses found for user (fallback)');
                  setSetupStatus('no_business');
                }
              } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                setSetupStatus('no_business');
              }
            }
          }
        } else {
          console.log('User not authenticated, skipping business setup');
          setSetupStatus('not_authenticated');
        }
      } catch (error) {
        console.error('Error in business setup:', error);
        setError('Error configurando el negocio');
        setSetupStatus('error');
      }
    };

    setupBusiness();
  }, [user, isInitialized, loading, activeBusinessId, getUserBusiness, getUserRole, switchBusiness]);

  // Mostrar loading mientras se configura
  if (setupStatus === 'checking' || setupStatus === 'setting_up') {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '200px',
          gap: 2 
        }}
      >
        <CircularProgress />
        <Typography>
          {setupStatus === 'checking' ? 'Verificando configuración...' : 'Configurando negocio...'}
        </Typography>
      </Box>
    );
  }

  // Mostrar error si hay algún problema
  if (setupStatus === 'error' && error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">
          {error}
        </Alert>
        {children}
      </Box>
    );
  }

  // Continuar normalmente
  return children;
};

export default BusinessSetup;