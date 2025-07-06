// src/services/inventory.service.js
import api from './api';

const inventoryService = {
  // =================== PRODUCTS ===================
  
  /**
   * Obtiene todos los productos del inventario
   * @returns {Promise<Array>} Lista de productos
   */
  async getProducts() {
    try {
      console.log('Obteniendo productos del inventario...');
      const response = await api.get('/inventory/products/');
      console.log('Productos obtenidos:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  },

  /**
   * Obtiene un producto específico por ID
   * @param {number} productId - ID del producto
   * @returns {Promise<Object>} Datos del producto
   */
  async getProduct(productId) {
    try {
      console.log(`Obteniendo producto ${productId}...`);
      const response = await api.get(`/inventory/products/${productId}/`);
      console.log('Producto obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener producto ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  async createProduct(productData) {
    try {
      console.log('Creando producto:', productData);
      const response = await api.post('/inventory/products/', productData);
      console.log('Producto creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  /**
   * Actualiza un producto existente
   * @param {number} productId - ID del producto
   * @param {Object} productData - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  async updateProduct(productId, productData) {
    try {
      console.log(`Actualizando producto ${productId}:`, productData);
      const response = await api.patch(`/inventory/products/${productId}/`, productData);
      console.log('Producto actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar producto ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un producto
   * @param {number} productId - ID del producto
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deleteProduct(productId) {
    try {
      console.log(`Eliminando producto ${productId}...`);
      const response = await api.delete(`/inventory/products/${productId}/`);
      console.log('Producto eliminado');
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar producto ${productId}:`, error);
      throw error;
    }
  },

  // =================== CATEGORIES ===================

  /**
   * Obtiene todas las categorías de productos
   * @returns {Promise<Array>} Lista de categorías
   */
  async getCategories() {
    try {
      console.log('Obteniendo categorías...');
      const response = await api.get('/inventory/categories/');
      console.log('Categorías obtenidas:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  },

  /**
   * Crea una nueva categoría
   * @param {Object} categoryData - Datos de la categoría
   * @returns {Promise<Object>} Categoría creada
   */
  async createCategory(categoryData) {
    try {
      console.log('Creando categoría:', categoryData);
      
      // El backend puede requerir el business ID automáticamente via contexto/token
      // o podemos incluirlo explícitamente aquí si es necesario
      const dataToSend = {
        ...categoryData
        // No agregamos business_id aquí porque debería ser manejado por el backend
        // basado en el contexto del usuario/token
      };
      
      const response = await api.post('/inventory/categories/', dataToSend);
      console.log('Categoría creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  /**
   * Actualiza una categoría existente
   * @param {number} categoryId - ID de la categoría
   * @param {Object} categoryData - Datos a actualizar
   * @returns {Promise<Object>} Categoría actualizada
   */
  async updateCategory(categoryId, categoryData) {
    try {
      console.log(`Actualizando categoría ${categoryId}:`, categoryData);
      const response = await api.patch(`/inventory/categories/${categoryId}/`, categoryData);
      console.log('Categoría actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar categoría ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una categoría
   * @param {number} categoryId - ID de la categoría
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deleteCategory(categoryId) {
    try {
      console.log(`Eliminando categoría ${categoryId}...`);
      const response = await api.delete(`/inventory/categories/${categoryId}/`);
      console.log('Categoría eliminada');
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar categoría ${categoryId}:`, error);
      throw error;
    }
  },

  // =================== STOCK MOVEMENTS ===================

  /**
   * Obtiene movimientos de stock
   * @param {Object} filters - Filtros opcionales (product_id, date_from, date_to)
   * @returns {Promise<Array>} Lista de movimientos
   */
  async getStockMovements(filters = {}) {
    try {
      console.log('Obteniendo movimientos de stock:', filters);
      const response = await api.get('/inventory/stock-movements/', {
        params: filters
      });
      console.log('Movimientos obtenidos:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener movimientos de stock:', error);
      return [];
    }
  },

  /**
   * Crea un nuevo movimiento de stock
   * @param {Object} movementData - Datos del movimiento
   * @returns {Promise<Object>} Movimiento creado
   */
  async createStockMovement(movementData) {
    try {
      console.log('Creando movimiento de stock:', movementData);
      const response = await api.post('/inventory/stock-movements/', movementData);
      console.log('Movimiento creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear movimiento de stock:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  // =================== UTILITY METHODS ===================

  /**
   * Busca productos por nombre o descripción
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Array>} Lista de productos encontrados
   */
  async searchProducts(query) {
    try {
      console.log(`Buscando productos: "${query}"`);
      const response = await api.get('/inventory/products/', {
        params: { search: query }
      });
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al buscar productos:', error);
      return [];
    }
  },

  /**
   * Obtiene productos con stock bajo
   * @returns {Promise<Array>} Lista de productos con stock bajo
   */
  async getLowStockProducts() {
    try {
      console.log('Obteniendo productos con stock bajo...');
      const response = await api.get('/inventory/products/', {
        params: { low_stock: true }
      });
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      return [];
    }
  },

  // =================== ADVANCED SEARCH ===================

  /**
   * Búsqueda avanzada de productos con filtros múltiples
   * @param {Object} filters - Filtros de búsqueda avanzada
   * @param {string} filters.name - Buscar por nombre
   * @param {string} filters.category - Filtrar por categoría
   * @param {number} filters.min_price - Precio mínimo
   * @param {number} filters.max_price - Precio máximo
   * @param {number} filters.min_stock - Stock mínimo
   * @param {number} filters.max_stock - Stock máximo
   * @param {boolean} filters.is_active - Solo productos activos
   * @param {string} filters.created_after - Creados después de esta fecha
   * @param {string} filters.created_before - Creados antes de esta fecha
   * @returns {Promise<Array>} Lista de productos encontrados
   */
  async advancedSearch(filters = {}) {
    try {
      console.log('Realizando búsqueda avanzada de productos:', filters);
      const response = await api.get('/inventory/products/advanced_search/', {
        params: filters
      });
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error en búsqueda avanzada de productos:', error);
      return [];
    }
  },

  /**
   * Búsqueda de productos por múltiples criterios
   * @param {Object} criteria - Criterios de búsqueda
   * @param {Array} criteria.categories - Array de IDs de categorías
   * @param {Array} criteria.tags - Array de tags
   * @param {string} criteria.availability - 'in_stock', 'low_stock', 'out_of_stock'
   * @param {string} criteria.sort_by - 'name', 'price', 'stock', 'created_at'
   * @param {string} criteria.order - 'asc' o 'desc'
   * @returns {Promise<Array>} Lista de productos encontrados
   */
  async searchByMultipleCriteria(criteria = {}) {
    try {
      console.log('Búsqueda por múltiples criterios:', criteria);
      
      // Construir parámetros de búsqueda
      const searchParams = {};
      
      if (criteria.categories && criteria.categories.length > 0) {
        searchParams.categories = criteria.categories.join(',');
      }
      
      if (criteria.tags && criteria.tags.length > 0) {
        searchParams.tags = criteria.tags.join(',');
      }
      
      if (criteria.availability) {
        searchParams.availability = criteria.availability;
      }
      
      if (criteria.sort_by) {
        searchParams.ordering = criteria.order === 'desc' ? `-${criteria.sort_by}` : criteria.sort_by;
      }
      
      const response = await api.get('/inventory/products/', {
        params: searchParams
      });
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error en búsqueda por múltiples criterios:', error);
      return [];
    }
  },

  // =================== BULK OPERATIONS ===================

  /**
   * Actualización masiva de productos
   * @param {Array} updates - Array de objetos {id, data}
   * @returns {Promise<Object>} Resultado de la operación
   */
  async bulkUpdateProducts(updates) {
    try {
      console.log('Actualizando productos masivamente:', updates);
      const response = await api.post('/inventory/products/bulk_update/', { updates });
      console.log('Actualización masiva completada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en actualización masiva de productos:', error);
      throw error;
    }
  },

  /**
   * Eliminación masiva de productos
   * @param {Array} productIds - Array de IDs de productos
   * @returns {Promise<Object>} Resultado de la operación
   */
  async bulkDeleteProducts(productIds) {
    try {
      console.log('Eliminando productos masivamente:', productIds);
      const response = await api.post('/inventory/products/bulk_delete/', { ids: productIds });
      console.log('Eliminación masiva completada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en eliminación masiva de productos:', error);
      throw error;
    }
  },

  // =================== EXPORT/IMPORT ===================

  /**
   * Exportar productos a CSV/JSON
   * @param {string} format - 'csv' o 'json'
   * @param {Object} filters - Filtros para exportación
   * @returns {Promise<Blob>} Archivo de exportación
   */
  async exportProducts(format = 'csv', filters = {}) {
    try {
      console.log(`Exportando productos en formato ${format}:`, filters);
      const response = await api.get('/inventory/products/export/', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error al exportar productos:', error);
      throw error;
    }
  },

  /**
   * Importar productos desde archivo
   * @param {File} file - Archivo CSV/JSON
   * @returns {Promise<Object>} Resultado de la importación
   */
  async importProducts(file) {
    try {
      console.log('Importando productos desde archivo:', file.name);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/inventory/products/import/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Importación completada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al importar productos:', error);
      throw error;
    }
  }
};

export default inventoryService;