// src/components/common/UniversalActivityFeed.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Chip,
  Button,
  Divider,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TextField,
  InputAdornment,
  Skeleton,
  useTheme,
  alpha,
  Collapse,
  Badge,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { getBusinessTypeIcon, getBusinessTypeColor } from '../../utils/businessTypes';

const UniversalActivityFeed = ({
  title = 'Actividad Reciente',
  activities = [],
  loading = false,
  maxItems = 10,
  showFilter = true,
  showSearch = true,
  refreshable = true,
  onRefresh,
  onActivityClick,
  groupByDate = true,
  businessType = 'restaurant',
  realTime = false,
  emptyMessage = 'No hay actividad reciente',
  emptySubtitle = 'La actividad aparecerá aquí cuando ocurra',
  height = 400,
  variant = 'default', // 'default', 'compact', 'minimal'
}) => {
  const theme = useTheme();
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    priority: 'all',
    timeRange: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [visibleItems, setVisibleItems] = useState(maxItems);

  const businessColor = getBusinessTypeColor(businessType);

  // Activity type configurations
  const activityTypeConfig = {
    order: {
      icon: '📋',
      color: theme.palette.info.main,
      label: 'Pedido',
    },
    payment: {
      icon: '💳',
      color: theme.palette.success.main,
      label: 'Pago',
    },
    customer: {
      icon: '👤',
      color: theme.palette.primary.main,
      label: 'Cliente',
    },
    inventory: {
      icon: '📦',
      color: theme.palette.warning.main,
      label: 'Inventario',
    },
    staff: {
      icon: '👨‍💼',
      color: theme.palette.secondary.main,
      label: 'Personal',
    },
    system: {
      icon: '⚙️',
      color: theme.palette.text.secondary,
      label: 'Sistema',
    },
    appointment: {
      icon: '📅',
      color: theme.palette.info.main,
      label: 'Cita',
    },
    delivery: {
      icon: '🚚',
      color: theme.palette.warning.main,
      label: 'Delivery',
    },
    review: {
      icon: '⭐',
      color: theme.palette.success.main,
      label: 'Reseña',
    },
    error: {
      icon: '🚨',
      color: theme.palette.error.main,
      label: 'Error',
    },
  };

  // Priority configurations
  const priorityConfig = {
    low: { color: theme.palette.success.main, icon: <CheckCircleIcon /> },
    medium: { color: theme.palette.info.main, icon: <InfoIcon /> },
    high: { color: theme.palette.warning.main, icon: <WarningIcon /> },
    urgent: { color: theme.palette.error.main, icon: <ErrorIcon /> },
  };

  // Filter activities
  const filteredActivities = React.useMemo(() => {
    let filtered = activities;

    // Apply type filter
    if (selectedFilters.type !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedFilters.type);
    }

    // Apply priority filter
    if (selectedFilters.priority !== 'all') {
      filtered = filtered.filter(activity => activity.priority === selectedFilters.priority);
    }

    // Apply time range filter
    if (selectedFilters.timeRange !== 'all') {
      const now = new Date();
      const timeRanges = {
        '1h': 1 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      };
      const range = timeRanges[selectedFilters.timeRange];
      if (range) {
        filtered = filtered.filter(activity => 
          new Date(activity.timestamp) > new Date(now.getTime() - range)
        );
      }
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [activities, selectedFilters, searchTerm]);

  // Group activities by date
  const groupedActivities = React.useMemo(() => {
    if (!groupByDate) {
      return { 'all': filteredActivities };
    }

    const groups = {};
    filteredActivities.forEach(activity => {
      const date = new Date(activity.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Hoy';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Ayer';
      } else {
        groupKey = date.toLocaleDateString();
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(activity);
    });

    return groups;
  }, [filteredActivities, groupByDate]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const ActivityItem = ({ activity, compact = false }) => {
    const config = activityTypeConfig[activity.type] || activityTypeConfig.system;
    const priorityConf = priorityConfig[activity.priority] || priorityConfig.medium;
    const isExpanded = expandedItems[activity.id];

    return (
      <ListItem
        alignItems="flex-start"
        sx={{
          cursor: onActivityClick ? 'pointer' : 'default',
          borderRadius: 2,
          mb: 0.5,
          '&:hover': onActivityClick ? {
            bgcolor: alpha(businessColor, 0.05),
          } : {},
        }}
        onClick={() => onActivityClick?.(activity)}
      >
        <ListItemAvatar>
          <Badge
            badgeContent={config.icon}
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: 'transparent',
                fontSize: '0.7rem',
                right: -2,
                top: -2,
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(config.color, 0.1),
                color: config.color,
                width: compact ? 32 : 40,
                height: compact ? 32 : 40,
              }}
            >
              {activity.user?.avatar ? (
                <img src={activity.user.avatar} alt="" />
              ) : (
                activity.user?.name?.charAt(0) || '?'
              )}
            </Avatar>
          </Badge>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant={compact ? 'body2' : 'body1'} sx={{ fontWeight: 600 }}>
                {activity.title || activity.description}
              </Typography>
              
              {activity.priority && activity.priority !== 'medium' && (
                <Chip
                  size="small"
                  label={activity.priority}
                  sx={{
                    bgcolor: alpha(priorityConf.color, 0.1),
                    color: priorityConf.color,
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
              )}
              
              <Chip
                size="small"
                label={config.label}
                sx={{
                  bgcolor: alpha(config.color, 0.1),
                  color: config.color,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            </Box>
          }
          secondary={
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'none' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {activity.description}
              </Typography>
              
              {activity.metadata && (
                <Collapse in={isExpanded}>
                  <Box sx={{ mt: 1, p: 1, bgcolor: alpha(theme.palette.grey[500], 0.05), borderRadius: 1 }}>
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <Typography key={key} variant="caption" display="block">
                        <strong>{key}:</strong> {value}
                      </Typography>
                    ))}
                  </Box>
                </Collapse>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {activity.user?.name && `${activity.user.name} • `}
                  {formatTimeAgo(activity.timestamp)}
                </Typography>
                
                {activity.metadata && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItemExpansion(activity.id);
                    }}
                  >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                )}
              </Box>
            </Box>
          }
        />

        {activity.actions && (
          <ListItemSecondaryAction>
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
  };

  const LoadingSkeleton = () => (
    <List>
      {Array.from(new Array(5)).map((_, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton variant="text" width="60%" />}
            secondary={
              <Box>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  const EmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
        {emptyMessage}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {emptySubtitle}
      </Typography>
    </Box>
  );

  return (
    <Card sx={{ height: height ? height : 'auto' }}>
      <CardContent sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
            {realTime && (
              <Badge color="success" variant="dot" sx={{ ml: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
              </Badge>
            )}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {refreshable && onRefresh && (
              <IconButton size="small" onClick={onRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            )}
            
            {showFilter && (
              <IconButton 
                size="small" 
                onClick={(e) => setFilterAnchor(e.currentTarget)}
              >
                <Badge 
                  badgeContent={
                    Object.values(selectedFilters).filter(v => v !== 'all').length
                  } 
                  color="primary"
                >
                  <FilterIcon />
                </Badge>
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Search */}
        {showSearch && (
          <TextField
            size="small"
            fullWidth
            placeholder="Buscar actividad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}

        {/* Content */}
        <Box sx={{ height: height ? height - 150 : 'auto', overflow: 'auto' }}>
          {loading ? (
            <LoadingSkeleton />
          ) : Object.keys(groupedActivities).length === 0 ? (
            <EmptyState />
          ) : (
            <Box>
              {Object.entries(groupedActivities).map(([dateGroup, groupActivities]) => (
                <Box key={dateGroup}>
                  {groupByDate && Object.keys(groupedActivities).length > 1 && (
                    <>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary" 
                        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                      >
                        {dateGroup}
                      </Typography>
                      <Divider sx={{ mb: 1 }} />
                    </>
                  )}
                  
                  <List disablePadding>
                    {groupActivities
                      .slice(0, visibleItems)
                      .map((activity, index) => (
                        <ActivityItem 
                          key={activity.id || index} 
                          activity={activity}
                          compact={variant === 'compact'}
                        />
                      ))}
                  </List>
                </Box>
              ))}
              
              {filteredActivities.length > visibleItems && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setVisibleItems(prev => prev + maxItems)}
                  >
                    Ver más actividades
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </CardContent>

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
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={selectedFilters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              label="Tipo"
            >
              <MenuItem value="all">Todos</MenuItem>
              {Object.entries(activityTypeConfig).map(([key, config]) => (
                <MenuItem key={key} value={key}>
                  {config.icon} {config.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Prioridad</InputLabel>
            <Select
              value={selectedFilters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              label="Prioridad"
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="low">Baja</MenuItem>
              <MenuItem value="medium">Media</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
              <MenuItem value="urgent">Urgente</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth size="small">
            <InputLabel>Tiempo</InputLabel>
            <Select
              value={selectedFilters.timeRange}
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              label="Tiempo"
            >
              <MenuItem value="all">Todo el tiempo</MenuItem>
              <MenuItem value="1h">Última hora</MenuItem>
              <MenuItem value="24h">Últimas 24 horas</MenuItem>
              <MenuItem value="7d">Últimos 7 días</MenuItem>
              <MenuItem value="30d">Últimos 30 días</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => setSelectedFilters({ type: 'all', priority: 'all', timeRange: 'all' })}
            sx={{ mt: 2 }}
          >
            Limpiar filtros
          </Button>
        </Box>
      </Menu>
    </Card>
  );
};

export default UniversalActivityFeed;