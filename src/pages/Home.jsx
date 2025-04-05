// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to BestsellerBookClub 📚</h1>
      <p className="text-gray-600 text-lg mb-8">
        Discover books, build your reading lists, and share reviews with your friends.
      </p>

      <div className="flex justify-center space-x-4">
        {!currentUser ? (
          <>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Log In
            </Link>
          </>
        ) : (
          <>
            <Link to="/books/search" className="btn btn-primary">
              Search Books
            </Link>
            <Link to={`/profile/${currentUser._id}`} className="btn btn-secondary">
              My Profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
