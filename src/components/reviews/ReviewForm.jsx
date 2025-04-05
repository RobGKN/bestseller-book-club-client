// src/components/reviews/ReviewForm.jsx
import { useState } from 'react';
import { useBooks } from '../../hooks/useBooks';
import { toast } from 'react-toastify';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const ReviewForm = ({ bookId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { addReview } = useBooks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReview = await addReview(bookId, { rating, comment });
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
      onReviewAdded(newReview);
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label className="block font-semibold mb-2">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const Star = star <= rating ? StarIcon : StarOutlineIcon;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-yellow-400 w-6 h-6"
              >
                <Star />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Comment</label>
        <textarea
          className="form-input w-full"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
