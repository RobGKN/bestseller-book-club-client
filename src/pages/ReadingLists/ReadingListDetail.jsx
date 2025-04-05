import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReadingLists } from '../../hooks/useReadingLists';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../../components/ui/Spinner';
import BookListItem from '../../components/books/BookListItem';
import { PencilIcon, TrashIcon, ShareIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const ReadingListDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    readingList, 
    loading, 
    error, 
    getReadingList, 
    removeBookFromReadingList 
  } = useReadingLists();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToRemove, setBookToRemove] = useState(null);
  
  useEffect(() => {
    getReadingList(id);
  }, [id, getReadingList]);
  
  const handleRemoveBook = async () => {
    if (!bookToRemove) return;
    
    try {
      await removeBookFromReadingList(id, bookToRemove);
      setBookToRemove(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Failed to remove book:', err);
    }
  };
  
  const initiateRemoveBook = (bookId) => {
    setBookToRemove(bookId);
    setShowDeleteConfirm(true);
  };
  
  const isOwner = readingList && currentUser && readingList.user === currentUser._id;
  
  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Error: {error}
        </div>
      </div>
    );
  }
  
  if (!readingList) {
    return (
      <div className="max-w-4xl mx-auto my-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Reading list not found</p>
          <Link to="/profile" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Return to your profile
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{readingList.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <span className="flex items-center">
                  {readingList.isPublic ? (
                    <>
                      <EyeIcon className="w-5 h-5 mr-1" />
                      Public
                    </>
                  ) : (
                    <>
                      <EyeSlashIcon className="w-5 h-5 mr-1" />
                      Private
                    </>
                  )}
                </span>
                <span className="mx-2">•</span>
                <span>{readingList.books.length} {readingList.books.length === 1 ? 'book' : 'books'}</span>
                {readingList.followers && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{readingList.followers.length} {readingList.followers.length === 1 ? 'follower' : 'followers'}</span>
                  </>
                )}
              </div>
            </div>
            
            {isOwner && (
              <div className="flex space-x-2">
                <Link 
                  to={`/reading-lists/${id}/edit`}
                  className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md border border-gray-300 hover:border-primary-600"
                >
                  <PencilIcon className="w-5 h-5 mr-1" />
                  Edit
                </Link>
                <button 
                  className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md border border-gray-300 hover:border-primary-600"
                >
                  <ShareIcon className="w-5 h-5 mr-1" />
                  Share
                </button>
              </div>
            )}
          </div>
          
          {readingList.description && (
            <p className="text-gray-700 mb-6">{readingList.description}</p>
          )}
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Books in this list</h2>
            
            {readingList.books.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-600 mb-4">This reading list is empty</p>
                {isOwner && (
                  <Link to="/books/search" className="btn btn-primary">
                    Search for books to add
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {readingList.books.map((bookItem) => (
                  <div key={bookItem.book._id} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0">
                    <BookListItem book={bookItem.book} dateAdded={bookItem.dateAdded} notes={bookItem.notes} />
                    
                    {isOwner && (
                      <button
                        onClick={() => initiateRemoveBook(bookItem.book._id)}
                        className="text-red-600 hover:text-red-800 ml-4"
                        title="Remove from list"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Remove Book"
        message="Are you sure you want to remove this book from the reading list?"
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={handleRemoveBook}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setBookToRemove(null);
        }}
      />
    </div>
  );
};

export default ReadingListDetail;