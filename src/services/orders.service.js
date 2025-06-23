// src/services/orders.service.js
import api from './api';

const ordersService = {
  // =================== ORDERS CRUD ===================

  /**
   * Obtiene todas las órdenes
   * @param {Object} filters - Filtros opcionales (status, date_from, date_to, customer)
   * @returns {Promise<Array>} Lista de órdenes
   */
  async getOrders(filters = {}) {
    try {
      console.log('Obteniendo órdenes:', filters);
      const response = await api.get('/orders/', {
        params: filters
      });
      console.log('Órdenes obtenidas:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      return [];
    }
  },

  /**
   * Obtiene una orden específica por ID
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Datos de la orden
   */
  async getOrder(orderId) {
    try {
      console.log(`Obteniendo orden ${orderId}...`);
      const response = await api.get(`/orders/${orderId}/`);
      console.log('Orden obtenida:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener orden ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva orden
   * @param {Object} orderData - Datos de la orden
   * @returns {Promise<Object>} Orden creada
   */
  async createOrder(orderData) {
    try {
      console.log('Creando orden:', orderData);
      const response = await api.post('/orders/', orderData);
      console.log('Orden creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  },

  /**
   * Actualiza una orden existente
   * @param {number} orderId - ID de la orden
   * @param {Object} orderData - Datos a actualizar
   * @returns {Promise<Object>} Orden actualizada
   */
  async updateOrder(orderId, orderData) {
    try {
      console.log(`Actualizando orden ${orderId}:`, orderData);
      const response = await api.patch(`/orders/${orderId}/`, orderData);
      console.log('Orden actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar orden ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una orden
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deleteOrder(orderId) {
    try {
      console.log(`Eliminando orden ${orderId}...`);
      const response = await api.delete(`/orders/${orderId}/`);
      console.log('Orden eliminada');
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar orden ${orderId}:`, error);
      throw error;
    }
  },

  // =================== ORDER STATUS MANAGEMENT ===================

  /**
   * Actualiza el estado de una orden
   * @param {number} orderId - ID de la orden
   * @param {string} status - Nuevo estado (pending, confirmed, preparing, ready, delivered, cancelled)
   * @returns {Promise<Object>} Orden actualizada
   */
  async updateOrderStatus(orderId, status) {
    try {
      console.log(`Actualizando estado de orden ${orderId} a: ${status}`);
      const response = await api.patch(`/orders/${orderId}/`, { status });
      console.log('Estado actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar estado de orden ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Confirma una orden
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Orden confirmada
   */
  async confirmOrder(orderId) {
    return this.updateOrderStatus(orderId, 'confirmed');
  },

  /**
   * Marca una orden como en preparación
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Orden actualizada
   */
  async startPreparingOrder(orderId) {
    return this.updateOrderStatus(orderId, 'preparing');
  },

  /**
   * Marca una orden como lista
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Orden actualizada
   */
  async markOrderReady(orderId) {
    return this.updateOrderStatus(orderId, 'ready');
  },

  /**
   * Marca una orden como entregada
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Orden actualizada
   */
  async deliverOrder(orderId) {
    return this.updateOrderStatus(orderId, 'delivered');
  },

  /**
   * Cancela una orden
   * @param {number} orderId - ID de la orden
   * @param {string} reason - Razón de la cancelación (opcional)
   * @returns {Promise<Object>} Orden cancelada
   */
  async cancelOrder(orderId, reason = '') {
    try {
      console.log(`Cancelando orden ${orderId} por: ${reason}`);
      const updateData = { status: 'cancelled' };
      if (reason) {
        updateData.cancellation_reason = reason;
      }
      
      const response = await api.patch(`/orders/${orderId}/`, updateData);
      console.log('Orden cancelada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al cancelar orden ${orderId}:`, error);
      throw error;
    }
  },

  // =================== ORDER FILTERING & SEARCH ===================

  /**
   * Obtiene órdenes por estado
   * @param {string} status - Estado de las órdenes
   * @returns {Promise<Array>} Lista de órdenes filtradas
   */
  async getOrdersByStatus(status) {
    return this.getOrders({ status });
  },

  /**
   * Obtiene órdenes pendientes
   * @returns {Promise<Array>} Lista de órdenes pendientes
   */
  async getPendingOrders() {
    return this.getOrdersByStatus('pending');
  },

  /**
   * Obtiene órdenes confirmadas
   * @returns {Promise<Array>} Lista de órdenes confirmadas
   */
  async getConfirmedOrders() {
    return this.getOrdersByStatus('confirmed');
  },

  /**
   * Obtiene órdenes en preparación
   * @returns {Promise<Array>} Lista de órdenes en preparación
   */
  async getPreparingOrders() {
    return this.getOrdersByStatus('preparing');
  },

  /**
   * Obtiene órdenes listas
   * @returns {Promise<Array>} Lista de órdenes listas
   */
  async getReadyOrders() {
    return this.getOrdersByStatus('ready');
  },

  /**
   * Obtiene órdenes entregadas
   * @returns {Promise<Array>} Lista de órdenes entregadas
   */
  async getDeliveredOrders() {
    return this.getOrdersByStatus('delivered');
  },

  /**
   * Obtiene órdenes de hoy
   * @returns {Promise<Array>} Lista de órdenes del día actual
   */
  async getTodayOrders() {
    const today = new Date().toISOString().split('T')[0];
    return this.getOrders({ 
      date_from: today,
      date_to: today 
    });
  },

  /**
   * Busca órdenes por cliente
   * @param {string} customerQuery - Nombre o información del cliente
   * @returns {Promise<Array>} Lista de órdenes encontradas
   */
  async searchOrdersByCustomer(customerQuery) {
    return this.getOrders({ customer: customerQuery });
  },

  // =================== ORDER STATISTICS ===================

  /**
   * Obtiene estadísticas de órdenes
   * @param {Object} filters - Filtros opcionales (date_from, date_to)
   * @returns {Promise<Object>} Estadísticas de órdenes
   */
  async getOrderStatistics(filters = {}) {
    try {
      console.log('Obteniendo estadísticas de órdenes:', filters);
      const response = await api.get('/orders/statistics/', {
        params: filters
      });
      console.log('Estadísticas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      // Devolver estadísticas por defecto en caso de error
      return {
        total_orders: 0,
        pending_orders: 0,
        confirmed_orders: 0,
        preparing_orders: 0,
        ready_orders: 0,
        delivered_orders: 0,
        cancelled_orders: 0,
        total_revenue: 0
      };
    }
  },

  // =================== REAL-TIME FUNCTIONALITY ===================

  /**
   * Suscribirse a actualizaciones de órdenes en tiempo real
   * @param {Function} callback - Función a ejecutar cuando hay actualizaciones
   * @returns {WebSocket} Conexión WebSocket
   */
  subscribeToOrderUpdates(callback) {
    try {
      // Determinar la URL del WebSocket basada en la URL de la API
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = api.defaults.baseURL?.replace(/^https?:\/\//, '').replace('/api', '') || 'localhost:8000';
      const wsUrl = `${wsProtocol}//${wsHost}/ws/orders/`;
      
      console.log('Conectando a WebSocket de órdenes:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('Conectado a WebSocket de órdenes');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Actualización de orden recibida:', data);
          callback(data);
        } catch (error) {
          console.error('Error al procesar mensaje WebSocket:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('Error en WebSocket de órdenes:', error);
      };
      
      ws.onclose = () => {
        console.log('Conexión WebSocket de órdenes cerrada');
      };
      
      return ws;
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      return null;
    }
  }
};

export default ordersService;