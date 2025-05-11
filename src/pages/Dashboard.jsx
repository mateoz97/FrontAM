// src/pages/Dashboard.jsx
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const stats = [
  {
    title: 'Ventas del Día',
    value: '$0',
    icon: <MoneyIcon />,
    color: '#4CAF50',
    trend: '+0%',
  },
  {
    title: 'Pedidos',
    value: '0',
    icon: <ReceiptIcon />,
    color: '#2196F3',
    trend: '+0%',
  },
  {
    title: 'Clientes',
    value: '0',
    icon: <PeopleIcon />,
    color: '#FF9800',
    trend: '+0%',
  },
  {
    title: 'Productos',
    value: '0',
    icon: <InventoryIcon />,
    color: '#9C27B0',
    trend: '0%',
  },
];

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
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
                No hay pedidos recientes para mostrar.
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
                No hay productos para mostrar.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;