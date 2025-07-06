// src/components/business/BusinessDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  alpha,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Schedule as ScheduleIcon,
  LocalOffer as LocalOfferIcon,
  AttachMoney as AttachMoneyIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Inventory as InventoryIcon,
  EventNote as EventNoteIcon,
  Restaurant as RestaurantIcon,
  Store as StoreIcon,
  Build as BuildIcon,
  School as SchoolIcon,
  LocalHospital as LocalHospitalIcon,
  FitnessCenter as FitnessCenterIcon,
} from '@mui/icons-material';
import { 
  getBusinessTypeConfig, 
  getBusinessTypeLabel, 
  getBusinessTypeIcon, 
  getBusinessTypeColor,
  getBusinessTypeDashboardWidgets 
} from '../../utils/businessTypes';
import { useAuth } from '../../contexts/AuthContext';

const BusinessDashboard = ({ businessType = 'restaurant' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    revenue: { value: 0, change: 0, label: 'Ingresos' },
    orders: { value: 0, change: 0, label: 'Pedidos' },
    customers: { value: 0, change: 0, label: 'Clientes' },
    inventory: { value: 0, change: 0, label: 'Inventario' },
    appointments: { value: 0, change: 0, label: 'Citas' },
    staff: { value: 0, change: 0, label: 'Personal' },
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const businessConfig = getBusinessTypeConfig(businessType);
  const businessLabel = getBusinessTypeLabel(businessType);
  const businessIcon = getBusinessTypeIcon(businessType);
  const businessColor = getBusinessTypeColor(businessType);
  const dashboardWidgets = getBusinessTypeDashboardWidgets(businessType);

  useEffect(() => {
    loadDashboardData();
  }, [businessType]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on business type
      const mockStats = generateMockStats(businessType);
      const mockActivity = generateMockActivity(businessType);
      
      setStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockStats = (type) => {
    const config = getBusinessTypeConfig(type);
    const baseStats = {
      revenue: { value: 25750, change: 12.5, label: 'Ingresos' },
      customers: { value: 1234, change: 8.2, label: 'Clientes' },
      staff: { value: 15, change: 0, label: 'Personal' },
    };

    if (config.hasOrders) {
      baseStats.orders = { value: 342, change: 15.3, label: 'Pedidos' };
    }

    if (config.hasInventory) {
      baseStats.inventory = { value: 89, change: -5.2, label: 'Inventario' };
    }

    if (config.hasReservations) {
      baseStats.appointments = { value: 127, change: 22.1, label: 'Citas' };
    }

    return baseStats;
  };

  const generateMockActivity = (type) => {
    const activities = [
      { id: 1, type: 'order', description: 'Nuevo pedido recibido', time: '5 min', icon: '📋' },
      { id: 2, type: 'payment', description: 'Pago procesado exitosamente', time: '12 min', icon: '💳' },
      { id: 3, type: 'customer', description: 'Cliente nuevo registrado', time: '25 min', icon: '👤' },
      { id: 4, type: 'inventory', description: 'Stock bajo en inventario', time: '1 hora', icon: '📦' },
      { id: 5, type: 'staff', description: 'Personal marcó entrada', time: '2 horas', icon: '👨‍💼' },
    ];

    return activities.slice(0, 5);
  };

  const getIconForStat = (statKey) => {
    const iconMap = {
      revenue: <AttachMoneyIcon />,
      orders: <ShoppingCartIcon />,
      customers: <PeopleIcon />,
      inventory: <InventoryIcon />,
      appointments: <EventNoteIcon />,
      staff: <PeopleIcon />,
    };
    return iconMap[statKey] || <AssessmentIcon />;
  };

  const getBusinessTypeSpecificIcon = (type) => {
    const iconMap = {
      restaurant: <RestaurantIcon />,
      bakery: <StoreIcon />,
      coffee_shop: <StoreIcon />,
      pharmacy: <LocalHospitalIcon />,
      beauty_salon: <BuildIcon />,
      fitness_center: <FitnessCenterIcon />,
      education: <SchoolIcon />,
      health_care: <LocalHospitalIcon />,
    };
    return iconMap[type] || <StoreIcon />;
  };

  const StatCard = ({ statKey, stat, loading }) => (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(businessColor, 0.1),
              color: businessColor,
              width: 48,
              height: 48,
            }}
          >
            {getIconForStat(statKey)}
          </Avatar>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {loading ? '-' : stat.value.toLocaleString()}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {stat.label}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {stat.change > 0 ? (
            <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
          ) : (
            <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: stat.change > 0 ? 'success.main' : 'error.main',
              fontWeight: 'medium',
            }}
          >
            {stat.change > 0 ? '+' : ''}{stat.change}%
          </Typography>
        </Box>
      </CardContent>
      {loading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
      )}
    </Card>
  );

  const BusinessHeader = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: businessColor,
              color: 'white',
              width: 56,
              height: 56,
              mr: 2,
              fontSize: '1.5rem',
            }}
          >
            {businessIcon}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Panel de Control
            </Typography>
            <Chip
              label={businessLabel}
              sx={{
                backgroundColor: alpha(businessColor, 0.1),
                color: businessColor,
                fontWeight: 'medium',
              }}
            />
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
          disabled={loading}
        >
          Actualizar
        </Button>
      </Box>
    </Box>
  );

  const RecentActivityCard = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Actividad Reciente</Typography>
          <Button size="small" color="primary">
            Ver Todo
          </Button>
        </Box>
        
        <List sx={{ py: 0 }}>
          {recentActivity.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: alpha(businessColor, 0.1), color: businessColor }}>
                    {activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.description}
                  secondary={`Hace ${activity.time}`}
                />
              </ListItem>
              {index < recentActivity.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const QuickActionsCard = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Acciones Rápidas
        </Typography>
        
        <Grid container spacing={2}>
          {businessConfig.hasOrders && (
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ShoppingCartIcon />}
                sx={{ py: 1.5 }}
              >
                Nuevo Pedido
              </Button>
            </Grid>
          )}
          
          {businessConfig.hasReservations && (
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ScheduleIcon />}
                sx={{ py: 1.5 }}
              >
                Nueva Cita
              </Button>
            </Grid>
          )}
          
          {businessConfig.hasInventory && (
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<InventoryIcon />}
                sx={{ py: 1.5 }}
              >
                Inventario
              </Button>
            </Grid>
          )}
          
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AttachMoneyIcon />}
              sx={{ py: 1.5 }}
            >
              Pagos
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <BusinessHeader />
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        {dashboardWidgets.map((widget) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={widget.key}>
            <StatCard
              statKey={widget.key}
              stat={stats[widget.key] || { value: 0, change: 0, label: widget.label }}
              loading={loading}
            />
          </Grid>
        ))}
        
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <RecentActivityCard />
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <QuickActionsCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessDashboard;