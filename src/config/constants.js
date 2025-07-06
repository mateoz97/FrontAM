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
  PHONE_REGEX: /^\+?[\d\s\-()]+$/,
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
  // Business Types Configuration
  TYPES: {
    RESTAURANT: 'restaurant',
    BAKERY: 'bakery',
    COFFEE_SHOP: 'coffee_shop',
    FOOD_TRUCK: 'food_truck',
    GROCERY_STORE: 'grocery_store',
    PHARMACY: 'pharmacy',
    BEAUTY_SALON: 'beauty_salon',
    FITNESS_CENTER: 'fitness_center',
    RETAIL_STORE: 'retail_store',
    SERVICES: 'services',
    EDUCATION: 'education',
    HEALTH_CARE: 'health_care',
    AUTOMOTIVE: 'automotive',
    REAL_ESTATE: 'real_estate',
    TECHNOLOGY: 'technology',
    OTHER: 'other',
  },

  TYPE_LABELS: {
    restaurant: 'Restaurante',
    bakery: 'Panadería',
    coffee_shop: 'Cafetería',
    food_truck: 'Food Truck',
    grocery_store: 'Tienda de Abarrotes',
    pharmacy: 'Farmacia',
    beauty_salon: 'Salón de Belleza',
    fitness_center: 'Gimnasio',
    retail_store: 'Tienda al Por Menor',
    services: 'Servicios',
    education: 'Educación',
    health_care: 'Atención Médica',
    automotive: 'Automotriz',
    real_estate: 'Bienes Raíces',
    technology: 'Tecnología',
    other: 'Otro',
  },

  TYPE_ICONS: {
    restaurant: '🍽️',
    bakery: '🥖',
    coffee_shop: '☕',
    food_truck: '🚚',
    grocery_store: '🏪',
    pharmacy: '💊',
    beauty_salon: '💄',
    fitness_center: '🏋️',
    retail_store: '🛒',
    services: '🔧',
    education: '📚',
    health_care: '⚕️',
    automotive: '🚗',
    real_estate: '🏠',
    technology: '💻',
    other: '🏢',
  },

  TYPE_COLORS: {
    restaurant: '#FF6B6B',
    bakery: '#FFD93D',
    coffee_shop: '#6F4E37',
    food_truck: '#FF8C42',
    grocery_store: '#4ECDC4',
    pharmacy: '#45B7D1',
    beauty_salon: '#FF69B4',
    fitness_center: '#32CD32',
    retail_store: '#9370DB',
    services: '#FF4500',
    education: '#4169E1',
    health_care: '#00CED1',
    automotive: '#696969',
    real_estate: '#228B22',
    technology: '#6495ED',
    other: '#708090',
  },

  // Business Type Features Configuration
  TYPE_FEATURES: {
    restaurant: {
      hasOrders: true,
      hasInventory: true,
      hasReservations: true,
      hasMenus: true,
      hasTableManagement: true,
      hasDelivery: true,
      orderFlow: 'restaurant',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['orders', 'inventory', 'reservations', 'menu', 'tables', 'delivery'],
    },
    bakery: {
      hasOrders: true,
      hasInventory: true,
      hasReservations: false,
      hasMenus: true,
      hasTableManagement: false,
      hasDelivery: true,
      orderFlow: 'bakery',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['orders', 'inventory', 'menu', 'delivery', 'production'],
    },
    coffee_shop: {
      hasOrders: true,
      hasInventory: true,
      hasReservations: false,
      hasMenus: true,
      hasTableManagement: true,
      hasDelivery: true,
      orderFlow: 'coffee_shop',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['orders', 'inventory', 'menu', 'tables', 'delivery'],
    },
    food_truck: {
      hasOrders: true,
      hasInventory: true,
      hasReservations: false,
      hasMenus: true,
      hasTableManagement: false,
      hasDelivery: false,
      orderFlow: 'food_truck',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['orders', 'inventory', 'menu', 'location'],
    },
    grocery_store: {
      hasOrders: false,
      hasInventory: true,
      hasReservations: false,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: true,
      orderFlow: 'retail',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['inventory', 'pos', 'delivery', 'suppliers'],
    },
    pharmacy: {
      hasOrders: false,
      hasInventory: true,
      hasReservations: false,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: true,
      orderFlow: 'pharmacy',
      paymentTypes: ['cash', 'card', 'digital', 'insurance'],
      modules: ['inventory', 'pos', 'delivery', 'prescriptions'],
    },
    beauty_salon: {
      hasOrders: false,
      hasInventory: true,
      hasReservations: true,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: false,
      orderFlow: 'appointments',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['appointments', 'inventory', 'clients', 'staff'],
    },
    fitness_center: {
      hasOrders: false,
      hasInventory: true,
      hasReservations: true,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: false,
      orderFlow: 'memberships',
      paymentTypes: ['cash', 'card', 'digital', 'membership'],
      modules: ['memberships', 'classes', 'equipment', 'trainers'],
    },
    retail_store: {
      hasOrders: false,
      hasInventory: true,
      hasReservations: false,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: true,
      orderFlow: 'retail',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['inventory', 'pos', 'delivery', 'suppliers'],
    },
    services: {
      hasOrders: false,
      hasInventory: false,
      hasReservations: true,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: false,
      orderFlow: 'appointments',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['appointments', 'clients', 'staff', 'quotes'],
    },
    education: {
      hasOrders: false,
      hasInventory: false,
      hasReservations: true,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: false,
      orderFlow: 'classes',
      paymentTypes: ['cash', 'card', 'digital', 'tuition'],
      modules: ['classes', 'students', 'teachers', 'courses'],
    },
    health_care: {
      hasOrders: false,
      hasInventory: true,
      hasReservations: true,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: false,
      orderFlow: 'appointments',
      paymentTypes: ['cash', 'card', 'digital', 'insurance'],
      modules: ['appointments', 'patients', 'medical_records', 'inventory'],
    },
    automotive: {
      hasOrders: false,
      hasInventory: true,
      hasReservations: true,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: false,
      orderFlow: 'services',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['appointments', 'inventory', 'clients', 'services'],
    },
    real_estate: {
      hasOrders: false,
      hasInventory: false,
      hasReservations: true,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: false,
      orderFlow: 'appointments',
      paymentTypes: ['cash', 'card', 'digital', 'financing'],
      modules: ['properties', 'clients', 'appointments', 'contracts'],
    },
    technology: {
      hasOrders: false,
      hasInventory: true,
      hasReservations: true,
      hasMenus: false,
      hasTableManagement: false,
      hasDelivery: true,
      orderFlow: 'services',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['projects', 'clients', 'inventory', 'services'],
    },
    other: {
      hasOrders: true,
      hasInventory: true,
      hasReservations: true,
      hasMenus: true,
      hasTableManagement: true,
      hasDelivery: true,
      orderFlow: 'general',
      paymentTypes: ['cash', 'card', 'digital'],
      modules: ['orders', 'inventory', 'clients', 'services'],
    },
  },

  ORDER_STATUSES: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    PAID: 'paid',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },
  ORDER_STATUS_LABELS: {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    preparing: 'En preparación',
    ready: 'Lista',
    paid: 'Pagada',
    delivered: 'Entregada',
    cancelled: 'Cancelada',
    refunded: 'Reembolsada',
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
    CONFIRMED: '#2196f3',
    PREPARING: '#1976d2',
    READY: '#4caf50',
    PAID: '#8bc34a',
    DELIVERED: '#66bb6a',
    CANCELLED: '#f44336',
    REFUNDED: '#9c27b0',
  },
};

