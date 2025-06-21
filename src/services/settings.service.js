// src/services/settings.service.js
import api from './api';

class SettingsService {
  
  // =================== USER SETTINGS ===================
  
  /**
   * Obtener configuraciones del usuario actual
   * GET /settings/user/
   */
  async getUserSettings() {
    try {
      const response = await api.get('/settings/user/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching user settings:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al obtener configuraciones de usuario',
        status: error.response?.status
      };
    }
  }

  /**
   * Actualizar configuraciones del usuario (PUT - reemplaza completamente)
   * PUT /settings/user/
   */
  async updateUserSettings(settingsData) {
    try {
      const response = await api.put('/settings/user/', settingsData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating user settings:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al actualizar configuraciones de usuario',
        status: error.response?.status,
        validationErrors: error.response?.data
      };
    }
  }

  /**
   * Actualización parcial de configuraciones del usuario (PATCH)
   * PATCH /settings/user/
   */
  async patchUserSettings(settingsData) {
    try {
      const response = await api.patch('/settings/user/', settingsData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error patching user settings:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al actualizar configuraciones de usuario',
        status: error.response?.status,
        validationErrors: error.response?.data
      };
    }
  }

  /**
   * Resetear configuraciones de usuario a valores por defecto
   * POST /settings/user/reset_to_defaults/
   */
  async resetUserSettingsToDefaults() {
    try {
      const response = await api.post('/settings/user/reset_to_defaults/');
      return {
        success: true,
        data: response.data,
        message: 'Configuraciones de usuario restauradas exitosamente'
      };
    } catch (error) {
      console.error('Error resetting user settings:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al restaurar configuraciones de usuario',
        status: error.response?.status
      };
    }
  }

  // =================== BUSINESS SETTINGS ===================
  
  /**
   * Obtener configuraciones del negocio actual
   * GET /settings/business/
   */
  async getBusinessSettings() {
    try {
      const response = await api.get('/settings/business/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching business settings:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al obtener configuraciones del negocio',
        status: error.response?.status
      };
    }
  }

  /**
   * Actualizar configuraciones del negocio (PUT - reemplaza completamente)
   * PUT /settings/business/
   */
  async updateBusinessSettings(settingsData) {
    try {
      const response = await api.put('/settings/business/', settingsData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating business settings:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al actualizar configuraciones del negocio',
        status: error.response?.status,
        validationErrors: error.response?.data
      };
    }
  }

  /**
   * Actualización parcial de configuraciones del negocio (PATCH)
   * PATCH /settings/business/
   */
  async patchBusinessSettings(settingsData) {
    try {
      const response = await api.patch('/settings/business/', settingsData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error patching business settings:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al actualizar configuraciones del negocio',
        status: error.response?.status,
        validationErrors: error.response?.data
      };
    }
  }

  /**
   * Resetear configuraciones de negocio a valores por defecto
   * POST /settings/business/reset_to_defaults/
   */
  async resetBusinessSettingsToDefaults() {
    try {
      const response = await api.post('/settings/business/reset_to_defaults/');
      return {
        success: true,
        data: response.data,
        message: 'Configuraciones del negocio restauradas exitosamente'
      };
    } catch (error) {
      console.error('Error resetting business settings:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al restaurar configuraciones del negocio',
        status: error.response?.status
      };
    }
  }

  // =================== NOTIFICATION TEMPLATES ===================
  
  /**
   * Obtener todas las plantillas de notificación
   * GET /settings/notifications/
   */
  async getNotificationTemplates() {
    try {
      const response = await api.get('/settings/notifications/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching notification templates:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al obtener plantillas de notificación',
        status: error.response?.status
      };
    }
  }

  /**
   * Crear nueva plantilla de notificación
   * POST /settings/notifications/
   */
  async createNotificationTemplate(templateData) {
    try {
      const response = await api.post('/settings/notifications/', templateData);
      return {
        success: true,
        data: response.data,
        message: 'Plantilla de notificación creada exitosamente'
      };
    } catch (error) {
      console.error('Error creating notification template:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al crear plantilla de notificación',
        status: error.response?.status,
        validationErrors: error.response?.data
      };
    }
  }

  /**
   * Actualizar plantilla de notificación (PUT)
   * PUT /settings/notifications/{id}/
   */
  async updateNotificationTemplate(templateId, templateData) {
    try {
      const response = await api.put(`/settings/notifications/${templateId}/`, templateData);
      return {
        success: true,
        data: response.data,
        message: 'Plantilla de notificación actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error updating notification template:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al actualizar plantilla de notificación',
        status: error.response?.status,
        validationErrors: error.response?.data
      };
    }
  }

  /**
   * Actualización parcial de plantilla de notificación (PATCH)
   * PATCH /settings/notifications/{id}/
   */
  async patchNotificationTemplate(templateId, templateData) {
    try {
      const response = await api.patch(`/settings/notifications/${templateId}/`, templateData);
      return {
        success: true,
        data: response.data,
        message: 'Plantilla de notificación actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error patching notification template:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al actualizar plantilla de notificación',
        status: error.response?.status,
        validationErrors: error.response?.data
      };
    }
  }

