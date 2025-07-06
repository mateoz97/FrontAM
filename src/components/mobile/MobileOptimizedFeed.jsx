// src/components/mobile/MobileOptimizedFeed.jsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Fab,
  SwipeableDrawer,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Avatar,
  Badge,
  Paper,
  Slide,
  useTheme,
  useMediaQuery,
  alpha,
  Divider,
  Button,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingIcon,
  Favorite as FavoriteIcon,
  Chat as ChatIcon,
  Share as ShareIcon,
  MoreHoriz as MoreIcon,
  ArrowBack as ArrowBackIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { getBusinessTypeIcon, getBusinessTypeColor } from '../../utils/businessTypes';

const MobileOptimizedFeed = ({
  posts = [],
  businesses = [],
  activeBusiness,
  user,
  onCreatePost,
  onLike,
  onComment,
  onShare,
  onBusinessSwitch,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollRef = useRef(null);

  const businessColor = activeBusiness ? getBusinessTypeColor(activeBusiness.type) : theme.palette.primary.main;

  // Handle scroll events for showing scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowScrollToTop(scrollRef.current.scrollTop > 300);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const MobileHeader = () => (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => setDrawerOpen(true)} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            Feed
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: businessColor,
            }}
          >
            {user?.first_name?.charAt(0)}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );

  const MobilePostCard = ({ post }) => {
    const [expanded, setExpanded] = useState(false);
    const [liked, setLiked] = useState(post.is_liked || false);
    const [likesCount, setLikesCount] = useState(post.likes || 0);

    const handleLike = useCallback(() => {
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
      onLike?.(post.id);
    }, [liked, onLike, post.id]);

    return (
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 1,
          borderRadius: 0,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {/* Post Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  bgcolor: alpha(businessColor, 0.1),
                  color: businessColor,
                  mr: 2,
                }}
              >
                {post.business?.type ? getBusinessTypeIcon(post.business.type) : '🏢'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {post.business?.name || 'Negocio'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.timestamp ? new Date(post.timestamp).toLocaleString() : 'Ahora'}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small">
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Post Content */}
        <Box sx={{ px: 2 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: expanded ? 'none' : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.content}
          </Typography>
          
          {post.content.length > 150 && (
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ p: 0, minWidth: 'auto' }}
            >
              {expanded ? 'Ver menos' : 'Ver más'}
            </Button>
          )}
        </Box>

        {/* Post Image */}
        {post.image && (
          <Box sx={{ mt: 1 }}>
            <img
              src={post.image}
              alt="Post content"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 300,
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        {/* Post Actions */}
        <Box sx={{ p: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                startIcon={
                  <FavoriteIcon 
                    sx={{ 
                      color: liked ? 'error.main' : 'text.secondary',
                      transition: 'color 0.2s',
                    }} 
                  />
                }
                onClick={handleLike}
                sx={{ 
                  minWidth: 'auto',
                  p: 0.5,
                  color: liked ? 'error.main' : 'text.secondary',
                }}
              >
                {likesCount}
              </Button>
              
              <Button
                startIcon={<ChatIcon />}
                onClick={() => setSelectedPost(post)}
                sx={{ 
                  minWidth: 'auto',
                  p: 0.5,
                  color: 'text.secondary',
                }}
              >
                {post.comments || 0}
              </Button>
            </Box>
            
            <IconButton 
              size="small" 
              onClick={() => onShare?.(post.id)}
              sx={{ color: 'text.secondary' }}
            >
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    );
  };

  const BusinessSwitcherDrawer = () => (
    <SwipeableDrawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      onOpen={() => setDrawerOpen(true)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Mis Negocios
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {businesses.map((business) => (
          <Box
            key={business.id}
            onClick={() => {
              onBusinessSwitch?.(business.id);
              setDrawerOpen(false);
            }}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              bgcolor: activeBusiness?.id === business.id ? alpha(businessColor, 0.1) : 'transparent',
              borderLeft: activeBusiness?.id === business.id ? `4px solid ${businessColor}` : '4px solid transparent',
              '&:hover': {
                bgcolor: alpha(businessColor, 0.05),
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(getBusinessTypeColor(business.type), 0.1),
                color: getBusinessTypeColor(business.type),
                mr: 2,
              }}
            >
              {getBusinessTypeIcon(business.type)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {business.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {business.role}
              </Typography>
            </Box>
          </Box>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        <Button
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => {
            setDrawerOpen(false);
            // Navigate to create business
          }}
          sx={{ m: 2, justifyContent: 'flex-start' }}
        >
          Crear Nuevo Negocio
        </Button>
      </Box>
    </SwipeableDrawer>
  );

  const CreatePostFAB = () => (
    <Fab
      color="primary"
      sx={{
        position: 'fixed',
        bottom: 80,
        right: 16,
        bgcolor: businessColor,
        '&:hover': {
          bgcolor: alpha(businessColor, 0.8),
        },
      }}
      onClick={() => setCreatePostOpen(true)}
    >
      <AddIcon />
    </Fab>
  );

  const ScrollToTopFAB = () => (
    <Slide direction="up" in={showScrollToTop}>
      <Fab
        size="small"
        sx={{
          position: 'fixed',
          bottom: 150,
          right: 16,
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          color: 'text.primary',
          boxShadow: theme.shadows[4],
        }}
        onClick={scrollToTop}
      >
        <TrendingIcon />
      </Fab>
    </Slide>
  );

  const MobileBottomNav = () => (
    <BottomNavigation
      value={bottomNavValue}
      onChange={(event, newValue) => setBottomNavValue(newValue)}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        zIndex: 1000,
      }}
    >
      <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
      <BottomNavigationAction label="Búsqueda" icon={<SearchIcon />} />
      <BottomNavigationAction label="Negocios" icon={<BusinessIcon />} />
      <BottomNavigationAction label="Perfil" icon={<AccountIcon />} />
    </BottomNavigation>
  );

  const PostDetailDialog = () => (
    <Dialog
      open={!!selectedPost}
      onClose={() => setSelectedPost(null)}
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'background.default',
        },
      }}
    >
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <IconButton edge="start" onClick={() => setSelectedPost(null)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, ml: 1 }}>
            Publicación
          </Typography>
          <IconButton>
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <DialogContent sx={{ p: 0 }}>
        {selectedPost && (
          <MobilePostCard post={selectedPost} />
        )}
        {/* Add comments section here */}
      </DialogContent>
    </Dialog>
  );

  if (!isMobile) {
    // Return desktop version or redirect
    return <Box>Esta vista está optimizada para móvil</Box>;
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader />
      
      {/* Main Content */}
      <Box 
        ref={scrollRef}
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          pb: 8, // Space for bottom navigation
        }}
      >
        {loading ? (
          <Box sx={{ p: 2 }}>
            {Array.from(new Array(3)).map((_, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Typography>Cargando...</Typography>
              </Paper>
            ))}
          </Box>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <MobilePostCard key={post.id} post={post} />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No hay publicaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ¡Sé el primero en publicar algo!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Floating Action Buttons */}
      <CreatePostFAB />
      <ScrollToTopFAB />
      
      {/* Bottom Navigation */}
      <MobileBottomNav />
      
      {/* Drawers and Dialogs */}
      <BusinessSwitcherDrawer />
      <PostDetailDialog />
    </Box>
  );
};

export default MobileOptimizedFeed;