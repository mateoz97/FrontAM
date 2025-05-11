// src/pages/Dashboard.jsx
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  Chip,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const stats = [
  {
    title: 'Ventas del Día',
    value: '$1,234',
    icon: <MoneyIcon />,
    color: '#4CAF50',
    trend: '+12%',
  },
  {
    title: 'Pedidos',
    value: '45',
    icon: <ReceiptIcon />,
    color: '#2196F3',
    trend: '+8%',
  },
  {
    title: 'Clientes',
    value: '32',
    icon: <PeopleIcon />,
    color: '#FF9800',
    trend: '+5%',
  },
  {
    title: 'Productos',
    value: '128',
    icon: <InventoryIcon />,
    color: '#9C27B0',
    trend: '0%',
  },
];

function Dashboard() {
  const { user, getUserBusiness, getUserRole } = useAuth();
  const businessInfo = getUserBusiness();
  const roleInfo = getUserRole();

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
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TrendingUpIcon 
                        sx={{ 
                          fontSize: 16, 
                          color: stat.trend.startsWith('+') ? '#4CAF50' : '#F44336',
                          mr: 0.5 
                        }} 
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: stat.trend.startsWith('+') ? '#4CAF50' : '#F44336' 
                        }}
                      >
                        {stat.trend} vs ayer
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: stat.color + '20', 
                      color: stat.color,
                      width: 56, 
                      height: 56 
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pedidos Recientes
              </Typography>
              <Typography color="textSecondary">
                Aquí irá la lista de pedidos recientes...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Productos Más Vendidos
              </Typography>
              <Typography color="textSecondary">
                Aquí irá la lista de productos más vendidos...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Información de permisos del usuario (útil para desarrollo) */}
      {roleInfo && roleInfo.permissions && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Permisos de tu rol ({roleInfo.name})
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(roleInfo.permissions).map(([permission, hasPermission]) => (
              <Grid item xs={12} sm={6} md={4} key={permission}>
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
    </Box>
  );
}

export default Dashboard;