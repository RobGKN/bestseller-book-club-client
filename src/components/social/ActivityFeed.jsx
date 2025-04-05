// src/components/social/ActivityFeed.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../../services/api';
import Spinner from '../ui/Spinner';

const ActivityFeed = ({ userId }) => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await api.get(`/users/${userId}/activity`);
        setActivity(data);
      } catch (err) {
        setError('Failed to load activity');
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!activity.length) return <p className="text-gray-500">No recent activity.</p>;

  return (
    <ul className="space-y-4">
      {activity.map((item) => (
        <li key={item._id} className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-800">
            {item.description || 'User did something'}{' '}
            <Link to={item.link} className="text-primary-600 hover:underline">
              View
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-1">{format(new Date(item.date), 'PPpp')}</p>
        </li>
      ))}
    </ul>
  );
};

export default ActivityFeed;
