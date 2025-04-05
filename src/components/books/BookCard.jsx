// src/components/books/BookCard.jsx
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const defaultImage = 'https://via.placeholder.com/128x192?text=No+Cover';

  return (
    <div className="card flex flex-col h-full">
      <div className="p-4 flex-grow">
        <Link to={`/books/${book._id || book.googleBooksId}`}>
          <img 
            src={book.imageLinks?.thumbnail || defaultImage} 
            alt={`Cover of ${book.title}`}
            className="w-32 h-48 object-cover mx-auto mb-4 rounded shadow"
          />
          <h3 className="text-lg font-semibold text-center">{book.title}</h3>
        </Link>
        <p className="text-sm text-gray-600 text-center">
          {book.authors ? book.authors.join(', ') : 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
