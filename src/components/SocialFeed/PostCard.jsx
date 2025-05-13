// src/components/SocialFeed/PostCard.jsx
import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, CardMedia, CardActions,
  Avatar, Typography, IconButton, Button, Box, Divider,
  TextField, Chip
} from '@mui/material';
import {
  MoreVert, FavoriteBorder, Favorite, 
  Comment, Share, Send, Business, Badge
} from '@mui/icons-material';

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'Hace un momento';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Ahora mismo';
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diff / 86400000);
      return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    onComment(commentText);
    setCommentText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.author?.name?.[0] || 'U'}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.author?.name || 'Usuario'}
            </Typography>
            {post.author?.business && (
              <Chip
                icon={<Business fontSize="small" />}
                label={post.author.business}
                size="small"
                variant="outlined"
                sx={{ height: 24 }}
              />
            )}
            {post.author?.role && (
              <Chip
                icon={<Badge fontSize="small" />}
                label={post.author.role}
                size="small"
                color="secondary"
                sx={{ height: 24 }}
              />
            )}
          </Box>
        }
        subheader={formatDate(post.created_at)}
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ py: 1 }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {post.content}
        </Typography>
      </CardContent>
      
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post image"
          sx={{ 
            maxHeight: '400px',
            objectFit: 'cover'
          }}
        />
      )}
      
      <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {post.likes || 0} Me gusta
        </Typography>
        <Typography variant="body2" color="text.secondary" onClick={() => setShowComments(!showComments)} sx={{ cursor: 'pointer' }}>
          {post.comments || 0} comentarios
        </Typography>
      </Box>
      
      <Divider />
      
      <CardActions sx={{ px: 2, py: 1, justifyContent: 'space-between' }}>
        <Button
          startIcon={post.is_liked ? <Favorite color="error" /> : <FavoriteBorder />}
          onClick={() => onLike(post.id)}
          sx={{ 
            flex: 1, 
            color: post.is_liked ? 'error.main' : 'text.secondary',
            textTransform: 'none' 
          }}
        >
          Me gusta
        </Button>
        
        <Button
          startIcon={<Comment />}
          onClick={() => setShowComments(!showComments)}
          sx={{ flex: 1, color: 'text.secondary', textTransform: 'none' }}
        >
          Comentar
        </Button>
        
        <Button
          startIcon={<Share />}
          onClick={() => onShare(post.id)}
          sx={{ flex: 1, color: 'text.secondary', textTransform: 'none' }}
        >
          Compartir
        </Button>
      </CardActions>
      
      {showComments && (
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Escribe un comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    size="small" 
                    color="primary" 
                    disabled={!commentText.trim()}
                    onClick={handleCommentSubmit}
                  >
                    <Send fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </Box>
          
          {post.comments_list && post.comments_list.length > 0 ? (
            post.comments_list.map((comment, index) => (
              <Box key={comment.id || index} sx={{ mb: 1.5, display: 'flex', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {comment.author?.name?.[0] || 'U'}
                </Avatar>
                <Box>
                  <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: '0 12px 12px 12px' }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.author?.name || 'Usuario'}
                    </Typography>
                    <Typography variant="body2">
                      {comment.content}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {formatDate(comment.created_at)}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 2 }}>
              No hay comentarios aún. ¡Sé el primero en comentar!
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
};

export default PostCard;