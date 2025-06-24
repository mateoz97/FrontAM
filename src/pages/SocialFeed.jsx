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
      setLoading(true);
      // Cargar datos reales del backend
      const [businessesData, postsData] = await Promise.all([
        businessService.getUserBusinesses(),
        postService.getFeedPosts()
      ]);
      
      setBusinesses(businessesData || []);
      setPosts(postsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setBusinesses([]);
      setPosts([]);
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
      // Crear el post usando el servicio real
      const createdPost = await postService.createPost(newPost);
      if (createdPost) {
        // Recargar los posts para obtener la lista actualizada
        await loadData();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setCreateModalOpen(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postService.toggleLike(postId);
      // Recargar posts para obtener el estado actualizado
      await loadData();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await postService.addComment(postId, comment);
      // Recargar posts para obtener los comentarios actualizados
      await loadData();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async (postId) => {
    try {
      await postService.sharePost(postId);
      console.log('Post shared:', postId);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
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