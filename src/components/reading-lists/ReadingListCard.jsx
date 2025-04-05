// src/components/reading-lists/ReadingListCard.jsx
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, UserIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const ReadingListCard = ({ readingList }) => {
  const defaultImage = 'https://via.placeholder.com/64x96?text=No+Cover';
  const books = readingList.books || [];

  return (
    <Link
      to={`/reading-lists/${readingList._id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{readingList.title}</h3>
        <span className="text-gray-500 text-sm">
          {readingList.isPublic ? (
            <EyeIcon className="w-4 h-4 inline-block mr-1" />
          ) : (
            <EyeSlashIcon className="w-4 h-4 inline-block mr-1" />
          )}
          {readingList.isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      {readingList.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{readingList.description}</p>
      )}

      <div className="flex items-center text-xs text-gray-500 space-x-4">
        <span className="flex items-center">
          <BookOpenIcon className="w-4 h-4 mr-1" />
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </span>
        <span className="flex items-center">
          <UserIcon className="w-4 h-4 mr-1" />
          {readingList.followers?.length || 0} followers
        </span>
        {readingList.createdAt && (
          <span>Created {format(new Date(readingList.createdAt), 'MMM d, yyyy')}</span>
        )}
      </div>
    </Link>
  );
};

export default ReadingListCard;
