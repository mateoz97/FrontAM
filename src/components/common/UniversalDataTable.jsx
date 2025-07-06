// src/components/common/UniversalDataTable.jsx
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Checkbox,
  Button,
  Skeleton,
  useTheme,
  alpha,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  ViewColumn as ViewColumnIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const UniversalDataTable = ({
  title,
  subtitle,
  columns = [],
  data = [],
  loading = false,
  totalCount,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  orderBy,
  order = 'asc',
  searchable = true,
  filterable = true,
  selectable = false,
  exportable = false,
  refreshable = true,
  onRefresh,
  onExport,
  onRowClick,
  onRowAction,
  dense = false,
  stickyHeader = false,
  maxHeight,
  emptyMessage = 'No hay datos disponibles',
  emptySubtitle = 'Los datos aparecerán aquí cuando estén disponibles',
  rowsPerPageOptions = [5, 10, 25, 50],
  searchPlaceholder = 'Buscar...',
  actions = [],
  bulkActions = [],
  customFilters = [],
  colorScheme = 'primary',
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [columnAnchor, setColumnAnchor] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const [filters, setFilters] = useState({});

  const colorValue = theme.palette[colorScheme]?.main || theme.palette.primary.main;

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm && searchable) {
      filtered = filtered.filter(row =>
        columns.some(column => {
          const value = row[column.id];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply custom filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(row => row[key] === value);
      }
    });

    return filtered;
  }, [data, searchTerm, filters, columns, searchable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, orderBy, order]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    if (onSort) {
      onSort(columnId, isAsc ? 'desc' : 'asc');
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (rowId) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleColumnToggle = (columnId) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const renderCellContent = (row, column) => {
    const value = row[column.id];

    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'avatar':
        return (
          <Avatar sx={{ width: 32, height: 32 }}>
            {value?.src ? <img src={value.src} alt="" /> : value?.text?.charAt(0)}
          </Avatar>
        );
      
      case 'chip':
        const chipConfig = column.chipConfig?.(value) || {};
        return (
          <Chip
            label={chipConfig.label || value}
            color={chipConfig.color || 'default'}
            variant={chipConfig.variant || 'filled'}
            size="small"
            {...chipConfig.props}
          />
        );
      
      case 'status':
        const statusConfig = {
          active: { color: 'success', icon: <CheckCircleIcon /> },
          inactive: { color: 'error', icon: <CancelIcon /> },
          pending: { color: 'warning', icon: <ScheduleIcon /> },
          error: { color: 'error', icon: <ErrorIcon /> },
        };
        const status = statusConfig[value] || { color: 'default' };
        return (
          <Chip
            label={value}
            color={status.color}
            icon={status.icon}
            size="small"
            variant="outlined"
          />
        );
      
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      
      case 'currency':
        return typeof value === 'number' ? `$${value.toLocaleString()}` : value;
      
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      
      case 'datetime':
        return value ? new Date(value).toLocaleString() : '-';
      
      default:
        return value || '-';
    }
  };

  const LoadingSkeleton = () => (
    <>
      {Array.from(new Array(rowsPerPage)).map((_, index) => (
        <TableRow key={index}>
          {selectable && (
            <TableCell padding="checkbox">
              <Skeleton variant="rectangular" width={18} height={18} />
            </TableCell>
          )}
          {columns
            .filter(col => visibleColumns[col.id])
            .map(column => (
              <TableCell key={column.id}>
                <Skeleton variant="text" />
              </TableCell>
            ))}
          {actions.length > 0 && (
            <TableCell>
              <Skeleton variant="rectangular" width={24} height={24} />
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );

  const EmptyState = () => (
    <TableRow>
      <TableCell 
        colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
        sx={{ textAlign: 'center', py: 8 }}
      >
        <Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {emptyMessage}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {emptySubtitle}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
              {totalCount !== undefined && (
                <Chip
                  label={totalCount.toLocaleString()}
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {refreshable && onRefresh && (
              <IconButton onClick={onRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            )}
            
            {exportable && onExport && (
              <IconButton onClick={onExport}>
                <DownloadIcon />
              </IconButton>
            )}
            
            {filterable && (
              <IconButton onClick={(e) => setFilterAnchor(e.currentTarget)}>
                <Badge badgeContent={Object.keys(filters).length} color="primary">
                  <FilterIcon />
                </Badge>
              </IconButton>
            )}
            
            <IconButton onClick={(e) => setColumnAnchor(e.currentTarget)}>
              <ViewColumnIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Search and Bulk Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {searchable && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 300 }}
            />
          )}
          
          {selectable && selectedRows.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {selectedRows.length} seleccionado(s)
              </Typography>
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  startIcon={action.icon}
                  onClick={() => action.onClick(selectedRows)}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight }}>
        <Table stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < filteredData.length}
                    checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              
              {columns
                .filter(col => visibleColumns[col.id])
                .map(column => (
                  <TableCell
                    key={column.id}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{ fontWeight: 600 }}
                  >
                    {column.sortable !== false ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              
              {actions.length > 0 && (
                <TableCell sx={{ width: 50 }}>Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {loading ? (
              <LoadingSkeleton />
            ) : sortedData.length === 0 ? (
              <EmptyState />
            ) : (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    hover={!!onRowClick}
                    selected={selectedRows.includes(row.id)}
                    onClick={() => onRowClick?.(row)}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    
                    {columns
                      .filter(col => visibleColumns[col.id])
                      .map(column => (
                        <TableCell key={column.id}>
                          {renderCellContent(row, column)}
                        </TableCell>
                      ))}
                    
                    {actions.length > 0 && (
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowAction?.(row, actions);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalCount !== undefined ? totalCount : filteredData.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
        PaperProps={{ sx: { minWidth: 250 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Filtros
          </Typography>
          {/* Custom filters would go here */}
          <MenuItem onClick={() => setFilters({})}>
            Limpiar filtros
          </MenuItem>
        </Box>
      </Menu>

      {/* Column Visibility Menu */}
      <Menu
        anchorEl={columnAnchor}
        open={Boolean(columnAnchor)}
        onClose={() => setColumnAnchor(null)}
        PaperProps={{ sx: { minWidth: 200 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Columnas
          </Typography>
          {columns.map(column => (
            <MenuItem key={column.id} onClick={() => handleColumnToggle(column.id)}>
              <Checkbox
                checked={visibleColumns[column.id]}
                size="small"
                sx={{ mr: 1 }}
              />
              {column.label}
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Paper>
  );
};

export default UniversalDataTable;