// src/pages/OrdersBoard.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Paper, Typography, Box, Grid, Card, CardContent,
  Chip, Avatar, Button, IconButton, LinearProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, List,
  ListItem, ListItemText, Divider, Stack, Badge, Fab,
  useTheme, alpha, Tooltip, CardHeader, CardActions
} from '@mui/material';
import {
  Schedule, CheckCircle, Cancel, Pause, PlayArrow,
  Restaurant, Timer, Person, Phone, LocationOn,
  Refresh, Fullscreen, VolumeUp, VolumeOff,
  Kitchen, LocalShipping, DoneAll, Warning,
  AccessTime, TrendingUp, Notifications, Print
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Datos mock para desarrollo - simulando pedidos en tiempo real
const mockOrders = [
  {
    id: 'ORD-001',
    orderNumber: 1,
    customerName: 'Juan Pérez',
    customerPhone: '+1234567890',
    type: 'dine_in', // dine_in, takeaway, delivery
    tableNumber: 5,
    status: 'pending', // pending, preparing, ready, completed, cancelled
    priority: 'normal', // high, normal, low
    estimatedTime: 15, // minutos
    timeElapsed: 3, // minutos desde que se creó
    createdAt: new Date(Date.now() - 3 * 60 * 1000), // hace 3 minutos
    items: [
      { id: 1, name: 'Hamburguesa Clásica', quantity: 2, notes: 'Sin cebolla' },
      { id: 2, name: 'Papas Fritas', quantity: 2, notes: '' },
      { id: 3, name: 'Coca Cola', quantity: 2, notes: 'Con hielo' }
    ],
    total: 29.98,
    notes: 'Cliente tiene alergia a nueces'
  },
  {
    id: 'ORD-002',
    orderNumber: 2,
    customerName: 'María González',
    customerPhone: '+1234567891',
    type: 'takeaway',
    tableNumber: null,
    status: 'preparing',
    priority: 'high',
    estimatedTime: 20,
    timeElapsed: 8,
    createdAt: new Date(Date.now() - 8 * 60 * 1000),
    items: [
      { id: 1, name: 'Pizza Margherita', quantity: 1, notes: 'Extra queso' },
      { id: 2, name: 'Ensalada César', quantity: 1, notes: 'Aderezo aparte' }
    ],
    total: 25.98,
    notes: ''
  },
  {
    id: 'ORD-003',
    orderNumber: 3,
    customerName: 'Carlos Rodríguez',
    customerPhone: '+1234567892',
    type: 'delivery',
    tableNumber: null,
    status: 'ready',
    priority: 'normal',
    estimatedTime: 25,
    timeElapsed: 22,
    createdAt: new Date(Date.now() - 22 * 60 * 1000),
    items: [
      { id: 1, name: 'Pasta Carbonara', quantity: 1, notes: '' },
      { id: 2, name: 'Pan de Ajo', quantity: 1, notes: '' },
      { id: 3, name: 'Vino Tinto', quantity: 1, notes: '' }
    ],
    total: 32.50,
    notes: 'Dirección: Calle 123 #45-67'
  },
  {
    id: 'ORD-004',
    orderNumber: 4,
    customerName: 'Ana Martínez',
    customerPhone: '+1234567893',
    type: 'dine_in',
    tableNumber: 12,
    status: 'pending',
    priority: 'low',
    estimatedTime: 18,
    timeElapsed: 1,
    createdAt: new Date(Date.now() - 1 * 60 * 1000),
    items: [
      { id: 1, name: 'Salmón a la Plancha', quantity: 1, notes: 'Término medio' },
      { id: 2, name: 'Verduras al Vapor', quantity: 1, notes: '' },
      { id: 3, name: 'Agua con Gas', quantity: 1, notes: 'Con limón' }
    ],
    total: 28.75,
    notes: ''
  }
];

const OrdersBoard = () => {
  const { getUserBusiness, hasPermission } = useAuth();
  const theme = useTheme();
  const businessInfo = getUserBusiness();
  
  // Estados principales
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
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

  // Simulación de tiempo real - actualizar tiempo transcurrido
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => ({
          ...order,
          timeElapsed: Math.floor((Date.now() - order.createdAt.getTime()) / 60000)
        }))
      );
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Simulación de nuevos pedidos (en producción esto vendría del backend)
  useEffect(() => {
    if (!autoRefresh) return;
    
    const newOrderInterval = setInterval(() => {
      // Simular nuevo pedido cada 2 minutos (para demo)
      if (Math.random() > 0.7) { // 30% de probabilidad
        const newOrder = {
          id: `ORD-${Date.now()}`,
          orderNumber: orders.length + 1,
          customerName: 'Cliente Nuevo',
          customerPhone: '+1234567890',
          type: ['dine_in', 'takeaway', 'delivery'][Math.floor(Math.random() * 3)],
          tableNumber: Math.floor(Math.random() * 20) + 1,
          status: 'pending',
          priority: ['high', 'normal', 'low'][Math.floor(Math.random() * 3)],
          estimatedTime: Math.floor(Math.random() * 20) + 10,
          timeElapsed: 0,
          createdAt: new Date(),
          items: [
            { id: 1, name: 'Producto Demo', quantity: 1, notes: '' }
          ],
          total: Math.floor(Math.random() * 50) + 10,
          notes: ''
        };
        
        setOrders(prev => [newOrder, ...prev]);
        
        // Reproducir sonido de nuevo pedido
        if (soundEnabled) {
          // En producción aquí iría un sonido real
          console.log('🔔 Nuevo pedido recibido!');
        }
      }
    }, 120000); // Cada 2 minutos

    return () => clearInterval(newOrderInterval);
  }, [orders.length, soundEnabled, autoRefresh]);

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

  // Manejadores de eventos
  const handleStatusChange = (orderId, newStatus) => {
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
            <Tooltip title="Actualización automática">
              <IconButton 
                color={autoRefresh ? 'primary' : 'default'}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <Refresh />
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
            
            <Chip 
              icon={<AccessTime />}
              label={`Actualizado: ${new Date().toLocaleTimeString()}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

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
                          {order.items.length} productos • ${order.total}
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
                          {order.items.length} productos • ${order.total}
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
                          {order.items.length} productos • ${order.total}
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
        </Grid>
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