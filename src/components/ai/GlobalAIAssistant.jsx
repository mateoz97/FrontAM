// src/components/ai/GlobalAIAssistant.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AIAssistantChat from './AIAssistantChat';

/**
 * Global AI Assistant that appears on all pages
 * Integrates with the app's context and provides contextual help
 */
const GlobalAIAssistant = ({ 
  disabled = false,
  hideOnPages = ['/login', '/register'],
  position = { bottom: 20, right: 20 }
}) => {
  const location = useLocation();
  const { user, activeBusiness } = useAuth();

  // Don't show on specific pages
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }

  // Don't show if user is not authenticated
  if (!user) {
    return null;
  }

  // Simple AI Chat component
  return (
    <AIAssistantChat
      position={position}
      disabled={disabled}
      // Context information
      currentPage={location.pathname}
      currentBusiness={activeBusiness}
      currentUser={user}
      // Enhanced with page-specific suggestions
      contextualSuggestions={getPageContextSuggestions(location.pathname, activeBusiness)}
    />
  );
};

/**
 * Get contextual suggestions based on current page
 */
const getPageContextSuggestions = (pathname, business) => {
  const businessType = business?.business_type || business?.type || 'restaurant';
  
  const pageContextMap = {
    '/': [
      'Ver últimas publicaciones',
      'Crear nueva publicación',
      'Cambiar de negocio',
      'Ver estadísticas del feed',
    ],
    '/dashboard': [
      'Explicar las métricas',
      '¿Cómo mejorar las ventas?',
      'Ver reportes detallados',
      'Configurar alertas',
    ],
    '/orders': [
      'Crear nuevo pedido',
      'Ver pedidos pendientes',
      'Configurar estados',
      'Reportes de pedidos',
    ],
    '/inventory': [
      'Agregar productos',
      'Ver stock bajo',
      'Configurar alertas',
      'Reportes de inventario',
    ],
    '/users': [
      'Invitar usuario',
      'Gestionar permisos',
      'Ver actividad del equipo',
      'Configurar roles',
    ],
    '/settings': [
      'Configurar pagos',
      'Ajustar notificaciones',
      'Personalizar interfaz',
      'Gestionar integraciones',
    ],
    '/payments': [
      'Procesar pago',
      'Ver historial',
      'Configurar métodos',
      'Reportes financieros',
    ],
  };

  // Get base suggestions for the page
  let suggestions = pageContextMap[pathname] || [
    'Ayuda general',
    'Navegación',
    'Configuración',
    'Reportes',
  ];

  // Add business-specific context
  if (businessType === 'restaurant') {
    suggestions = [...suggestions, 'Gestionar mesas', 'Ver menú'];
  } else if (businessType === 'pharmacy') {
    suggestions = [...suggestions, 'Gestionar recetas', 'Control de medicamentos'];
  } else if (businessType === 'fitness_center') {
    suggestions = [...suggestions, 'Gestionar membresías', 'Programar clases'];
  }

  return suggestions.slice(0, 6); // Limit to 6 suggestions
};

export default GlobalAIAssistant;