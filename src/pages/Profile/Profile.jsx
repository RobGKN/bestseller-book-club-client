import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useReadingLists } from '../../hooks/useReadingLists';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { PencilIcon, BookOpenIcon, UserIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import ReadingListCard from '../../components/reading-lists/ReadingListCard';
import ActivityFeed from '../../components/social/ActivityFeed';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getUserReadingLists, readingLists, loading: listsLoading } = useReadingLists();
  
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/users/${id}`);
        setProfileUser(data);
        getUserReadingLists(id);

        if (currentUser && currentUser._id !== id) {
          const { data: followingData } = await api.get(`/users/${currentUser._id}/following`);
          setIsFollowing(followingData.some(user => user._id === id));
        }

        const { data: followers } = await api.get(`/users/${id}/followers`);
        const { data: following } = await api.get(`/users/${id}/following`);
        setFollowerCount(followers.length);
        setFollowingCount(following.length);

      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, currentUser, getUserReadingLists]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/users/${id}/follow`);
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      } else {
        await api.post(`/users/${id}/follow`);
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle follow state', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <Spinner size="large" />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-3xl mx-auto my-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error || 'User not found'}
        </div>
        <Link to="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Return to homepage
        </Link>
      </div>
    );
  }

  const isCurrentUser = currentUser && currentUser._id === id;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{profileUser.name || profileUser.username}</h1>
            <p className="text-gray-600 mb-2">@{profileUser.username}</p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>{followerCount} {followerCount === 1 ? 'Follower' : 'Followers'}</span>
              <span>{followingCount} Following</span>
            </div>
          </div>

          <div>
            {isCurrentUser ? (
              <Link to={`/profile/${id}/edit`} className="btn btn-secondary flex items-center">
                <PencilIcon className="w-5 h-5 mr-1" />
                Edit Profile
              </Link>
            ) : (
              <button 
                onClick={handleFollowToggle}
                className="btn btn-primary"
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-4 mb-6 border-b border-gray-200">
          <Tab
            className={({ selected }) =>
              `px-4 py-2 font-medium ${
                selected
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <BookmarkIcon className="w-5 h-5" />
              <span>Reading Lists</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `px-4 py-2 font-medium ${
                selected
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="w-5 h-5" />
              <span>Activity</span>
            </div>
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            {listsLoading ? (
              <Spinner />
            ) : readingLists.length === 0 ? (
              <p className="text-gray-500">No reading lists yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readingLists.map((list) => (
                  <ReadingListCard key={list._id} readingList={list} />
                ))}
              </div>
            )}
          </Tab.Panel>
          <Tab.Panel>
            <ActivityFeed userId={id} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Profile;
