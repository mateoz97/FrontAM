import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      console.log('Checking authentication...');
      try {
        const currentUser = authService.getCurrentUser();
        console.log('Current user:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    console.log('Login attempt with:', credentials);
    try {
      const data = await authService.login(credentials);
      console.log('Login response:', data);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    console.log('Register attempt with:', userData);
    try {
      const data = await authService.register(userData);
      console.log('Register response:', data);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logout');
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  console.log('AuthContext value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Exports nombrados
export { AuthProvider, useAuth };
export default AuthContext;