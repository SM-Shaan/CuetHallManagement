import React, { useState } from 'react';
import { Star, Star as StarFilled } from 'lucide-react';

interface NoticeItemProps {
  title: string;
  date: string;
  description: string;
  type: 'maintenance' | 'events' | 'updates';
  onClick?: () => void;
}

const NoticeItem: React.FC<NoticeItemProps> = ({ title, date, description, type, onClick }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRead, setIsRead] = useState(false);

  const handleFavorite = () => setIsFavorite(!isFavorite);
  const handleRead = () => setIsRead(!isRead);

  const typeColors = {
    maintenance: 'bg-orange-50',
    events: 'bg-purple-50',
    updates: 'bg-emerald-50',
  };

  return (
    <div
      className={`p-4 ${typeColors[type] } shadow-md rounded-lg mb-4 hover:shadow-lg transition duration-200 cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className={`text-xl font-bold ${isRead ? 'text-gray-500' : 'text-indigo-800'}`}>{title}</h3>
        <button onClick={handleFavorite} aria-label="Toggle favorite">
          {isFavorite ? <StarFilled className="text-yellow-500" /> : <Star className="text-gray-400" />}
        </button>
      </div>
      <p className="text-sm text-gray-500">{date}</p>
      <p className={`mt-2 ${isRead ? 'text-gray-500' : 'text-gray-700'}`}>{description}</p>
      <button onClick={handleRead} className="mt-2 text-sm text-indigo-600 hover:underline">
        Mark as {isRead ? 'Unread' : 'Read'}
      </button>
    </div>
  );
};

export default NoticeItem;