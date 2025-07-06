// src/utils/businessTypes.js
import { BUSINESS } from '../config/constants';

/**
 * Utilities for business types management
 */

/**
 * Gets business type configuration
 * @param {string} businessType - The business type key
 * @returns {Object} Business type configuration
 */
export const getBusinessTypeConfig = (businessType) => {
  if (!businessType || !BUSINESS.TYPE_FEATURES[businessType]) {
    return BUSINESS.TYPE_FEATURES.other;
  }
  return BUSINESS.TYPE_FEATURES[businessType];
};

/**
 * Gets business type label
 * @param {string} businessType - The business type key
 * @returns {string} Business type label in Spanish
 */
export const getBusinessTypeLabel = (businessType) => {
  return BUSINESS.TYPE_LABELS[businessType] || 'Otro';
};

/**
 * Gets business type icon
 * @param {string} businessType - The business type key
 * @returns {string} Business type emoji icon
 */
export const getBusinessTypeIcon = (businessType) => {
  return BUSINESS.TYPE_ICONS[businessType] || '🏢';
};

/**
 * Gets business type color
 * @param {string} businessType - The business type key
 * @returns {string} Business type color hex code
 */
export const getBusinessTypeColor = (businessType) => {
  return BUSINESS.TYPE_COLORS[businessType] || '#708090';
};

/**
 * Checks if a business type has a specific feature
 * @param {string} businessType - The business type key
 * @param {string} feature - The feature to check
 * @returns {boolean} Whether the business type has the feature
 */
export const hasBusinessFeature = (businessType, feature) => {
  const config = getBusinessTypeConfig(businessType);
  return config[feature] === true;
};

/**
 * Gets available modules for a business type
 * @param {string} businessType - The business type key
 * @returns {Array} Array of available modules
 */
export const getBusinessModules = (businessType) => {
  const config = getBusinessTypeConfig(businessType);
  return config.modules || [];
};

/**
 * Gets available payment types for a business type
 * @param {string} businessType - The business type key
 * @returns {Array} Array of available payment types
 */
export const getBusinessPaymentTypes = (businessType) => {
  const config = getBusinessTypeConfig(businessType);
  return config.paymentTypes || ['cash', 'card', 'digital'];
};

/**
 * Gets the order flow type for a business type
 * @param {string} businessType - The business type key
 * @returns {string} Order flow type
 */
export const getBusinessOrderFlow = (businessType) => {
  const config = getBusinessTypeConfig(businessType);
  return config.orderFlow || 'general';
};

/**
 * Gets all available business types as options
 * @returns {Array} Array of business type options
 */
export const getBusinessTypeOptions = () => {
  return Object.keys(BUSINESS.TYPE_LABELS).map(key => ({
    value: key,
    label: BUSINESS.TYPE_LABELS[key],
    icon: BUSINESS.TYPE_ICONS[key],
    color: BUSINESS.TYPE_COLORS[key],
  }));
};

/**
 * Gets business type specific navigation items
 * @param {string} businessType - The business type key
 * @returns {Array} Array of navigation items for the business type
 */
export const getBusinessTypeNavigation = (businessType) => {
  const config = getBusinessTypeConfig(businessType);
  const modules = config.modules || [];
  
  const navigationMap = {
    orders: { label: 'Pedidos', icon: '📋', path: '/orders' },
    inventory: { label: 'Inventario', icon: '📦', path: '/inventory' },
    reservations: { label: 'Reservas', icon: '📅', path: '/reservations' },
    appointments: { label: 'Citas', icon: '📅', path: '/appointments' },
    menu: { label: 'Menú', icon: '🍽️', path: '/menu' },
    tables: { label: 'Mesas', icon: '🪑', path: '/tables' },
    delivery: { label: 'Delivery', icon: '🚚', path: '/delivery' },
    production: { label: 'Producción', icon: '🏭', path: '/production' },
    pos: { label: 'Punto de Venta', icon: '💳', path: '/pos' },
    suppliers: { label: 'Proveedores', icon: '🏪', path: '/suppliers' },
    prescriptions: { label: 'Recetas', icon: '💊', path: '/prescriptions' },
    clients: { label: 'Clientes', icon: '👥', path: '/clients' },
    staff: { label: 'Personal', icon: '👨‍💼', path: '/staff' },
    memberships: { label: 'Membresías', icon: '🎫', path: '/memberships' },
    classes: { label: 'Clases', icon: '🏋️', path: '/classes' },
    equipment: { label: 'Equipo', icon: '🏋️‍♂️', path: '/equipment' },
    trainers: { label: 'Entrenadores', icon: '💪', path: '/trainers' },
    quotes: { label: 'Cotizaciones', icon: '💰', path: '/quotes' },
    students: { label: 'Estudiantes', icon: '👨‍🎓', path: '/students' },
    teachers: { label: 'Profesores', icon: '👨‍🏫', path: '/teachers' },
    courses: { label: 'Cursos', icon: '📚', path: '/courses' },
    patients: { label: 'Pacientes', icon: '🏥', path: '/patients' },
    medical_records: { label: 'Expedientes', icon: '📋', path: '/medical-records' },
    services: { label: 'Servicios', icon: '🔧', path: '/services' },
    properties: { label: 'Propiedades', icon: '🏠', path: '/properties' },
    contracts: { label: 'Contratos', icon: '📄', path: '/contracts' },
    projects: { label: 'Proyectos', icon: '💻', path: '/projects' },
    location: { label: 'Ubicación', icon: '📍', path: '/location' },
  };

  return modules.map(module => navigationMap[module]).filter(Boolean);
};

