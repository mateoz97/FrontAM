// src/pages/Feed.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Container, CircularProgress, useTheme, useMediaQuery,
  Paper, Button, Chip, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Componentes
import TopHeader from '../components/SocialFeed/TopHeader';
import BusinessSwitcher from '../components/SocialFeed/BusinessSwitcher';
import CreatePost from '../components/SocialFeed/CreatePost';
import PostCard from '../components/SocialFeed/PostCard';
import BottomNavigation from '../components/SocialFeed/BottomNavigation';
import CreatePostModal from '../components/SocialFeed/CreatePostModal';

// Servicios
import businessService from '../services/business.service';
import postService from '../services/post.service';

// Componente para mostrar cuando el usuario no tiene negocio
const NoBusinessBanner = () => {
  const navigate = useNavigate();

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2,
        background: 'linear-gradient(to right, #e0f7fa, #b2ebf2)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            ¡Bienvenido al Feed! 
          </Typography>
          <Typography variant="body1">
            Aquí podrás ver las publicaciones de la comunidad. Para acceder a todas las funcionalidades, 
            crea tu propio negocio o únete a uno existente.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Crear Negocio
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/users')}
          >
            Unirse a Negocio
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

const Feed = () => {
  const navigate = useNavigate();
  const { user, activeBusinessId, switchBusiness } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [businesses, setBusinesses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargar negocios del usuario
      const businessesData = await businessService.getUserBusinesses();
      setBusinesses(Array.isArray(businessesData) ? businessesData : []);
      
      // Cargar posts
      const postsData = await postService.getFeed();
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSelect = (businessId) => {
    switchBusiness(businessId);
    navigate(`/dashboard/${businessId}`);
  };

  const handleCreatePost = () => {
    setCreateModalOpen(true);
  };

  const handlePostCreated = async (newPost) => {
    try {
      const createdPost = await postService.createPost(newPost);
      setPosts([createdPost, ...posts]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setCreateModalOpen(false);
  };

  const handleLike = async (postId) => {
    try {
      const result = await postService.likePost(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, is_liked: result.liked, likes: result.likes_count }
          : post
      ));
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await postService.commentPost(postId, comment);
      // Recargar posts para obtener los comentarios actualizados
      const updatedPosts = await postService.getFeed();
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  };

  const handleShare = (postId) => {
    // Implementar funcionalidad de compartir
    console.log('Compartir post:', postId);
  };

  if (loading && posts.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: isMobile ? 7 : 0, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <TopHeader />
      
      <Container maxWidth="md" sx={{ px: isMobile ? 2 : 3, py: 2 }}>
        {/* BusinessSwitcher - Solo si el usuario tiene negocios */}
        {businesses && businesses.length > 0 ? (
          <BusinessSwitcher 
            businesses={businesses}
            activeBusinessId={activeBusinessId}
            onSelectBusiness={handleBusinessSelect}
          />
        ) : null}
        
        {/* Banner para usuarios sin negocio */}
        {(!businesses || businesses.length === 0) && <NoBusinessBanner />}
        
        {/* Create Post */}
        <CreatePost onOpenModal={handleCreatePost} user={user} />
        
        {/* Posts Feed */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post}
              onLike={() => handleLike(post.id)}
              onComment={(comment) => handleComment(post.id, comment)}
              onShare={() => handleShare(post.id)}
            />
          ))
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="textSecondary">
              No hay publicaciones disponibles
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              ¡Sé el primero en publicar algo!
            </Typography>
          </Paper>
        )}
      </Container>
      
      {/* Bottom Navigation - Solo en móvil */}
      {isMobile && <BottomNavigation />}
      
      {/* Create Post Modal */}
      <CreatePostModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
        activeBusinessId={activeBusinessId}
      />
    </Box>
  );
};

export default Feed;