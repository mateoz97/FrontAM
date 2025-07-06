// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  Chip,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  RssFeed as FeedIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ordersService from '../services/orders.service';
import inventoryService from '../services/inventory.service';

function Dashboard() {
  const navigate = useNavigate();
  const { user, getUserBusiness, getUserRole } = useAuth();
  const businessInfo = getUserBusiness();
  const roleInfo = getUserRole();
  
  // Estados para datos del dashboard
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
    recentOrders: [],
    lowStockProducts: []
  });

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Cargar estadísticas de órdenes
        const orderStats = await ordersService.getOrderStatistics();
        
        // Cargar órdenes recientes (últimas 5)
        const recentOrders = await ordersService.getTodayOrders();
        
        // Cargar productos con stock bajo
        const lowStockProducts = await inventoryService.getLowStockProducts();
        
        // Cargar total de productos
        const allProducts = await inventoryService.getProducts();
        
        setStats({
          totalOrders: orderStats.total_orders || 0,
          totalRevenue: orderStats.total_revenue || 0,
          pendingOrders: orderStats.pending_orders || 0,
          totalProducts: allProducts.length || 0,
          recentOrders: recentOrders.slice(0, 5) || [],
          lowStockProducts: lowStockProducts.slice(0, 5) || []
        });
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && businessInfo) {
      loadDashboardData();
    }
  }, [user, businessInfo]);

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Obtener color del estado de la orden
  const getOrderStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      preparing: '#9c27b0',
      ready: '#4caf50',
      delivered: '#8bc34a',
      cancelled: '#f44336'
    };
    return colors[status] || '#757575';
  };

  // Obtener icono del estado de la orden
  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ScheduleIcon />;
      case 'confirmed':
      case 'preparing':
        return <CheckIcon />;
      case 'ready':
      case 'delivered':
        return <ShippingIcon />;
      default:
        return <ReceiptIcon />;
    }
  };

  return (
    <Box>
      {/* Header con información del usuario */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Bienvenido, {user?.first_name || user?.username}!
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              {businessInfo && (
                <Chip
                  icon={<BusinessIcon />}
                  label={businessInfo.name}
                  color="primary"
                  variant="outlined"
                />
              )}
              {roleInfo && (
                <Chip
                  icon={<BadgeIcon />}
                  label={roleInfo.name}
                  color="secondary"
                />
              )}
            </Box>
          </Box>
          
          {businessInfo && businessInfo.is_owner && (
            <Chip
              label="Propietario"
              color="success"
              size="large"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
      </Paper>
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={50} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Cargando datos del dashboard...
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Ventas del Día */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="body2">
                        Ventas del Día
                      </Typography>
                      <Typography variant="h4" component="div">
                        {formatCurrency(stats.totalRevenue)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Ingresos totales
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#4CAF5020', color: '#4CAF50', width: 56, height: 56 }}>
                      <MoneyIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Total de Pedidos */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="body2">
                        Total Pedidos
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stats.totalOrders}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Pedidos totales
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#2196F320', color: '#2196F3', width: 56, height: 56 }}>
                      <ReceiptIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Pedidos Pendientes */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="body2">
                        Pedidos Pendientes
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stats.pendingOrders}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Requieren atención
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#FF980020', color: '#FF9800', width: 56, height: 56 }}>
                      <ScheduleIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Total de Productos */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="body2">
                        Productos
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stats.totalProducts}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        En inventario
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#9C27B020', color: '#9C27B0', width: 56, height: 56 }}>
                      <InventoryIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {!loading && (
        <Grid container spacing={3}>
          {/* Pedidos Recientes */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Pedidos Recientes
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => navigate('/orders')}
                  >
                    Ver Todos
                  </Button>
                </Box>
                
                {stats.recentOrders.length > 0 ? (
                  <List>
                    {stats.recentOrders.map((order, index) => (
                      <React.Fragment key={order.id}>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar 
                              sx={{ 
                                bgcolor: getOrderStatusColor(order.status) + '20',
                                color: getOrderStatusColor(order.status),
                                width: 40, 
                                height: 40 
                              }}
                            >
                              {getOrderStatusIcon(order.status)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={`Pedido #${order.id}`}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="textSecondary">
                                  Cliente: {order.customer_name || order.customer || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Total: {formatCurrency(order.total || 0)}
                                </Typography>
                                <Chip 
                                  label={order.status || 'pending'} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: getOrderStatusColor(order.status) + '20',
                                    color: getOrderStatusColor(order.status),
                                    mt: 1
                                  }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < stats.recentOrders.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary" textAlign="center" sx={{ py: 4 }}>
                    No hay pedidos recientes
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Productos con Stock Bajo */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Stock Bajo
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => navigate('/inventory')}
                  >
                    Ver Inventario
                  </Button>
                </Box>
                
                {stats.lowStockProducts.length > 0 ? (
                  <List>
                    {stats.lowStockProducts.map((product, index) => (
                      <React.Fragment key={product.id}>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: '#f44336', color: 'white', width: 32, height: 32 }}>
                              <InventoryIcon fontSize="small" />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={product.name}
                            secondary={
                              <Typography variant="body2" color="error">
                                Stock: {product.stock || 0}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < stats.lowStockProducts.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary" textAlign="center" sx={{ py: 4 }}>
                    ✅ Todos los productos tienen stock suficiente
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Información de permisos del usuario (útil para desarrollo) */}
      {roleInfo && roleInfo.permissions && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Permisos de tu rol ({roleInfo.name})
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(roleInfo.permissions).map(([permission, hasPermission]) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={permission}>
                <Chip
                  label={permission.replace('can_', '').replace(/_/g, ' ')}
                  color={hasPermission ? "success" : "default"}
                  variant={hasPermission ? "filled" : "outlined"}
                  sx={{ width: '100%', justifyContent: 'flex-start' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Botón para ir al Feed */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          ¿Quieres ver las últimas publicaciones?
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          startIcon={<FeedIcon />}
          onClick={() => navigate('/feed')}
          sx={{ mt: 2 }}
        >
          Ir al Feed
        </Button>
      </Box>
    </Box>
  );
}

export default Dashboard;