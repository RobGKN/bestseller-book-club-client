import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
});

// Request interceptor for adding auth token
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
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Book endpoints
export const bookAPI = {
  search: (query) => api.get(`/books/search?query=${query}`),
  getById: (id) => api.get(`/books/${id}`),
  //getTopBooks: () => api.get('/books/top'),
};

// Review endpoints
export const reviewAPI = {
  getBookReviews: (bookId) => api.get(`/reviews/book/${bookId}`),
  createReview: (bookId, reviewData) => api.post(`/reviews/book/${bookId}`, reviewData),
  updateReview: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

export default api;
