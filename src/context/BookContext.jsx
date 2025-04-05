import { createContext, useState } from 'react';
import { bookAPI, reviewAPI } from '../services/api';

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search books
  const searchBooks = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await bookAPI.search(query);
      setBooks(data.books);
      return data.books;
    } catch (err) {
      setError(err.message || 'Failed to search books');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single book by ID
  const getBook = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await bookAPI.getById(id);
      setBook(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get reviews for a book
  const getBookReviews = async (bookId) => {
    setError(null);
    try {
      const { data } = await reviewAPI.getBookReviews(bookId);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to get reviews');
      throw err;
    }
  };

  // Submit a review
  const addReview = async (bookId, review) => {
    setError(null);
    try {
      const { data } = await reviewAPI.createReview(bookId, review);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to add review');
      throw err;
    }
  };

  const value = {
    books,
    book,
    loading,
    error,
    searchBooks,
    getBook,
    getBookReviews,
    addReview,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};
