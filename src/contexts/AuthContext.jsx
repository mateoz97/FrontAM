// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
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

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Verificando autenticación...');
      setLoading(true);
      try {
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
            // Simplemente limpiar el contexto en caso de error
            setUser(null);
            setActiveBusinessId(null);
            // Opcional: forzar logout si la token es inválida
            authService.logout();
          }
        } else {
          setUser(null);
          setActiveBusinessId(null);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setUser(null);
        setActiveBusinessId(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    console.log('Intento de login con:', credentials);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      
      // Establecer negocio activo si existe
      if (data.user?.business_info?.id) {
        setActiveBusinessId(data.user.business_info.id);
      }
      
      return data;
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    console.log('Intento de registro con:', userData);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      
      // Establecer negocio activo si existe
      if (data.user?.business_info?.id) {
        setActiveBusinessId(data.user.business_info.id);
      }
      
      return data;
    } catch (error) {
      console.error('Error de registro:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Cerrando sesión');
    authService.logout();
    setUser(null);
    setActiveBusinessId(null);
  };

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
  const switchBusiness = async (businessId) => {
    try {
      console.log(`Cambiando al negocio ID: ${businessId}`);
      setLoading(true);
      
      // Llamar al backend para cambiar el negocio activo
      const result = await businessService.switchBusiness(businessId);
      
      // Actualizar el estado local
      setActiveBusinessId(businessId);
      
      // Actualizar información del usuario
      try {
        const updatedUser = await authService.getUserInfo();
        setUser(updatedUser);
      } catch (error) {
        console.error('Error al obtener información actualizada del usuario:', error);
        
        // Si falla, actualizar manualmente el usuario actual
        if (user && user.business_info) {
          const updatedUser = {
            ...user,
            business_info: {
              ...user.business_info,
              id: businessId
            }
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      console.error(`Error al cambiar al negocio ID ${businessId}:`, error);
      setLoading(false);
      throw error;
    }
  };

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
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    updateUser,
    getUserBusiness,
    getUserRole,
    hasPermission,
    activeBusinessId,
    switchBusiness
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;