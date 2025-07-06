// src/hooks/useAIChat.js
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import aiService from '../services/ai.service';
import { getBusinessTypeLabel } from '../utils/businessTypes';

/**
 * Custom hook for AI Chat functionality
 */
export const useAIChat = () => {
  const { user, activeBusiness } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  
  const sessionRef = useRef(null);
  const messagesRef = useRef([]);

  // Update messages ref when messages change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Initialize session when chat opens
  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeSession();
    }
  }, [isOpen, sessionId, initializeSession]);

  // Cleanup session when component unmounts
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        endSession();
      }
    };
  }, [endSession]);

  const initializeSession = async () => {
    try {
      const sessionData = await aiService.createSession({
        businessType: activeBusiness?.business_type || activeBusiness?.type || 'restaurant',
        businessId: activeBusiness?.id,
        userId: user?.id,
        language: 'es',
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      });
      
      setSessionId(sessionData.sessionId || Date.now().toString());
      sessionRef.current = sessionData;
      
      // Load conversation history if exists
      if (sessionData.sessionId) {
        loadConversationHistory(sessionData.sessionId);
      } else {
        // Initialize with welcome message
        initializeWelcomeMessage();
      }
    } catch (error) {
      console.error('Error initializing AI session:', error);
      setError('Error al inicializar el chat');
      // Fallback to local session
      const fallbackSessionId = `local_${Date.now()}`;
      setSessionId(fallbackSessionId);
      initializeWelcomeMessage();
    }
  };

  const loadConversationHistory = async (sessionId) => {
    try {
      const history = await aiService.getConversationHistory(sessionId);
      if (history.length > 0) {
        setMessages(history);
      } else {
        initializeWelcomeMessage();
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      initializeWelcomeMessage();
    }
  };

  const initializeWelcomeMessage = () => {
    const businessLabel = getBusinessTypeLabel(
      activeBusiness?.business_type || activeBusiness?.type || 'restaurant'
    );
    
    const welcomeMessage = {
      id: `welcome_${Date.now()}`,
      type: 'ai',
      content: `¡Hola ${user?.first_name || 'Usuario'}! 👋\n\nSoy tu asistente de IA para ${activeBusiness?.name || 'tu negocio'}. Estoy aquí para ayudarte con:\n\n🔹 Gestión de ${businessLabel.toLowerCase()}\n🔹 Reportes y análisis\n🔹 Configuración del sistema\n🔹 Resolución de dudas\n\n¿En qué puedo asistirte hoy?`,
      timestamp: new Date(),
      suggestions: getInitialSuggestions(),
    };
    
    setMessages([welcomeMessage]);
  };

  const getInitialSuggestions = () => {
    const businessType = activeBusiness?.business_type || activeBusiness?.type || 'restaurant';
    const businessLabel = getBusinessTypeLabel(businessType);

    const suggestionMap = {
      restaurant: [
        '¿Cómo gestionar pedidos?',
        '¿Cómo configurar el menú?',
        'Ver reportes de ventas',
        'Gestionar reservas',
        'Control de inventario',
      ],
      bakery: [
        '¿Cómo programar producción?',
        'Gestionar inventario de ingredientes',
        'Ver pedidos especiales',
        'Configurar horarios',
      ],
      pharmacy: [
        '¿Cómo gestionar recetas?',
        'Control de medicamentos',
        'Alertas de vencimiento',
        'Gestionar seguros médicos',
      ],
      fitness_center: [
        '¿Cómo gestionar membresías?',
        'Programar clases',
        'Control de equipos',
        'Ver estadísticas de miembros',
      ],
      default: [
        `¿Cómo gestionar mi ${businessLabel.toLowerCase()}?`,
        '¿Qué reportes puedo generar?',
        'Ayuda con configuración',
        'Ver estadísticas del negocio',
      ],
    };

    return suggestionMap[businessType] || suggestionMap.default;
  };

  const sendMessage = useCallback(async (content, options = {}) => {
    if (!content.trim() || isLoading) return null;

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      metadata: options.metadata || {},
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Prepare message data for AI service
      const messageData = {
        content: content.trim(),
        businessType: activeBusiness?.business_type || activeBusiness?.type || 'restaurant',
        businessId: activeBusiness?.id,
        userId: user?.id,
        sessionId: sessionId,
        previousMessages: messagesRef.current.slice(-10), // Last 10 messages for context
        language: options.language || 'es',
      };

      // Send to AI service
      const aiResponse = await aiService.sendMessage(messageData);
      
      // Create AI message
      const aiMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: aiResponse.content || aiResponse.message || 'Lo siento, no pude procesar tu mensaje.',
        timestamp: new Date(),
        suggestions: aiResponse.suggestions || [],
        actions: aiResponse.actions || [],
        confidence: aiResponse.confidence,
        metadata: aiResponse.metadata || {},
      };

      setMessages(prev => [...prev, aiMessage]);
      return aiMessage;
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error al enviar el mensaje');
      
      // Fallback to local AI simulation
      const fallbackResponse = await simulateAIResponse(content);
      const aiMessage = {
        id: `ai_fallback_${Date.now()}`,
        type: 'ai',
        content: fallbackResponse.content,
        timestamp: new Date(),
        suggestions: fallbackResponse.suggestions || [],
        actions: fallbackResponse.actions || [],
        isOffline: true,
      };

      setMessages(prev => [...prev, aiMessage]);
      return aiMessage;
      
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId, activeBusiness, user, simulateAIResponse]);

  const simulateAIResponse = async (userMessage) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    const businessType = activeBusiness?.business_type || activeBusiness?.type || 'restaurant';
    const businessLabel = getBusinessTypeLabel(businessType);
    const lowerMessage = userMessage.toLowerCase();

    // Pattern matching for responses
    if (lowerMessage.includes('pedido') || lowerMessage.includes('orden')) {
      return {
        content: `Para gestionar pedidos en tu ${businessLabel.toLowerCase()}, puedes:\n\n📋 **Funciones disponibles:**\n• Ver todos los pedidos activos\n• Crear nuevos pedidos\n• Cambiar estados de pedidos\n• Generar reportes de ventas\n\n¿Te gustaría que te ayude con alguna función específica?`,
        suggestions: [
          'Ver pedidos activos',
          'Crear nuevo pedido',
          'Reportes de ventas',
          'Configurar estados',
        ],
        actions: [
          { label: 'Ir a Pedidos', path: '/orders' },
        ]
      };
    }

    if (lowerMessage.includes('inventario') || lowerMessage.includes('stock')) {
      return {
        content: `El control de inventario es fundamental para tu ${businessLabel.toLowerCase()}:\n\n📦 **Funciones de inventario:**\n• Consultar stock actual\n• Agregar nuevos productos\n• Configurar alertas de stock bajo\n• Ver movimientos de inventario\n\n¿Qué aspecto del inventario necesitas gestionar?`,
        suggestions: [
          'Ver stock actual',
          'Agregar productos',
          'Alertas de stock',
          'Movimientos de inventario',
        ],
        actions: [
          { label: 'Ir a Inventario', path: '/inventory' },
        ]
      };
    }

    if (lowerMessage.includes('reporte') || lowerMessage.includes('estadística')) {
      return {
        content: `Puedes generar diversos reportes para analizar tu ${businessLabel.toLowerCase()}:\n\n📊 **Reportes disponibles:**\n• Ventas por período\n• Productos más vendidos\n• Análisis de clientes\n• Rendimiento del personal\n• Estado financiero\n\n¿Qué tipo de análisis necesitas?`,
        suggestions: [
          'Reporte de ventas',
          'Productos populares',
          'Análisis financiero',
          'Rendimiento del equipo',
        ],
        actions: [
          { label: 'Ver Dashboard', path: '/dashboard' },
        ]
      };
    }

    if (lowerMessage.includes('configuración') || lowerMessage.includes('ajuste')) {
      return {
        content: `Te ayudo con la configuración de tu ${businessLabel.toLowerCase()}:\n\n⚙️ **Configuraciones disponibles:**\n• Información del negocio\n• Métodos de pago\n• Notificaciones\n• Gestión de usuarios\n• Módulos activos\n\n¿Qué configuración necesitas ajustar?`,
        suggestions: [
          'Configurar pagos',
          'Gestionar usuarios',
          'Ajustar notificaciones',
          'Información del negocio',
        ],
        actions: [
          { label: 'Ir a Configuración', path: '/settings' },
        ]
      };
    }

    // Default response
    return {
      content: `Entiendo que necesitas ayuda con tu ${businessLabel.toLowerCase()}. Puedo asistirte con:\n\n🔹 **Gestión operativa:** Pedidos, inventario, ventas\n🔹 **Análisis:** Reportes, estadísticas, tendencias\n🔹 **Configuración:** Sistema, usuarios, notificaciones\n🔹 **Soporte:** Resolución de dudas y problemas\n\n¿Podrías ser más específico sobre lo que necesitas?`,
      suggestions: [
        'Gestión de pedidos',
        'Control de inventario',
        'Ver reportes',
        'Configurar sistema',
        'Ayuda general',
      ]
    };
  };

  const sendFeedback = useCallback(async (messageId, rating, comment = '') => {
    try {
      await aiService.sendFeedback({
        messageId,
        sessionId,
        rating,
        comment,
        metadata: {
          timestamp: new Date().toISOString(),
          businessType: activeBusiness?.business_type || activeBusiness?.type,
        },
      });
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  }, [sessionId, activeBusiness]);

  const clearChat = useCallback(() => {
    setMessages([]);
    initializeWelcomeMessage();
    setError(null);
  }, [initializeWelcomeMessage]);

  const endSession = useCallback(async () => {
    if (sessionRef.current && sessionId) {
      try {
        await aiService.endSession(sessionId);
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
    sessionRef.current = null;
    setSessionId(null);
  }, [sessionId]);

  return {
    // State
    isOpen,
    messages,
    isLoading,
    error,
    sessionId,
    
    // Actions
    setIsOpen,
    sendMessage,
    sendFeedback,
    clearChat,
    endSession,
    
    // Utils
    initializeSession,
    getInitialSuggestions,
  };
};

export default useAIChat;