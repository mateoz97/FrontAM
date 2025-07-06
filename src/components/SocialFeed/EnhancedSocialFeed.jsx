// src/components/SocialFeed/EnhancedSocialFeed.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Public as PublicIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { getBusinessTypeLabel, getBusinessTypeIcon, getBusinessTypeColor } from '../../utils/businessTypes';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import CreatePostModal from './CreatePostModal';

const EnhancedSocialFeed = ({
  businesses = [],
  activeBusinessId,
  user,
  onBusinessSelect,
  onPostCreated,
  onLike,
  onComment,
  onShare,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [feedTab, setFeedTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  const feedTypes = [
    { id: 0, label: 'Global', icon: <PublicIcon />, description: 'Todos los negocios' },
    { id: 1, label: 'Mi Negocio', icon: <BusinessIcon />, description: 'Solo mi negocio activo' },
    { id: 2, label: 'Mis Negocios', icon: <GroupIcon />, description: 'Todos mis negocios' },
    { id: 3, label: 'Destacados', icon: <StarIcon />, description: 'Posts populares' },
  ];

  const sortOptions = [
    { id: 'recent', label: 'Más Recientes', icon: <ScheduleIcon /> },
    { id: 'popular', label: 'Más Populares', icon: <TrendingIcon /> },
    { id: 'relevant', label: 'Más Relevantes', icon: <StarIcon /> },
  ];

  // Get unique business types from businesses
  const availableBusinessTypes = React.useMemo(() => {
    const types = new Set();
    businesses.forEach(business => {
      const type = business.business_type || business.type || 'restaurant';
      types.add(type);
    });
    return Array.from(types);
  }, [businesses]);

  const loadPosts = useCallback(async (forceReload = false) => {
    if (loading && !forceReload) return;
    
    setLoading(true);
    try {
      // Simulate API call with filters
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock posts with business context
      const mockPosts = [
        {
          id: 1,
          content: '¡Nuevo menú especial para este fin de semana! 🍽️',
          author: { name: 'Restaurante La Plaza', avatar: null },
          business: { id: 1, name: 'Restaurante La Plaza', type: 'restaurant' },
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          likes: 24,
          comments: 5,
          shares: 2,
          is_liked: false,
          image: null,
          business_context: true,
        },
        {
          id: 2,
          content: 'Gracias a todos nuestros clientes por su preferencia 💪',
          author: { name: 'Gimnasio Power', avatar: null },
          business: { id: 2, name: 'Gimnasio Power', type: 'fitness_center' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          likes: 18,
          comments: 3,
          shares: 1,
          is_liked: true,
          image: null,
          business_context: true,
        },
        {
          id: 3,
          content: 'Nuevos productos llegaron a la farmacia 💊',
          author: { name: 'Farmacia Central', avatar: null },
          business: { id: 3, name: 'Farmacia Central', type: 'pharmacy' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          likes: 12,
          comments: 2,
          shares: 0,
          is_liked: false,
          image: null,
          business_context: true,
        },
      ];

      // Filter posts based on current tab and filters
      let filteredPosts = mockPosts;
      
      // Filter by feed type
      if (feedTab === 1 && activeBusinessId) {
        filteredPosts = mockPosts.filter(post => post.business.id === activeBusinessId);
      } else if (feedTab === 2) {
        const myBusinessIds = businesses.map(b => b.id);
        filteredPosts = mockPosts.filter(post => myBusinessIds.includes(post.business.id));
      } else if (feedTab === 3) {
        filteredPosts = mockPosts.filter(post => post.likes > 15);
      }

      // Filter by business type
      if (selectedBusinessType !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
          post.business.type === selectedBusinessType
        );
      }

      // Filter by search term
      if (searchTerm) {
        filteredPosts = filteredPosts.filter(post =>
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.business.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sort posts
      if (sortBy === 'popular') {
        filteredPosts.sort((a, b) => b.likes - a.likes);
      } else if (sortBy === 'relevant') {
        filteredPosts.sort((a, b) => (b.likes + b.comments * 2) - (a.likes + a.comments * 2));
      } else {
        filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }

      setPosts(filteredPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [feedTab, activeBusinessId, businesses, selectedBusinessType, searchTerm, sortBy, loading]);

  useEffect(() => {
    loadPosts(true);
  }, [loadPosts]);

  const handleTabChange = (event, newValue) => {
    setFeedTab(newValue);
  };

  const handleFilterOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleSortOpen = (event) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleBusinessTypeFilter = (type) => {
    setSelectedBusinessType(type);
    setFilterMenuAnchor(null);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setSortMenuAnchor(null);
  };

  const renderBusinessTypeChip = (businessType) => {
    const label = getBusinessTypeLabel(businessType);
    const icon = getBusinessTypeIcon(businessType);
    const color = getBusinessTypeColor(businessType);

    return (
      <Chip
        key={businessType}
        icon={<Box component="span">{icon}</Box>}
        label={label}
        onClick={() => handleBusinessTypeFilter(businessType)}
        variant={selectedBusinessType === businessType ? 'filled' : 'outlined'}
        sx={{
          ...(selectedBusinessType === businessType && {
            bgcolor: alpha(color, 0.1),
            color: color,
            borderColor: color,
          }),
          '& .MuiChip-icon': {
            fontSize: '1rem',
          },
        }}
      />
    );
  };

  const PostsHeader = () => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {feedTypes[feedTab].label}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => loadPosts(true)} disabled={loading}>
            <RefreshIcon />
          </IconButton>
          <IconButton size="small" onClick={handleFilterOpen}>
            <FilterIcon />
          </IconButton>
          <IconButton size="small" onClick={handleSortOpen}>
            <SortIcon />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {feedTypes[feedTab].description}
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Buscar publicaciones..."
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

      {/* Active filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Filtros activos:
        </Typography>
        
        <Chip
          label={sortOptions.find(s => s.id === sortBy)?.label || 'Recientes'}
          size="small"
          variant="outlined"
          sx={{ borderRadius: 1 }}
        />

        {selectedBusinessType !== 'all' && (
          <Chip
            label={getBusinessTypeLabel(selectedBusinessType)}
            size="small"
            onDelete={() => setSelectedBusinessType('all')}
            sx={{ 
              borderRadius: 1,
              bgcolor: alpha(getBusinessTypeColor(selectedBusinessType), 0.1),
              color: getBusinessTypeColor(selectedBusinessType),
            }}
          />
        )}

        {searchTerm && (
          <Chip
            label={`Búsqueda: "${searchTerm}"`}
            size="small"
            onDelete={() => setSearchTerm('')}
            sx={{ borderRadius: 1 }}
          />
        )}
      </Box>
    </Paper>
  );

  return (
    <Box>
      {/* Feed Tabs */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={feedTab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: 1.5,
            },
          }}
        >
          {feedTypes.map((type) => (
            <Tab
              key={type.id}
              icon={type.icon}
              label={type.label}
              iconPosition="start"
              sx={{
                minHeight: 56,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Create Post */}
      <CreatePost onOpenModal={() => setCreateModalOpen(true)} user={user} />

      {/* Posts Header */}
      <PostsHeader />

      {/* Posts List */}
      <Box>
        {loading ? (
          Array.from(new Array(3)).map((_, index) => (
            <Paper key={index} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
              <Typography variant="body1">Cargando publicaciones...</Typography>
            </Paper>
          ))
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <Fade in timeout={300 + index * 100} key={post.id}>
              <Box>
                <PostCard
                  post={post}
                  onLike={() => onLike(post.id)}
                  onComment={(comment) => onComment(post.id, comment)}
                  onShare={() => onShare(post.id)}
                  showBusinessContext={feedTab === 0 || feedTab === 3}
                />
              </Box>
            </Fade>
          ))
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No hay publicaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feedTab === 1 
                ? 'Tu negocio aún no tiene publicaciones'
                : feedTab === 2
                ? 'Tus negocios aún no tienen publicaciones'
                : 'No se encontraron publicaciones con los filtros actuales'
              }
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 280 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Filtrar por tipo de negocio
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Chip
              label="Todos los tipos"
              onClick={() => handleBusinessTypeFilter('all')}
              variant={selectedBusinessType === 'all' ? 'filled' : 'outlined'}
              sx={{ justifyContent: 'flex-start' }}
            />
            
            <Divider sx={{ my: 1 }} />
            
            {availableBusinessTypes.map(type => renderBusinessTypeChip(type))}
          </Box>
        </Box>
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 200 } }}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => handleSortChange(option.id)}
            selected={sortBy === option.id}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {option.icon}
              {option.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Create Post Modal */}
      <CreatePostModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPostCreated={onPostCreated}
        activeBusinessId={activeBusinessId}
      />
    </Box>
  );
};

export default EnhancedSocialFeed;