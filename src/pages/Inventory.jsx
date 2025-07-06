// src/pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Grid, Card, CardContent,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Avatar, Fab, Alert, Snackbar, MenuItem,
  Select, FormControl, InputLabel, Tooltip, Badge, Stack,
  TablePagination, InputAdornment, Tabs, Tab, useTheme,
  CircularProgress, CardHeader, CardActions
} from '@mui/material';
import {
  Add, Edit, Delete, Search, FilterList, Inventory2,
  TrendingUp, TrendingDown, Warning, CheckCircle, Category,
  QrCode, AttachMoney, Archive, Visibility, MoreVert,
  Download, Upload, Analytics, ShoppingCart, LocalOffer,
  Store, Refresh, Save, Cancel
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import inventoryService from '../services/inventory.service';

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
  const { getUserBusiness, hasPermission, activeBusinessId } = useAuth();
  const theme = useTheme();
  const businessInfo = getUserBusiness();

  // Estados principales
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Estados para tabs
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para modales
  const [addProductModal, setAddProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [stockModal, setStockModal] = useState(false);
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Estados para formularios
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: '',
    price: '',
    stock: '',
    min_stock: '',
    cost: '',
    description: ''
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });
  
  const [stockForm, setStockForm] = useState({
    type: 'add', // 'add', 'remove', 'set'
    quantity: '',
    reason: ''
  });
  
  // Estados para mensajes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar productos, categorías y movimientos en paralelo
        const [productsData, categoriesData, movementsData] = await Promise.all([
          inventoryService.getProducts(),
          inventoryService.getCategories(),
          inventoryService.getStockMovements({ limit: 50 })
        ]);
        
        // Debug: Log loaded data
        console.log('DEBUG LOAD - Products loaded:', productsData);
        console.log('DEBUG LOAD - Categories loaded:', categoriesData);
        console.log('DEBUG LOAD - Products with categories and types:', productsData.map(p => ({ 
          id: p.id, 
          name: p.name, 
          category_id: p.category_id, 
          category_id_type: typeof p.category_id 
        })));
        console.log('DEBUG LOAD - Categories with types:', categoriesData.map(c => ({ 
          id: c.id, 
          name: c.name, 
          id_type: typeof c.id 
        })));
        
        setProducts(productsData);
        setCategories([{ id: '', name: 'Todas las categorías' }, ...categoriesData]);
        setStockMovements(movementsData);
        
      } catch (error) {
        console.error('Error loading inventory data:', error);
        setError('Error al cargar los datos del inventario');
      } finally {
        setLoading(false);
      }
    };

    if (businessInfo) {
      loadInventoryData();
    }
  }, [businessInfo]);

  // Filtrar productos
  useEffect(() => {
    let filtered = products;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría (normalizar tipos para comparación)
    if (selectedCategoryFilter && selectedCategoryFilter !== '') {
      filtered = filtered.filter(product => String(product.category_id || '') === String(selectedCategoryFilter));
    }

    // Filtro por estado de stock
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'low_stock':
          filtered = filtered.filter(product => product.stock <= (product.min_stock || 0));
          break;
        case 'out_of_stock':
          filtered = filtered.filter(product => product.stock === 0);
          break;
        case 'in_stock':
          filtered = filtered.filter(product => product.stock > (product.min_stock || 0));
          break;
        default:
          break;
      }
    }

    setFilteredProducts(filtered);
    setPage(0);
  }, [products, searchTerm, selectedCategoryFilter, statusFilter]);

  // Calcular estadísticas de categorías (memoizado para optimización)
  const categoriesWithStats = React.useMemo(() => {
    return categories.map(category => {
      let productCount = 0;
      
      // Para la categoría "Todas las categorías" (id vacío), contar todos los productos
      if (category.id === '' || category.id === null) {
        productCount = products.length;
      } else {
        // Normalizar IDs para comparación (convertir a string para comparación segura)
        const categoryIdStr = String(category.id);
        productCount = products.filter(product => {
          const productCategoryIdStr = String(product.category_id || '');
          return productCategoryIdStr === categoryIdStr;
        }).length;
      }

      // Debug logging para verificar el conteo
      console.log(`DEBUG CATEGORY COUNT - Category: ${category.name} (ID: ${category.id}), Products: ${productCount}`);

      return {
        ...category,
        productCount: productCount
      };
    });
  }, [categories, products]);

  // Funciones de utilidad
  const getStatusChip = (product) => {
    if (product.stock === 0) {
      return <Chip label="Sin stock" color="error" size="small" icon={<Warning />} />;
    } else if (product.stock <= (product.min_stock || 0)) {
      return <Chip label="Stock bajo" color="warning" size="small" icon={<TrendingDown />} />;
    } else {
      return <Chip label="En stock" color="success" size="small" icon={<CheckCircle />} />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getCategoryName = (categoryId) => {
    // Debug: Log category lookup (simplificado)
    console.log('DEBUG getCategoryName - categoryId:', categoryId, 'type:', typeof categoryId);
    
    // Intentar tanto comparación estricta como flexible para manejar diferencias de tipo
    const category = categories.find(cat => cat.id === categoryId || cat.id == categoryId);
    
    console.log('DEBUG getCategoryName - found category:', category);
    
    return category?.name || 'Sin categoría';
  };

  // Funciones de manejo de formularios
  const handleProductFormChange = (field, value) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      category_id: '',
      price: '',
      stock: '',
      min_stock: '',
      cost: '',
      description: ''
    });
  };

  const resetStockForm = () => {
    setStockForm({
      type: 'add',
      quantity: '',
      reason: ''
    });
  };

  // Funciones CRUD para productos
  const handleCreateProduct = async () => {
    try {
      // Debug: Log form values before processing
      console.log('DEBUG - productForm before processing:', productForm);
      console.log('DEBUG - productForm.category_id type:', typeof productForm.category_id);
      console.log('DEBUG - productForm.category_id value:', productForm.category_id);
      
      const productDataWithBusiness = {
        ...productForm,
        // Convertir category_id a integer solo si tiene valor, mantener null si está vacío
        category_id: productForm.category_id && productForm.category_id !== '' 
          ? parseInt(productForm.category_id) 
          : null,
        price: parseFloat(productForm.price) || 0,
        stock: parseInt(productForm.stock) || 0,
        min_stock: parseInt(productForm.min_stock) || 0,
        cost: parseFloat(productForm.cost) || 0,
        business: activeBusinessId || businessInfo?.id
      };

      // Debug: Log final data structure
      console.log('Creating product with data:', { 
        name: productDataWithBusiness.name, 
        category_id: productDataWithBusiness.category_id, 
        category_id_type: typeof productDataWithBusiness.category_id 
      });

      const newProduct = await inventoryService.createProduct(productDataWithBusiness);
      
      console.log('RESPONSE - Product created:', { 
        id: newProduct.id, 
        name: newProduct.name, 
        category_id: newProduct.category_id, 
        category_id_type: typeof newProduct.category_id 
      });

      setProducts(prev => [newProduct, ...prev]);
      setAddProductModal(false);
      resetProductForm();
      setSnackbar({ open: true, message: 'Producto creado exitosamente', severity: 'success' });
      
    } catch (error) {
      console.error('Error creating product:', error);
      console.error('Error response data:', error.response?.data);
      console.error('activeBusinessId:', activeBusinessId);
      console.error('Business info:', businessInfo);
      setSnackbar({ open: true, message: 'Error al crear el producto', severity: 'error' });
    }
  };

  const handleEditProduct = async () => {
    try {
      // Debug: Log form values before processing
      console.log('DEBUG EDIT - productForm before processing:', productForm);
      console.log('DEBUG EDIT - productForm.category_id type:', typeof productForm.category_id);
      console.log('DEBUG EDIT - productForm.category_id value:', productForm.category_id);
      
      const updateData = {
        ...productForm,
        // Convertir category_id a integer solo si tiene valor, mantener null si está vacío
        category_id: productForm.category_id && productForm.category_id !== '' 
          ? parseInt(productForm.category_id) 
          : null,
        price: parseFloat(productForm.price) || 0,
        stock: parseInt(productForm.stock) || 0,
        min_stock: parseInt(productForm.min_stock) || 0,
        cost: parseFloat(productForm.cost) || 0
      };

      // Debug: Log after processing
      console.log('DEBUG EDIT - updateData after processing:', updateData);
      console.log('DEBUG EDIT - category_id after parseInt:', updateData.category_id);

      // ENVIAR category_id siempre (incluso si es null) para que el backend lo maneje
      // NO eliminar category_id del objeto

      console.log('Updating product with data (FINAL):', updateData);

      const updatedProduct = await inventoryService.updateProduct(selectedProduct.id, updateData);
      
      console.log('RESPONSE EDIT - Product updated:', updatedProduct);
      console.log('RESPONSE EDIT - Updated product category_id:', updatedProduct.category_id);

      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
      setEditProductModal(false);
      setSelectedProduct(null);
      resetProductForm();
      setSnackbar({ open: true, message: 'Producto actualizado exitosamente', severity: 'success' });
      
    } catch (error) {
      console.error('Error updating product:', error);
      console.error('Error response data:', error.response?.data);
      setSnackbar({ open: true, message: 'Error al actualizar el producto', severity: 'error' });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await inventoryService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        setSnackbar({ open: true, message: 'Producto eliminado exitosamente', severity: 'success' });
        
      } catch (error) {
        console.error('Error deleting product:', error);
        setSnackbar({ open: true, message: 'Error al eliminar el producto', severity: 'error' });
      }
    }
  };

  // Funciones para movimientos de stock
  const handleStockMovement = async () => {
    try {
      const movement = {
        product: selectedProduct.id,
        movement_type: stockForm.type,
        quantity: parseInt(stockForm.quantity),
        reason: stockForm.reason,
        business: activeBusinessId || businessInfo?.id
      };

      console.log('Creating stock movement with business context:', movement);

      await inventoryService.createStockMovement(movement);

      // Actualizar el stock del producto localmente
      let newStock = selectedProduct.stock;
      switch (stockForm.type) {
        case 'add':
          newStock += parseInt(stockForm.quantity);
          break;
        case 'remove':
          newStock -= parseInt(stockForm.quantity);
          break;
        case 'set':
          newStock = parseInt(stockForm.quantity);
          break;
        default:
          break;
      }

      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id ? { ...p, stock: Math.max(0, newStock) } : p
      ));

      setStockModal(false);
      setSelectedProduct(null);
      resetStockForm();
      setSnackbar({ open: true, message: 'Movimiento de stock registrado exitosamente', severity: 'success' });
      
    } catch (error) {
      console.error('Error creating stock movement:', error);
      setSnackbar({ open: true, message: 'Error al registrar el movimiento de stock', severity: 'error' });
    }
  };

  // Funciones para categorías
  const handleCreateCategory = async () => {
    try {
      // Debug: verificar tanto businessInfo como activeBusinessId
      console.log('DEBUG - businessInfo completo:', businessInfo);
      console.log('DEBUG - activeBusinessId:', activeBusinessId);
      
      // Usar activeBusinessId como fuente principal
      const businessId = activeBusinessId || businessInfo?.id;
      
      if (!businessId) {
        console.error('PROBLEMA: No se pudo obtener el business ID');
        console.error('activeBusinessId:', activeBusinessId);
        console.error('businessInfo:', businessInfo);
        setSnackbar({ 
          open: true, 
          message: 'Error: No se pudo identificar el negocio. Intenta refrescar la página.', 
          severity: 'error' 
        });
        return;
      }
      
      const categoryDataWithBusiness = {
        ...categoryForm,
        business: businessId
      };
      
      console.log('Creating category with business context:', categoryDataWithBusiness);
      
      const newCategory = await inventoryService.createCategory(categoryDataWithBusiness);
      setCategories(prev => [...prev, newCategory]);
      setAddCategoryModal(false);
      setCategoryForm({ name: '', description: '' });
      setSnackbar({ open: true, message: 'Categoría creada exitosamente', severity: 'success' });
      
    } catch (error) {
      console.error('Error creating category:', error);
      console.error('activeBusinessId:', activeBusinessId);
      console.error('Business info:', businessInfo);
      setSnackbar({ open: true, message: 'Error al crear la categoría', severity: 'error' });
    }
  };

  const handleEditCategory = async () => {
    try {
      const updatedCategory = await inventoryService.updateCategory(selectedCategory.id, categoryForm);
      setCategories(prev => prev.map(cat => cat.id === selectedCategory.id ? updatedCategory : cat));
      setEditCategoryModal(false);
      setSelectedCategory(null);
      setCategoryForm({ name: '', description: '' });
      setSnackbar({ open: true, message: 'Categoría actualizada exitosamente', severity: 'success' });
    } catch (error) {
      console.error('Error updating category:', error);
      setSnackbar({ open: true, message: 'Error al actualizar la categoría', severity: 'error' });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    // Verificar si hay productos usando esta categoría (normalizar tipos para comparación)
    const productsUsingCategory = products.filter(p => String(p.category_id || '') === String(categoryId));
    
    if (productsUsingCategory.length > 0) {
      setSnackbar({ 
        open: true, 
        message: `No se puede eliminar la categoría porque tiene ${productsUsingCategory.length} producto(s) asociado(s)`, 
        severity: 'warning' 
      });
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await inventoryService.deleteCategory(categoryId);
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        setSnackbar({ open: true, message: 'Categoría eliminada exitosamente', severity: 'success' });
      } catch (error) {
        console.error('Error deleting category:', error);
        setSnackbar({ open: true, message: 'Error al eliminar la categoría', severity: 'error' });
      }
    }
  };

  // Funciones de UI
  const openEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name || '',
      category_id: product.category_id || '',
      price: product.price || '',
      stock: product.stock || '',
      min_stock: product.min_stock || '',
      cost: product.cost || '',
      description: product.description || ''
    });
    setEditProductModal(true);
  };

  const openEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name || '',
      description: category.description || ''
    });
    setEditCategoryModal(true);
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setStockModal(true);
  };

  // Verificar permisos
  const canViewInventory = hasPermission('can_view_inventory') || businessInfo?.is_owner;
  const canManageInventory = hasPermission('can_manage_inventory') || businessInfo?.is_owner;

  if (!canViewInventory) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          No tienes permisos para acceder al inventario
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={50} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Cargando inventario...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              📦 Inventario
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Gestiona productos, categorías y movimientos de stock
            </Typography>
          </Box>
          
          {canManageInventory && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Category />}
                onClick={() => setAddCategoryModal(true)}
              >
                Nueva Categoría
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddProductModal(true)}
              >
                Nuevo Producto
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Inventory2 />} label="Productos" />
          {/* <Tab icon={<Analytics />} label="Movimientos" /> */}
          <Tab icon={<Category />} label="Categorías" />
        </Tabs>

        {/* Tab Panel: Productos */}
        <TabPanel value={tabValue} index={0}>
          {/* Filtros */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Buscar productos..."
              variant="outlined"
              size="small"
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
            
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                label="Categoría"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
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
                <MenuItem value="in_stock">En stock</MenuItem>
                <MenuItem value="low_stock">Stock bajo</MenuItem>
                <MenuItem value="out_of_stock">Sin stock</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Lista de productos */}
          {filteredProducts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No se encontraron productos
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {products.length === 0 
                  ? 'Agrega tu primer producto para comenzar'
                  : 'Intenta ajustar los filtros de búsqueda'
                }
              </Typography>
            </Paper>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell align="right">Precio</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell align="center">Estado</TableCell>
                      {canManageInventory && <TableCell align="center">Acciones</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((product) => (
                        <TableRow key={product.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={product.image}
                                sx={{ mr: 2, bgcolor: theme.palette.primary.light }}
                              >
                                <Inventory2 />
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {product.name}
                                </Typography>
                                {product.description && (
                                  <Typography variant="body2" color="textSecondary">
                                    {product.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{getCategoryName(product.category_id)}</TableCell>
                          <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <Typography variant="body2">
                                {product.stock}
                              </Typography>
                              {product.min_stock && (
                                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                                  / {product.min_stock}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {getStatusChip(product)}
                          </TableCell>
                          {canManageInventory && (
                            <TableCell align="center">
                              <Tooltip title="Ajustar stock">
                                <IconButton
                                  size="small"
                                  onClick={() => openStockModal(product)}
                                  color="primary"
                                >
                                  <TrendingUp />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditProduct(product)}
                                  color="default"
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={filteredProducts.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                }
              />
            </>
          )}
        </TabPanel>

        {/* Tab Panel: Movimientos de Stock - Comentado para futuras implementaciones */}
        {/*
        <TabPanel value={tabValue} index={1}>
          {stockMovements.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No hay movimientos de stock registrados
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell>Motivo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.created_at || movement.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {movement.product_name || movement.product?.name || `Producto #${movement.product}`}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={movement.movement_type || movement.type}
                          size="small"
                          color={movement.movement_type === 'add' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right">{movement.quantity}</TableCell>
                      <TableCell>{movement.reason || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
        */}

        {/* Tab Panel: Categorías */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            {categoriesWithStats.filter(cat => cat.id !== '').map((category) => (
              <Grid xs={12} sm={6} md={4} key={category.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {category.name}
                    </Typography>
                    {category.description && (
                      <Typography variant="body2" color="textSecondary">
                        {category.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      {category.productCount} productos
                    </Typography>
                  </CardContent>
                  {canManageInventory && (
                    <CardActions>
                      <Tooltip title="Editar categoría">
                        <IconButton
                          size="small"
                          onClick={() => openEditCategory(category)}
                          color="default"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar categoría">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteCategory(category.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Modal: Agregar Producto */}
      <Dialog open={addProductModal} onClose={() => setAddProductModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre del producto"
                value={productForm.name}
                onChange={(e) => handleProductFormChange('name', e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={productForm.category_id}
                  onChange={(e) => handleProductFormChange('category_id', e.target.value)}
                  label="Categoría"
                >
                  {categories.filter(cat => cat.id !== '').map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={productForm.price}
                onChange={(e) => handleProductFormChange('price', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stock inicial"
                type="number"
                value={productForm.stock}
                onChange={(e) => handleProductFormChange('stock', e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stock mínimo"
                type="number"
                value={productForm.min_stock}
                onChange={(e) => handleProductFormChange('min_stock', e.target.value)}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={productForm.description}
                onChange={(e) => handleProductFormChange('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddProductModal(false)}>Cancelar</Button>
          <Button onClick={handleCreateProduct} variant="contained">
            Crear Producto
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Editar Producto */}
      <Dialog open={editProductModal} onClose={() => setEditProductModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre del producto"
                value={productForm.name}
                onChange={(e) => handleProductFormChange('name', e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={productForm.category_id}
                  onChange={(e) => handleProductFormChange('category_id', e.target.value)}
                  label="Categoría"
                >
                  {categories.filter(cat => cat.id !== '').map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={productForm.price}
                onChange={(e) => handleProductFormChange('price', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stock actual"
                type="number"
                value={productForm.stock}
                onChange={(e) => handleProductFormChange('stock', e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stock mínimo"
                type="number"
                value={productForm.min_stock}
                onChange={(e) => handleProductFormChange('min_stock', e.target.value)}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={productForm.description}
                onChange={(e) => handleProductFormChange('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProductModal(false)}>Cancelar</Button>
          <Button onClick={handleEditProduct} variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Movimiento de Stock */}
      <Dialog open={stockModal} onClose={() => setStockModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Ajustar Stock - {selectedProduct?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Stock actual: {selectedProduct?.stock}
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Tipo de movimiento</InputLabel>
              <Select
                value={stockForm.type}
                onChange={(e) => setStockForm(prev => ({ ...prev, type: e.target.value }))}
                label="Tipo de movimiento"
              >
                <MenuItem value="add">Agregar stock</MenuItem>
                <MenuItem value="remove">Quitar stock</MenuItem>
                <MenuItem value="set">Establecer stock</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Cantidad"
              type="number"
              value={stockForm.quantity}
              onChange={(e) => setStockForm(prev => ({ ...prev, quantity: e.target.value }))}
              sx={{ mb: 3 }}
              inputProps={{ min: 0 }}
            />

            <TextField
              fullWidth
              label="Motivo"
              multiline
              rows={2}
              value={stockForm.reason}
              onChange={(e) => setStockForm(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Describe el motivo del ajuste de stock"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStockModal(false)}>Cancelar</Button>
          <Button 
            onClick={handleStockMovement} 
            variant="contained"
            disabled={!stockForm.quantity || !stockForm.reason}
          >
            Registrar Movimiento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Agregar Categoría */}
      <Dialog open={addCategoryModal} onClose={() => setAddCategoryModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nueva Categoría</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre de la categoría"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mt: 2, mb: 3 }}
          />
          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={3}
            value={categoryForm.description}
            onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCategoryModal(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreateCategory} 
            variant="contained"
            disabled={!categoryForm.name}
          >
            Crear Categoría
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Editar Categoría */}
      <Dialog open={editCategoryModal} onClose={() => setEditCategoryModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Categoría</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre de la categoría"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mt: 2, mb: 3 }}
          />
          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={3}
            value={categoryForm.description}
            onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCategoryModal(false)}>Cancelar</Button>
          <Button 
            onClick={handleEditCategory} 
            variant="contained"
            disabled={!categoryForm.name}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Inventory;