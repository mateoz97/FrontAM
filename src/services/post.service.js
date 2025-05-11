// src/services/post.service.js
import api from './api';

const postService = {
  async getFeed() {
    try {
      console.log('Fetching feed...');
      // Primero intentar el endpoint feed
      try {
        const response = await api.get('/posts/feed/');
        console.log('Feed fetched successfully:', response.data);
        return response.data;
      } catch (feedError) {
        console.log('Error fetching feed, trying main endpoint...', feedError);
        // Si falla, intentar el endpoint principal
        const response = await api.get('/posts/');
        console.log('Posts fetched successfully:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching posts:', error.response?.data || error.message);
      // Devolver array vacío para evitar errores
      return [];
    }
  },

  async createPost(postData) {
    try {
      console.log('Creating post with data:', postData);
      const response = await api.post('/posts/', postData);
      console.log('Post created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      throw error;
    }
  },

  async likePost(postId) {
    try {
      console.log(`Liking post ${postId}...`);
      const response = await api.post(`/posts/${postId}/like/`);
      console.log('Like response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error.response?.data || error.message);
      // Valor predeterminado en caso de error
      return { liked: false, likes_count: 0 };
    }
  },

  async commentPost(postId, content) {
    try {
      console.log(`Commenting on post ${postId} with content:`, content);
      const response = await api.post(`/posts/${postId}/comment/`, { content });
      console.log('Comment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error commenting on post:', error.response?.data || error.message);
      throw error;
    }
  },

  async getComments(postId) {
    try {
      console.log(`Fetching comments for post ${postId}...`);
      const response = await api.get(`/posts/${postId}/comments/`);
      console.log('Comments:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error.response?.data || error.message);
      // Devolver array vacío para evitar errores
      return [];
    }
  }
};

export default postService;