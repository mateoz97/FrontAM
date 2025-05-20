// src/App.jsx
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
    return <Navigate to="/" />; // Ahora redirige a la raíz, que será Feed
  }
  
  return children;
};

// Componente para verificar si el usuario debe ir a Dashboard
const BusinessRedirect = ({ children }) => {
  const { user, getUserBusiness } = useAuth();
  const businessInfo = getUserBusiness();
  
  // Si el usuario tiene un negocio asignado y está en la ruta raíz,
  // podríamos decidir dejarlo en Feed o redirigirlo a Dashboard
  // Por ahora, lo dejamos en Feed independientemente de si tiene negocio o no
  
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
                  <BusinessRedirect>
                    <Feed />
                  </BusinessRedirect>
                } 
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/feed" element={<Navigate to="/" />} /> {/* Redirige /feed a / */}
              <Route path="/orders" element={<div>Pedidos</div>} />
              <Route path="/inventory" element={<div>Inventario</div>} />
              <Route path="/users" element={<div>Usuarios</div>} />
              <Route path="/settings" element={<div>Configuración</div>} />
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