/**
 * Gets business type specific dashboard widgets
 * @param {string} businessType - The business type key
 * @returns {Array} Array of dashboard widgets for the business type
 */
export const getBusinessTypeDashboardWidgets = (businessType) => {
  const config = getBusinessTypeConfig(businessType);
  
  const widgetMap = {
    orders: { key: 'orders', label: 'Pedidos', icon: '📋' },
    inventory: { key: 'inventory', label: 'Inventario', icon: '📦' },
    reservations: { key: 'reservations', label: 'Reservas', icon: '📅' },
    appointments: { key: 'appointments', label: 'Citas', icon: '📅' },
    sales: { key: 'sales', label: 'Ventas', icon: '💰' },
    customers: { key: 'customers', label: 'Clientes', icon: '👥' },
    staff: { key: 'staff', label: 'Personal', icon: '👨‍💼' },
    analytics: { key: 'analytics', label: 'Análisis', icon: '📊' },
  };

  let widgets = ['sales', 'customers', 'staff', 'analytics'];
  
  if (config.hasOrders) widgets.unshift('orders');
  if (config.hasInventory) widgets.push('inventory');
  if (config.hasReservations) widgets.push('reservations');
  
  return widgets.map(widget => widgetMap[widget]).filter(Boolean);
};

/**
 * Gets business type specific form fields for business creation
 * @param {string} businessType - The business type key
 * @returns {Array} Array of form fields specific to the business type
 */
export const getBusinessTypeFormFields = (businessType) => {
  const baseFields = [
    { key: 'name', label: 'Nombre del Negocio', type: 'text', required: true },
    { key: 'description', label: 'Descripción', type: 'textarea', required: false },
    { key: 'phone', label: 'Teléfono', type: 'tel', required: false },
    { key: 'email', label: 'Email', type: 'email', required: false },
    { key: 'address', label: 'Dirección', type: 'text', required: false },
  ];

  const typeSpecificFields = {
    restaurant: [
      { key: 'cuisine_type', label: 'Tipo de Cocina', type: 'select', options: ['mexicana', 'italiana', 'china', 'internacional'] },
      { key: 'table_count', label: 'Número de Mesas', type: 'number' },
      { key: 'delivery_radius', label: 'Radio de Delivery (km)', type: 'number' },
    ],
    bakery: [
      { key: 'specialties', label: 'Especialidades', type: 'multiselect', options: ['pan', 'pasteles', 'galletas', 'repostería'] },
      { key: 'production_hours', label: 'Horario de Producción', type: 'text' },
    ],
    coffee_shop: [
      { key: 'coffee_types', label: 'Tipos de Café', type: 'multiselect', options: ['espresso', 'americano', 'latte', 'cappuccino'] },
      { key: 'seating_capacity', label: 'Capacidad de Asientos', type: 'number' },
    ],
    pharmacy: [
      { key: 'license_number', label: 'Número de Licencia', type: 'text', required: true },
      { key: 'pharmacist_name', label: 'Nombre del Farmacéutico', type: 'text', required: true },
    ],
    beauty_salon: [
      { key: 'services', label: 'Servicios', type: 'multiselect', options: ['corte', 'coloración', 'peinado', 'tratamientos'] },
      { key: 'staff_count', label: 'Número de Estilistas', type: 'number' },
    ],
    fitness_center: [
      { key: 'membership_types', label: 'Tipos de Membresía', type: 'multiselect', options: ['mensual', 'anual', 'diaria'] },
      { key: 'equipment_count', label: 'Cantidad de Equipos', type: 'number' },
    ],
  };

  return [
    ...baseFields,
    ...(typeSpecificFields[businessType] || [])
  ];
};

/**
 * Validates business type configuration
 * @param {string} businessType - The business type key
 * @returns {boolean} Whether the business type is valid
 */
export const isValidBusinessType = (businessType) => {
  return businessType && Object.prototype.hasOwnProperty.call(BUSINESS.TYPE_FEATURES, businessType);
};

/**
 * Gets business type suggestions based on keywords
 * @param {string} keyword - The search keyword
 * @returns {Array} Array of suggested business types
 */
export const getBusinessTypeSuggestions = (keyword) => {
  if (!keyword) return getBusinessTypeOptions();
  
  const lowercaseKeyword = keyword.toLowerCase();
  return getBusinessTypeOptions().filter(option => 
    option.label.toLowerCase().includes(lowercaseKeyword) ||
    option.value.toLowerCase().includes(lowercaseKeyword)
  );
};

export default {
  getBusinessTypeConfig,
  getBusinessTypeLabel,
  getBusinessTypeIcon,
  getBusinessTypeColor,
  hasBusinessFeature,
  getBusinessModules,
  getBusinessPaymentTypes,
  getBusinessOrderFlow,
  getBusinessTypeOptions,
  getBusinessTypeNavigation,
  getBusinessTypeDashboardWidgets,
  getBusinessTypeFormFields,
  isValidBusinessType,
  getBusinessTypeSuggestions,
};