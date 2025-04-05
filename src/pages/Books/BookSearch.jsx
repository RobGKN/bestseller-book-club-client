import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../../hooks/useBooks';
import BookCard from '../../components/books/BookCard';
import Spinner from '../../components/ui/Spinner';

const BookSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const { books, loading, error, searchBooks } = useBooks();

  useEffect(() => {
    if (query) {
      searchBooks(query);
    }
  }, [query, searchBooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ query: searchTerm });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book Search</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            className="form-input flex-grow"
            placeholder="Search for books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary whitespace-nowrap">
            Search Books
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center my-12">
          <Spinner size="large" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          Error: {error}
        </div>
      ) : books.length > 0 ? (
        <>
          <p className="mb-4 text-gray-600">Found {books.length} results for "{query}"</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.googleBooksId || book._id} book={book} />
            ))}
          </div>
        </>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No books found for "{query}"</p>
          <p className="text-gray-500 mt-2">Try a different search term</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Search for books to get started</p>
          <p className="text-gray-500 mt-2">Try searching by title, author, or ISBN</p>
        </div>
      )}
    </div>
  );
};

export default BookSearch;