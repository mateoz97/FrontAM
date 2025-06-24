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
  }
};

export default inventoryService;