// src/pages/SocialFeed.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Container, CircularProgress, useTheme, useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TopHeader from '../components/SocialFeed/TopHeader';
import BusinessSwitcher from '../components/SocialFeed/BusinessSwitcher';
import CreatePost from '../components/SocialFeed/CreatePost';
import PostCard from '../components/SocialFeed/PostCard';
import BottomNavigation from '../components/SocialFeed/BottomNavigation';
import CreatePostModal from '../components/SocialFeed/CreatePostModal';
import businessService from '../services/business.service';
import postService from '../services/post.service';

// Datos mock para desarrollo
const mockBusinesses = [
  { id: 1, name: 'El Sabor', description: 'Sede Principal', isOwner: true, role: 'Owner' },
  { id: 2, name: 'Bella Italia', description: 'Sucursal Norte', isOwner: true, role: 'Owner' },
  { id: 3, name: 'Bar & Grill', description: 'Empleado', isOwner: false, role: 'Mesero' },
  { id: 4, name: 'Sushi House', description: 'Administrador', isOwner: false, role: 'Gerente' },
];

const mockPosts = [
  {
    id: 1,
    author: { name: 'Restaurante El Sabor', id: 1 },
    content: '¡Nuevo plato especial del día! 🍝 Prueba nuestra deliciosa pasta con mariscos frescos. Disponible solo por hoy con 20% de descuento.',
    likes: 24,
    comments: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // hace 2 horas
    image: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    author: { name: 'Pizzería Bella Italia', id: 2 },
    content: '🎉 ¡Feliz viernes! Hoy tenemos 2x1 en todas nuestras pizzas familiares. Ven con tu familia y amigos a disfrutar de la mejor pizza de la ciudad.',
    likes: 48,
    comments: 8,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // hace 5 horas
    image: null
  },
  {
    id: 3,
    author: { name: 'Café Express', id: 3 },
    content: 'Buenos días ☕ Comenzamos la semana con energía. Recuerda que tenemos delivery gratis para pedidos mayores a $15.',
    likes: 35,
    comments: 5,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // hace 1 día
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop'
  }
];

const SocialFeed = () => {
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
      // Intentar cargar datos reales del backend
      const [businessesData, postsData] = await Promise.all([
        businessService.getUserBusinesses(),
        postService.getFeedPosts()
      ]);
      
      // Si hay datos reales, usarlos
      if (businessesData && businessesData.length > 0) {
        setBusinesses(businessesData);
      } else {
        // Si no hay datos reales, usar mock
        setBusinesses(mockBusinesses);
      }
      
      if (postsData && postsData.length > 0) {
        setPosts(postsData);
      } else {
        // Si no hay datos reales, usar mock
        setPosts(mockPosts);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // En caso de error, usar datos mock
      setBusinesses(mockBusinesses);
      setPosts(mockPosts);
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

  const handlePostCreated = (newPost) => {
    // Si es un mock, simular la creación del post
    const mockNewPost = {
      id: Date.now(),
      author: { 
        name: user?.business_name || user?.username || 'Usuario',
        id: user?.id || 1
      },
      content: newPost.content,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      image: null
    };
    
    setPosts([mockNewPost, ...posts]);
    setCreateModalOpen(false);
  };

  const handleLike = (postId) => {
    // Simular like/unlike
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    // Por ahora, solo console.log
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId) => {
    // Por ahora, solo console.log
    console.log('Share post:', postId);
  };

  if (loading) {
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
        {/* Business Switcher - Solo si el usuario tiene negocios */}
        {businesses.length > 0 && (
          <BusinessSwitcher 
            businesses={businesses}
            activeBusinessId={activeBusinessId}
            onSelectBusiness={handleBusinessSelect}
          />
        )}
        
        {/* Create Post */}
        <CreatePost onOpenModal={handleCreatePost} user={user} />
        
        {/* Posts Feed */}
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post}
            onLike={() => handleLike(post.id)}
            onComment={() => handleComment(post.id)}
            onShare={() => handleShare(post.id)}
          />
        ))}
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

export default SocialFeed;