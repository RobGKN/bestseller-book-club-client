import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooks } from '../../hooks/useBooks';
import { useAuth } from '../../hooks/useAuth';
import { useReadingLists } from '../../hooks/useReadingLists';
import Spinner from '../../components/ui/Spinner';
import ReviewForm from '../../components/reviews/ReviewForm';
import ReviewList from '../../components/reviews/ReviewList';
import AddToReadingListModal from '../../components/books/AddToReadingListModal';

const BookDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { getBook, getBookReviews, book, loading, error } = useBooks();
  const { readingLists, getUserReadingLists, loading: listsLoading } = useReadingLists();
  
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [showAddToListModal, setShowAddToListModal] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        await getBook(id);
      } catch (err) {
        console.error('Failed to load book:', err);
      }
    };
    
    fetchBookData();
  }, [id, getBook]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (book && book._id) {
        setReviewsLoading(true);
        try {
          const bookReviews = await getBookReviews(book._id);
          setReviews(bookReviews);
        } catch (err) {
          setReviewsError('Failed to load reviews');
        } finally {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();
  }, [book, getBookReviews]);

  useEffect(() => {
    if (currentUser && showAddToListModal) {
      getUserReadingLists(currentUser._id);
    }
  }, [currentUser, showAddToListModal, getUserReadingLists]);

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

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

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto my-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Book not found</p>
          <Link to="/books/search" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Return to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex justify-center">
            <img
              src={book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover'}
              alt={`Cover of ${book.title}`}
              className="w-48 h-auto object-cover rounded shadow-md"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-lg text-gray-700 mb-4">
              by {book.authors ? book.authors.join(', ') : 'Unknown Author'}
            </p>
            
            {book.averageRating > 0 && (
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {book.averageRating.toFixed(1)} ({book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
            
            {book.categories && book.categories.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-gray-700">Categories:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {book.categories.map((category, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {book.publisher && (
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Publisher:</span> {book.publisher}
                {book.publishedDate && ` (${new Date(book.publishedDate).getFullYear()})`}
              </p>
            )}
            
            {book.pageCount && (
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Pages:</span> {book.pageCount}
              </p>
            )}
            
            {book.language && (
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Language:</span> {book.language.toUpperCase()}
              </p>
            )}
            
            {currentUser && (
              <div className="flex flex-wrap gap-3 mt-6">
                <button 
                  onClick={() => setShowAddToListModal(true)}
                  className="btn btn-primary"
                >
                  Add to Reading List
                </button>
              </div>
            )}
          </div>
        </div>
        
        {book.description && (
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
          
          {currentUser ? (
            <ReviewForm bookId={book._id} onReviewAdded={handleReviewAdded} />
          ) : (
            <div className="bg-gray-50 p-4 rounded mb-6 text-center">
              <p className="text-gray-700">
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Sign in
                </Link>{' '}
                to leave a review
              </p>
            </div>
          )}
          
          {reviewsLoading ? (
            <div className="flex justify-center my-8">
              <Spinner />
            </div>
          ) : reviewsError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {reviewsError}
            </div>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </div>
      </div>

      {showAddToListModal && (
        <AddToReadingListModal
          book={book}
          readingLists={readingLists}
          loading={listsLoading}
          onClose={() => setShowAddToListModal(false)}
        />
      )}
    </div>
  );
};

export default BookDetail;