// src/components/SocialFeed/PostCard.jsx - Sistema de comentarios corregido

import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, CardMedia, CardActions,
  Avatar, Typography, IconButton, Button, Box, Divider,
  TextField, Chip, Skeleton
} from '@mui/material';
import {
  MoreVert, FavoriteBorder, Favorite, 
  Comment, Share, Send, Business, Badge
} from '@mui/icons-material';

const PostCard = ({ post, onLike, onComment, onShare, loading = false }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState(post.comments_list || []);
  const [localCommentsCount, setLocalCommentsCount] = useState(post.comments || 0);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Formatear fecha relativa
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

  // ✅ CORRECCIÓN: Manejar comentarios localmente
  const handleCommentSubmit = async () => {
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);

    // Definir el id temporal fuera del try/catch
    const optimisticCommentId = `temp_${Date.now()}`;
    
    try {
      console.log('💬 Enviando comentario:', commentText);
      
      // Crear comentario optimista (mostrar inmediatamente)
      const optimisticComment = {
        id: optimisticCommentId, // ID temporal
        content: commentText,
        created_at: new Date().toISOString(),
        author: {
          name: 'Tú', // Se actualizará con la respuesta del servidor
          username: 'current_user'
        }
      };

      // ✅ Agregar comentario inmediatamente al estado local
      setLocalComments(prevComments => [optimisticComment, ...prevComments]);
      setLocalCommentsCount(prevCount => prevCount + 1);
      setCommentText(''); // Limpiar campo inmediatamente

      // Enviar al servidor
      const serverComment = await onComment(commentText);
      
      console.log('✅ Comentario enviado al servidor:', serverComment);
      
      // ✅ Reemplazar comentario optimista con el del servidor
      if (serverComment && serverComment.id) {
        setLocalComments(prevComments => 
          prevComments.map(comment => 
            comment.id === optimisticCommentId ? serverComment : comment
          )
        );
      }

    } catch (error) {
      console.error('❌ Error al enviar comentario:', error);
      
      // ✅ Revertir cambios optimistas en caso de error
      setLocalComments(prevComments => 
        prevComments.filter(comment => comment.id !== optimisticCommentId)
      );
      setLocalCommentsCount(prevCount => Math.max(0, prevCount - 1));
      setCommentText(commentText); // Restaurar texto del comentario
      
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <CardHeader
          avatar={<Skeleton variant="circular" width={40} height={40} />}
          title={<Skeleton variant="text" width="60%" />}
          subheader={<Skeleton variant="text" width="40%" />}
        />
        <CardContent>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </CardContent>
        <Skeleton variant="rectangular" height={200} />
        <CardActions>
          <Skeleton variant="text" width="100%" height={40} />
        </CardActions>
      </Card>
    );
  }

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
        <Typography 
          variant="body2" 
          color="text.secondary" 
          onClick={() => setShowComments(!showComments)} 
          sx={{ cursor: 'pointer' }}
        >
          {localCommentsCount} comentarios
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
            <Avatar sx={{ width: 32, height: 32 }}>
              {post.author?.name?.[0] || 'U'}
            </Avatar>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Escribe un comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={submittingComment}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    size="small" 
                    color="primary" 
                    disabled={!commentText.trim() || submittingComment}
                    onClick={handleCommentSubmit}
                  >
                    <Send fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </Box>
          
          {/* ✅ CORRECCIÓN: Usar comentarios locales */}
          {localComments && localComments.length > 0 ? (
            localComments.map((comment, index) => (
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