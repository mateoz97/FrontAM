// src/services/post.service.js
import api from './api';

const postService = {
  async getFeed() {
    const response = await api.get('/posts/feed/');
    return response.data;
  },

  async createPost(postData) {
    const response = await api.post('/posts/', postData);
    return response.data;
  },

  async likePost(postId) {
    const response = await api.post(`/posts/${postId}/like/`);
    return response.data;
  },

  async commentPost(postId, content) {
    const response = await api.post(`/posts/${postId}/comment/`, { content });
    return response.data;
  },

  async getComments(postId) {
    const response = await api.get(`/posts/${postId}/comments/`);
    return response.data;
  }
};

export default postService;