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
  Switch, FormControlLabel, Divider, CircularProgress
} from '@mui/material';
import {
  Add, Edit, Delete, Search, FilterList, People, PersonAdd,
  Block, CheckCircle, Warning, Email, Phone, Business,
  Badge as BadgeIcon, SupervisorAccount, Group, Pending,
  Visibility, MoreVert, Send, PersonOff, Key, Settings,
  History, Schedule, Verified, Star, ManageAccounts
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import businessService from '../services/business.service';
import rolesService from '../services/roles.service';

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
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
    role_id: '',
    message: ''
  });
  
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role_id: '',
    status: 'active'
  });
  
  // Estados para mensajes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Cargar datos iniciales
  useEffect(() => {
    const loadUsersData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar usuarios, solicitudes y roles del negocio en paralelo
        const [businessUsers, requests, businessRoles] = await Promise.all([
          businessService.getBusinessUsers(),
          businessService.getJoinRequests(),
          rolesService.getRoles()
        ]);
        
        // Procesar usuarios para formatearlos correctamente
        const processedUsers = businessUsers.map(user => ({
          ...user,
          firstName: user.first_name || user.firstName || '',
          lastName: user.last_name || user.lastName || '',
          isOwner: user.is_owner || user.isOwner || false,
          lastLogin: user.last_login || user.lastLogin,
          joinDate: user.date_joined || user.joinDate,
          role: user.role?.name || user.role_name || 'Sin rol',
          roleId: user.role?.id || user.role_id,
          status: user.is_active ? 'active' : 'inactive'
        }));
        
        setUsers(processedUsers);
        setJoinRequests(requests || []);
        setRoles(businessRoles || []);
        
      } catch (error) {
        console.error('Error loading users data:', error);
        setError('Error al cargar los datos de usuarios');
      } finally {
        setLoading(false);
      }
    };

    if (businessInfo) {
      loadUsersData();
    }
  }, [businessInfo]);

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
      filtered = filtered.filter(user => user.roleId === roleFilter);
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
    
    const roleName = role?.toLowerCase() || '';
    
    if (roleName.includes('admin') || roleName.includes('propietario')) {
      return <SupervisorAccount color="error" />;
    } else if (roleName.includes('gerente') || roleName.includes('manager')) {
      return <ManageAccounts color="primary" />;
    } else if (roleName.includes('mesero') || roleName.includes('waiter')) {
      return <People color="info" />;
    } else if (roleName.includes('cocinero') || roleName.includes('chef')) {
      return <BadgeIcon color="secondary" />;
    } else if (roleName.includes('viewer') || roleName.includes('observador')) {
      return <Visibility color="action" />;
    }
    
    return <BadgeIcon color="action" />;
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
      role_id: roles.length > 0 ? roles[0].id : '',
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
      role_id: user.roleId,
      status: user.status
    });
    setEditUserModal(true);
  };

  const handleChangeRole = (user) => {
    setSelectedUser(user);
    setRoleModal(true);
  };

  const handleSendInvite = async () => {
    try {
      console.log('Enviando invitación:', inviteForm);
      await businessService.inviteUser({
        email: inviteForm.email,
        role_id: inviteForm.role_id,
        message: inviteForm.message
      });
      
      setSnackbar({ open: true, message: 'Invitación enviada exitosamente', severity: 'success' });
      setInviteModal(false);
      setInviteForm({ email: '', role_id: '', message: '' });
      
    } catch (error) {
      console.error('Error al enviar invitación:', error);
      setSnackbar({ open: true, message: 'Error al enviar la invitación', severity: 'error' });
    }
  };

  const handleSaveUser = async () => {
    try {
      console.log('Actualizando usuario:', selectedUser.id, userForm);
      const updatedUser = await businessService.updateBusinessUser(selectedUser.id, {
        first_name: userForm.firstName,
        last_name: userForm.lastName,
        email: userForm.email,
        phone: userForm.phone,
        is_active: userForm.status === 'active'
      });
      
      // Actualizar la lista local
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id 
          ? { ...u, ...updatedUser, 
              firstName: updatedUser.first_name, 
              lastName: updatedUser.last_name,
              status: updatedUser.is_active ? 'active' : 'inactive'
            }
          : u
      ));
      
      setSnackbar({ open: true, message: 'Usuario actualizado exitosamente', severity: 'success' });
      setEditUserModal(false);
      
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setSnackbar({ open: true, message: 'Error al actualizar el usuario', severity: 'error' });
    }
  };

  const handleUpdateRole = async (newRoleId) => {
    try {
      console.log('Actualizando rol:', selectedUser.id, newRoleId);
      await rolesService.assignRole({
        user_id: selectedUser.id,
        role_id: newRoleId
      });
      
      // Actualizar la lista local
      const newRole = roles.find(r => r.id === newRoleId);
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id 
          ? { ...u, role: newRole?.name || 'Sin rol', roleId: newRoleId }
          : u
      ));
      
      setSnackbar({ open: true, message: 'Rol actualizado exitosamente', severity: 'success' });
      setRoleModal(false);
      
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      setSnackbar({ open: true, message: 'Error al actualizar el rol', severity: 'error' });
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      console.log('Aprobando solicitud:', requestId);
      await businessService.approveJoinRequest(requestId);
      
      // Remover la solicitud de la lista
      setJoinRequests(prev => prev.filter(req => req.id !== requestId));
      
      // Recargar usuarios para incluir el nuevo miembro
      const businessUsers = await businessService.getBusinessUsers();
      const processedUsers = businessUsers.map(user => ({
        ...user,
        firstName: user.first_name || user.firstName || '',
        lastName: user.last_name || user.lastName || '',
        isOwner: user.is_owner || user.isOwner || false,
        lastLogin: user.last_login || user.lastLogin,
        joinDate: user.date_joined || user.joinDate,
        role: user.role?.name || user.role_name || 'Sin rol',
        roleId: user.role?.id || user.role_id,
        status: user.is_active ? 'active' : 'inactive'
      }));
      setUsers(processedUsers);
      
      setSnackbar({ open: true, message: 'Solicitud aprobada exitosamente', severity: 'success' });
      
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      setSnackbar({ open: true, message: 'Error al aprobar la solicitud', severity: 'error' });
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      console.log('Rechazando solicitud:', requestId);
      await businessService.rejectJoinRequest(requestId);
      
      // Remover la solicitud de la lista
      setJoinRequests(prev => prev.filter(req => req.id !== requestId));
      
      setSnackbar({ open: true, message: 'Solicitud rechazada', severity: 'info' });
      
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      setSnackbar({ open: true, message: 'Error al procesar la solicitud', severity: 'error' });
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      const newStatus = user.status === 'active' ? false : true;
      
      console.log('Cambiando estado del usuario:', userId, newStatus);
      await businessService.updateBusinessUser(userId, {
        is_active: newStatus
      });
      
      // Actualizar la lista local
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, status: newStatus ? 'active' : 'inactive' }
          : u
      ));
      
      setSnackbar({ 
        open: true, 
        message: `Usuario ${newStatus ? 'activado' : 'desactivado'} exitosamente`, 
        severity: 'info' 
      });
      
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      setSnackbar({ open: true, message: 'Error al cambiar el estado del usuario', severity: 'error' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario del negocio?')) {
      try {
        console.log('Eliminando usuario:', userId);
        await businessService.removeUserFromBusiness(userId);
        
        // Remover de la lista local
        setUsers(prev => prev.filter(u => u.id !== userId));
        
        setSnackbar({ open: true, message: 'Usuario eliminado exitosamente', severity: 'warning' });
        
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setSnackbar({ open: true, message: 'Error al eliminar el usuario', severity: 'error' });
      }
    }
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
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
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
            {roles.map((role) => {
              const roleUsers = users.filter(u => u.roleId === role.id);
              const roleName = role.name?.toLowerCase() || '';
              
              // Determinar color basado en el nombre del rol
              let roleColor = 'default';
              if (roleName.includes('admin') || roleName.includes('propietario')) {
                roleColor = 'error';
              } else if (roleName.includes('gerente') || roleName.includes('manager')) {
                roleColor = 'primary';
              } else if (roleName.includes('mesero') || roleName.includes('waiter')) {
                roleColor = 'info';
              } else if (roleName.includes('cocinero') || roleName.includes('chef')) {
                roleColor = 'secondary';
              }

              return (
                <Grid item xs={12} sm={6} md={4} key={role.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: `${roleColor}.main`, mr: 2 }}>
                          {getRoleIcon(role.name, false)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{role.name}</Typography>
                          {role.description && (
                            <Typography variant="caption" color="textSecondary">
                              {role.description}
                            </Typography>
                          )}
                        </Box>
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
                              if (!u.lastLogin) return false;
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
                        onClick={() => {
                          // TODO: Implementar configuración de permisos
                          setSnackbar({ 
                            open: true, 
                            message: 'Configuración de permisos en desarrollo', 
                            severity: 'info' 
                          });
                        }}
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
                value={inviteForm.role_id}
                onChange={(e) => setInviteForm({ ...inviteForm, role_id: e.target.value })}
                label="Rol"
              >
                {roles.filter(role => !role.name?.toLowerCase().includes('admin')).map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
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
              defaultValue={selectedUser?.roleId}
              onChange={(e) => handleUpdateRole(e.target.value)}
              label="Nuevo Rol"
            >
              {roles.filter(role => 
                !role.name?.toLowerCase().includes('admin') && 
                role.id !== selectedUser?.roleId
              ).map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
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