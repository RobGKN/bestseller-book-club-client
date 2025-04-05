import { createContext, useState } from 'react';
import api from '../services/api';

export const ReadingListContext = createContext();

export const ReadingListProvider = ({ children }) => {
  const [readingLists, setReadingLists] = useState([]);
  const [readingList, setReadingList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get a user's reading lists
  const getUserReadingLists = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/users/${userId}/reading-lists`);
      setReadingLists(data);
      return data;
    } catch (err) {
      setError('Failed to fetch reading lists');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single reading list
  const getReadingList = async (listId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/reading-lists/${listId}`);
      setReadingList(data);
      return data;
    } catch (err) {
      setError('Failed to fetch reading list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new reading list
  const createReadingList = async (listData) => {
    setError(null);
    try {
      const { data } = await api.post('/reading-lists', listData);
      setReadingLists((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError('Failed to create reading list');
      throw err;
    }
  };

  // Remove a book from a list
  const removeBookFromReadingList = async (listId, bookId) => {
    setError(null);
    try {
      await api.delete(`/reading-lists/${listId}/books/${bookId}`);
      if (readingList && readingList._id === listId) {
        setReadingList({
          ...readingList,
          books: readingList.books.filter((b) => b.book._id !== bookId),
        });
      }
    } catch (err) {
      setError('Failed to remove book from list');
      throw err;
    }
  };

  const value = {
    readingLists,
    readingList,
    loading,
    error,
    getUserReadingLists,
    getReadingList,
    createReadingList,
    removeBookFromReadingList,
  };

  return (
    <ReadingListContext.Provider value={value}>
      {children}
    </ReadingListContext.Provider>
  );
};