  /**
   * Eliminar plantilla de notificación
   * DELETE /settings/notifications/{id}/
   */
  async deleteNotificationTemplate(templateId) {
    try {
      await api.delete(`/settings/notifications/${templateId}/`);
      return {
        success: true,
        message: 'Plantilla de notificación eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error deleting notification template:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al eliminar plantilla de notificación',
        status: error.response?.status
      };
    }
  }

  /**
   * Crear plantillas de notificación por defecto
   * POST /settings/notifications/create_default_templates/
   */
  async createDefaultNotificationTemplates() {
    try {
      const response = await api.post('/settings/notifications/create_default_templates/');
      return {
        success: true,
        data: response.data,
        message: 'Plantillas por defecto creadas exitosamente'
      };
    } catch (error) {
      console.error('Error creating default notification templates:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al crear plantillas por defecto',
        status: error.response?.status
      };
    }
  }

  // =================== SUMMARY & EXPORT ===================
  
  /**
   * Obtener resumen de todas las configuraciones
   * GET /settings/summary/
   */
  async getSettingsSummary() {
    try {
      const response = await api.get('/settings/summary/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching settings summary:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al obtener resumen de configuraciones',
        status: error.response?.status
      };
    }
  }

  /**
   * Exportar todas las configuraciones
   * POST /settings/summary/export_settings/
   */
  async exportSettings() {
    try {
      const response = await api.post('/settings/summary/export_settings/');
      return {
        success: true,
        data: response.data,
        message: 'Configuraciones exportadas exitosamente'
      };
    } catch (error) {
      console.error('Error exporting settings:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al exportar configuraciones',
        status: error.response?.status
      };
    }
  }

  // =================== HELPER METHODS ===================

  /**
   * Descargar configuraciones exportadas como archivo JSON
   */
  async downloadExportedSettings() {
    try {
      const exportResult = await this.exportSettings();
      
      if (!exportResult.success) {
        return exportResult;
      }

      // Crear archivo para descarga
      const blob = new Blob([JSON.stringify(exportResult.data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'Archivo de configuraciones descargado exitosamente'
      };
    } catch (error) {
      console.error('Error downloading exported settings:', error);
      return {
        success: false,
        error: 'Error al descargar archivo de configuraciones'
      };
    }
  }

  /**
   * Resetear todas las configuraciones (usuario y negocio)
   */
  async resetAllSettings() {
    try {
      const [userResult, businessResult] = await Promise.allSettled([
        this.resetUserSettingsToDefaults(),
        this.resetBusinessSettingsToDefaults()
      ]);

      const results = {
        user: userResult.status === 'fulfilled' ? userResult.value : { success: false, error: userResult.reason },
        business: businessResult.status === 'fulfilled' ? businessResult.value : { success: false, error: businessResult.reason }
      };

      const allSuccessful = results.user.success && results.business.success;

      return {
        success: allSuccessful,
        data: results,
        message: allSuccessful 
          ? 'Todas las configuraciones restauradas exitosamente' 
          : 'Algunas configuraciones no pudieron ser restauradas'
      };
    } catch (error) {
      console.error('Error resetting all settings:', error);
      return {
        success: false,
        error: 'Error al restaurar configuraciones'
      };
    }
  }

  /**
   * Cargar todas las configuraciones de una vez
   */
  async loadAllSettings() {
    try {
      const [userResult, businessResult, templatesResult, summaryResult] = await Promise.allSettled([
        this.getUserSettings(),
        this.getBusinessSettings(),
        this.getNotificationTemplates(),
        this.getSettingsSummary()
      ]);

      return {
        success: true,
        data: {
          user: userResult.status === 'fulfilled' && userResult.value.success ? userResult.value.data : null,
          business: businessResult.status === 'fulfilled' && businessResult.value.success ? businessResult.value.data : null,
          templates: templatesResult.status === 'fulfilled' && templatesResult.value.success ? templatesResult.value.data : [],
          summary: summaryResult.status === 'fulfilled' && summaryResult.value.success ? summaryResult.value.data : null
        },
        errors: {
          user: userResult.status === 'rejected' || !userResult.value.success ? userResult.value?.error : null,
          business: businessResult.status === 'rejected' || !businessResult.value.success ? businessResult.value?.error : null,
          templates: templatesResult.status === 'rejected' || !templatesResult.value.success ? templatesResult.value?.error : null,
          summary: summaryResult.status === 'rejected' || !summaryResult.value.success ? summaryResult.value?.error : null
        }
      };
    } catch (error) {
      console.error('Error loading all settings:', error);
      return {
        success: false,
        error: 'Error al cargar configuraciones'
      };
    }
  }
}

// Exportar instancia única del servicio
const settingsService = new SettingsService();
export default settingsService;

// También exportar la clase para casos específicos
export { SettingsService };