// src/components/SocialFeed/PostCard.jsx
import React from 'react';
import {
  Card, CardHeader, CardContent, CardMedia, CardActions,
  Avatar, Typography, IconButton, Button, Box
} from '@mui/material';
import { MoreVert, ThumbUp, Comment, Share } from '@mui/icons-material';

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Hace ${minutes} minutos`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `Hace ${hours} horas`;
    } else {
      const days = Math.floor(diff / 86400000);
      return `Hace ${days} días`;
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.author.name[0]}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title={post.author.name}
        subheader={formatDate(post.createdAt)}
      />
      
      <CardContent>
        <Typography>{post.content}</Typography>
      </CardContent>
      
      {post.image && (
        <CardMedia
          component="img"
          height="300"
          image={post.image}
          alt="Post image"
        />
      )}
      
      <Box sx={{ px: 2, py: 1, borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {post.likes} Me gusta
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {post.comments} comentarios
          </Typography>
        </Box>
      </Box>
      
      <CardActions sx={{ justifyContent: 'space-around' }}>
        <Button
          startIcon={<ThumbUp />}
          sx={{ flex: 1, textTransform: 'none' }}
          onClick={() => onLike(post.id)}
        >
          Me gusta
        </Button>
        <Button
          startIcon={<Comment />}
          sx={{ flex: 1, textTransform: 'none' }}
          onClick={() => onComment(post.id)}
        >
          Comentar
        </Button>
        <Button
          startIcon={<Share />}
          sx={{ flex: 1, textTransform: 'none' }}
          onClick={() => onShare(post.id)}
        >
          Compartir
        </Button>
      </CardActions>
    </Card>
  );
};

export default PostCard;