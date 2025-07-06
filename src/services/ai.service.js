// src/services/ai.service.js
import api from './api';

/**
 * Service for AI Assistant interactions
 */
const aiService = {
  /**
   * Sends a message to the AI assistant
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} AI response
   */
  async sendMessage(messageData) {
    try {
      console.log('Sending message to AI:', messageData);
      const response = await api.post('/ai/chat/', {
        message: messageData.content,
        context: {
          businessType: messageData.businessType,
          businessId: messageData.businessId,
          userId: messageData.userId,
          sessionId: messageData.sessionId,
          previousMessages: messageData.previousMessages?.slice(-5), // Last 5 messages for context
        },
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          language: messageData.language || 'es',
        }
      });
      
      console.log('AI response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw error;
    }
  },

  /**
   * Gets conversation history
   * @param {string} sessionId - Session ID
   * @returns {Promise<Array>} Conversation history
   */
  async getConversationHistory(sessionId) {
    try {
      console.log('Getting conversation history:', sessionId);
      const response = await api.get(`/ai/conversations/${sessionId}/`);
      console.log('Conversation history retrieved:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.messages) {
        return response.data.messages;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  },

  /**
   * Creates a new conversation session
   * @param {Object} sessionData - Session data
   * @returns {Promise<Object>} Session information
   */
  async createSession(sessionData) {
    try {
      console.log('Creating AI session:', sessionData);
      const response = await api.post('/ai/sessions/', {
        businessType: sessionData.businessType,
        businessId: sessionData.businessId,
        userId: sessionData.userId,
        language: sessionData.language || 'es',
        metadata: sessionData.metadata || {},
      });
      
      console.log('AI session created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating AI session:', error);
      throw error;
    }
  },

  /**
   * Ends a conversation session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} End session result
   */
  async endSession(sessionId) {
    try {
      console.log('Ending AI session:', sessionId);
      const response = await api.post(`/ai/sessions/${sessionId}/end/`);
      console.log('AI session ended:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error ending AI session:', error);
      throw error;
    }
  },

  /**
   * Gets AI suggestions based on context
   * @param {Object} contextData - Context for suggestions
   * @returns {Promise<Array>} AI suggestions
   */
  async getSuggestions(contextData) {
    try {
      console.log('Getting AI suggestions:', contextData);
      const response = await api.post('/ai/suggestions/', {
        businessType: contextData.businessType,
        currentPage: contextData.currentPage,
        userRole: contextData.userRole,
        recentActions: contextData.recentActions,
        language: contextData.language || 'es',
      });
      
      console.log('AI suggestions received:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.suggestions) {
        return response.data.suggestions;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return [];
    }
  },

  /**
   * Sends feedback about AI response
   * @param {Object} feedbackData - Feedback data
   * @returns {Promise<Object>} Feedback result
   */
  async sendFeedback(feedbackData) {
    try {
      console.log('Sending AI feedback:', feedbackData);
      const response = await api.post('/ai/feedback/', {
        messageId: feedbackData.messageId,
        sessionId: feedbackData.sessionId,
        rating: feedbackData.rating, // 'up', 'down', or number
        comment: feedbackData.comment,
        category: feedbackData.category, // 'helpful', 'accurate', 'relevant', etc.
        metadata: feedbackData.metadata || {},
      });
      
      console.log('AI feedback sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending AI feedback:', error);
      throw error;
    }
  },

  /**
   * Gets AI analytics and insights
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} AI analytics
   */
  async getAnalytics(filters = {}) {
    try {
      console.log('Getting AI analytics:', filters);
      const response = await api.get('/ai/analytics/', { params: filters });
      console.log('AI analytics retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting AI analytics:', error);
      return {
        totalConversations: 0,
        totalMessages: 0,
        averageRating: 0,
        topQuestions: [],
        responseTime: 0,
      };
    }
  },

  /**
   * Gets business-specific AI prompts and templates
   * @param {string} businessType - Business type
   * @returns {Promise<Object>} AI prompts and templates
   */
  async getBusinessPrompts(businessType) {
    try {
      console.log('Getting business prompts for:', businessType);
      const response = await api.get(`/ai/prompts/${businessType}/`);
      console.log('Business prompts retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting business prompts:', error);
      return {
        welcomeMessages: [],
        quickActions: [],
        helpTopics: [],
        commonQuestions: [],
      };
    }
  },

  /**
   * Processes voice input to text
   * @param {Blob} audioBlob - Audio data
   * @returns {Promise<Object>} Transcription result
   */
  async processVoiceInput(audioBlob) {
    try {
      console.log('Processing voice input...');
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', 'es-ES');
      
      const response = await api.post('/ai/voice/transcribe/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Voice transcription result:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error processing voice input:', error);
      throw error;
    }
  },

  /**
   * Converts text to speech
   * @param {Object} ttsData - Text-to-speech data
   * @returns {Promise<Blob>} Audio blob
   */
  async textToSpeech(ttsData) {
    try {
      console.log('Converting text to speech:', ttsData);
      const response = await api.post('/ai/voice/synthesize/', {
        text: ttsData.text,
        language: ttsData.language || 'es-ES',
        voice: ttsData.voice || 'es-ES-Standard-A',
        speed: ttsData.speed || 1.0,
      }, {
        responseType: 'blob',
      });
      
      console.log('Text-to-speech conversion completed');
      return response.data;
    } catch (error) {
      console.error('Error converting text to speech:', error);
      throw error;
    }
  },

  /**
   * Gets AI configuration for business
   * @param {string} businessId - Business ID
   * @returns {Promise<Object>} AI configuration
   */
  async getBusinessAIConfig(businessId) {
    try {
      console.log('Getting AI config for business:', businessId);
      const response = await api.get(`/ai/business/${businessId}/config/`);
      console.log('Business AI config retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting business AI config:', error);
      return {
        enabled: true,
        features: {
          chat: true,
          voiceInput: false,
          suggestions: true,
          analytics: false,
        },
        settings: {
          language: 'es',
          responseStyle: 'friendly',
          maxConversationLength: 50,
        },
      };
    }
  },

  /**
   * Updates AI configuration for business
   * @param {string} businessId - Business ID
   * @param {Object} config - AI configuration
   * @returns {Promise<Object>} Updated configuration
   */
  async updateBusinessAIConfig(businessId, config) {
    try {
      console.log('Updating AI config for business:', businessId, config);
      const response = await api.put(`/ai/business/${businessId}/config/`, config);
      console.log('Business AI config updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating business AI config:', error);
      throw error;
    }
  },

  /**
   * Gets AI assistant status and health
   * @returns {Promise<Object>} AI status
   */
  async getStatus() {
    try {
      console.log('Getting AI assistant status...');
      const response = await api.get('/ai/status/');
      console.log('AI status retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting AI status:', error);
      return {
        available: false,
        version: 'unknown',
        features: [],
        limitations: [],
      };
    }
  },

  /**
   * Generates automated responses for common scenarios
   * @param {Object} scenarioData - Scenario data
   * @returns {Promise<Object>} Generated response
   */
  async generateResponse(scenarioData) {
    try {
      console.log('Generating AI response for scenario:', scenarioData);
      const response = await api.post('/ai/generate/', {
        scenario: scenarioData.scenario,
        businessType: scenarioData.businessType,
        context: scenarioData.context,
        tone: scenarioData.tone || 'professional',
        language: scenarioData.language || 'es',
      });
      
      console.log('AI response generated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  },
};

export default aiService;