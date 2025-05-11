// src/services/post.service.js
import api from './api';

const postService = {
  async getFeedPosts() {
    try {
      const response = await api.get('/posts/feed/');
      return response.data;
    } catch (error) {
      console.error('Error getting feed posts:', error);
      return [];
    }
  },

  async createPost(postData) {
    const response = await api.post('/posts/', postData);
    return response.data;
  },

  async likePost(postId) {
    const response = await api.post(`/posts/${postId}/like/`);
    return response.data;
  },

  async commentPost(postId, comment) {
    const response = await api.post(`/posts/${postId}/comment/`, { comment });
    return response.data;
  }
};

export default postService;