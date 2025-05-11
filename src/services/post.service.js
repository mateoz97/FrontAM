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

  async createPost(data) {
    try {
      console.log('Creating post with data:', data);
      
      // Si data es FormData, no necesitamos configuración especial
      // Si no, intentamos convertirlo a FormData
      const isFormData = data instanceof FormData;
      
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};
      
      // Si no es FormData, pero es un objeto con image o video, convertirlo
      if (!isFormData && (data.image || data.video)) {
        const formData = new FormData();
        if (data.content) formData.append('content', data.content);
        if (data.image) formData.append('image', data.image);
        if (data.video) formData.append('video', data.video);
        
        const response = await api.post('/posts/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        console.log('Post created successfully:', response.data);
        return response.data;
      }
      
      // Si no hay multimedia o ya es FormData
      const response = await api.post('/posts/', data, config);
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
  },
  
  async deletePost(postId) {
    try {
      console.log(`Deleting post ${postId}...`);
      const response = await api.delete(`/posts/${postId}/`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default postService;