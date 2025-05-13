// src/services/post.service.js
import api from './api';

const postService = {
  /**
   * Obtiene el feed de publicaciones
   * @returns {Promise<Array>} Lista de publicaciones
   */
  async getFeed() {
    try {
      console.log('Obteniendo feed de publicaciones...');
      // Intentar primero el endpoint feed
      try {
        const response = await api.get('/posts/feed/');
        console.log('Feed obtenido correctamente:', response.data);
        
        // Manejar diferentes formatos de respuesta
        if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data)) {
            return response.data;
          } else if (response.data.results) {
            return response.data.results;
          }
        }
        
        return response.data || [];
      } catch (feedError) {
        console.log('Error al obtener feed, intentando endpoint principal...', feedError);
        // Si falla, intentar el endpoint principal
        const response = await api.get('/posts/');
        console.log('Posts obtenidos correctamente:', response.data);
        
        // Manejar diferentes formatos de respuesta
        if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data)) {
            return response.data;
          } else if (response.data.results) {
            return response.data.results;
          }
        }
        
        return response.data || [];
      }
    } catch (error) {
      console.error('Error al obtener publicaciones:', error.response?.data || error.message);
      // Devolver array vacío para evitar errores
      return [];
    }
  },

  /**
   * Crea una nueva publicación
   * @param {Object} data - Datos de la publicación
   * @returns {Promise<Object>} Publicación creada
   */
  async createPost(data) {
    try {
      console.log('Creando publicación con datos:', data);
      
      // Determinar si es FormData o un objeto regular
      const isFormData = data instanceof FormData;
      let postData;
      
      if (isFormData) {
        postData = data;
      } else {
        // Crear un FormData si hay archivos o convertir a objeto si no
        if (data.image || data.video) {
          postData = new FormData();
          
          // Añadir todos los campos al FormData
          if (data.content) postData.append('content', data.content);
          if (data.image) postData.append('image', data.image);
          if (data.video) postData.append('video', data.video);
          
          // Si hay businessId, añadirlo como business
          if (data.businessId) postData.append('business', data.businessId);
          
        } else {
          // Si no hay archivos, usar un objeto normal
          postData = {
            content: data.content
          };
          
          // Si hay businessId, añadirlo como business
          if (data.businessId) {
            postData.business = data.businessId;
          }
        }
      }
      
      // Configurar headers adecuados
      const config = isFormData || data.image || data.video ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};
      
      // Enviar solicitud
      const response = await api.post('/posts/', postData, config);
      console.log('Publicación creada correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear publicación:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Da/quita like a una publicación
   * @param {number} postId - ID de la publicación
   * @returns {Promise<Object>} Resultado de la operación
   */
  async likePost(postId) {
    try {
      console.log(`Dando like a publicación ${postId}...`);
      const response = await api.post(`/posts/${postId}/like/`);
      console.log('Respuesta de like:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al dar like a la publicación:', error.response?.data || error.message);
      // Valor predeterminado en caso de error
      return { liked: false, likes_count: 0 };
    }
  },

  /**
   * Añade un comentario a una publicación
   * @param {number} postId - ID de la publicación
   * @param {string} content - Contenido del comentario
   * @returns {Promise<Object>} Comentario creado
   */
  async commentPost(postId, content) {
    try {
      console.log(`Comentando en publicación ${postId} con contenido:`, content);
      const response = await api.post(`/posts/${postId}/comment/`, { content });
      console.log('Comentario creado correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al comentar en la publicación:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Obtiene los comentarios de una publicación
   * @param {number} postId - ID de la publicación
   * @returns {Promise<Array>} Lista de comentarios
   */
  async getComments(postId) {
    try {
      console.log(`Obteniendo comentarios de la publicación ${postId}...`);
      const response = await api.get(`/posts/${postId}/comments/`);
      console.log('Comentarios obtenidos correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener comentarios:', error.response?.data || error.message);
      // Devolver array vacío para evitar errores
      return [];
    }
  },
  
  /**
   * Elimina una publicación
   * @param {number} postId - ID de la publicación
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deletePost(postId) {
    try {
      console.log(`Eliminando publicación ${postId}...`);
      const response = await api.delete(`/posts/${postId}/`);
      console.log('Publicación eliminada correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar publicación:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default postService;