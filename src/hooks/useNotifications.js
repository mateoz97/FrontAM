import { useState, useCallback, useEffect } from 'react';

/**
 * Hook para manejo de notificaciones y mensajes de usuario
 * Diseñado para mostrar mensajes claros y comprensibles para todas las edades
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [nextId, setNextId] = useState(1);

  // Limpiar notificaciones automáticamente después de un tiempo
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => 
        prev.filter(notification => 
          Date.now() - notification.timestamp < (notification.duration || 6000)
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addNotification = useCallback((notification) => {
    const id = nextId;
    setNextId(prev => prev + 1);

    const newNotification = {
      id,
      timestamp: Date.now(),
      duration: 6000, // 6 segundos por defecto
      type: 'info',
      autoHide: true,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, [nextId]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Métodos de conveniencia para diferentes tipos de notificaciones
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      title: 'Perfecto',
      message,
      duration: 4000,
      ...options,
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      title: 'Ups, algo salió mal',
      message,
      duration: 8000,
      autoHide: false, // Los errores requieren acción del usuario
      ...options,
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      title: 'Atención',
      message,
      duration: 6000,
      ...options,
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      title: 'Información',
      message,
      duration: 5000,
      ...options,
    });
  }, [addNotification]);

  // Mensajes específicos para diferentes situaciones
  const showLoading = useCallback((message = 'Procesando...', options = {}) => {
    return addNotification({
      type: 'info',
      title: 'Un momento',
      message,
      autoHide: false,
      showProgress: true,
      ...options,
    });
  }, [addNotification]);

  const showNetworkError = useCallback(() => {
    return showError(
      'No se pudo conectar al servidor. Revisa tu conexión a internet y vuelve a intentar.',
      {
        title: 'Sin conexión',
        actions: [
          {
            label: 'Reintentar',
            action: () => window.location.reload(),
          },
        ],
      }
    );
  }, [showError]);

  const showSessionExpired = useCallback(() => {
    return showWarning(
      'Tu sesión ha expirado por seguridad. Necesitas iniciar sesión nuevamente.',
      {
        title: 'Sesión expirada',
        duration: 10000,
        actions: [
          {
            label: 'Iniciar sesión',
            action: () => window.location.href = '/login',
          },
        ],
      }
    );
  }, [showWarning]);

  const showPermissionDenied = useCallback(() => {
    return showError(
      'No tienes permisos para realizar esta acción. Contacta a tu administrador si necesitas acceso.',
      {
        title: 'Acceso denegado',
      }
    );
  }, [showError]);

  const showServerError = useCallback(() => {
    return showError(
      'El servidor está experimentando problemas. Nuestro equipo ya está trabajando en solucionarlo. Intenta más tarde.',
      {
        title: 'Error del servidor',
        actions: [
          {
            label: 'Reintentar más tarde',
            action: () => window.location.reload(),
          },
        ],
      }
    );
  }, [showError]);

  // Mensajes de confirmación para acciones importantes
  const showDataSaved = useCallback(() => {
    return showSuccess('Tus cambios se guardaron correctamente.');
  }, [showSuccess]);

  const showDataDeleted = useCallback(() => {
    return showSuccess('Información eliminada correctamente.');
  }, [showSuccess]);

  const showFormErrors = useCallback((errors) => {
    if (Array.isArray(errors)) {
      errors.forEach(error => {
        showError(error);
      });
    } else if (typeof errors === 'object') {
      Object.values(errors).forEach(error => {
        if (Array.isArray(error)) {
          error.forEach(e => showError(e));
        } else {
          showError(error);
        }
      });
    } else {
      showError(errors);
    }
  }, [showError]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    
    // Métodos de conveniencia
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    
    // Mensajes específicos
    showNetworkError,
    showSessionExpired,
    showPermissionDenied,
    showServerError,
    showDataSaved,
    showDataDeleted,
    showFormErrors,
  };
};