// Payment System Constants
export const PAYMENTS = {
  METHODS: {
    CASH: 'cash',
    CARD: 'card',
    DIGITAL: 'digital',
    BANK_TRANSFER: 'bank_transfer',
    CRYPTO: 'crypto',
    CREDIT: 'credit',
    GIFT_CARD: 'gift_card',
    POINTS: 'points',
    INSURANCE: 'insurance',
    MEMBERSHIP: 'membership',
    TUITION: 'tuition',
    FINANCING: 'financing',
  },

  METHOD_LABELS: {
    cash: 'Efectivo',
    card: 'Tarjeta',
    digital: 'Pago Digital',
    bank_transfer: 'Transferencia Bancaria',
    crypto: 'Criptomoneda',
    credit: 'Crédito',
    gift_card: 'Tarjeta de Regalo',
    points: 'Puntos',
    insurance: 'Seguro',
    membership: 'Membresía',
    tuition: 'Colegiatura',
    financing: 'Financiamiento',
  },

  METHOD_ICONS: {
    cash: '💵',
    card: '💳',
    digital: '📱',
    bank_transfer: '🏦',
    crypto: '₿',
    credit: '🏷️',
    gift_card: '🎁',
    points: '⭐',
    insurance: '🛡️',
    membership: '🎫',
    tuition: '📚',
    financing: '📊',
  },

  STATUSES: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
    PARTIALLY_REFUNDED: 'partially_refunded',
  },

  STATUS_LABELS: {
    pending: 'Pendiente',
    processing: 'Procesando',
    completed: 'Completado',
    failed: 'Fallido',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
    partially_refunded: 'Parcialmente Reembolsado',
  },

  STATUS_COLORS: {
    pending: '#ff9800',
    processing: '#2196f3',
    completed: '#4caf50',
    failed: '#f44336',
    cancelled: '#9e9e9e',
    refunded: '#9c27b0',
    partially_refunded: '#ff5722',
  },

  PROVIDERS: {
    STRIPE: 'stripe',
    PAYPAL: 'paypal',
    MERCADOPAGO: 'mercadopago',
    CONEKTA: 'conekta',
    OPENPAY: 'openpay',
    CLIP: 'clip',
    SQUARE: 'square',
    INTERNAL: 'internal',
  },

  CURRENCIES: {
    MXN: 'MXN',
    USD: 'USD',
    EUR: 'EUR',
    CAD: 'CAD',
    GBP: 'GBP',
  },

  CURRENCY_SYMBOLS: {
    MXN: '$',
    USD: 'US$',
    EUR: '€',
    CAD: 'C$',
    GBP: '£',
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
  PAYMENTS: true,
  MULTI_CURRENCY: true,
  CRYPTO_PAYMENTS: false,
  INSTALLMENTS: true,
  TIPS: true,
  LOYALTY_POINTS: true,
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