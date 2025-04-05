// src/components/layout/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-primary-600">
        BestsellerBookClub
      </Link>
      <div className="space-x-4">
        {currentUser ? (
          <>
            <Link to={`/profile/${currentUser._id}`} className="text-gray-700 hover:text-primary-600">
              Profile
            </Link>
            <button onClick={logout} className="text-gray-700 hover:text-red-500">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-primary-600">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-primary-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
