// src/pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Grid, Card, CardContent,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Avatar, Fab, Alert, Snackbar, MenuItem,
  Select, FormControl, InputLabel, Tooltip, Badge, Stack,
  TablePagination, InputAdornment, Tabs, Tab, useTheme, alpha
} from '@mui/material';
import {
  Add, Edit, Delete, Search, FilterList, Inventory2,
  TrendingUp, TrendingDown, Warning, CheckCircle, Category,
  QrCode, AttachMoney, Archive, Visibility, MoreVert,
  Download, Upload, Analytics, ShoppingCart, LocalOffer,
  Store, Refresh, Save, Cancel
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Datos mock para desarrollo
const mockProducts = [
  {
    id: 1,
    name: 'Hamburguesa Clásica',
    category: 'Principales',
    price: 12.99,
    stock: 45,
    minStock: 10,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop',
    status: 'active',
    lastUpdate: '2024-01-15',
    cost: 8.50
  },
  {
    id: 2,
    name: 'Pizza Margherita',
    category: 'Principales',
    price: 15.99,
    stock: 3,
    minStock: 5,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
    status: 'low_stock',
    lastUpdate: '2024-01-14',
    cost: 10.00
  },
  {
    id: 3,
    name: 'Ensalada César',
    category: 'Ensaladas',
    price: 9.99,
    stock: 0,
    minStock: 8,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&h=100&fit=crop',
    status: 'out_of_stock',
    lastUpdate: '2024-01-13',
    cost: 6.00
  },
  {
    id: 4,
    name: 'Pasta Carbonara',
    category: 'Principales',
    price: 13.99,
    stock: 25,
    minStock: 10,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=100&h=100&fit=crop',
    status: 'active',
    lastUpdate: '2024-01-15',
    cost: 9.00
  },
  {
    id: 5,
    name: 'Bebida Cola',
    category: 'Bebidas',
    price: 2.99,
    stock: 120,
    minStock: 50,
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=100&h=100&fit=crop',
    status: 'active',
    lastUpdate: '2024-01-15',
    cost: 1.50
  }
];

const mockCategories = ['Todas', 'Principales', 'Ensaladas', 'Bebidas', 'Postres', 'Entrantes'];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Inventory = () => {
  const { getUserBusiness, hasPermission } = useAuth();
  const theme = useTheme();
  const businessInfo = getUserBusiness();

  // Estados principales
  const [products] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [categories] = useState(mockCategories);
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para modales
  const [addProductModal, setAddProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [stockModal, setStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Estados para formularios
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    minStock: '',
    cost: '',
    description: ''
  });
  
  const [stockForm, setStockForm] = useState({
    type: 'add', // 'add', 'remove', 'set'
    quantity: '',
    reason: ''
  });
  
  // Estados para mensajes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Filtrar productos
  useEffect(() => {
    let filtered = products;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
    setPage(0); // Reset page when filters change
  }, [products, searchTerm, selectedCategory, statusFilter]);

  // Funciones de utilidad
  const getStatusChip = (product) => {
    if (product.stock === 0) {
      return <Chip label="Sin stock" color="error" size="small" />;
    }
    if (product.stock <= product.minStock) {
      return <Chip label="Stock bajo" color="warning" size="small" />;
    }
    return <Chip label="Disponible" color="success" size="small" />;
  };

  const getStockIcon = (product) => {
    if (product.stock === 0) {
      return <Warning color="error" />;
    }
    if (product.stock <= product.minStock) {
      return <TrendingDown color="warning" />;
    }
    return <CheckCircle color="success" />;
  };

  // Cálculos para estadísticas
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // Manejadores de eventos
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddProduct = () => {
    setProductForm({
      name: '',
      category: '',
      price: '',
      stock: '',
      minStock: '',
      cost: '',
      description: ''
    });
    setAddProductModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      cost: product.cost.toString(),
      description: product.description || ''
    });
    setEditProductModal(true);
  };

  const handleStockAdjustment = (product) => {
    setSelectedProduct(product);
    setStockForm({
      type: 'add',
      quantity: '',
      reason: ''
    });
    setStockModal(true);
  };

  const handleSaveProduct = () => {
    // Aquí conectaremos con el backend
    console.log('Guardando producto:', productForm);
    setSnackbar({ open: true, message: 'Producto guardado exitosamente', severity: 'success' });
    setAddProductModal(false);
    setEditProductModal(false);
  };

  const handleStockUpdate = () => {
    // Aquí conectaremos con el backend
    console.log('Actualizando stock:', stockForm, selectedProduct);
    setSnackbar({ open: true, message: 'Stock actualizado exitosamente', severity: 'success' });
    setStockModal(false);
  };

  const handleDeleteProduct = (productId) => {
    // Aquí conectaremos con el backend
    console.log('Eliminando producto:', productId);
    setSnackbar({ open: true, message: 'Producto eliminado', severity: 'info' });
  };

  // Verificar permisos
  const canManageInventory = hasPermission('can_manage_inventory') || businessInfo?.is_owner;
  const canViewInventory = hasPermission('can_view_inventory') || canManageInventory;

  if (!canViewInventory) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          No tienes permisos para acceder al inventario
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
              Inventario
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona los productos de {businessInfo?.name || 'tu negocio'}
            </Typography>
          </Box>
          {canManageInventory && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                size="small"
              >
                Exportar
              </Button>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                size="small"
              >
                Importar
              </Button>
            </Box>
          )}
        </Box>

        {/* Estadísticas rápidas */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                  <Inventory2 />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {totalProducts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Productos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                  <TrendingDown />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {lowStockProducts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock Bajo
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 2 }}>
                  <Warning />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {outOfStockProducts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sin Stock
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  ${totalValue.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Valor Total
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
            <Tab label="Productos" icon={<Inventory2 />} iconPosition="start" />
            <Tab label="Categorías" icon={<Category />} iconPosition="start" />
            <Tab label="Análisis" icon={<Analytics />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Panel 0 - Productos */}
        <TabPanel value={tabValue} index={0}>
          {/* Filtros y búsqueda */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Buscar productos..."
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

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Categoría"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Estado"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Disponible</MenuItem>
                <MenuItem value="low_stock">Stock Bajo</MenuItem>
                <MenuItem value="out_of_stock">Sin Stock</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
                setStatusFilter('all');
              }}
            >
              Limpiar
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            {canManageInventory && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddProduct}
              >
                Nuevo Producto
              </Button>
            )}
          </Box>

          {/* Tabla de productos */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="center">Stock</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={product.image}
                            sx={{ width: 40, height: 40 }}
                          >
                            <Inventory2 />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {product.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Actualizado: {product.lastUpdate}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={product.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" fontWeight={600}>
                          ${product.price}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          {getStockIcon(product)}
                          <Typography variant="body2" fontWeight={600}>
                            {product.stock}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(product)}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Ver detalles">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {canManageInventory && (
                            <>
                              <Tooltip title="Ajustar stock">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleStockAdjustment(product)}
                                >
                                  <TrendingUp />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteProduct(product.id)}
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
            count={filteredProducts.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            labelRowsPerPage="Filas por página:"
          />
        </TabPanel>

        {/* Tab Panel 1 - Categorías */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {categories.filter(cat => cat !== 'Todas').map((category) => {
              const categoryProducts = products.filter(p => p.category === category);
              const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                          <Category />
                        </Avatar>
                        <Typography variant="h6">{category}</Typography>
                      </Box>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Productos:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {categoryProducts.length}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Valor:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            ${categoryValue.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Stock total:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {categoryProducts.reduce((sum, p) => sum + p.stock, 0)}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        {/* Tab Panel 2 - Análisis */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Productos más Vendidos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Análisis en desarrollo - Se conectará con datos de ventas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tendencias de Stock
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gráfico de movimientos de inventario
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Modal Agregar/Editar Producto */}
      <Dialog 
        open={addProductModal || editProductModal} 
        onClose={() => {
          setAddProductModal(false);
          setEditProductModal(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {addProductModal ? 'Agregar Producto' : 'Editar Producto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del producto"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  label="Categoría"
                >
                  {categories.filter(cat => cat !== 'Todas').map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock inicial"
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock mínimo"
                type="number"
                value={productForm.minStock}
                onChange={(e) => setProductForm({ ...productForm, minStock: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAddProductModal(false);
            setEditProductModal(false);
          }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveProduct}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Ajustar Stock */}
      <Dialog open={stockModal} onClose={() => setStockModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Ajustar Stock - {selectedProduct?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Stock actual: {selectedProduct?.stock} unidades
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de movimiento</InputLabel>
              <Select
                value={stockForm.type}
                onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })}
                label="Tipo de movimiento"
              >
                <MenuItem value="add">Agregar stock</MenuItem>
                <MenuItem value="remove">Retirar stock</MenuItem>
                <MenuItem value="set">Establecer stock</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Cantidad"
              type="number"
              value={stockForm.quantity}
              onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Motivo"
              multiline
              rows={2}
              value={stockForm.reason}
              onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
              placeholder="Ej: Inventario físico, venta, merma..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStockModal(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleStockUpdate}>
            Actualizar Stock
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB para agregar producto (móvil) */}
      {canManageInventory && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' }
          }}
          onClick={handleAddProduct}
        >
          <Add />
        </Fab>
      )}

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

export default Inventory;