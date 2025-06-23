// src/pages/OrdersBoard.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Paper, Typography, Box, Grid, Card, CardContent,
  Chip, Avatar, Button, IconButton, LinearProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, List,
  ListItem, ListItemText, Divider, Stack, Badge, Fab,
  useTheme, alpha, Tooltip, CardHeader, CardActions, CircularProgress
} from '@mui/material';
import {
  Schedule, CheckCircle, Cancel, Pause, PlayArrow,
  Restaurant, Timer, Person, Phone, LocationOn,
  Refresh, Fullscreen, VolumeUp, VolumeOff,
  Kitchen, LocalShipping, DoneAll, Warning,
  AccessTime, TrendingUp, Notifications, Print
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ordersService from '../services/orders.service';

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

  // Cargar órdenes iniciales
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar todas las órdenes activas (no entregadas ni canceladas)
        const allOrders = await ordersService.getOrders({
          status__in: 'pending,confirmed,preparing,ready'
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
        
        setOrders(processedOrders);
        setLastUpdate(new Date());
        
      } catch (error) {
        console.error('Error loading orders:', error);
        setError('Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    if (businessInfo) {
      loadOrders();
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
      avgWaitTime: orders.reduce((acc, o) => acc + o.timeElapsed, 0) / orders.length || 0
    };
    setStats(newStats);
  }, [orders]);

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
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Schedule />,
      preparing: <Kitchen />,
      ready: <CheckCircle />,
      completed: <DoneAll />,
      cancelled: <Cancel />
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
      
      setOrders(processedOrders);
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Error refreshing orders:', error);
      setError('Error al actualizar los pedidos');
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
            {/* Estadísticas rápidas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Pedidos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
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
          
          <Grid item xs={6} sm={3}>
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
          
          <Grid item xs={6} sm={3}>
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
        </Grid>

        {/* Grid de pedidos por estado */}
        <Grid container spacing={2}>
          {/* Columna Pendientes */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
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
              
              <Stack spacing={2}>
                {orders
                  .filter(order => order.status === 'pending')
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((order) => (
                    <Card 
                      key={order.id}
                      sx={{ 
                        border: `2px solid ${getPriorityColor(order.priority)}`,
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 3 }
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
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
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
              
              <Stack spacing={2}>
                {orders
                  .filter(order => order.status === 'preparing')
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((order) => (
                    <Card 
                      key={order.id}
                      sx={{ 
                        border: `2px solid ${theme.palette.info.main}`,
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 3 }
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
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
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
              
              <Stack spacing={2}>
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
                        '&:hover': { boxShadow: 3 }
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
                        </CardActions>
                      )}
                    </Card>
                  ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Mensaje cuando no hay órdenes */}
          {orders.length === 0 && !loading && (
            <Grid item xs={12}>
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
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person />
                      <Typography>{selectedOrder.customerName}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone />
                      <Typography>{selectedOrder.customerPhone}</Typography>
                    </Box>
                  </Grid>
                  {selectedOrder.type === 'dine_in' && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Restaurant />
                        <Typography>Mesa {selectedOrder.tableNumber}</Typography>
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={12}>
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
                  Productos ({selectedOrder.items.length})
                </Typography>
                <List>
                  {selectedOrder.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body1">
                                {item.quantity}x {item.name}
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                ${(item.quantity * (selectedOrder.total / selectedOrder.items.length)).toFixed(2)}
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
                      {index < selectedOrder.items.length - 1 && <Divider />}
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
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      ID del Pedido:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedOrder.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Hora de Creación:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedOrder.createdAt.toLocaleTimeString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
            </>
          )}
        </DialogActions>
      </Dialog>

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