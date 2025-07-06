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
   * Marca una orden como pagada
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Orden actualizada
   */
  async markOrderPaid(orderId) {
    return this.updateOrderStatus(orderId, 'paid');
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

  /**
   * Reembolsa una orden
   * @param {number} orderId - ID de la orden
   * @param {Object} refundData - Datos del reembolso (amount, reason, partial_refund)
   * @returns {Promise<Object>} Orden reembolsada
   */
  async refundOrder(orderId, refundData = {}) {
    try {
      console.log(`Reembolsando orden ${orderId}:`, refundData);
      const response = await api.post(`/orders/${orderId}/refund_order/`, refundData);
      console.log('Orden reembolsada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al reembolsar orden ${orderId}:`, error);
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
          
          // Manejar diferentes tipos de eventos
          switch(data.type) {
            case 'order_created':
              console.log('Nueva orden creada:', data.order);
              break;
            case 'order_updated':
              console.log('Orden actualizada:', data.order);
              break;
            case 'order_status_changed':
              console.log('Estado de orden cambiado:', data.order);
              break;
            case 'order_cancelled':
              console.log('Orden cancelada:', data.order);
              break;
            case 'order_refunded':
              console.log('Orden reembolsada:', data.order);
              break;
            case 'order_paid':
              console.log('Orden pagada:', data.order);
              break;
            case 'ping':
              console.log('Ping recibido, enviando pong');
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ action: 'pong' }));
              }
              break;
            case 'pong':
              console.log('Pong recibido');
              break;
            default:
              console.log('Evento desconocido:', data.type);
          }
          
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

      // Configurar ping/pong para mantener conexión activa
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ action: 'ping' }));
        } else {
          clearInterval(pingInterval);
        }
      }, 30000); // Ping cada 30 segundos

      // Limpiar interval cuando se cierre la conexión
      ws.onclose = (originalOnClose => () => {
        clearInterval(pingInterval);
        console.log('Conexión WebSocket de órdenes cerrada');
        if (originalOnClose) originalOnClose();
      })(ws.onclose);
      
      return ws;
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      return null;
    }
  },

  // =================== ORDER ITEM MANAGEMENT ===================

  /**
   * Agrega un item a una orden existente
   * @param {number} orderId - ID de la orden
   * @param {Object} itemData - Datos del item (product_id, quantity, notes, etc.)
   * @returns {Promise<Object>} Orden actualizada
   */
  async addItemToOrder(orderId, itemData) {
    try {
      console.log(`Agregando item a orden ${orderId}:`, itemData);
      const response = await api.post(`/orders/${orderId}/add_item/`, itemData);
      console.log('Item agregado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al agregar item a orden ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza un item de una orden
   * @param {number} orderId - ID de la orden
   * @param {number} itemId - ID del item
   * @param {Object} itemData - Datos a actualizar
   * @returns {Promise<Object>} Item actualizado
   */
  async updateOrderItem(orderId, itemId, itemData) {
    try {
      console.log(`Actualizando item ${itemId} de orden ${orderId}:`, itemData);
      const response = await api.patch(`/orders/${orderId}/items/${itemId}/`, itemData);
      console.log('Item actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar item ${itemId} de orden ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Remueve un item de una orden
   * @param {number} orderId - ID de la orden
   * @param {number} itemId - ID del item
   * @returns {Promise<Object>} Resultado de la operación
   */
  async removeOrderItem(orderId, itemId) {
    try {
      console.log(`Removiendo item ${itemId} de orden ${orderId}`);
      const response = await api.delete(`/orders/${orderId}/items/${itemId}/`);
      console.log('Item removido');
      return response.data;
    } catch (error) {
      console.error(`Error al remover item ${itemId} de orden ${orderId}:`, error);
      throw error;
    }
  },

  // =================== AUDIT LOG ===================

  /**
   * Obtiene el registro de auditoría de una orden
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Array>} Lista de logs de auditoría
   */
  async getAuditLog(orderId) {
    try {
      console.log(`Obteniendo audit log de orden ${orderId}`);
      const response = await api.get(`/orders/${orderId}/audit_log/`);
      console.log('Audit log obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener audit log de orden ${orderId}:`, error);
      return [];
    }
  },

  // =================== ADVANCED STATISTICS ===================

  /**
   * Obtiene estadísticas avanzadas con filtros de período
   * @param {Object} params - Parámetros (period, date, date_from, date_to)
   * @returns {Promise<Object>} Estadísticas detalladas
   */
  async getAdvancedStats(params = {}) {
    try {
      console.log('Obteniendo estadísticas avanzadas:', params);
      const response = await api.get('/orders/stats/', { params });
      console.log('Estadísticas avanzadas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas avanzadas:', error);
      return {
        total_orders: 0,
        pending_orders: 0,
        confirmed_orders: 0,
        preparing_orders: 0,
        ready_orders: 0,
        paid_orders: 0,
        delivered_orders: 0,
        cancelled_orders: 0,
        refunded_orders: 0,
        total_revenue: 0,
        average_order_value: 0,
        peak_hours: [],
        revenue_by_period: {},
        comparison_data: {}
      };
    }
  }
};

export default ordersService;