// src/hooks/useSettings.js - Optimizado para el nuevo servicio
import { useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settings.service';

export const useSettings = () => {
  // Estados principales
  const [userSettings, setUserSettings] = useState(null);
  const [businessSettings, setBusinessSettings] = useState(null);
  const [notificationTemplates, setNotificationTemplates] = useState([]);
  const [settingsSummary, setSettingsSummary] = useState(null);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // =================== LOAD DATA ===================

  /**
   * Cargar todas las configuraciones
   */
  const loadAllSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await settingsService.loadAllSettings();

      if (result.success) {
        setUserSettings(result.data.user);
        setBusinessSettings(result.data.business);
        setNotificationTemplates(result.data.templates?.results || result.data.templates || []);
        setSettingsSummary(result.data.summary);
        setLastUpdated(new Date());
      } else {
        setError('Error al cargar configuraciones');
        console.error('Load settings errors:', result.errors);
      }

    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Error inesperado al cargar configuraciones');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar solo configuraciones de usuario
   */
  const loadUserSettings = useCallback(async () => {
    const result = await settingsService.getUserSettings();
    if (result.success) {
      setUserSettings(result.data);
      return result;
    } else {
      setError(result.error);
      return result;
    }
  }, []);

  /**
   * Cargar solo configuraciones de negocio
   */
  const loadBusinessSettings = useCallback(async () => {
    const result = await settingsService.getBusinessSettings();
    if (result.success) {
      setBusinessSettings(result.data);
      return result;
    } else {
      setError(result.error);
      return result;
    }
  }, []);

  /**
   * Cargar plantillas de notificación
   */
  const loadNotificationTemplates = useCallback(async () => {
    const result = await settingsService.getNotificationTemplates();
    if (result.success) {
      setNotificationTemplates(result.data?.results || result.data || []);
      return result;
    } else {
      setError(result.error);
      return result;
    }
  }, []);

  // =================== USER SETTINGS ===================

  /**
   * Actualizar configuraciones de usuario (reemplazo completo)
   */
  const updateUserSettings = useCallback(async (newSettings) => {
    const result = await settingsService.updateUserSettings(newSettings);
    if (result.success) {
      setUserSettings(result.data);
      setLastUpdated(new Date());
    }
    return result;
  }, []);

  /**
   * Actualización parcial de configuraciones de usuario
   */
  const patchUserSettings = useCallback(async (settingsUpdates) => {
    const result = await settingsService.patchUserSettings(settingsUpdates);
    if (result.success) {
      setUserSettings(result.data);
      setLastUpdated(new Date());
    }
    return result;
  }, []);

  /**
   * Resetear configuraciones de usuario
   */
  const resetUserSettings = useCallback(async () => {
    const result = await settingsService.resetUserSettingsToDefaults();
    if (result.success) {
      setUserSettings(result.data);
      setLastUpdated(new Date());
    }
    return result;
  }, []);

  // =================== BUSINESS SETTINGS ===================

  /**
   * Actualizar configuraciones de negocio (reemplazo completo)
   */
  const updateBusinessSettings = useCallback(async (newSettings) => {
    const result = await settingsService.updateBusinessSettings(newSettings);
    if (result.success) {
      setBusinessSettings(result.data);
      setLastUpdated(new Date());
    }
    return result;
  }, []);

  /**
   * Actualización parcial de configuraciones de negocio
   */
  const patchBusinessSettings = useCallback(async (settingsUpdates) => {
    const result = await settingsService.patchBusinessSettings(settingsUpdates);
    if (result.success) {
      setBusinessSettings(result.data);
      setLastUpdated(new Date());
    }
    return result;
  }, []);

  /**
   * Resetear configuraciones de negocio
   */
  const resetBusinessSettings = useCallback(async () => {
    const result = await settingsService.resetBusinessSettingsToDefaults();
    if (result.success) {
      setBusinessSettings(result.data);
      setLastUpdated(new Date());
    }
    return result;
  }, []);

  // =================== NOTIFICATION TEMPLATES ===================

  /**
   * Crear nueva plantilla de notificación
   */
  const createNotificationTemplate = useCallback(async (templateData) => {
    const result = await settingsService.createNotificationTemplate(templateData);
    if (result.success) {
      await loadNotificationTemplates(); // Recargar lista
    }
    return result;
  }, [loadNotificationTemplates]);

  /**
   * Actualizar plantilla de notificación
   */
  const updateNotificationTemplate = useCallback(async (templateId, templateData) => {
    const result = await settingsService.updateNotificationTemplate(templateId, templateData);
    if (result.success) {
      await loadNotificationTemplates(); // Recargar lista
    }
    return result;
  }, [loadNotificationTemplates]);

  /**
   * Actualización parcial de plantilla
   */
  const patchNotificationTemplate = useCallback(async (templateId, templateData) => {
    const result = await settingsService.patchNotificationTemplate(templateId, templateData);
    if (result.success) {
      await loadNotificationTemplates(); // Recargar lista
    }
    return result;
  }, [loadNotificationTemplates]);

  /**
   * Eliminar plantilla de notificación
   */
  const deleteNotificationTemplate = useCallback(async (templateId) => {
    const result = await settingsService.deleteNotificationTemplate(templateId);
    if (result.success) {
      await loadNotificationTemplates(); // Recargar lista
    }
    return result;
  }, [loadNotificationTemplates]);

  /**
   * Crear plantillas por defecto
   */
  const createDefaultTemplates = useCallback(async () => {
    const result = await settingsService.createDefaultNotificationTemplates();
    if (result.success) {
      await loadNotificationTemplates(); // Recargar lista
    }
    return result;
  }, [loadNotificationTemplates]);

  // =================== BULK OPERATIONS ===================

  /**
   * Exportar y descargar configuraciones
   */
  const exportAndDownloadSettings = useCallback(async () => {
    return await settingsService.downloadExportedSettings();
  }, []);

  /**
   * Resetear todas las configuraciones
   */
  const resetAllSettings = useCallback(async () => {
    const result = await settingsService.resetAllSettings();
    if (result.success) {
      await loadAllSettings(); // Recargar todo
    }
    return result;
  }, [loadAllSettings]);

  /**
   * Recargar resumen de configuraciones
   */
  const refreshSummary = useCallback(async () => {
    const result = await settingsService.getSettingsSummary();
    if (result.success) {
      setSettingsSummary(result.data);
    }
    return result;
  }, []);

  // =================== LOCAL STATE HELPERS ===================

  /**
   * Actualizar configuraciones de usuario localmente (sin API)
   */
  const updateUserSettingsLocal = useCallback((updates) => {
    setUserSettings(prev => prev ? { ...prev, ...updates } : updates);
  }, []);

  /**
   * Actualizar configuraciones de negocio localmente (sin API)
   */
  const updateBusinessSettingsLocal = useCallback((updates) => {
    setBusinessSettings(prev => prev ? { ...prev, ...updates } : updates);
  }, []);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpiar todos los datos
   */
  const clearAllData = useCallback(() => {
    setUserSettings(null);
    setBusinessSettings(null);
    setNotificationTemplates([]);
    setSettingsSummary(null);
    setError(null);
    setLastUpdated(null);
  }, []);

  // =================== EFFECTS ===================

  // Cargar configuraciones al montar el hook
  useEffect(() => {
    loadAllSettings();
  }, [loadAllSettings]);

  // =================== COMPUTED VALUES ===================

  const hasUserSettings = userSettings !== null;
  const hasBusinessSettings = businessSettings !== null;
  const hasTemplates = notificationTemplates.length > 0;
  const isDataLoaded = hasUserSettings || hasBusinessSettings || hasTemplates;

  return {
    // Estados principales
    userSettings,
    businessSettings,
    notificationTemplates,
    settingsSummary,
    
    // Estados de UI
    loading,
    error,
    lastUpdated,
    
    // Estados computados
    hasUserSettings,
    hasBusinessSettings,
    hasTemplates,
    isDataLoaded,
    
    // Acciones de carga
    loadAllSettings,
    loadUserSettings,
    loadBusinessSettings,
    loadNotificationTemplates,
    refreshSummary,
    
    // Acciones de usuario
    updateUserSettings,
    patchUserSettings,
    resetUserSettings,
    
    // Acciones de negocio
    updateBusinessSettings,
    patchBusinessSettings,
    resetBusinessSettings,
    
    // Acciones de plantillas
    createNotificationTemplate,
    updateNotificationTemplate,
    patchNotificationTemplate,
    deleteNotificationTemplate,
    createDefaultTemplates,
    
    // Operaciones masivas
    exportAndDownloadSettings,
    resetAllSettings,
    
    // Helpers locales
    updateUserSettingsLocal,
    updateBusinessSettingsLocal,
    clearError,
    clearAllData,
  };
};