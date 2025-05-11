// src/pages/Feed.jsx - Corregido para el error de ListItemIcon
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Paper,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon, // Añadido el import de ListItemIcon
  ListItemText, // Añadido el import de ListItemText
} from '@mui/material';
import {
  FavoriteBorder as LikeIcon,
  Favorite as LikedIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  RssFeed as FeedIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
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

// Componente simple para mostrar imagen
const ImagePreview = ({ src }) => {
  if (!src) return null;
  
  return (
    <Box
      component="img"
      src={src}
      alt="Imagen adjunta"
      sx={{ 
        width: '100%', 
        borderRadius: 1, 
        mb: 2,
        maxHeight: '400px',
        objectFit: 'cover',
      }}
    />
  );
};

const PostCard = ({ post, onLike, onComment, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      onDelete && onDelete(post.id);
    }
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    onComment(post.id, comment);
    setComment('');
  };

  const isAuthor = post.author && user ? post.author.id === user.id : false;

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.author && post.author.name ? post.author.name[0] : 'U'}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick={handleMenu}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.author && post.author.name ? post.author.name : 'Usuario'}
            </Typography>
            {post.author && post.author.business && (
              <Chip
                icon={<BusinessIcon />}
                label={post.author.business}
                size="small"
                variant="outlined"
              />
            )}
            {post.author && post.author.role && (
              <Chip
                icon={<BadgeIcon />}
                label={post.author.role}
                size="small"
                color="secondary"
              />
            )}
          </Box>
        }
        subheader={post.created_at ? new Date(post.created_at).toLocaleString() : 'Ahora'}
      />
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          try {
            navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
            handleMenuClose();
          } catch (e) {
            console.error('Error copying to clipboard:', e);
          }
        }}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Compartir</ListItemText>
        </MenuItem>
        {isAuthor && (
          <MenuItem onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primary="Eliminar" primaryTypographyProps={{ color: 'error' }} />
          </MenuItem>
        )}
        {!isAuthor && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <FlagIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reportar</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <CardContent>
        {post.content && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {post.content}
          </Typography>
        )}
        
        {post.image && <ImagePreview src={post.image} />}
        
        {post.video && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <video width="100%" controls>
              <source src={post.video} type="video/mp4" />
              Tu navegador no soporta videos.
            </video>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => onLike(post.id)}>
              {post.is_liked ? <LikedIcon color="error" /> : <LikeIcon />}
            </IconButton>
            <Typography variant="body2">{post.likes || 0}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setShowComments(!showComments)}>
              <CommentIcon />
            </IconButton>
            <Typography variant="body2">{post.comments || 0}</Typography>
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
            
            {post.comments_list && post.comments_list.length > 0 ? (
              post.comments_list.map((comment) => (
                <Box key={comment.id} sx={{ mb: 2, display: 'flex', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {comment.author.name[0]}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 2 }}>
                      <Typography variant="subtitle2">{comment.author.name}</Typography>
                      <Typography variant="body2">{comment.content}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {new Date(comment.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No hay comentarios aún. ¡Sé el primero en comentar!
              </Typography>
            )}
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
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  const businessInfo = getUserBusiness();
  const roleInfo = getUserRole();

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imagePreview) return;
    
    setLoading(true);
    try {
      // Aquí solo enviamos texto por simplicidad
      await onCreatePost({ content });
      setContent('');
      handleRemoveImage();
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
              {user?.first_name || user?.username || 'Usuario'}
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
        
        {/* Preview de imagen */}
        {imagePreview && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{ 
                width: '100%', 
                maxHeight: '200px', 
                objectFit: 'cover',
                borderRadius: 1
              }}
            />
            
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                }
              }}
              onClick={handleRemoveImage}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-button-file"
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <label htmlFor="image-button-file">
              <IconButton 
                color="primary" 
                aria-label="upload picture" 
                component="span"
              >
                <ImageIcon />
              </IconButton>
            </label>
          </Box>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={(!content.trim() && !imagePreview) || loading}
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
  const { user, getUserBusiness } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const businessInfo = getUserBusiness();

  useEffect(() => {
    console.log("Feed component mounted!");
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getFeed();
      console.log("Feed data loaded:", data);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading feed:", err);
      setError('Error al cargar el feed. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const newPost = await postService.createPost(postData);
      setPosts([newPost, ...posts]);
    } catch (err) {
      console.error('Error al crear post:', err);
      alert('No se pudo crear la publicación. Intenta de nuevo más tarde.');
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
      // Recargar posts para obtener comentarios actualizados
      loadPosts();
    } catch (err) {
      console.error('Error al comentar:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error al eliminar post:', err);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box id="feed-root">
      <Typography variant="h4" component="h1" gutterBottom>
        Feed
      </Typography>
      
      {/* Mostrar banner para usuarios sin negocio */}
      {!businessInfo && <NoBusinessBanner />}
      
      <CreatePostCard onCreatePost={handleCreatePost} />
      
      {error && (
        <Box sx={{ textAlign: 'center', my: 4, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error.dark">{error}</Typography>
          <Button 
            variant="outlined" 
            color="error" 
            sx={{ mt: 1 }}
            onClick={loadPosts}
          >
            Reintentar
          </Button>
        </Box>
      )}
      
      {!error && posts.length === 0 && !loading && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <FeedIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography color="textSecondary" variant="h6">
              No hay publicaciones aún
            </Typography>
            <Typography color="textSecondary">
              ¡Sé el primero en publicar algo!
            </Typography>
          </CardContent>
        </Card>
      )}
      
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onDelete={handleDeletePost}
        />
      ))}
      
      {loading && posts.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default Feed;