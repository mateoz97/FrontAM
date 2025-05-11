// src/pages/Feed.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  FavoriteBorder as LikeIcon,
  Favorite as LikedIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import postService from '../services/post.service';

const PostCard = ({ post, onLike, onComment }) => {
  // Removed unused 'user' variable
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    onComment(post.id, comment);
    setComment('');
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.author.name[0]}
          </Avatar>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.author.name}
            </Typography>
            {post.author.business && (
              <Chip
                icon={<BusinessIcon />}
                label={post.author.business}
                size="small"
                variant="outlined"
              />
            )}
            {post.author.role && (
              <Chip
                icon={<BadgeIcon />}
                label={post.author.role}
                size="small"
                color="secondary"
              />
            )}
          </Box>
        }
        subheader={new Date(post.created_at).toLocaleString()}
      />
      <CardContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.content}
        </Typography>
        
        {post.image && (
          <Box
            component="img"
            src={post.image}
            sx={{ width: '100%', borderRadius: 1, mb: 2 }}
          />
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => onLike(post.id)}>
              {post.is_liked ? <LikedIcon color="error" /> : <LikeIcon />}
            </IconButton>
            <Typography variant="body2">{post.likes}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setShowComments(!showComments)}>
              <CommentIcon />
            </IconButton>
            <Typography variant="body2">{post.comments}</Typography>
          </Box>
        </Box>
        
        {showComments && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Escribe un comentario..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <IconButton
                color="primary"
                onClick={handleSubmitComment}
                disabled={!comment.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
            
            {/* Aquí se mostrarían los comentarios existentes */}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const CreatePostCard = ({ onCreatePost }) => {
  const { user, getUserBusiness, getUserRole } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  const businessInfo = getUserBusiness();
  const roleInfo = getUserRole();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      await onCreatePost(content);
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {user?.first_name?.[0] || user?.username?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.first_name || user?.username}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              {businessInfo && (
                <Chip
                  icon={<BusinessIcon />}
                  label={businessInfo.name}
                  size="small"
                  variant="outlined"
                />
              )}
              {roleInfo && (
                <Chip
                  icon={<BadgeIcon />}
                  label={roleInfo.name}
                  size="small"
                  color="secondary"
                />
              )}
            </Box>
          </Box>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="¿Qué hay de nuevo?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

function Feed() {
  // Removed unused 'user' variable
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await postService.getFeed();
      setPosts(data);
    } catch (err) {
      setError('Error al cargar el feed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (content) => {
    try {
      const newPost = await postService.createPost({ content });
      setPosts([newPost, ...posts]);
    } catch (err) {
      console.error('Error al crear post:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const result = await postService.likePost(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, is_liked: result.liked, likes: result.likes_count }
          : post
      ));
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      await postService.commentPost(postId, content);
      // Recargar posts o actualizar localmente
      loadPosts();
    } catch (err) {
      console.error('Error al comentar:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Feed
      </Typography>
      
      <CreatePostCard onCreatePost={handleCreatePost} />
      
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}
      
      {posts.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">
              No hay publicaciones aún. ¡Sé el primero en publicar!
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Feed;