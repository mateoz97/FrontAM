// src/pages/OrdersBoard.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Paper, Typography, Box, Grid, Card, CardContent,
  Chip, Avatar, Button, IconButton, LinearProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, List,
  ListItem, ListItemText, Divider, Stack, Badge, Fab,
  useTheme, Tooltip, CardHeader, CardActions, CircularProgress,
  TextField, FormControl, InputLabel, Select, MenuItem, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  InputAdornment, Snackbar
} from '@mui/material';
import {
  Schedule, CheckCircle, Cancel, Pause, PlayArrow,
  Restaurant, Timer, Person, Phone, LocationOn,
  Refresh, Fullscreen, VolumeUp, VolumeOff,
  Kitchen, LocalShipping, DoneAll, Warning,
  AccessTime, TrendingUp, Notifications, Print, Add,
  FilterList, Edit, Delete, Remove
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ordersService from '../services/orders.service';
import inventoryService from '../services/inventory.service';
import { alpha } from '@mui/material/styles';

// Función auxiliar para calcular tiempo transcurrido
const calculateTimeElapsed = (createdAt) => {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
};

const OrdersBoard = () => {
  const { getUserBusiness, hasPermission } = useAuth();
  const theme = useTheme();
  const businessInfo = getUserBusiness();
  
  // Estados principales
  const [orders, setOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // WebSocket para tiempo real
  const wsRef = useRef(null);
  
  // Ref para el contenedor principal
  const boardRef = useRef(null);
  
  // Estados para estadísticas
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    avgWaitTime: 0
  });

  // Estados para crear nuevo pedido
  const [createOrderModal, setCreateOrderModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    order_type: 'dine_in',
    table_number: '',
    notes: '',
    items: []
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Estados para cancelación de pedidos
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(false);
  
  // Estados para edición de pedidos
  const [editOrderModal, setEditOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editOrderForm, setEditOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    order_type: 'dine_in',
    table_number: '',
    notes: '',
    items: []
  });
  
  // Estados para filtros y búsqueda
  const [dateFilter, setDateFilter] = useState('today');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para reembolsos
  const [refundModal, setRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [processingRefund, setProcessingRefund] = useState(false);

  // Función para obtener filtros de fecha
  const getDateFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (dateFilter) {
      case 'today':
        return { date_from: today, date_to: today };
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { date_from: weekAgo.toISOString().split('T')[0], date_to: today };
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { date_from: monthAgo.toISOString().split('T')[0], date_to: today };
      case 'custom':
        return { 
          date_from: customDateFrom || today, 
          date_to: customDateTo || today 
        };
      case 'all':
        return {};
      default:
        return { date_from: today, date_to: today };
    }
  };

  // Cargar órdenes con filtros
  const loadOrdersWithFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dateFilters = getDateFilters();
      
      // Cargar todas las órdenes activas con filtros de fecha
      const allOrders = await ordersService.getOrders({
        status__in: 'pending,confirmed,preparing,ready,refund',
        ...dateFilters
      });
      
      // Cargar órdenes canceladas con los mismos filtros
      const cancelledOrdersData = await ordersService.getOrders({
        status: 'cancelled',
        ...dateFilters
      });
        
        // Procesar órdenes para agregar timeElapsed
        const processedOrders = allOrders.map(order => ({
          ...order,
          timeElapsed: calculateTimeElapsed(order.created_at || order.createdAt),
          // Mapear campos del backend a campos del frontend
          customerName: order.customer_name || order.customer || 'Cliente',
          customerPhone: order.customer_phone || order.phone || '',
          createdAt: new Date(order.created_at || order.createdAt),
          // Mapear tipo de orden
          type: order.order_type || order.type || 'dine_in',
          // Mapear mesa
          tableNumber: order.table_number || order.table || null,
          // Tiempo estimado (si no viene del backend, usar un default)
          estimatedTime: order.estimated_time || 20,
          // Prioridad (si no viene del backend, usar normal)
          priority: order.priority || 'normal',
          // Notas
          notes: order.notes || order.special_instructions || ''
        }));
        
        // Procesar órdenes canceladas
        const processedCancelledOrders = cancelledOrdersData.map(order => ({
          ...order,
          timeElapsed: calculateTimeElapsed(order.created_at || order.createdAt),
          customerName: order.customer_name || order.customer || 'Cliente',
          customerPhone: order.customer_phone || order.phone || '',
          createdAt: new Date(order.created_at || order.createdAt),
          type: order.order_type || order.type || 'dine_in',
          tableNumber: order.table_number || order.table || null,
          estimatedTime: order.estimated_time || 20,
          priority: order.priority || 'normal',
          notes: order.notes || order.special_instructions || '',
          cancellation_reason: order.cancellation_reason || 'Sin motivo especificado'
        }));
        
        setOrders(processedOrders);
        setCancelledOrders(processedCancelledOrders);
        setLastUpdate(new Date());
        
      } catch (error) {
        console.error('Error loading orders:', error);
        setError('Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

  // UseEffect para cargar órdenes cuando cambien los filtros
  useEffect(() => {
    if (businessInfo) {
      loadOrdersWithFilters();
    }
  }, [businessInfo, dateFilter, customDateFrom, customDateTo]);

  // Cargar productos para crear pedidos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await inventoryService.getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    if (businessInfo) {
      loadProducts();
    }
  }, [businessInfo]);

  // Configurar WebSocket para actualizaciones en tiempo real
  useEffect(() => {
    if (!autoRefresh || !businessInfo) return;

    // Conectar WebSocket
    wsRef.current = ordersService.subscribeToOrderUpdates((update) => {
      console.log('📡 Actualización de orden en tiempo real:', update);
      
      // Reproducir sonido para nuevas órdenes
      if (soundEnabled && update.type === 'new_order') {
        console.log('🔔 Nueva orden recibida!');
        // Aquí podrías agregar un sonido real
      }

      // Actualizar la lista de órdenes
      setOrders(prevOrders => {
        const orderIndex = prevOrders.findIndex(o => o.id === update.order.id);
        
        if (update.type === 'new_order' || orderIndex === -1) {
          // Nueva orden
          const newOrder = {
            ...update.order,
            timeElapsed: calculateTimeElapsed(update.order.created_at),
            customerName: update.order.customer_name || 'Cliente',
            customerPhone: update.order.customer_phone || '',
            createdAt: new Date(update.order.created_at),
            type: update.order.order_type || 'dine_in',
            tableNumber: update.order.table_number || null,
            estimatedTime: update.order.estimated_time || 20,
            priority: update.order.priority || 'normal',
            notes: update.order.notes || ''
          };
          return [newOrder, ...prevOrders];
        } else {
          // Actualizar orden existente
          const updatedOrders = [...prevOrders];
          updatedOrders[orderIndex] = {
            ...updatedOrders[orderIndex],
            ...update.order,
            timeElapsed: calculateTimeElapsed(update.order.created_at || updatedOrders[orderIndex].createdAt)
          };
          return updatedOrders;
        }
      });

      setLastUpdate(new Date());
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [autoRefresh, businessInfo, soundEnabled]);

  // Actualizar estadísticas cuando cambien los pedidos
  useEffect(() => {
    const newStats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      refund: orders.filter(o => o.status === 'refund').length,
      cancelled: cancelledOrders.length,
      avgWaitTime: orders.reduce((acc, o) => acc + o.timeElapsed, 0) / orders.length || 0
    };
    setStats(newStats);
  }, [orders, cancelledOrders]);

  // Actualizar tiempo transcurrido cada minuto
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => ({
          ...order,
          timeElapsed: calculateTimeElapsed(order.createdAt)
        }))
      );
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Funciones de utilidad
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      preparing: 'info',
      ready: 'success',
      completed: 'default',
      cancelled: 'error',
      refund: 'secondary'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Schedule />,
      preparing: <Kitchen />,
      ready: <CheckCircle />,
      completed: <DoneAll />,
      cancelled: <Cancel />,
      refund: <LocalShipping />
    };
    return icons[status] || <Schedule />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#f44336',
      normal: '#2196f3',
      low: '#4caf50'
    };
    return colors[priority] || colors.normal;
  };

  const getTypeIcon = (type) => {
    const icons = {
      dine_in: <Restaurant />,
      takeaway: <Kitchen />,
      delivery: <LocalShipping />
    };
    return icons[type] || <Restaurant />;
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTimeProgress = (elapsed, estimated) => {
    return Math.min((elapsed / estimated) * 100, 100);
  };

  const getTimeColor = (elapsed, estimated) => {
    const progress = elapsed / estimated;
    if (progress > 1.2) return 'error';
    if (progress > 0.8) return 'warning';
    return 'success';
  };


  // Función para refrescar órdenes manualmente
  const refreshOrders = async () => {
    try {
      setError(null);
      const allOrders = await ordersService.getOrders({
        status__in: 'pending,confirmed,preparing,ready'
      });
      
      // Cargar órdenes canceladas del día actual
      const today = new Date().toISOString().split('T')[0];
      const cancelledOrdersData = await ordersService.getOrders({
        status: 'cancelled',
        date_from: today,
        date_to: today
      });
      
      const processedOrders = allOrders.map(order => ({
        ...order,
        timeElapsed: calculateTimeElapsed(order.created_at || order.createdAt),
        customerName: order.customer_name || order.customer || 'Cliente',
        customerPhone: order.customer_phone || order.phone || '',
        createdAt: new Date(order.created_at || order.createdAt),
        type: order.order_type || order.type || 'dine_in',
        tableNumber: order.table_number || order.table || null,
        estimatedTime: order.estimated_time || 20,
        priority: order.priority || 'normal',
        notes: order.notes || order.special_instructions || ''
      }));
      
      const processedCancelledOrders = cancelledOrdersData.map(order => ({
        ...order,
        timeElapsed: calculateTimeElapsed(order.created_at || order.createdAt),
        customerName: order.customer_name || order.customer || 'Cliente',
        customerPhone: order.customer_phone || order.phone || '',
        createdAt: new Date(order.created_at || order.createdAt),
        type: order.order_type || order.type || 'dine_in',
        tableNumber: order.table_number || order.table || null,
        estimatedTime: order.estimated_time || 20,
        priority: order.priority || 'normal',
        notes: order.notes || order.special_instructions || '',
        cancellation_reason: order.cancellation_reason || 'Sin motivo especificado'
      }));
      
      setOrders(processedOrders);
      setCancelledOrders(processedCancelledOrders);
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Error refreshing orders:', error);
      setError('Error al actualizar los pedidos');
    }
  };

  // Funciones para crear pedidos
  const handleCreateOrder = () => {
    setCreateOrderModal(true);
  };

  const handleAddProduct = () => {
    if (!selectedProduct || productQuantity <= 0) {
      setSnackbar({ open: true, message: 'Selecciona un producto y cantidad válida', severity: 'warning' });
      return;
    }

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) {
      setSnackbar({ open: true, message: 'Producto no encontrado', severity: 'error' });
      return;
    }

    const existingItemIndex = orderForm.items.findIndex(item => 
      parseInt(item.product_id) === parseInt(product.id)
    );
    
    if (existingItemIndex >= 0) {
      // Si el producto ya existe, actualizar cantidad
      const updatedItems = [...orderForm.items];
      updatedItems[existingItemIndex].quantity += parseInt(productQuantity);
      setOrderForm(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Agregar nuevo producto
      const newItem = {
        product_id: parseInt(product.id),
        product_name: product.name,
        quantity: parseInt(productQuantity),
        price: parseFloat(product.price || 0)
      };
      setOrderForm(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }

    setSelectedProduct('');
    setProductQuantity(1);
  };

  const handleRemoveProduct = (productId) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product_id !== productId)
    }));
  };

  const handleSubmitOrder = async () => {
    try {
      if (orderForm.items.length === 0) {
        setSnackbar({ open: true, message: 'Agrega al menos un producto al pedido', severity: 'warning' });
        return;
      }

      if (orderForm.order_type === 'dine_in' && !orderForm.table_number.trim()) {
        setSnackbar({ open: true, message: 'El número de mesa es requerido para pedidos en mesa', severity: 'warning' });
        return;
      }

      // Calcular total
      const total = orderForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Format order data with proper field structure and data types
      const orderData = {
        customer_name: orderForm.customer_name || '',
        customer_phone: orderForm.customer_phone || '',
        order_type: orderForm.order_type,
        table_number: orderForm.order_type === 'dine_in' ? orderForm.table_number : null,
        notes: orderForm.notes || '',
        total: parseFloat(total.toFixed(2)),
        status: 'pending',
        items: orderForm.items.map(item => ({
          product_id: parseInt(item.product_id),
          product_name: item.product_name,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        }))
      };

      console.log('Creating new order with formatted data:', orderData);
      const newOrder = await ordersService.createOrder(orderData);
      
      // Agregar la nueva orden al estado local
      const processedOrder = {
        ...newOrder,
        timeElapsed: 0,
        customerName: newOrder.customer_name || orderForm.customer_name,
        customerPhone: newOrder.customer_phone || orderForm.customer_phone,
        createdAt: new Date(),
        type: newOrder.order_type || orderForm.order_type,
        tableNumber: newOrder.table_number || orderForm.table_number,
        estimatedTime: 20,
        priority: 'normal',
        notes: newOrder.notes || orderForm.notes
      };

      setOrders(prev => [processedOrder, ...prev]);
      
      // Limpiar formulario y cerrar modal
      setOrderForm({
        customer_name: '',
        customer_phone: '',
        order_type: 'dine_in',
        table_number: '',
        notes: '',
        items: []
      });
      setCreateOrderModal(false);
      setSnackbar({ open: true, message: 'Pedido creado exitosamente', severity: 'success' });

    } catch (error) {
      console.error('Error creating order:', error);
      
      // Extract more specific error message
      let errorMessage = 'Error al crear el pedido';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ');
        } else {
          // Show validation errors for specific fields
          const fieldErrors = [];
          Object.keys(error.response.data).forEach(field => {
            if (Array.isArray(error.response.data[field])) {
              fieldErrors.push(`${field}: ${error.response.data[field].join(', ')}`);
            }
          });
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('; ');
          }
        }
      }
      
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    }
  };

  // Manejadores de eventos
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Actualizar estado en el backend
      await ordersService.updateOrderStatus(orderId, newStatus);
      
      // Actualizar estado local optimistamente
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );

      // Reproducir sonido de cambio de estado
      if (soundEnabled) {
        console.log(`🔄 Pedido ${orderId} cambió a ${newStatus}`);
      }
      
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Error al actualizar el estado del pedido');
    }
  };

  const handleOrderDetail = (order) => {
    setSelectedOrder(order);
    setDetailModal(true);
  };

  // Funciones para cancelar pedidos
  const handleCancelOrder = () => {
    setCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      setCancellingOrder(true);
      await ordersService.cancelOrder(selectedOrder.id, cancelReason);
      
      // Actualizar la lista de órdenes
      await refreshOrders();
      
      // Cerrar modales y limpiar estados
      setCancelModal(false);
      setDetailModal(false);
      setCancelReason('');
      setSnackbar({ 
        open: true, 
        message: `Pedido #${selectedOrder.orderNumber || selectedOrder.id} cancelado exitosamente`, 
        severity: 'success' 
      });
      
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al cancelar el pedido', 
        severity: 'error' 
      });
    } finally {
      setCancellingOrder(false);
    }
  };

  const closeCancelModal = () => {
    setCancelModal(false);
    setCancelReason('');
  };

  // Funciones para editar pedidos
  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setEditOrderForm({
      customer_name: order.customerName || '',
      customer_phone: order.customerPhone || '',
      order_type: order.type || 'dine_in',
      table_number: order.tableNumber || '',
      notes: order.notes || '',
      items: [...(order.items || order.order_items || [])]
    });
    setEditOrderModal(true);
  };

  const handleAddProductToEdit = () => {
    if (!selectedProduct || productQuantity <= 0) return;
    
    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    const existingItem = editOrderForm.items.find(item => 
      parseInt(item.product_id) === parseInt(selectedProduct)
    );
    
    if (existingItem) {
      // Actualizar cantidad
      setEditOrderForm(prev => ({
        ...prev,
        items: prev.items.map(item =>
          parseInt(item.product_id) === parseInt(selectedProduct)
            ? { ...item, quantity: item.quantity + productQuantity }
            : item
        )
      }));
    } else {
      // Agregar nuevo producto
      setEditOrderForm(prev => ({
        ...prev,
        items: [...prev.items, {
          product_id: parseInt(selectedProduct),
          product_name: product.name,
          quantity: parseInt(productQuantity),
          price: parseFloat(product.price || 0),
          unit_price: parseFloat(product.price || 0)
        }]
      }));
    }
    
    setSelectedProduct('');
    setProductQuantity(1);
  };

  const handleRemoveProductFromEdit = (productId) => {
    setEditOrderForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product_id !== productId)
    }));
  };

  const handleUpdateQuantityInEdit = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveProductFromEdit(productId);
      return;
    }
    
    setEditOrderForm(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    }));
  };

  const confirmEditOrder = async () => {
    if (!editingOrder) return;
    
    try {
      setLoading(true);
      
      // Calculate total for edited order
      const total = editOrderForm.items.reduce((sum, item) => 
        sum + ((item.price || item.unit_price || 0) * item.quantity), 0
      );
      
      // Format edit order data with proper data types
      const updateData = {
        customer_name: editOrderForm.customer_name || '',
        customer_phone: editOrderForm.customer_phone || '',
        order_type: editOrderForm.order_type,
        table_number: editOrderForm.order_type === 'dine_in' ? editOrderForm.table_number : null,
        notes: editOrderForm.notes || '',
        total: parseFloat(total.toFixed(2)),
        items: editOrderForm.items.map(item => ({
          product_id: parseInt(item.product_id),
          product_name: item.product_name,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price || item.unit_price || 0)
        }))
      };
      
      console.log('Updating order with data:', updateData);
      await ordersService.updateOrder(editingOrder.id, updateData);
      
      // Actualizar la lista de órdenes
      await loadOrdersWithFilters();
      
      setEditOrderModal(false);
      setEditingOrder(null);
      setSnackbar({ 
        open: true, 
        message: `Pedido #${editingOrder.orderNumber || editingOrder.id} actualizado exitosamente`, 
        severity: 'success' 
      });
      
    } catch (error) {
      console.error('Error updating order:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al actualizar el pedido', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const closeEditModal = () => {
    setEditOrderModal(false);
    setEditingOrder(null);
    setEditOrderForm({
      customer_name: '',
      customer_phone: '',
      order_type: 'dine_in',
      table_number: '',
      notes: '',
      items: []
    });
  };

  // Funciones para reembolsos
  const handleRefundOrder = (order) => {
    setSelectedOrder(order);
    setRefundModal(true);
  };

  const confirmRefundOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      setProcessingRefund(true);
      await ordersService.updateOrderStatus(selectedOrder.id, 'refund');
      // Si hay un campo para razón de reembolso en el backend
      if (refundReason) {
        await ordersService.updateOrder(selectedOrder.id, { refund_reason: refundReason });
      }
      
      // Actualizar la lista de órdenes
      await loadOrdersWithFilters();
      
      setRefundModal(false);
      setDetailModal(false);
      setRefundReason('');
      setSnackbar({ 
        open: true, 
        message: `Reembolso procesado para pedido #${selectedOrder.orderNumber || selectedOrder.id}`, 
        severity: 'success' 
      });
      
    } catch (error) {
      console.error('Error processing refund:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al procesar el reembolso', 
        severity: 'error' 
      });
    } finally {
      setProcessingRefund(false);
    }
  };

  const closeRefundModal = () => {
    setRefundModal(false);
    setRefundReason('');
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (boardRef.current.requestFullscreen) {
        boardRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handlePrintOrder = (order) => {
    // En producción aquí iría la lógica de impresión
    console.log('🖨️ Imprimiendo pedido:', order.orderNumber);
  };

  // Verificar permisos
  const canViewOrders = hasPermission('can_view_orders') || businessInfo?.is_owner;
  const canUpdateOrders = hasPermission('can_update_orders') || businessInfo?.is_owner;

  if (!canViewOrders) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          No tienes permisos para acceder al tablero de pedidos
        </Alert>
      </Container>
    );
  }

  return (
    <Box ref={boardRef} sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f5f5f5',
      position: 'relative'
    }}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Header del tablero */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          bgcolor: 'white',
          p: 2,
          borderRadius: 2,
          boxShadow: 1
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              📋 Tablero de Pedidos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {businessInfo?.name || 'Restaurante'} • Tiempo real
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {canUpdateOrders && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateOrder}
                sx={{ mr: 1 }}
              >
                Crear Pedido
              </Button>
            )}
            
            <Tooltip title="Actualizar manualmente">
              <IconButton 
                onClick={refreshOrders}
                disabled={loading}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Actualización automática">
              <IconButton 
                color={autoRefresh ? 'primary' : 'default'}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? <Notifications /> : <Schedule />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Sonido">
              <IconButton 
                color={soundEnabled ? 'primary' : 'default'}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <VolumeUp /> : <VolumeOff />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Pantalla completa">
              <IconButton onClick={handleFullscreen}>
                <Fullscreen />
              </IconButton>
            </Tooltip>
            
            {loading && <CircularProgress size={20} />}
            
            <Chip 
              icon={<AccessTime />}
              label={`Actualizado: ${lastUpdate.toLocaleTimeString()}`}
              size="small"
              variant="outlined"
              color={error ? 'error' : 'default'}
            />
          </Box>
        </Box>

        {/* Mostrar errores */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={refreshOrders}>
                Reintentar
              </Button>
            }
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Estado de carga inicial */}
        {loading && orders.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={50} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Cargando pedidos...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Filtros y búsqueda */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  🔍 Filtros de Búsqueda
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowFilters(!showFilters)}
                  startIcon={showFilters ? <Warning /> : <FilterList />}
                >
                  {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
                </Button>
              </Box>
              
              {showFilters && (
                <Grid container spacing={2} alignItems="center">
                  <Grid xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Período</InputLabel>
                      <Select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        label="Período"
                      >
                        <MenuItem value="today">Hoy</MenuItem>
                        <MenuItem value="week">Última Semana</MenuItem>
                        <MenuItem value="month">Último Mes</MenuItem>
                        <MenuItem value="custom">Fechas Personalizadas</MenuItem>
                        <MenuItem value="all">Todos los Pedidos</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {dateFilter === 'custom' && (
                    <>
                      <Grid xs={12} sm={6} md={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Desde"
                          type="date"
                          value={customDateFrom}
                          onChange={(e) => setCustomDateFrom(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Hasta"
                          type="date"
                          value={customDateTo}
                          onChange={(e) => setCustomDateTo(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </>
                  )}
                  
                  <Grid xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`${orders.length + cancelledOrders.length} pedidos`}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        label={dateFilter === 'today' ? 'Hoy' : 
                               dateFilter === 'week' ? 'Últimos 7 días' : 
                               dateFilter === 'month' ? 'Últimos 30 días' :
                               dateFilter === 'custom' ? 'Rango personalizado' : 'Histórico'}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Paper>

            {/* Estadísticas rápidas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={6} sm={4} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Activos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid xs={6} sm={4} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="warning.main" fontWeight="bold">
                  {stats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pendientes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid xs={6} sm={4} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="info.main" fontWeight="bold">
                  {stats.preparing}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Preparando
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid xs={6} sm={4} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  {stats.ready}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Listos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid xs={6} sm={4} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="secondary.main" fontWeight="bold">
                  {stats.refund || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reembolsos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid xs={6} sm={4} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="error.main" fontWeight="bold">
                  {stats.cancelled}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cancelados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Grid de pedidos por estado */}
        <Grid container spacing={2}>
          {/* Columna Pendientes */}
          <Grid xs={12} sm={6} md={4} lg={2.4}>
            <Paper sx={{ p: 3, height: '75vh', overflow: 'auto', borderRadius: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2 
              }}>
                <Typography variant="h6" fontWeight="bold">
                  ⏳ Pendientes
                </Typography>
                <Badge badgeContent={stats.pending} color="warning">
                  <Schedule />
                </Badge>
              </Box>
              
              <Stack spacing={3}>
                {orders
                  .filter(order => order.status === 'pending')
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((order) => (
                    <Card 
                      key={order.id}
                      sx={{ 
                        border: `2px solid ${getPriorityColor(order.priority)}`,
                        cursor: 'pointer',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          boxShadow: 6,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => handleOrderDetail(order)}
                    >
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: getPriorityColor(order.priority) }}>
                            {order.orderNumber}
                          </Avatar>
                        }
                        title={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {order.customerName}
                            </Typography>
                            {getTypeIcon(order.type)}
                          </Box>
                        }
                        subheader={
                          <Box>
                            <Typography variant="body2">
                              {order.type === 'dine_in' && `Mesa ${order.tableNumber}`}
                              {order.type === 'takeaway' && 'Para llevar'}
                              {order.type === 'delivery' && 'Domicilio'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Hace {formatTime(order.timeElapsed)}
                            </Typography>
                          </Box>
                        }
                        action={
                          <Chip 
                            label={order.priority.toUpperCase()} 
                            size="small"
                            sx={{ 
                              bgcolor: getPriorityColor(order.priority),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        }
                      />
                      
                      <CardContent sx={{ pt: 0 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {order.items?.length || order.order_items?.length || 0} productos • {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(order.total || 0)}
                        </Typography>
                        
                        {order.notes && (
                          <Alert severity="info" sx={{ mb: 1, py: 0 }}>
                            <Typography variant="caption">
                              {order.notes}
                            </Typography>
                          </Alert>
                        )}
                        
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Tiempo estimado: {order.estimatedTime}min
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={getTimeProgress(order.timeElapsed, order.estimatedTime)}
                            color={getTimeColor(order.timeElapsed, order.estimatedTime)}
                            sx={{ mt: 1, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </CardContent>
                      
                      {canUpdateOrders && (
                        <CardActions>
                          <Button 
                            size="small" 
                            variant="contained"
                            startIcon={<PlayArrow />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(order.id, 'preparing');
                            }}
                          >
                            Iniciar
                          </Button>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditOrder(order);
                            }}
                            title="Editar pedido"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrintOrder(order);
                            }}
                          >
                            <Print />
                          </IconButton>
                        </CardActions>
                      )}
                    </Card>
                  ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Columna Preparando */}
          <Grid xs={12} sm={6} md={4} lg={2.4}>
            <Paper sx={{ p: 3, height: '75vh', overflow: 'auto', borderRadius: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2 
              }}>
                <Typography variant="h6" fontWeight="bold">
                  👨‍🍳 Preparando
                </Typography>
                <Badge badgeContent={stats.preparing} color="info">
                  <Kitchen />
                </Badge>
              </Box>
              
              <Stack spacing={3}>
                {orders
                  .filter(order => order.status === 'preparing')
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((order) => (
                    <Card 
                      key={order.id}
                      sx={{ 
                        border: `2px solid ${theme.palette.info.main}`,
                        cursor: 'pointer',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          boxShadow: 6,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => handleOrderDetail(order)}
                    >
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: 'info.main' }}>
                            {order.orderNumber}
                          </Avatar>
                        }
                        title={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {order.customerName}
                            </Typography>
                            {getTypeIcon(order.type)}
                          </Box>
                        }
                        subheader={
                          <Box>
                            <Typography variant="body2">
                              {order.type === 'dine_in' && `Mesa ${order.tableNumber}`}
                              {order.type === 'takeaway' && 'Para llevar'}
                              {order.type === 'delivery' && 'Domicilio'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Hace {formatTime(order.timeElapsed)}
                            </Typography>
                          </Box>
                        }
                        action={
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="bold">
                              {formatTime(order.timeElapsed)}
                            </Typography>
                            <Typography variant="caption">
                              de {order.estimatedTime}min
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <CardContent sx={{ pt: 0 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {order.items?.length || order.order_items?.length || 0} productos • {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(order.total || 0)}
                        </Typography>
                        
                        <Box sx={{ mt: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={getTimeProgress(order.timeElapsed, order.estimatedTime)}
                            color={getTimeColor(order.timeElapsed, order.estimatedTime)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </CardContent>
                      
                      {canUpdateOrders && (
                        <CardActions>
                          <Button 
                            size="small" 
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(order.id, 'ready');
                            }}
                          >
                            Completar
                          </Button>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditOrder(order);
                            }}
                            title="Editar pedido"
                          >
                            <Edit />
                          </IconButton>
                          <Button 
                            size="small" 
                            variant="outlined"
                            startIcon={<Pause />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(order.id, 'pending');
                            }}
                          >
                            Pausar
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                  ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Columna Listos */}
          <Grid xs={12} sm={6} md={4} lg={2.4}>
            <Paper sx={{ p: 3, height: '75vh', overflow: 'auto', borderRadius: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2 
              }}>
                <Typography variant="h6" fontWeight="bold">
                  ✅ Listos
                </Typography>
                <Badge badgeContent={stats.ready} color="success">
                  <CheckCircle />
                </Badge>
              </Box>
              
              <Stack spacing={3}>
                {orders
                  .filter(order => order.status === 'ready')
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((order) => (
                    <Card 
                      key={order.id}
                      sx={{ 
                        border: `2px solid ${theme.palette.success.main}`,
                        cursor: 'pointer',
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          boxShadow: 6,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => handleOrderDetail(order)}
                    >
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            {order.orderNumber}
                          </Avatar>
                        }
                        title={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {order.customerName}
                            </Typography>
                            {getTypeIcon(order.type)}
                          </Box>
                        }
                        subheader={
                          <Box>
                            <Typography variant="body2">
                              {order.type === 'dine_in' && `Mesa ${order.tableNumber}`}
                              {order.type === 'takeaway' && 'Para llevar'}
                              {order.type === 'delivery' && 'Domicilio'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Listo desde hace {formatTime(order.timeElapsed - order.estimatedTime)}
                            </Typography>
                          </Box>
                        }
                        action={
                          <Chip 
                            label="LISTO" 
                            color="success"
                            sx={{ 
                              fontWeight: 'bold',
                              animation: 'pulse 2s infinite'
                            }}
                          />
                        }
                      />
                      
                      <CardContent sx={{ pt: 0 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {order.items?.length || order.order_items?.length || 0} productos • {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(order.total || 0)}
                        </Typography>
                        
                        {order.customerPhone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Phone fontSize="small" />
                            <Typography variant="body2">
                              {order.customerPhone}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                      
                      {canUpdateOrders && (
                        <CardActions>
                          <Button 
                            size="small" 
                            variant="contained"
                            color="primary"
                            startIcon={<DoneAll />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(order.id, 'completed');
                            }}
                          >
                            Entregado
                          </Button>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditOrder(order);
                            }}
                            title="Editar pedido"
                          >
                            <Edit />
                          </IconButton>
                          <Button 
                            size="small" 
                            variant="outlined"
                            color="secondary"
                            startIcon={<LocalShipping />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRefundOrder(order);
                            }}
                          >
                            Reembolso
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                  ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Columna Reembolsos */}
          <Grid xs={12} sm={6} md={4} lg={2.4}>
            <Paper sx={{ p: 3, height: '75vh', overflow: 'auto', borderRadius: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2 
              }}>
                <Typography variant="h6" fontWeight="bold">
                  💰 Reembolsos
                </Typography>
                <Badge badgeContent={stats.refund || 0} color="secondary">
                  <LocalShipping />
                </Badge>
              </Box>
              
              <Stack spacing={3}>
                {orders
                  .filter(order => order.status === 'refund')
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((order) => (
                    <Card 
                      key={order.id}
                      sx={{ 
                        border: `2px solid ${theme.palette.secondary.main}`,
                        cursor: 'pointer',
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          boxShadow: 6,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => handleOrderDetail(order)}
                    >
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            {order.orderNumber || order.id}
                          </Avatar>
                        }
                        title={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {order.customerName}
                            </Typography>
                            {getTypeIcon(order.type)}
                          </Box>
                        }
                        subheader={
                          <Box>
                            <Typography variant="body2">
                              {order.type === 'dine_in' && `Mesa ${order.tableNumber}`}
                              {order.type === 'takeaway' && 'Para llevar'}
                              {order.type === 'delivery' && 'Domicilio'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Reembolsado hace {formatTime(order.timeElapsed)}
                            </Typography>
                          </Box>
                        }
                        action={
                          <Chip 
                            label="REEMBOLSADO" 
                            color="secondary"
                            sx={{ 
                              fontWeight: 'bold'
                            }}
                          />
                        }
                      />
                      
                      <CardContent sx={{ pt: 0 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {order.items?.length || order.order_items?.length || 0} productos • {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(order.total || 0)}
                        </Typography>
                        
                        {order.refund_reason && (
                          <Alert severity="info" sx={{ mb: 1, py: 0 }}>
                            <Typography variant="caption">
                              <strong>Motivo:</strong> {order.refund_reason}
                            </Typography>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Columna Cancelados */}
          <Grid xs={12} sm={6} md={4} lg={2.4}>
            <Paper sx={{ p: 3, height: '75vh', overflow: 'auto', borderRadius: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2 
              }}>
                <Typography variant="h6" fontWeight="bold">
                  ❌ Cancelados Hoy
                </Typography>
                <Badge badgeContent={stats.cancelled} color="error">
                  <Cancel />
                </Badge>
              </Box>
              
              <Stack spacing={3}>
                {cancelledOrders
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((order) => (
                    <Card 
                      key={order.id}
                      sx={{ 
                        border: `2px solid ${theme.palette.error.main}`,
                        cursor: 'pointer',
                        bgcolor: alpha(theme.palette.error.main, 0.05),
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        opacity: 0.8,
                        '&:hover': { 
                          boxShadow: 6,
                          transform: 'translateY(-2px)',
                          opacity: 1
                        }
                      }}
                      onClick={() => handleOrderDetail(order)}
                    >
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: 'error.main' }}>
                            {order.orderNumber || order.id}
                          </Avatar>
                        }
                        title={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {order.customerName}
                            </Typography>
                            {getTypeIcon(order.type)}
                          </Box>
                        }
                        subheader={
                          <Box>
                            <Typography variant="body2">
                              {order.type === 'dine_in' && `Mesa ${order.tableNumber}`}
                              {order.type === 'takeaway' && 'Para llevar'}
                              {order.type === 'delivery' && 'Domicilio'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Cancelado: {order.createdAt.toLocaleTimeString()}
                            </Typography>
                          </Box>
                        }
                        action={
                          <Box sx={{ textAlign: 'center' }}>
                            <Chip 
                              label="CANCELADO" 
                              color="error" 
                              size="small"
                              icon={<Cancel />}
                            />
                          </Box>
                        }
                      />
                      
                      <CardContent sx={{ pt: 0 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {(order.items || order.order_items || []).length} productos • {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(order.total || 0)}
                        </Typography>
                        
                        {order.cancellation_reason && (
                          <Typography variant="body2" color="error.main" sx={{ fontStyle: 'italic', mt: 1 }}>
                            Motivo: {order.cancellation_reason}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Mensaje cuando no hay órdenes */}
          {orders.length === 0 && !loading && (
            <Grid xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No hay pedidos activos
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Los nuevos pedidos aparecerán aquí automáticamente
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
        </>
        )}
      </Container>

      {/* Modal de detalle del pedido */}
      <Dialog 
        open={detailModal} 
        onClose={() => setDetailModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">
                Pedido #{selectedOrder?.orderNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedOrder?.customerName}
              </Typography>
            </Box>
            <Chip 
              label={selectedOrder?.status}
              color={getStatusColor(selectedOrder?.status)}
              icon={getStatusIcon(selectedOrder?.status)}
            />
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedOrder && (
            <Box>
              {/* Información del cliente */}
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Información del Cliente
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person />
                      <Typography>{selectedOrder.customerName}</Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone />
                      <Typography>{selectedOrder.customerPhone}</Typography>
                    </Box>
                  </Grid>
                  {selectedOrder.type === 'dine_in' && (
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Restaurant />
                        <Typography>Mesa {selectedOrder.tableNumber}</Typography>
                      </Box>
                    </Grid>
                  )}
                  <Grid xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timer />
                      <Typography>
                        Tiempo transcurrido: {formatTime(selectedOrder.timeElapsed)} 
                        / {selectedOrder.estimatedTime}min
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Productos del pedido */}
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Productos ({(selectedOrder.items || selectedOrder.order_items || []).length})
                </Typography>
                <List>
                  {(selectedOrder.items || selectedOrder.order_items || []).map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body1">
                                {item.quantity}x {item.product_name || item.name}
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {new Intl.NumberFormat('es-CO', {
                                  style: 'currency',
                                  currency: 'COP',
                                  minimumFractionDigits: 0
                                }).format((item.quantity * (item.price || item.unit_price || 0)))}
                              </Typography>
                            </Box>
                          }
                          secondary={item.notes && (
                            <Typography variant="body2" color="primary" fontStyle="italic">
                              Nota: {item.notes}
                            </Typography>
                          )}
                        />
                      </ListItem>
                      {index < (selectedOrder.items || selectedOrder.order_items || []).length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ${selectedOrder.total}
                  </Typography>
                </Box>
              </Paper>

              {/* Notas especiales */}
              {selectedOrder.notes && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Notas especiales:
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.notes}
                  </Typography>
                </Alert>
              )}

              {/* Información adicional */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Información del Pedido
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      ID del Pedido:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedOrder.id}
                    </Typography>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Hora de Creación:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedOrder.createdAt.toLocaleTimeString()}
                    </Typography>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Tipo de Pedido:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTypeIcon(selectedOrder.type)}
                      <Typography variant="body1" fontWeight="bold">
                        {selectedOrder.type === 'dine_in' && 'Para comer aquí'}
                        {selectedOrder.type === 'takeaway' && 'Para llevar'}
                        {selectedOrder.type === 'delivery' && 'Domicilio'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Prioridad:
                    </Typography>
                    <Chip 
                      label={selectedOrder.priority.toUpperCase()}
                      size="small"
                      sx={{ 
                        bgcolor: getPriorityColor(selectedOrder.priority),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDetailModal(false)}>
            Cerrar
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Print />}
            onClick={() => handlePrintOrder(selectedOrder)}
          >
            Imprimir
          </Button>
          {canUpdateOrders && selectedOrder && (
            <>
              {selectedOrder.status === 'pending' && (
                <Button 
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, 'preparing');
                    setDetailModal(false);
                  }}
                >
                  Iniciar Preparación
                </Button>
              )}
              {selectedOrder.status === 'preparing' && (
                <Button 
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, 'ready');
                    setDetailModal(false);
                  }}
                >
                  Marcar como Listo
                </Button>
              )}
              {selectedOrder.status === 'ready' && (
                <Button 
                  variant="contained"
                  color="primary"
                  startIcon={<DoneAll />}
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, 'completed');
                    setDetailModal(false);
                  }}
                >
                  Marcar como Entregado
                </Button>
              )}
              {/* Botón de cancelar - solo si el pedido no está cancelado o completado */}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                <Button 
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={handleCancelOrder}
                  sx={{ ml: 1 }}
                >
                  Cancelar Pedido
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Modal de crear pedido */}
      <Dialog 
        open={createOrderModal} 
        onClose={() => setCreateOrderModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Crear Nuevo Pedido</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Información del cliente */}
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre del cliente (opcional)"
                value={orderForm.customer_name}
                onChange={(e) => setOrderForm(prev => ({ ...prev, customer_name: e.target.value }))}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono (opcional)"
                value={orderForm.customer_phone}
                onChange={(e) => setOrderForm(prev => ({ ...prev, customer_phone: e.target.value }))}
              />
            </Grid>
            
            {/* Tipo de pedido */}
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de pedido</InputLabel>
                <Select
                  value={orderForm.order_type}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, order_type: e.target.value }))}
                  label="Tipo de pedido"
                >
                  <MenuItem value="dine_in">Para comer aquí</MenuItem>
                  <MenuItem value="takeaway">Para llevar</MenuItem>
                  <MenuItem value="delivery">Domicilio</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Número de mesa (solo para dine_in) */}
            {orderForm.order_type === 'dine_in' && (
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número de mesa"
                  value={orderForm.table_number}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, table_number: e.target.value }))}
                  required
                />
              </Grid>
            )}
            
            {/* Notas */}
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Notas especiales"
                multiline
                rows={2}
                value={orderForm.notes}
                onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
            
            {/* Agregar productos */}
            <Grid xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Agregar Productos
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', mb: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Producto</InputLabel>
                  <Select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    label="Producto"
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} - ${product.price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Cantidad"
                  type="number"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1 }}
                  sx={{ width: 100 }}
                />
                
                <Button
                  variant="contained"
                  onClick={handleAddProduct}
                  disabled={!selectedProduct}
                >
                  Agregar
                </Button>
              </Box>
            </Grid>
            
            {/* Lista de productos agregados */}
            <Grid xs={12}>
              {orderForm.items.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Productos en el pedido
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell align="center">Cantidad</TableCell>
                          <TableCell align="right">Precio Unit.</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                          <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderForm.items.map((item) => (
                          <TableRow key={item.product_id}>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="right">${item.price}</TableCell>
                            <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveProduct(item.product_id)}
                              >
                                <Cancel />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3}><strong>Total:</strong></TableCell>
                          <TableCell align="right">
                            <strong>
                              ${orderForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                            </strong>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOrderModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitOrder}
            disabled={orderForm.items.length === 0}
          >
            Crear Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación de cancelación */}
      <Dialog 
        open={cancelModal} 
        onClose={closeCancelModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Cancel color="error" />
            <Typography variant="h6">
              Cancelar Pedido #{selectedOrder?.orderNumber || selectedOrder?.id}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            ¿Estás seguro de que quieres cancelar este pedido? Esta acción no se puede deshacer.
          </Typography>
          
          <TextField
            fullWidth
            label="Motivo de cancelación (opcional)"
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Ej: Cliente cambió de opinión, problemas con ingredientes, etc."
            sx={{ mt: 2 }}
          />
          
          {selectedOrder && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Cliente:</strong> {selectedOrder.customerName}<br/>
                <strong>Total:</strong> {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0
                }).format(selectedOrder.total || 0)}<br/>
                <strong>Productos:</strong> {(selectedOrder.items || selectedOrder.order_items || []).length} artículos
              </Typography>
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeCancelModal} disabled={cancellingOrder}>
            No Cancelar
          </Button>
          <Button 
            variant="contained"
            color="error"
            startIcon={cancellingOrder ? <CircularProgress size={20} /> : <Cancel />}
            onClick={confirmCancelOrder}
            disabled={cancellingOrder}
          >
            {cancellingOrder ? 'Cancelando...' : 'Sí, Cancelar Pedido'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar pedido */}
      <Dialog 
        open={editOrderModal} 
        onClose={() => setEditOrderModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            ✏️ Editar Pedido #{editingOrder?.orderNumber || editingOrder?.id}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Información básica del pedido */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre del cliente"
                  value={editOrderForm.customer_name}
                  onChange={(e) => setEditOrderForm(prev => ({ ...prev, customer_name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono del cliente"
                  value={editOrderForm.customer_phone}
                  onChange={(e) => setEditOrderForm(prev => ({ ...prev, customer_phone: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de pedido</InputLabel>
                  <Select
                    value={editOrderForm.order_type}
                    label="Tipo de pedido"
                    onChange={(e) => setEditOrderForm(prev => ({ ...prev, order_type: e.target.value }))}
                  >
                    <MenuItem value="dine_in">En mesa</MenuItem>
                    <MenuItem value="takeaway">Para llevar</MenuItem>
                    <MenuItem value="delivery">Domicilio</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {editOrderForm.order_type === 'dine_in' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número de mesa"
                    value={editOrderForm.table_number}
                    onChange={(e) => setEditOrderForm(prev => ({ ...prev, table_number: e.target.value }))}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas especiales"
                  multiline
                  rows={2}
                  value={editOrderForm.notes}
                  onChange={(e) => setEditOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </Grid>
            </Grid>

            {/* Sección para agregar productos */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Agregar Productos</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Seleccionar producto</InputLabel>
                    <Select
                      value={selectedProduct}
                      label="Seleccionar producto"
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name} - {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(product.price || 0)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Cantidad"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddProductToEdit}
                    disabled={!selectedProduct}
                  >
                    Agregar
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Lista de productos en el pedido */}
            <Typography variant="h6" sx={{ mb: 2 }}>Productos en el Pedido</Typography>
            {editOrderForm.items.length === 0 ? (
              <Alert severity="warning">
                No hay productos en este pedido. Agrega al menos uno.
              </Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="right">Precio Unitario</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {editOrderForm.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <IconButton 
                              size="small"
                              onClick={() => handleUpdateQuantityInEdit(item.product_id, item.quantity - 1)}
                            >
                              <Remove />
                            </IconButton>
                            <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton 
                              size="small"
                              onClick={() => handleUpdateQuantityInEdit(item.product_id, item.quantity + 1)}
                            >
                              <Add />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(item.price || item.unit_price || 0)}
                        </TableCell>
                        <TableCell align="right">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format((item.price || item.unit_price || 0) * item.quantity)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small"
                            color="error"
                            onClick={() => handleRemoveProductFromEdit(item.product_id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="h6" fontWeight="bold">
                          Total:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" fontWeight="bold">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(editOrderForm.items.reduce((total, item) => 
                            total + ((item.price || item.unit_price || 0) * item.quantity), 0
                          ))}
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setEditOrderModal(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Edit />}
            onClick={confirmEditOrder}
            disabled={loading || editOrderForm.items.length === 0}
          >
            {loading ? 'Actualizando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para reembolso */}
      <Dialog 
        open={refundModal} 
        onClose={() => setRefundModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            💰 Procesar Reembolso
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Estás seguro de que quieres procesar un reembolso para este pedido?
          </Typography>
          
          <TextField
            fullWidth
            label="Motivo del reembolso (opcional)"
            multiline
            rows={3}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Ej: Cliente insatisfecho, producto incorrecto, etc."
            sx={{ mt: 2 }}
          />
          
          {selectedOrder && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Cliente:</strong> {selectedOrder.customerName}<br/>
                <strong>Total a reembolsar:</strong> {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0
                }).format(selectedOrder.total || 0)}
              </Typography>
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setRefundModal(false)} disabled={processingRefund}>
            Cancelar
          </Button>
          <Button 
            variant="contained"
            color="secondary"
            startIcon={processingRefund ? <CircularProgress size={20} /> : <LocalShipping />}
            onClick={confirmRefundOrder}
            disabled={processingRefund}
          >
            {processingRefund ? 'Procesando...' : 'Procesar Reembolso'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Notificación flotante para nuevos pedidos */}
      {autoRefresh && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            animation: stats.pending > 0 ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' }
            }
          }}
        >
          <Badge badgeContent={stats.pending} color="error">
            <Notifications />
          </Badge>
        </Fab>
      )}

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default OrdersBoard;