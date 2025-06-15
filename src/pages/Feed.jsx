// src/pages/Feed.jsx - Versión corregida sin duplicaciones

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  // ✅ CORRECCIÓN: Usar ref para evitar múltiples cargas
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  // Función para cargar los negocios del usuario
  const loadBusinesses = useCallback(async () => {
    try {
      setLoadingBusinesses(true);
      const businessesData = await businessService.getUserBusinesses();
      
      // Verificar el formato de la respuesta
      if (Array.isArray(businessesData)) {
        setBusinesses(businessesData);
      } else if (businessesData && typeof businessesData === 'object') {
        if (businessesData.results) {
          setBusinesses(businessesData.results);
        } else {
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
  const loadPosts = useCallback(async (forceReload = false) => {
    // ✅ PREVENIR múltiples cargas simultáneas
    if (isLoadingRef.current && !forceReload) {
      console.log('⏳ Ya se están cargando posts, omitiendo...');
      return;
    }

    isLoadingRef.current = true;
    
    try {
      console.log('📥 Cargando posts del feed...');
      setLoadingPosts(true);
      
      const postsData = await postService.getFeed();
      
      console.log('📊 Posts recibidos:', postsData);
      
      // Verificar el formato de la respuesta
      let processedPosts = [];
      if (Array.isArray(postsData)) {
        processedPosts = postsData;
      } else if (postsData && typeof postsData === 'object') {
        if (postsData.results) {
          processedPosts = postsData.results;
        } else {
          const postsArray = Object.values(postsData);
          if (Array.isArray(postsArray)) {
            processedPosts = postsArray;
          }
        }
      }
      
      // ✅ CORRECCIÓN: Solo actualizar si hay cambios o es forzado
      setPosts(prevPosts => {
        if (forceReload || prevPosts.length === 0) {
          console.log('🔄 Actualizando posts completos');
          return processedPosts;
        }
        
        // Verificar si hay posts nuevos
        const newPosts = processedPosts.filter(newPost => 
          !prevPosts.some(existingPost => existingPost.id === newPost.id)
        );
        
        if (newPosts.length > 0) {
          console.log(`➕ Agregando ${newPosts.length} posts nuevos`);
          return [...newPosts, ...prevPosts];
        }
        
        console.log('✅ No hay posts nuevos');
        return prevPosts;
      });
      
    } catch (error) {
      console.error('❌ Error al cargar publicaciones:', error);
      if (!hasLoadedRef.current) {
        setError('Error al cargar publicaciones. Intenta de nuevo más tarde.');
      }
    } finally {
      setLoadingPosts(false);
      isLoadingRef.current = false;
      hasLoadedRef.current = true;
    }
  }, []);

  // ✅ CORRECCIÓN: Cargar datos solo una vez al montar
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      if (!user || hasLoadedRef.current) return;
      
      console.log('🚀 Inicializando datos del Feed...');
      
      try {
        await Promise.all([
          loadBusinesses(),
          loadPosts(true) // Forzar primera carga
        ]);
      } catch (error) {
        console.error('❌ Error al inicializar datos:', error);
      }
    };

    if (isMounted) {
      initializeData();
    }

    return () => {
      isMounted = false;
    };
  }, [user, user?.id, loadBusinesses, loadPosts]); // ✅ Incluir dependencias requeridas

  // ✅ CORRECCIÓN: Manejar cambio de negocio sin recargar posts duplicados
  const handleBusinessSelect = useCallback(async (businessId) => {
    try {
      setLoadingPosts(true);
      setSnackbar({ open: true, message: 'Cambiando de negocio...', severity: 'info' });
      
      await switchBusiness(businessId);
      
      // ✅ Solo recargar posts después de cambiar negocio
      await loadPosts(true);
      
      setSnackbar({ open: true, message: 'Negocio cambiado correctamente', severity: 'success' });
    } catch (error) {
      console.error('❌ Error al cambiar de negocio:', error);
      setSnackbar({ open: true, message: 'Error al cambiar de negocio', severity: 'error' });
    } finally {
      setLoadingPosts(false);
    }
  }, [switchBusiness, loadPosts]);

  const handleCreatePost = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  // ✅ FUNCIÓN CORREGIDA - Reemplazar esta función en tu Feed.jsx
  const handlePostCreated = useCallback(async (postData) => {
    try {
      console.log('📝 Post creado recibido:', postData);
      
      // ✅ CORRECCIÓN: El post ya fue creado en el modal, solo agregarlo al estado
      if (postData.createdPost && postData.createdPost.id) {
        const createdPost = postData.createdPost;
        
        setPosts(prevPosts => {
          // ✅ Verificar que no exista ya
          const exists = prevPosts.some(post => post.id === createdPost.id);
          if (!exists) {
            console.log('➕ Agregando nuevo post al feed');
            return [createdPost, ...prevPosts];
          }
          console.log('⚠️ Post ya existe, no duplicar');
          return prevPosts;
        });
        
        setSnackbar({ 
          open: true, 
          message: 'Publicación creada correctamente', 
          severity: 'success' 
        });
      } else {
        console.error('❌ No se recibió el post creado correctamente');
        setSnackbar({ 
          open: true, 
          message: 'Error al procesar la publicación', 
          severity: 'error' 
        });
      }
      
    } catch (error) {
      console.error('❌ Error al procesar publicación:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al crear la publicación', 
        severity: 'error' 
      });
    }
    
    setCreateModalOpen(false);
  }, []);

  const handleLike = useCallback(async (postId) => {
    try {
      const result = await postService.likePost(postId);
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId 
          ? { ...post, is_liked: result.liked, likes: result.likes_count || post.likes }
          : post
      ));
    } catch (error) {
      console.error('❌ Error al dar like:', error);
      setSnackbar({ open: true, message: 'Error al actualizar like', severity: 'error' });
    }
  }, []);

  const handleComment = useCallback(async (postId, comment) => {
    try {
      const newComment = await postService.commentPost(postId, comment);
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments: (post.comments || 0) + 1,
                comments_list: newComment ? [newComment, ...(post.comments_list || [])] : post.comments_list
              }
            : post
        )
      );
      
      setSnackbar({ 
        open: true, 
        message: 'Comentario añadido', 
        severity: 'success' 
      });

      return newComment;
      
    } catch (error) {
      console.error('❌ Error al comentar:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al añadir comentario', 
        severity: 'error' 
      });
      return null;
    }
  }, []);

  const handleShare = useCallback(() => {
    setSnackbar({ open: true, message: 'Funcionalidad de compartir en desarrollo', severity: 'info' });
  }, []);

  // Mostrar loading solo en la primera carga
  if (loadingBusinesses && loadingPosts && !hasLoadedRef.current) {
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
      <Container 
        maxWidth="md" 
        sx={{ 
          px: isMobile ? 2 : 3, 
          py: 0,
          mt: 1
        }}
      >
        {/* Mostrar error si existe */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* BusinessSwitcher */}
        <BusinessSwitcher 
          businesses={businesses}
          activeBusinessId={activeBusinessId}
          onSelectBusiness={handleBusinessSelect}
          loading={loadingBusinesses}
        />
        
        {/* Banner para usuarios sin negocio */}
        {!loadingBusinesses && (!businesses || businesses.length === 0) && (
          <NoBusinessBanner navigate={navigate} />
        )}
        
        {/* Create Post */}
        <CreatePost onOpenModal={handleCreatePost} user={user} />
        
        {/* Posts Feed */}
        {loadingPosts && posts.length === 0 ? (
          // Mostrar skeleton solo si no hay posts
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
              key={`post-${post.id}`} // ✅ Key único y descriptivo
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