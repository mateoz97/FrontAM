// src/pages/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Grid, Card, CardContent,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Avatar, Fab, Alert, Snackbar, MenuItem,
  Select, FormControl, InputLabel, Tooltip, Badge, Stack,
  TablePagination, InputAdornment, Tabs, Tab, useTheme, alpha,
  List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction,
  Switch, FormControlLabel, Divider
} from '@mui/material';
import {
  Add, Edit, Delete, Search, FilterList, People, PersonAdd,
  Block, CheckCircle, Warning, Email, Phone, Business,
  Badge as BadgeIcon, SupervisorAccount, Group, Pending,
  Visibility, MoreVert, Send, PersonOff, Key, Settings,
  History, Schedule, Verified, Star, ManageAccounts
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Datos mock para desarrollo
const mockUsers = [
  {
    id: 1,
    username: 'admin_user',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@restaurant.com',
    phone: '+1234567890',
    role: 'Admin',
    status: 'active',
    isOwner: true,
    lastLogin: '2024-01-15 14:30',
    joinDate: '2024-01-01',
    avatar: null,
    permissions: ['all']
  },
  {
    id: 2,
    username: 'manager_maria',
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@restaurant.com',
    phone: '+1234567891',
    role: 'Gerente',
    status: 'active',
    isOwner: false,
    lastLogin: '2024-01-15 12:15',
    joinDate: '2024-01-02',
    avatar: null,
    permissions: ['manage_inventory', 'view_reports']
  },
  {
    id: 3,
    username: 'waiter_carlos',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@restaurant.com',
    phone: '+1234567892',
    role: 'Mesero',
    status: 'active',
    isOwner: false,
    lastLogin: '2024-01-15 10:45',
    joinDate: '2024-01-05',
    avatar: null,
    permissions: ['create_orders', 'view_inventory']
  },
  {
    id: 4,
    username: 'chef_ana',
    firstName: 'Ana',
    lastName: 'Martínez',
    email: 'ana.martinez@restaurant.com',
    phone: '+1234567893',
    role: 'Cocinero',
    status: 'inactive',
    isOwner: false,
    lastLogin: '2024-01-10 09:30',
    joinDate: '2024-01-03',
    avatar: null,
    permissions: ['view_orders', 'update_orders']
  },
  {
    id: 5,
    username: 'viewer_luis',
    firstName: 'Luis',
    lastName: 'Torres',
    email: 'luis.torres@restaurant.com',
    phone: '+1234567894',
    role: 'Viewer',
    status: 'pending',
    isOwner: false,
    lastLogin: null,
    joinDate: '2024-01-14',
    avatar: null,
    permissions: ['view_dashboard']
  }
];

const mockJoinRequests = [
  {
    id: 1,
    user: {
      firstName: 'Pedro',
      lastName: 'Sánchez',
      email: 'pedro.sanchez@email.com',
      username: 'pedro_sanchez'
    },
    message: 'Me gustaría unirme al equipo como mesero. Tengo 3 años de experiencia.',
    requestDate: '2024-01-14',
    status: 'pending'
  },
  {
    id: 2,
    user: {
      firstName: 'Laura',
      lastName: 'Díaz',
      email: 'laura.diaz@email.com',
      username: 'laura_diaz'
    },
    message: 'Soy chef con experiencia en cocina italiana.',
    requestDate: '2024-01-13',
    status: 'pending'
  }
];

const mockRoles = ['Admin', 'Gerente', 'Mesero', 'Cocinero', 'Viewer'];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`users-tabpanel-${index}`}
      aria-labelledby={`users-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminUsers = () => {
  const { getUserBusiness, hasPermission } = useAuth();
  const theme = useTheme();
  const businessInfo = getUserBusiness();

  // Estados principales
  const [users, _setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [joinRequests] = useState(mockJoinRequests);
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para modales
  const [inviteModal, setInviteModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [roleModal, setRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Estados para formularios
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'Viewer',
    message: ''
  });
  
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Viewer',
    status: 'active'
  });
  
  // Estados para mensajes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Filtrar usuarios
  useEffect(() => {
    let filtered = users;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
    setPage(0);
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Funciones de utilidad
  const getStatusChip = (status) => {
    const statusConfig = {
      active: { label: 'Activo', color: 'success' },
      inactive: { label: 'Inactivo', color: 'error' },
      pending: { label: 'Pendiente', color: 'warning' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getRoleIcon = (role, isOwner) => {
    if (isOwner) return <Star color="warning" />;
    
    const roleIcons = {
      'Admin': <SupervisorAccount color="error" />,
      'Gerente': <ManageAccounts color="primary" />,
      'Mesero': <People color="info" />,
      'Cocinero': <BadgeIcon color="secondary" />,
      'Viewer': <Visibility color="action" />
    };
    
    return roleIcons[role] || <BadgeIcon color="action" />;
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  // Cálculos para estadísticas
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const totalRequests = joinRequests.length;

  // Manejadores de eventos
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInviteUser = () => {
    setInviteForm({
      email: '',
      role: 'Viewer',
      message: ''
    });
    setInviteModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setEditUserModal(true);
  };

  const handleChangeRole = (user) => {
    setSelectedUser(user);
    setRoleModal(true);
  };

  const handleSendInvite = () => {
    // Aquí conectaremos con el backend
    console.log('Enviando invitación:', inviteForm);
    setSnackbar({ open: true, message: 'Invitación enviada exitosamente', severity: 'success' });
    setInviteModal(false);
  };

  const handleSaveUser = () => {
    // Aquí conectaremos con el backend
    console.log('Guardando usuario:', userForm);
    setSnackbar({ open: true, message: 'Usuario actualizado exitosamente', severity: 'success' });
    setEditUserModal(false);
  };

  const handleUpdateRole = (newRole) => {
    // Aquí conectaremos con el backend
    console.log('Actualizando rol:', selectedUser, newRole);
    setSnackbar({ open: true, message: 'Rol actualizado exitosamente', severity: 'success' });
    setRoleModal(false);
  };

  const handleApproveRequest = (requestId) => {
    // Aquí conectaremos con el backend
    console.log('Aprobando solicitud:', requestId);
    setSnackbar({ open: true, message: 'Solicitud aprobada', severity: 'success' });
  };

  const handleRejectRequest = (requestId) => {
    // Aquí conectaremos con el backend
    console.log('Rechazando solicitud:', requestId);
    setSnackbar({ open: true, message: 'Solicitud rechazada', severity: 'info' });
  };

  const handleToggleUserStatus = (userId) => {
    // Aquí conectaremos con el backend
    console.log('Cambiando estado del usuario:', userId);
    setSnackbar({ open: true, message: 'Estado del usuario actualizado', severity: 'info' });
  };

  const handleDeleteUser = (userId) => {
    // Aquí conectaremos con el backend
    console.log('Eliminando usuario:', userId);
    setSnackbar({ open: true, message: 'Usuario eliminado', severity: 'warning' });
  };

  // Verificar permisos
  const canManageUsers = hasPermission('can_manage_users') || businessInfo?.is_owner;

  if (!canManageUsers) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          No tienes permisos para administrar usuarios
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Administración de Usuarios
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona el equipo de {businessInfo?.name || 'tu negocio'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleInviteUser}
          >
            Invitar Usuario
          </Button>
        </Box>

        {/* Estadísticas rápidas */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                  <People />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Usuarios
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {activeUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usuarios Activos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                  <Pending />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {pendingUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pendientes
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Badge badgeContent={totalRequests} color="error">
                  <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                    <Group />
                  </Avatar>
                </Badge>
                <Typography variant="h4" fontWeight="bold">
                  {totalRequests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Solicitudes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Tabs */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.primary.main, 0.02)
        }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              label={`Usuarios (${totalUsers})`} 
              icon={<People />} 
              iconPosition="start" 
            />
            <Tab 
              label={`Solicitudes (${totalRequests})`} 
              icon={<Badge badgeContent={totalRequests} color="error"><Pending /></Badge>} 
              iconPosition="start" 
            />
            <Tab 
              label="Roles" 
              icon={<BadgeIcon />} 
              iconPosition="start" 
            />
          </Tabs>
        </Box>

        {/* Tab Panel 0 - Usuarios */}
        <TabPanel value={tabValue} index={0}>
          {/* Filtros y búsqueda */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Rol"
              >
                <MenuItem value="all">Todos</MenuItem>
                {mockRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Estado"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
            >
              Limpiar
            </Button>
          </Box>

          {/* Tabla de usuarios */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell>Último Acceso</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: user.isOwner ? 'warning.main' : 'primary.main' }}>
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.firstName} />
                            ) : (
                              getInitials(user.firstName, user.lastName)
                            )}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {user.firstName} {user.lastName}
                              {user.isOwner && (
                                <Chip 
                                  label="Propietario" 
                                  size="small" 
                                  color="warning" 
                                  sx={{ ml: 1 }} 
                                />
                              )}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              @{user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Email fontSize="small" color="action" />
                            <Typography variant="body2">{user.email}</Typography>
                          </Box>
                          {user.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Phone fontSize="small" color="action" />
                              <Typography variant="body2">{user.phone}</Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getRoleIcon(user.role, user.isOwner)}
                          <Typography variant="body2" fontWeight={500}>
                            {user.role}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(user.status)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.lastLogin ? user.lastLogin : 'Nunca'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Unido: {user.joinDate}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Ver perfil">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {!user.isOwner && (
                            <>
                              <Tooltip title="Cambiar rol">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleChangeRole(user)}
                                >
                                  <BadgeIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={user.status === 'active' ? 'Desactivar' : 'Activar'}>
                                <IconButton 
                                  size="small"
                                  color={user.status === 'active' ? 'error' : 'success'}
                                  onClick={() => handleToggleUserStatus(user.id)}
                                >
                                  {user.status === 'active' ? <Block /> : <CheckCircle />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            labelRowsPerPage="Filas por página:"
          />
        </TabPanel>

        {/* Tab Panel 1 - Solicitudes */}
        <TabPanel value={tabValue} index={1}>
          {joinRequests.length > 0 ? (
            <List>
              {joinRequests.map((request, index) => (
                <React.Fragment key={request.id}>
                  <ListItem
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      mb: 2,
                      border: 1,
                      borderColor: 'divider'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getInitials(request.user.firstName, request.user.lastName)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {request.user.firstName} {request.user.lastName}
                          </Typography>
                          <Chip label="Solicitud pendiente" size="small" color="warning" />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <Email fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                            {request.user.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            <Schedule fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Solicitado: {request.requestDate}
                          </Typography>
                          {request.message && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                              "{request.message}"
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApproveRequest(request.id)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Block />}
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          Rechazar
                        </Button>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < joinRequests.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Group sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No hay solicitudes pendientes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Las nuevas solicitudes aparecerán aquí
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Tab Panel 2 - Roles */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {mockRoles.map((role) => {
              const roleUsers = users.filter(u => u.role === role);
              const roleColor = {
                'Admin': 'error',
                'Gerente': 'primary',
                'Mesero': 'info',
                'Cocinero': 'secondary',
                'Viewer': 'default'
              }[role] || 'default';

              return (
                <Grid item xs={12} sm={6} md={4} key={role}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: `${roleColor}.main`, mr: 2 }}>
                          {getRoleIcon(role, false)}
                        </Avatar>
                        <Typography variant="h6">{role}</Typography>
                      </Box>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Usuarios:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {roleUsers.length}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Activos:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {roleUsers.filter(u => u.status === 'active').length}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Últimos 7 días:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {roleUsers.filter(u => {
                              const lastLogin = new Date(u.lastLogin);
                              const sevenDaysAgo = new Date();
                              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                              return lastLogin > sevenDaysAgo;
                            }).length}
                          </Typography>
                        </Box>
                      </Stack>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        startIcon={<Settings />}
                      >
                        Configurar Permisos
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Modal Invitar Usuario */}
      <Dialog open={inviteModal} onClose={() => setInviteModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invitar Usuario</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                label="Rol"
              >
                {mockRoles.filter(role => role !== 'Admin').map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Mensaje de invitación (opcional)"
              multiline
              rows={3}
              value={inviteForm.message}
              onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
              placeholder="Añade un mensaje personalizado a la invitación..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteModal(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSendInvite} startIcon={<Send />}>
            Enviar Invitación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Editar Usuario */}
      <Dialog open={editUserModal} onClose={() => setEditUserModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={userForm.firstName}
                onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={userForm.lastName}
                onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo electrónico"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={userForm.status}
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                  label="Estado"
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                  <MenuItem value="pending">Pendiente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserModal(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveUser}>
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Cambiar Rol */}
      <Dialog open={roleModal} onClose={() => setRoleModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Cambiar Rol - {selectedUser?.firstName} {selectedUser?.lastName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Rol actual: {selectedUser?.role}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Nuevo Rol</InputLabel>
            <Select
              defaultValue={selectedUser?.role}
              onChange={(e) => handleUpdateRole(e.target.value)}
              label="Nuevo Rol"
            >
              {mockRoles.filter(role => role !== 'Admin' && role !== selectedUser?.role).map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleModal(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB para invitar usuario (móvil) */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={handleInviteUser}
      >
        <PersonAdd />
      </Fab>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminUsers;