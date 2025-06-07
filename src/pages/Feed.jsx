// src/pages/Feed.jsx (continuación)
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, CircularProgress, useTheme, useMediaQuery,
  Paper, Button, Chip, Typography, Alert, Snackbar, Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Componentes
import BusinessSwitcher from '../components/SocialFeed/BusinessSwitcher';
import CreatePost from '../components/SocialFeed/CreatePost';
import PostCard from '../components/SocialFeed/PostCard';
import BottomNavigation from '../components/SocialFeed/BottomNavigation';
import CreatePostModal from '../components/SocialFeed/CreatePostModal';

// Servicios
import businessService from '../services/business.service';
import postService from '../services/post.service';

// Componente para mostrar cuando el usuario no tiene negocio
const NoBusinessBanner = ({ navigate }) => {

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
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Función para cargar los negocios del usuario
  const loadBusinesses = useCallback(async () => {
    try {
      setLoadingBusinesses(true);
      const businessesData = await businessService.getUserBusinesses();
      
      // Verificar el formato de la respuesta
      if (Array.isArray(businessesData)) {
        setBusinesses(businessesData);
      } else if (businessesData && typeof businessesData === 'object') {
        // Intentar extraer datos si viene en formato diferente
        if (businessesData.results) {
          setBusinesses(businessesData.results);
        } else {
          // Convertir objeto a array si es necesario
          const businessArray = Object.values(businessesData);
          if (Array.isArray(businessArray)) {
            setBusinesses(businessArray);
          } else {
            setBusinesses([]);
          }
        }
      } else {
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Error al cargar negocios:', error);
      setError('Error al cargar tus negocios. Intenta de nuevo más tarde.');
      setBusinesses([]);
    } finally {
      setLoadingBusinesses(false);
    }
  }, []);

  // Función para cargar las publicaciones
  const loadPosts = useCallback(async () => {
    try {
      setLoadingPosts(true);
      const postsData = await postService.getFeed();
      
      // Verificar el formato de la respuesta
      if (Array.isArray(postsData)) {
        setPosts(postsData);
      } else if (postsData && typeof postsData === 'object') {
        // Intentar extraer datos si viene en formato diferente
        if (postsData.results) {
          setPosts(postsData.results);
        } else {
          // Convertir objeto a array si es necesario
          const postsArray = Object.values(postsData);
          if (Array.isArray(postsArray)) {
            setPosts(postsArray);
          } else {
            setPosts([]);
          }
        }
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      setError('Error al cargar publicaciones. Intenta de nuevo más tarde.');
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadBusinesses();
    loadPosts();
  }, [loadBusinesses, loadPosts]);

  // Actualizar cuando cambia el negocio activo
  useEffect(() => {
    // Solo cargar datos si el usuario está autenticado
    if (user) {
      loadBusinesses();
      loadPosts();
    }
  }, [user]);

  const handleBusinessSelect = async (businessId) => {
    try {
      // Mostrar carga mientras se cambia de negocio
      setLoadingPosts(true);
      setSnackbar({ open: true, message: 'Cambiando de negocio...', severity: 'info' });
      
      // Llamar al servicio para cambiar de negocio
      await switchBusiness(businessId);
      
      // Recargar posts para el nuevo negocio
      await loadPosts();
      
      setSnackbar({ open: true, message: 'Negocio cambiado correctamente', severity: 'success' });
    } catch (error) {
      console.error('Error al cambiar de negocio:', error);
      setSnackbar({ open: true, message: 'Error al cambiar de negocio', severity: 'error' });
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleCreatePost = () => {
    setCreateModalOpen(true);
  };

  const handlePostCreated = async (newPost) => {
    try {
      // Enviar datos al servidor
      const createdPost = await postService.createPost({
        content: newPost.content,
        image: newPost.image,
        businessId: activeBusinessId
      });
      
      // Añadir nueva publicación al principio de la lista
      setPosts(prevPosts => [createdPost, ...prevPosts]);
      
      // Mostrar mensaje de éxito
      setSnackbar({ open: true, message: 'Publicación creada correctamente', severity: 'success' });
    } catch (error) {
      console.error('Error al crear publicación:', error);
      setSnackbar({ open: true, message: 'Error al crear la publicación', severity: 'error' });
    }
    
    // Cerrar modal
    setCreateModalOpen(false);
  };

  const handleLike = async (postId) => {
    try {
      const result = await postService.likePost(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, is_liked: result.liked, likes: result.likes_count || post.likes }
          : post
      ));
    } catch (error) {
      console.error('Error al dar like:', error);
      setSnackbar({ open: true, message: 'Error al actualizar like', severity: 'error' });
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      // Enviar comentario al servidor
      await postService.commentPost(postId, comment);
      
      // Actualizar la publicación (incrementar contador de comentarios)
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: (post.comments || 0) + 1 }
          : post
      ));
      
      // Mostrar mensaje de éxito
      setSnackbar({ open: true, message: 'Comentario añadido', severity: 'success' });
    } catch (error) {
      console.error('Error al comentar:', error);
      setSnackbar({ open: true, message: 'Error al añadir comentario', severity: 'error' });
    }
  };

  const handleShare = () => {
    // Por ahora solo mostramos un mensaje
    setSnackbar({ open: true, message: 'Funcionalidad de compartir en desarrollo', severity: 'info' });
  };

  // Verificar si tenemos datos de negocio en el contexto
  // Removed unused variable 'businessInfo'
  
  // Mostrar loading si ambos están cargando
  if (loadingBusinesses && loadingPosts && posts.length === 0) {
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
      {/* TopHeader ya está incluido en MainLayout, no es necesario aquí */}
      
      <Container 
          maxWidth="md" 
          sx={{ 
            px: isMobile ? 2 : 3, 
            py: 0, // CAMBIO: Remover padding vertical que puede causar cortes
            // CAMBIO: Agregar un pequeño margin-top para separar del Toolbar
            mt: 1
          }}
        >
          
        {/* Mostrar error si existe */}
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        
        {/* BusinessSwitcher - Solo si el usuario tiene negocios */}
        <BusinessSwitcher 
            businesses={businesses}
            activeBusinessId={activeBusinessId}
            onSelectBusiness={handleBusinessSelect}
            loading={loadingBusinesses}
          />
        
        {/* Banner para usuarios sin negocio - Solo mostrar si no hay negocios y ya terminó de cargar */}
        {!loadingBusinesses && (!businesses || businesses.length === 0) && <NoBusinessBanner navigate={navigate} />}
        
        {/* Create Post */}
        <CreatePost onOpenModal={handleCreatePost} user={user} />
        
        {/* Posts Feed */}
          {loadingPosts && posts.length === 0 ? (
            // Mostrar skeletons mientras carga
            Array.from(new Array(3)).map((_, index) => (
              <Paper key={`skeleton-${index}`} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                  <Typography variant="body2">Cargando publicaciones...</Typography>
                </Box>
              </Paper>
            ))
          ) : posts.length > 0 ? (
            // Mostrar posts
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
            // No hay posts
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
      
      {/* Snackbar para mensajes */}
      <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity={snackbar.severity} 
            variant="filled"
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Feed;