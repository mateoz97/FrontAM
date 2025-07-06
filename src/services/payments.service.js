// src/services/payments.service.js
import api from './api';

/**
 * Service for payment-related operations
 */
const paymentsService = {
  /**
   * Processes a payment
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(paymentData) {
    try {
      console.log('Processing payment:', paymentData);
      const response = await api.post('/payments/process/', paymentData);
      console.log('Payment processed:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  /**
   * Gets payment history
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} Payment history
   */
  async getPaymentHistory(filters = {}) {
    try {
      console.log('Getting payment history:', filters);
      const response = await api.get('/payments/history/', { params: filters });
      console.log('Payment history retrieved:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error getting payment history:', error);
      return [];
    }
  },

  /**
   * Gets payment details by ID
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentById(paymentId) {
    try {
      console.log(`Getting payment details for ID: ${paymentId}`);
      const response = await api.get(`/payments/${paymentId}/`);
      console.log('Payment details retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error getting payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Cancels a payment
   * @param {string} paymentId - Payment ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelPayment(paymentId, reason = '') {
    try {
      console.log(`Canceling payment ${paymentId}:`, reason);
      const response = await api.post(`/payments/${paymentId}/cancel/`, {
        reason: reason
      });
      console.log('Payment canceled:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error canceling payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Refunds a payment
   * @param {string} paymentId - Payment ID
   * @param {number} amount - Refund amount (optional, defaults to full amount)
   * @param {string} reason - Refund reason
   * @returns {Promise<Object>} Refund result
   */
  async refundPayment(paymentId, amount = null, reason = '') {
    try {
      console.log(`Refunding payment ${paymentId}:`, { amount, reason });
      const response = await api.post(`/payments/${paymentId}/refund/`, {
        amount: amount,
        reason: reason
      });
      console.log('Payment refunded:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error refunding payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Gets payment methods configuration
   * @returns {Promise<Object>} Payment methods configuration
   */
  async getPaymentMethods() {
    try {
      console.log('Getting payment methods configuration...');
      const response = await api.get('/payments/methods/');
      console.log('Payment methods retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return {
        available_methods: [],
        default_currency: 'MXN',
        supported_currencies: ['MXN']
      };
    }
  },

  /**
   * Updates payment methods configuration
   * @param {Object} config - Payment methods configuration
   * @returns {Promise<Object>} Updated configuration
   */
  async updatePaymentMethods(config) {
    try {
      console.log('Updating payment methods configuration:', config);
      const response = await api.put('/payments/methods/', config);
      console.log('Payment methods updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating payment methods:', error);
      throw error;
    }
  },

  /**
   * Gets payment statistics
   * @param {Object} filters - Filter parameters (date_from, date_to, etc.)
   * @returns {Promise<Object>} Payment statistics
   */
  async getPaymentStats(filters = {}) {
    try {
      console.log('Getting payment statistics:', filters);
      const response = await api.get('/payments/stats/', { params: filters });
      console.log('Payment statistics retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting payment statistics:', error);
      return {
        total_payments: 0,
        total_amount: 0,
        successful_payments: 0,
        failed_payments: 0,
        refunded_amount: 0
      };
    }
  },

  /**
   * Creates a payment intent (for future card payments)
   * @param {Object} intentData - Payment intent data
   * @returns {Promise<Object>} Payment intent
   */
  async createPaymentIntent(intentData) {
    try {
      console.log('Creating payment intent:', intentData);
      const response = await api.post('/payments/intent/', intentData);
      console.log('Payment intent created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  /**
   * Confirms a payment intent
   * @param {string} intentId - Payment intent ID
   * @param {Object} confirmData - Confirmation data
   * @returns {Promise<Object>} Confirmation result
   */
  async confirmPaymentIntent(intentId, confirmData) {
    try {
      console.log(`Confirming payment intent ${intentId}:`, confirmData);
      const response = await api.post(`/payments/intent/${intentId}/confirm/`, confirmData);
      console.log('Payment intent confirmed:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error confirming payment intent ${intentId}:`, error);
      throw error;
    }
  },

  /**
   * Gets payment providers status
   * @returns {Promise<Object>} Providers status
   */
  async getProvidersStatus() {
    try {
      console.log('Getting payment providers status...');
      const response = await api.get('/payments/providers/status/');
      console.log('Providers status retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting providers status:', error);
      return {
        providers: [],
        active_providers: [],
        default_provider: null
      };
    }
  },

  /**
   * Tests payment provider connection
   * @param {string} provider - Provider name
   * @returns {Promise<Object>} Test result
   */
  async testProvider(provider) {
    try {
      console.log(`Testing provider connection: ${provider}`);
      const response = await api.post('/payments/providers/test/', { provider });
      console.log('Provider test result:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error testing provider ${provider}:`, error);
      throw error;
    }
  },

  /**
   * Gets payment receipts
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Blob>} Receipt PDF
   */
  async getReceipt(paymentId) {
    try {
      console.log(`Getting receipt for payment ${paymentId}`);
      const response = await api.get(`/payments/${paymentId}/receipt/`, {
        responseType: 'blob'
      });
      console.log('Receipt retrieved');
      return response.data;
    } catch (error) {
      console.error(`Error getting receipt for payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Sends payment receipt by email
   * @param {string} paymentId - Payment ID
   * @param {string} email - Email address
   * @returns {Promise<Object>} Send result
   */
  async sendReceiptByEmail(paymentId, email) {
    try {
      console.log(`Sending receipt for payment ${paymentId} to ${email}`);
      const response = await api.post(`/payments/${paymentId}/receipt/email/`, {
        email: email
      });
      console.log('Receipt sent by email:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error sending receipt for payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Gets installment plans (for installment payments)
   * @param {number} amount - Payment amount
   * @returns {Promise<Array>} Available installment plans
   */
  async getInstallmentPlans(amount) {
    try {
      console.log(`Getting installment plans for amount: ${amount}`);
      const response = await api.get('/payments/installments/', {
        params: { amount }
      });
      console.log('Installment plans retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting installment plans:', error);
      return [];
    }
  },

  /**
   * Creates an installment payment
   * @param {Object} installmentData - Installment payment data
   * @returns {Promise<Object>} Installment payment result
   */
  async createInstallmentPayment(installmentData) {
    try {
      console.log('Creating installment payment:', installmentData);
      const response = await api.post('/payments/installments/', installmentData);
      console.log('Installment payment created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating installment payment:', error);
      throw error;
    }
  },

  /**
   * Validates payment data before processing
   * @param {Object} paymentData - Payment data to validate
   * @returns {Promise<Object>} Validation result
   */
  async validatePayment(paymentData) {
    try {
      console.log('Validating payment data:', paymentData);
      const response = await api.post('/payments/validate/', paymentData);
      console.log('Payment validation result:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error validating payment:', error);
      throw error;
    }
  },

  /**
   * Gets payment webhooks logs
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} Webhook logs
   */
  async getWebhookLogs(filters = {}) {
    try {
      console.log('Getting webhook logs:', filters);
      const response = await api.get('/payments/webhooks/logs/', { params: filters });
      console.log('Webhook logs retrieved:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error getting webhook logs:', error);
      return [];
    }
  }
};

export default paymentsService;