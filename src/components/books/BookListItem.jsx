// src/components/books/BookListItem.jsx
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const BookListItem = ({ book, dateAdded, notes }) => {
  const defaultImage = 'https://via.placeholder.com/128x192?text=No+Cover';

  return (
    <div className="flex items-start space-x-4">
      <img
        src={book.imageLinks?.thumbnail || defaultImage}
        alt={book.title}
        className="w-20 h-32 object-cover rounded shadow"
      />
      <div className="flex-1">
        <Link to={`/books/${book._id || book.googleBooksId}`}>
          <h3 className="text-lg font-semibold">{book.title}</h3>
        </Link>
        <p className="text-sm text-gray-600">{book.authors?.join(', ') || 'Unknown author'}</p>
        {notes && <p className="mt-2 text-sm text-gray-800 italic">"{notes}"</p>}
        {dateAdded && (
          <p className="mt-1 text-xs text-gray-500">
            Added on {format(new Date(dateAdded), 'MMM d, yyyy')}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookListItem;
