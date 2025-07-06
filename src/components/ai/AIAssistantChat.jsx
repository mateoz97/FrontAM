// src/components/ai/AIAssistantChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Collapse,
  useTheme,
  useMediaQuery,
  alpha,
  Slide,
  Zoom,
} from '@mui/material';
import {
  SmartToy as AIIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ContentCopy as CopyIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getBusinessTypeLabel, getBusinessTypeColor } from '../../utils/businessTypes';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AIAssistantChat = ({ 
  position = { bottom: 20, right: 20 },
  color = 'primary',
  size = 'large',
  disabled = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, activeBusiness } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // Removed unused suggestions state
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const businessColor = activeBusiness 
    ? getBusinessTypeColor(activeBusiness.business_type || activeBusiness.type)
    : theme.palette.primary.main;

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getInitialSuggestions = React.useCallback(() => {
    const businessType = activeBusiness?.business_type || activeBusiness?.type || 'restaurant';
    const businessLabel = getBusinessTypeLabel(businessType);

    return [
      `¿Cómo gestionar pedidos en mi ${businessLabel.toLowerCase()}?`,
      '¿Qué reportes puedo generar?',
      'Ayúdame con la configuración',
      '¿Cómo agregar nuevos productos?',
      '¿Cómo manejar el inventario?',
    ];
  }, [activeBusiness]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'ai',
        content: `¡Hola ${user?.first_name || 'Usuario'}! 👋 Soy tu asistente de IA para ${activeBusiness?.name || 'tu negocio'}. ¿En qué puedo ayudarte hoy?`,
        timestamp: new Date(),
        suggestions: getInitialSuggestions(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user, activeBusiness, messages.length, getInitialSuggestions]);

  const handleSendMessage = async (message = inputValue) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      await simulateAIResponse(message.trim());
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (userMessage) => {
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const responses = getContextualResponses(userMessage);
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: randomResponse.content,
      timestamp: new Date(),
      suggestions: randomResponse.suggestions,
      actions: randomResponse.actions,
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const getContextualResponses = (message) => {
    const businessType = activeBusiness?.business_type || activeBusiness?.type || 'restaurant';
    const businessLabel = getBusinessTypeLabel(businessType);
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('pedido') || lowerMessage.includes('orden')) {
      return [{
        content: `Para gestionar pedidos en tu ${businessLabel.toLowerCase()}, puedes:\n\n1. 📋 Ir a la sección "Pedidos" en el menú\n2. ➕ Crear nuevos pedidos desde el botón "Nuevo Pedido"\n3. 📊 Ver el estado de todos los pedidos en tiempo real\n4. ✏️ Editar pedidos existentes si es necesario\n\n¿Te gustaría que te ayude con algo específico sobre pedidos?`,
        suggestions: [
          'Crear un nuevo pedido',
          'Ver pedidos pendientes',
          'Configurar estados de pedidos',
          'Reportes de pedidos',
        ],
        actions: [
          { label: 'Ir a Pedidos', path: '/orders' },
          { label: 'Crear Pedido', action: 'create_order' },
        ]
      }];
    }

    if (lowerMessage.includes('inventario') || lowerMessage.includes('stock')) {
      return [{
        content: `El inventario es clave para tu ${businessLabel.toLowerCase()}. Te ayudo con:\n\n📦 **Gestión de Stock:**\n- Agregar nuevos productos\n- Actualizar cantidades\n- Configurar alertas de stock bajo\n\n📊 **Reportes:**\n- Productos más vendidos\n- Movimientos de inventario\n- Valoración del stock\n\n¿Qué aspecto del inventario te interesa más?`,
        suggestions: [
          'Agregar productos',
          'Ver stock bajo',
          'Reportes de inventario',
          'Configurar alertas',
        ],
        actions: [
          { label: 'Ir a Inventario', path: '/inventory' },
        ]
      }];
    }

    if (lowerMessage.includes('reporte') || lowerMessage.includes('estadística')) {
      return [{
        content: `¡Perfecto! Puedes generar varios tipos de reportes para tu ${businessLabel.toLowerCase()}:\n\n📈 **Reportes Disponibles:**\n- Ventas por período\n- Productos más vendidos\n- Rendimiento del personal\n- Análisis de clientes\n- Estado financiero\n\n¿Qué tipo de reporte necesitas?`,
        suggestions: [
          'Reporte de ventas',
          'Productos más vendidos',
          'Análisis de clientes',
          'Reporte financiero',
        ],
        actions: [
          { label: 'Ver Dashboard', path: '/dashboard' },
        ]
      }];
    }

    if (lowerMessage.includes('configuración') || lowerMessage.includes('ajuste')) {
      return [{
        content: `Te ayudo con la configuración de tu ${businessLabel.toLowerCase()}:\n\n⚙️ **Configuraciones Disponibles:**\n- Información del negocio\n- Métodos de pago\n- Notificaciones\n- Usuarios y permisos\n- Módulos activos\n\n¿Qué configuración necesitas ajustar?`,
        suggestions: [
          'Configurar pagos',
          'Gestionar usuarios',
          'Ajustar notificaciones',
          'Módulos del negocio',
        ],
        actions: [
          { label: 'Ir a Configuración', path: '/settings' },
        ]
      }];
    }

    // Default responses
    return [
      {
        content: `Entiendo que necesitas ayuda con tu ${businessLabel.toLowerCase()}. Puedo asistirte con:\n\n🔹 Gestión de pedidos y ventas\n🔹 Control de inventario\n🔹 Reportes y análisis\n🔹 Configuración del sistema\n🔹 Gestión de clientes\n🔹 Procesamiento de pagos\n\n¿Con cuál de estos temas te gustaría empezar?`,
        suggestions: [
          'Gestión de pedidos',
          'Control de inventario',
          'Ver reportes',
          'Configurar sistema',
        ]
      },
      {
        content: `¡Claro! Estoy aquí para hacer más fácil la gestión de tu ${businessLabel.toLowerCase()}. Puedo ayudarte paso a paso con cualquier función de la plataforma.\n\n¿Hay algo específico que te gustaría aprender o configurar?`,
        suggestions: [
          'Tour por la plataforma',
          'Configuración inicial',
          'Mejores prácticas',
          'Solución de problemas',
        ]
      }
    ];
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // Could add a snackbar notification here
  };

  const handleMessageFeedback = (messageId, feedback) => {
    // Handle message feedback (thumbs up/down)
    console.log('Feedback:', messageId, feedback);
  };

  const clearChat = () => {
    setMessages([]);
    const welcomeMessage = {
      id: 1,
      type: 'ai',
      content: `¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?`,
      timestamp: new Date(),
      suggestions: getInitialSuggestions(),
    };
    setMessages([welcomeMessage]);
  };

  const MessageItem = ({ message }) => {
    const isUser = message.type === 'user';
    
    return (
      <ListItem
        sx={{
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          py: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: isUser ? 'row-reverse' : 'row',
            width: '100%',
            maxWidth: '80%',
            alignSelf: isUser ? 'flex-end' : 'flex-start',
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mx: 1,
              bgcolor: isUser ? businessColor : alpha(theme.palette.secondary.main, 0.1),
              color: isUser ? 'white' : theme.palette.secondary.main,
            }}
          >
            {isUser ? user?.first_name?.charAt(0) || 'U' : <AIIcon />}
          </Avatar>
          
          <Paper
            elevation={1}
            sx={{
              p: 2,
              maxWidth: '100%',
              bgcolor: isUser ? businessColor : 'background.paper',
              color: isUser ? 'white' : 'text.primary',
              borderRadius: 2,
              position: 'relative',
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {message.content}
            </Typography>
            
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1,
                opacity: 0.7,
                fontSize: '0.7rem',
              }}
            >
              {message.timestamp.toLocaleTimeString()}
            </Typography>

            {!isUser && (
              <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => handleCopyMessage(message.content)}
                  sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleMessageFeedback(message.id, 'up')}
                  sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                >
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleMessageFeedback(message.id, 'down')}
                  sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                >
                  <ThumbDownIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Suggestions */}
        {!isUser && message.suggestions && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: '80%' }}>
            {message.suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                variant="outlined"
                size="small"
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: alpha(businessColor, 0.1),
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Actions */}
        {!isUser && message.actions && (
          <Box sx={{ mt: 1, display: 'flex', gap: 1, maxWidth: '80%' }}>
            {message.actions.map((action, index) => (
              <Button
                key={index}
                size="small"
                variant="outlined"
                startIcon={<SparkleIcon />}
                onClick={() => {
                  if (action.path) {
                    // Navigate to path
                    window.location.href = action.path;
                  } else if (action.action) {
                    // Handle custom action
                    console.log('Action:', action.action);
                  }
                }}
                sx={{ fontSize: '0.75rem' }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </ListItem>
    );
  };

  const ChatDialog = () => (
    <Dialog
      open={isOpen && !isMinimized}
      onClose={() => setIsOpen(false)}
      TransitionComponent={Transition}
      maxWidth={isFullscreen ? false : 'sm'}
      fullWidth
      fullScreen={isFullscreen}
      PaperProps={{
        sx: {
          height: isFullscreen ? '100vh' : isMobile ? '80vh' : '600px',
          maxHeight: isFullscreen ? 'none' : '80vh',
          borderRadius: isFullscreen ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${businessColor}, ${alpha(businessColor, 0.8)})`,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: alpha('#fff', 0.2), color: 'white', mr: 2 }}>
            <AIIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Asistente IA</Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {activeBusiness?.name || 'Tu asistente personal'}
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <IconButton
            onClick={() => setIsFullscreen(!isFullscreen)}
            sx={{ color: 'white', mr: 1 }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton
            onClick={() => setIsMinimized(true)}
            sx={{ color: 'white', mr: 1 }}
          >
            <MinimizeIcon />
          </IconButton>
          <IconButton
            onClick={clearChat}
            sx={{ color: 'white', mr: 1 }}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            onClick={() => setIsOpen(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <List
          sx={{
            flex: 1,
            overflow: 'auto',
            py: 1,
            minHeight: 0,
          }}
        >
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <ListItem sx={{ justifyContent: 'flex-start' }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                  <AIIcon />
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Escribiendo...
                </Typography>
              </Box>
            </ListItem>
          )}
          
          <div ref={messagesEndRef} />
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%', gap: 1 }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={3}
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            variant="outlined"
            size="small"
          />
          
          {recognitionRef.current && (
            <IconButton
              onClick={handleVoiceInput}
              color={isListening ? 'error' : 'default'}
              disabled={isLoading}
            >
              {isListening ? <StopIcon /> : <MicIcon />}
            </IconButton>
          )}
          
          <IconButton
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            sx={{
              bgcolor: businessColor,
              color: 'white',
              '&:hover': {
                bgcolor: alpha(businessColor, 0.8),
              },
              '&:disabled': {
                bgcolor: 'action.disabled',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </DialogActions>
    </Dialog>
  );

  const MinimizedChat = () => (
    <Collapse in={isMinimized}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: position.bottom + 80,
          right: position.right,
          width: 300,
          maxHeight: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: theme.zIndex.speedDial,
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: businessColor,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => setIsMinimized(false)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 32, height: 32, mr: 1 }}>
              <AIIcon />
            </Avatar>
            <Typography variant="subtitle2">Asistente IA</Typography>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              setIsMinimized(false);
            }}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {messages.length > 1 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {messages[messages.length - 1]?.content?.substring(0, 100)}...
            </Typography>
          </Box>
        )}
      </Paper>
    </Collapse>
  );

  return (
    <>
      {/* Floating Action Button */}
      <Zoom in={!disabled}>
        <Fab
          color={color}
          size={size}
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: position.bottom,
            right: position.right,
            bgcolor: businessColor,
            '&:hover': {
              bgcolor: alpha(businessColor, 0.8),
            },
            zIndex: theme.zIndex.speedDial,
            boxShadow: theme.shadows[6],
          }}
        >
          <AIIcon />
        </Fab>
      </Zoom>

      {/* Chat Dialog */}
      <ChatDialog />

      {/* Minimized Chat */}
      <MinimizedChat />
    </>
  );
};

export default AIAssistantChat;