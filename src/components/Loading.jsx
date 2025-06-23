import React from 'react';
import EnhancedLoading from './common/EnhancedLoading';

/**
 * Componente de carga simplificado que usa EnhancedLoading
 * Mantiene compatibilidad con el código existente
 */
const Loading = ({ 
  message = 'Cargando...', 
  fullHeight = true,
  variant = 'circular',
  size = 'medium',
  ...props 
}) => {
  return (
    <EnhancedLoading
      message={message}
      fullHeight={fullHeight}
      variant={variant}
      size={size}
      description="Por favor espera un momento"
      {...props}
    />
  );
};

export default Loading;