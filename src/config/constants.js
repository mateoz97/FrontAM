// src/config/constants.js

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Mi Restaurante';
export const API_TIMEOUT = 10000; // 10 seconds
export const RETRY_ATTEMPTS = 3;

// Application Routes
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  FEED: '/',
  ORDERS: '/orders',
  INVENTORY: '/inventory',
  USERS: '/users',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  BUSINESS_PROFILE: '/business/profile',
};

// UI Constants
export const UI = {
  DRAWER_WIDTH: 260,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 'md',
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  PAGINATION_SIZE: 20,
  DEBOUNCE_DELAY: 300,
};

// User Experience Settings
export const UX = {
  NOTIFICATION_DURATION: {
    SUCCESS: 4000,
    ERROR: 8000,
    WARNING: 6000,
    INFO: 5000,
  },
  LOADING_DELAY: 200, // Delay before showing loading indicator
  ANIMATION_DURATION: 300,
  TOUCH_TARGET_SIZE: 48, // Minimum size for touch targets (WCAG)
};

// Accessibility Settings
export const A11Y = {
  MIN_CONTRAST_RATIO: 4.5,
  MIN_FONT_SIZE: 16,
  MIN_TOUCH_TARGET: 44,
  FOCUS_OUTLINE_WIDTH: 3,
  KEYBOARD_NAVIGATION: true,
  SCREEN_READER_SUPPORT: true,
};

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_MESSAGE_LENGTH: 1000,
};

// User-friendly messages
export const MESSAGES = {
  LOADING: {
    DEFAULT: 'Cargando...',
    LOGIN: 'Iniciando sesión...',
    SAVING: 'Guardando cambios...',
    UPLOADING: 'Subiendo archivo...',
    PROCESSING: 'Procesando...',
  },
  SUCCESS: {
    SAVED: 'Cambios guardados correctamente',
    DELETED: 'Eliminado correctamente',
    CREATED: 'Creado exitosamente',
    UPDATED: 'Actualizado correctamente',
    LOGIN: 'Sesión iniciada correctamente',
    LOGOUT: 'Sesión cerrada',
  },
  ERROR: {
    NETWORK: 'Problemas de conexión. Revisa tu internet',
    UNAUTHORIZED: 'Sesión expirada. Inicia sesión nuevamente',
    FORBIDDEN: 'No tienes permisos para esta acción',
    SERVER: 'Error en el servidor. Intenta más tarde',
    VALIDATION: 'Por favor revisa los datos ingresados',
    UNKNOWN: 'Ocurrió un error inesperado',
  },
  CONFIRM: {
    DELETE: '¿Estás seguro de que quieres eliminar esto?',
    LOGOUT: '¿Quieres cerrar tu sesión?',
    UNSAVED_CHANGES: 'Tienes cambios sin guardar. ¿Quieres salir sin guardar?',
  },
};

// Business Logic Constants
export const BUSINESS = {
  ORDER_STATUSES: {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  },
  ORDER_STATUS_LABELS: {
    pending: 'Pendiente',
    in_progress: 'En preparación',
    ready: 'Listo',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  },
  PRIORITY_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
  },
  PRIORITY_LABELS: {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  },
};

// Color schemes for different contexts
export const COLORS = {
  STATUS: {
    SUCCESS: '#2e7d32',
    ERROR: '#d32f2f',
    WARNING: '#f57c00',
    INFO: '#1976d2',
  },
  PRIORITY: {
    LOW: '#4caf50',
    MEDIUM: '#ff9800',
    HIGH: '#f44336',
    URGENT: '#9c27b0',
  },
  ORDER: {
    PENDING: '#ff9800',
    IN_PROGRESS: '#2196f3',
    READY: '#4caf50',
    DELIVERED: '#8bc34a',
    CANCELLED: '#f44336',
  },
};

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  OFFLINE_MODE: false,
  PUSH_NOTIFICATIONS: true,
  VOICE_COMMANDS: false,
  ANALYTICS: true,
  DEBUG_MODE: import.meta.env.DEV,
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
};

// Environment checks
export const ENV = {
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  NODE_ENV: import.meta.env.NODE_ENV,
};