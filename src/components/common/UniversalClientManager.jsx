// src/components/common/UniversalClientManager.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { getBusinessTypeConfig, getBusinessTypeLabel, getBusinessTypeColor } from '../../utils/businessTypes';
import UniversalStatsCard from './UniversalStatsCard';
import UniversalDataTable from './UniversalDataTable';

const UniversalClientManager = ({
  businessType = 'restaurant',
  clients = [],
  onAddClient,
  onEditClient,
  onDeleteClient,
  onViewClient,
  loading = false,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [clientFormData, setClientFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const businessConfig = getBusinessTypeConfig(businessType);
  const businessColor = getBusinessTypeColor(businessType);

  // Adapt client terminology based on business type
  const getClientTerminology = () => {
    const terminology = {
      restaurant: { singular: 'Cliente', plural: 'Clientes', verb: 'Atender' },
      pharmacy: { singular: 'Paciente', plural: 'Pacientes', verb: 'Atender' },
      beauty_salon: { singular: 'Cliente', plural: 'Clientes', verb: 'Atender' },
      fitness_center: { singular: 'Miembro', plural: 'Miembros', verb: 'Gestionar' },
      education: { singular: 'Estudiante', plural: 'Estudiantes', verb: 'Enseñar' },
      health_care: { singular: 'Paciente', plural: 'Pacientes', verb: 'Tratar' },
      automotive: { singular: 'Cliente', plural: 'Clientes', verb: 'Atender' },
      real_estate: { singular: 'Cliente', plural: 'Clientes', verb: 'Asesorar' },
      services: { singular: 'Cliente', plural: 'Clientes', verb: 'Atender' },
      technology: { singular: 'Cliente', plural: 'Clientes', verb: 'Desarrollar' },
    };
    return terminology[businessType] || terminology.restaurant;
  };

  const terminology = getClientTerminology();

  // Generate mock client stats
  const generateClientStats = () => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const newThisMonth = Math.floor(totalClients * 0.15);
    const avgValue = Math.floor(Math.random() * 1000) + 500;

    return [
      {
        title: `Total ${terminology.plural}`,
        value: totalClients,
        trend: 12.5,
        icon: <PersonIcon />,
        color: businessColor,
      },
      {
        title: `${terminology.plural} Activos`,
        value: activeClients,
        trend: 8.2,
        icon: <FavoriteIcon />,
        color: theme.palette.success.main,
      },
      {
        title: 'Nuevos este mes',
        value: newThisMonth,
        trend: 25.1,
        icon: <TrendingUpIcon />,
        color: theme.palette.info.main,
      },
      {
        title: 'Valor promedio',
        value: `$${avgValue}`,
        trend: 5.8,
        icon: <StarIcon />,
        color: theme.palette.warning.main,
      },
    ];
  };

  const clientStats = generateClientStats();

  // Define table columns based on business type
  const getTableColumns = () => {
    const baseColumns = [
      {
        id: 'avatar',
        label: '',
        type: 'avatar',
        sortable: false,
        render: (value, row) => (
          <Avatar sx={{ bgcolor: alpha(businessColor, 0.1), color: businessColor }}>
            {row.name?.charAt(0)}
          </Avatar>
        ),
      },
      {
        id: 'name',
        label: 'Nombre',
        sortable: true,
      },
      {
        id: 'email',
        label: 'Email',
        sortable: true,
      },
      {
        id: 'phone',
        label: 'Teléfono',
        sortable: false,
      },
      {
        id: 'status',
        label: 'Estado',
        type: 'chip',
        chipConfig: (value) => ({
          label: value === 'active' ? 'Activo' : 'Inactivo',
          color: value === 'active' ? 'success' : 'default',
        }),
      },
      {
        id: 'lastVisit',
        label: 'Última visita',
        type: 'date',
        sortable: true,
      },
    ];

    // Add business-specific columns
    if (businessType === 'fitness_center') {
      baseColumns.splice(-1, 0, {
        id: 'membership',
        label: 'Membresía',
        type: 'chip',
        chipConfig: (value) => ({
          label: value || 'Sin membresía',
          color: value ? 'primary' : 'default',
        }),
      });
    }

    if (businessType === 'pharmacy' || businessType === 'health_care') {
      baseColumns.splice(-1, 0, {
        id: 'insurance',
        label: 'Seguro',
        render: (value) => value || 'Sin seguro',
      });
    }

    if (businessType === 'education') {
      baseColumns.splice(-1, 0, {
        id: 'grade',
        label: 'Grado',
        render: (value) => value || 'N/A',
      });
    }

    return baseColumns;
  };

  const tableColumns = getTableColumns();

  // Mock client interactions based on business type
  const generateClientInteractions = (clientId) => {
    const interactions = {
      restaurant: [
        { type: 'order', description: 'Pedido de almuerzo - Mesa 5', date: new Date(), amount: '$45.00' },
        { type: 'reservation', description: 'Reserva para 4 personas', date: new Date(Date.now() - 86400000) },
      ],
      fitness_center: [
        { type: 'class', description: 'Clase de yoga matutina', date: new Date() },
        { type: 'payment', description: 'Pago de membresía mensual', date: new Date(Date.now() - 86400000), amount: '$50.00' },
      ],
      pharmacy: [
        { type: 'prescription', description: 'Receta médica - Antibiótico', date: new Date() },
        { type: 'purchase', description: 'Compra de vitaminas', date: new Date(Date.now() - 86400000), amount: '$25.00' },
      ],
      beauty_salon: [
        { type: 'appointment', description: 'Corte y peinado', date: new Date(), amount: '$35.00' },
        { type: 'treatment', description: 'Tratamiento facial', date: new Date(Date.now() - 604800000), amount: '$80.00' },
      ],
    };

    return interactions[businessType] || interactions.restaurant;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClientAction = (action, client = null) => {
    setSelectedClient(client);
    
    if (action === 'add') {
      setClientFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
      });
      setDialogOpen(true);
    } else if (action === 'edit') {
      setClientFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        notes: client.notes || '',
      });
      setDialogOpen(true);
    } else if (action === 'delete') {
      if (onDeleteClient) {
        onDeleteClient(client.id);
      }
    } else if (action === 'view') {
      if (onViewClient) {
        onViewClient(client);
      }
    }
    
    setMenuAnchor(null);
  };

  const handleSaveClient = () => {
    if (selectedClient) {
      // Edit existing client
      if (onEditClient) {
        onEditClient(selectedClient.id, clientFormData);
      }
    } else {
      // Add new client
      if (onAddClient) {
        onAddClient(clientFormData);
      }
    }
    
    setDialogOpen(false);
    setSelectedClient(null);
  };

  const ClientOverviewTab = () => (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {clientStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <UniversalStatsCard
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              icon={stat.icon}
              customColor={stat.color}
              variant="gradient"
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Gestión de {terminology.plural}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleClientAction('add')}
              sx={{ bgcolor: businessColor }}
            >
              Agregar {terminology.singular}
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Administra tu base de {terminology.plural.toLowerCase()} y mantén un registro de sus interacciones.
          </Typography>
        </CardContent>
      </Card>

      {/* Recent Clients */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {terminology.plural} Recientes
          </Typography>
          
          <List>
            {clients.slice(0, 5).map((client, index) => (
              <React.Fragment key={client.id}>
                <ListItem
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: alpha(businessColor, 0.05),
                    },
                  }}
                  onClick={() => handleClientAction('view', client)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: alpha(businessColor, 0.1), color: businessColor }}>
                      {client.name?.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={client.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {client.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Última visita: {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(client);
                        setMenuAnchor(e.currentTarget);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < 4 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  const ClientListTab = () => (
    <UniversalDataTable
      title={`Lista de ${terminology.plural}`}
      subtitle={`Gestiona todos los ${terminology.plural.toLowerCase()} de tu negocio`}
      columns={tableColumns}
      data={clients}
      loading={loading}
      searchable
      filterable
      exportable
      onRowClick={(client) => handleClientAction('view', client)}
      onRowAction={(client) => {
        setSelectedClient(client);
        setMenuAnchor(null);
        // Show actions menu or perform default action
      }}
      actions={[
        { label: 'Ver', icon: <PersonIcon />, onClick: (client) => handleClientAction('view', client) },
        { label: 'Editar', icon: <EditIcon />, onClick: (client) => handleClientAction('edit', client) },
        { label: 'Eliminar', icon: <DeleteIcon />, onClick: (client) => handleClientAction('delete', client) },
      ]}
      colorScheme="primary"
    />
  );

  const tabs = [
    { label: 'Resumen', component: <ClientOverviewTab /> },
    { label: 'Lista Completa', component: <ClientListTab /> },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {terminology.plural}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona tu base de {terminology.plural.toLowerCase()} y mantén un registro de sus interacciones
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: businessColor,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              sx={{
                '&.Mui-selected': {
                  color: businessColor,
                },
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabs[activeTab]?.component}

      {/* Client Form Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedClient ? 'Editar' : 'Agregar'} {terminology.singular}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre completo"
                value={clientFormData.name}
                onChange={(e) => setClientFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={clientFormData.email}
                onChange={(e) => setClientFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={clientFormData.phone}
                onChange={(e) => setClientFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={clientFormData.address}
                onChange={(e) => setClientFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                multiline
                rows={3}
                value={clientFormData.notes}
                onChange={(e) => setClientFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Información adicional sobre el cliente..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveClient}
            variant="contained"
            sx={{ bgcolor: businessColor }}
            disabled={!clientFormData.name.trim()}
          >
            {selectedClient ? 'Guardar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleClientAction('view', selectedClient)}>
          <PersonIcon sx={{ mr: 1 }} />
          Ver perfil
        </MenuItem>
        <MenuItem onClick={() => handleClientAction('edit', selectedClient)}>
          <EditIcon sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleClientAction('delete', selectedClient)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UniversalClientManager;