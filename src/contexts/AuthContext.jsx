// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import businessService from '../services/business.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBusinessId, setActiveBusinessId] = useState(null);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Show user-friendly error messages
  const setUserFriendlyError = useCallback((error) => {
    let message = 'Ocurrió un error inesperado';
    
    if (error?.message?.includes('network')) {
      message = 'Problemas de conexión. Revisa tu internet';
    } else if (error?.response?.status === 401) {
      message = 'Sesión expirada. Inicia sesión nuevamente';
    } else if (error?.response?.status === 403) {
      message = 'No tienes permisos para esta acción';
    } else if (error?.response?.status >= 500) {
      message = 'Error en el servidor. Intenta más tarde';
    } else if (error?.message) {
      message = error.message;
    }
    
    setError(message);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar si hay token antes de intentar cualquier solicitud
      if (authService.isAuthenticated()) {
        try {
          const updatedUser = await authService.getUserInfo();
          setUser(updatedUser);
          
          // Establecer negocio activo
          if (updatedUser?.business_info?.id) {
            setActiveBusinessId(updatedUser.business_info.id);
          }
        } catch (error) {
          console.error('Error al obtener información del usuario:', error);
          // Limpiar el contexto en caso de error
          setUser(null);
          setActiveBusinessId(null);
          // Forzar logout si la token es inválida
          authService.logout();
          setUserFriendlyError(error);
        }
      } else {
        setUser(null);
        setActiveBusinessId(null);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setUser(null);
      setActiveBusinessId(null);
      setUserFriendlyError(error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [setUserFriendlyError]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== LOGIN DEBUG ===');
      console.log('Login credentials:', credentials);
      
      const data = await authService.login(credentials);
      console.log('Login response data:', data);
      
      setUser(data.user);
      console.log('User set in context:', data.user);
      
      // Establecer negocio activo si existe
      if (data.user?.business_info?.id) {
        console.log('Setting active business ID:', data.user.business_info.id);
        setActiveBusinessId(data.user.business_info.id);
      } else {
        console.log('No business_info found in user data');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error de login:', error);
      setUserFriendlyError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [setUserFriendlyError]);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.register(userData);
      setUser(data.user);
      
      // Establecer negocio activo si existe
      if (data.user?.business_info?.id) {
        setActiveBusinessId(data.user.business_info.id);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error de registro:', error);
      setUserFriendlyError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [setUserFriendlyError]);

  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
      setActiveBusinessId(null);
      setError(null);
    } catch (error) {
      console.error('Error durante logout:', error);
      // Forzar limpieza local aunque falle el logout
      setUser(null);
      setActiveBusinessId(null);
      setError(null);
    }
  }, []);

  const updateUser = async () => {
    try {
      const updatedUserData = await authService.getUserInfo();
      setUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      // Actualizar negocio activo si es necesario
      if (updatedUserData?.business_info?.id) {
        setActiveBusinessId(updatedUserData.business_info.id);
      }
      
      return updatedUserData;
    } catch (error) {
      console.error('Error al actualizar información del usuario:', error);
      throw error;
    }
  };

  // Función para cambiar el negocio activo
  const switchBusiness = useCallback(async (businessId) => {
    try {
      console.log(`=== SWITCH BUSINESS DEBUG ===`);
      console.log(`Cambiando al negocio ID: ${businessId}`);
      setLoading(true);
      setError(null);
      
      // Llamar al backend para cambiar el negocio activo
      const result = await businessService.switchBusiness(businessId);
      console.log('Switch business result:', result);
      
      // Actualizar el estado local
      setActiveBusinessId(businessId);
      console.log('Active business ID set to:', businessId);
      
      // Si el resultado incluye información del negocio, usarla para actualizar el usuario
      if (result.business) {
        console.log('Updating user with business info from switch result');
        const updatedUser = {
          ...user,
          business_info: {
            id: result.business.id,
            name: result.business.name,
            description: result.business.description,
            is_owner: result.isOwner || result.business.isOwner || false
          },
          role_info: {
            name: result.role || result.business.role || 'Owner'
          }
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        // Intentar actualizar información del usuario desde la API
        try {
          console.log('Fetching updated user info from API...');
          const updatedUser = await authService.getUserInfo();
          console.log('Updated user info:', updatedUser);
          setUser(updatedUser);
        } catch (error) {
          console.error('Error al obtener información actualizada del usuario:', error);
          console.log('Fallback: updating business ID manually');
        }
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      console.error(`Error al cambiar al negocio ID ${businessId}:`, error);
      setUserFriendlyError(error);
      setLoading(false);
      throw error;
    }
  }, [user, setUserFriendlyError]);

  // Función para activar negocio automáticamente (para usuarios con un solo negocio)
  const activateUserBusiness = useCallback(async () => {
    try {
      console.log('=== ACTIVATE USER BUSINESS ===');
      setLoading(true);
      setError(null);
      
      const result = await businessService.activateUserBusiness();
      console.log('Activate business result:', result);
      
      if (result.success) {
        // Actualizar el estado local con la información del negocio
        setActiveBusinessId(result.business_id);
        console.log('Active business ID set to:', result.business_id);
        
        // Actualizar el usuario con la información del negocio
        const updatedUser = {
          ...user,
          business_info: {
            id: result.business.id,
            name: result.business.name,
            description: result.business.description,
            is_owner: result.isOwner || false
          },
          role_info: {
            name: result.role || 'Owner'
          }
        };
        
        console.log('Updated user with business info:', updatedUser);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      console.error('Error activating user business:', error);
      setUserFriendlyError(error);
      setLoading(false);
      throw error;
    }
  }, [user, setUserFriendlyError]);

  // Funciones para acceder a información específica
  const getUserBusiness = () => {
    return user?.business_info || null;
  };

  const getUserRole = () => {
    return user?.role_info || null;
  };

  const hasPermission = (permission) => {
    const roleInfo = getUserRole();
    if (!roleInfo || !roleInfo.permissions) return false;
    return roleInfo.permissions[permission] || false;
  };

  const value = {
    // User state
    user,
    loading,
    error,
    isInitialized,
    isAuthenticated: !!user,
    activeBusinessId,
    
    // Auth actions
    login,
    register,
    logout,
    checkAuth,
    clearError,
    
    // User data actions
    updateUser,
    switchBusiness,
    activateUserBusiness,
    
    // Helper functions
    getUserBusiness,
    getUserRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;