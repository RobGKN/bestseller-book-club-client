// src/services/api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL });

// Attach token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
};

//  Book endpoints
export const bookAPI = {
  search: (query) => api.get(`/books/search?query=${encodeURIComponent(query)}`),
  getById: (id) => api.get(`/books/${id}`),
  // getTopBooks: () => api.get('/books/top'),
};

// Review endpoints
export const reviewAPI = {
  getBookReviews: (bookId) => api.get(`/reviews/book/${bookId}`),
  createReview: (bookId, data) => api.post(`/reviews/book/${bookId}`, data),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

export default api;
