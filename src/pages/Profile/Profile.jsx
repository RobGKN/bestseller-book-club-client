import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import BookListItem from '../../components/books/BookListItem';
import { useReadingLists } from '../../hooks/useReadingLists';

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const userId = id || (currentUser && currentUser._id); 

  const isCurrentUser = !id || (currentUser && currentUser._id === userId);

  const [user, setUser] = useState(null);
  const [readingLists, setReadingLists] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [bookLoading, setBookLoading] = useState(false);

  const { getUserReadingLists } = useReadingLists();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const { data } = userId === currentUser?._id
          ? await api.get('/auth/me')
          : { data: null }; // optionally show error for others
    
        setUser(data);
    
        const lists = await getUserReadingLists(userId);
        setReadingLists(lists);
    
        // Skip followers/following if not current user
        //if (userId === currentUser?._id) {
        //  const { data: followers } = await api.get(`/users/${userId}/followers`);
        //  const { data: following } = await api.get(`/users/${userId}/following`);
        //  setFollowers(followers);
        //  setFollowing(following);
        //}
      } catch (err) {
        console.error('Failed to load profile:', err);
        navigate('/');
      }
    };

    fetchUserProfile();
  }, [userId, navigate, getUserReadingLists]);

  //const handleFollow = async () => {
  //  try {
  //    await api.post(`/users/${userId}/follow`);
  //    setFollowers((prev) => [...prev, currentUser]);
  //  } catch (err) {
  //    console.error('Failed to follow user', err);
  //  }
  //};
//
  //const handleUnfollow = async () => {
  //  try {
  //    await api.delete(`/users/${userId}/follow`);
  //    setFollowers((prev) => prev.filter((f) => f._id !== currentUser._id));
  //  } catch (err) {
  //    console.error('Failed to unfollow user', err);
  //  }
  //};

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
      <p className="text-gray-600">@{user.username}</p>
      <p className="mt-2 text-gray-700">{user.bio || 'No bio yet.'}</p>

      <div className="mt-4 flex gap-4 text-sm text-gray-500">
        <p><strong>{followers.length}</strong> Followers</p>
        <p><strong>{following.length}</strong> Following</p>
      </div>

      {!isCurrentUser && currentUser && (
        followers.find((f) => f._id === currentUser._id) ? (
          <button className="btn btn-secondary mt-4" onClick={handleUnfollow}>
            Unfollow
          </button>
        ) : (
          <button className="btn btn-primary mt-4" onClick={handleFollow}>
            Follow
          </button>
        )
      )}

      {isCurrentUser && (
        <div className="mt-6">
          <Link to={`/profile/${userId}/edit`} className="btn btn-outline">
            Edit Profile
          </Link>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Reading Lists</h2>
        {readingLists.length > 0 ? (
          <ul className="space-y-2">
            {readingLists.map((list) => (
              <li key={list._id} className="p-4 border rounded-md">
                <h3 className="font-semibold">{list.name}</h3>
                <p className="text-sm text-gray-600">{list.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reading lists yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
