// src/App.jsx - Versión actualizada con las nuevas páginas
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed'; 
import MainLayout from './layouts/MainLayout';
import UserProfile from './pages/UserProfile';
import BusinessProfile from './pages/BusinessProfile';

// Importar las nuevas páginas
import Settings from './pages/Settings';
import Inventory from './pages/Inventory';
import AdminUsers from './pages/AdminUsers';
import OrdersBoard from './pages/OrdersBoard';

// Debug component
import LoginDebug from './components/debug/LoginDebug';
import BusinessSetup from './components/auth/BusinessSetup';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Componente para rutas públicas (login, registro)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" />; // Redirige al Feed
  }
  
  return children;
};

// Componente para verificar si el usuario debe ir a Dashboard
const BusinessRedirect = ({ children }) => {
  const { user, getUserBusiness, getUserRole, activeBusinessId, switchBusiness } = useAuth();
  const businessInfo = getUserBusiness();
  const roleInfo = getUserRole();
  
  // Si el usuario es owner y no tiene negocio activo, intentar activar su negocio
  React.useEffect(() => {
    const setupBusinessForOwner = async () => {
      // Si el usuario es owner pero no tiene businessInfo activo
      if ((roleInfo?.name?.toLowerCase() === 'owner' || user?.role_info?.name?.toLowerCase() === 'owner') && 
          !businessInfo && !activeBusinessId) {
        
        console.log('Usuario es owner sin negocio activo, intentando configurar...');
        
        // Verificar si hay información de negocio en los datos del usuario
        if (user?.business_info?.id) {
          console.log('Encontrado business_info en usuario:', user.business_info);
          try {
            await switchBusiness(user.business_info.id);
            console.log('Negocio activado exitosamente');
          } catch (error) {
            console.error('Error activando negocio:', error);
          }
        }
      }
    };

    setupBusinessForOwner();
  }, [user, roleInfo, businessInfo, activeBusinessId, switchBusiness]);
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route 
              path="/debug" 
              element={<LoginDebug />} 
            />
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Feed es ahora la página principal (ruta raíz) */}
              <Route 
                path="/" 
                element={
                  <BusinessSetup>
                    <BusinessRedirect>
                      <Feed />
                    </BusinessRedirect>
                  </BusinessSetup>
                } 
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/feed" element={<Navigate to="/" />} /> {/* Redirige /feed a / */}
              
              {/* Nueva ruta del tablero de pedidos */}
              <Route path="/orders" element={<OrdersBoard />} />
              
              {/* Nueva ruta de inventario */}
              <Route path="/inventory" element={<Inventory />} />
              
              {/* Nueva ruta de administración de usuarios */}
              <Route path="/users" element={<AdminUsers />} />
              
              {/* Nueva ruta de configuración */}
              <Route path="/settings" element={<Settings />} />
              
              {/* Rutas de perfil */}
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/business/profile" element={<BusinessProfile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;