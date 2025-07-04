import React, { useState, useEffect } from 'react';
import { Star, Star as StarFilled } from 'lucide-react';
import { DOMAIN } from '../../constants/domain';

const Token = localStorage.getItem('token');

const NoticeItem = ({ title, noticeId, date, description, noticeType, isFavorite, isRead, onClick }: { title: string; noticeId: number; date: string; description: string; noticeType: 'maintenance' | 'events' | 'updates'; isFavorite: boolean; isRead: boolean; onClick?: () => void; }) => {
  const [iisFavorite, setIsFavorite] = useState(isFavorite);
  const [iisRead, setIsRead] = useState(isRead);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    console.log('Initial isFavorite:', isFavorite);
    console.log('Initial isRead:', isRead);
  }, [isFavorite, isRead]);

  const handleFavorite = (noticeId: number) => {
    fetch(`${DOMAIN}/Notice/PriorityOrFavourite/${noticeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify({ isFavourite: !iisFavorite }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 401) {
            window.location.href = '/login';
            alert('Unauthorized: Login First');
            return;
          }
          if (response.status === 400) {
            window.location.href = '/';
            alert(errorMessage);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return;
      })
      .then(() => {
        setIsFavorite(!iisFavorite);
      })
      .catch((error) => {
        console.error('Error updating favorite status:', error);
      });
  };

  const handleRead = (noticeId: number) => {
    fetch(`${DOMAIN}/Notice/MarkAsRead/${noticeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`,
      },
      body: JSON.stringify({ isRead: !iisRead }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 401) {
            window.location.href = '/login';
            alert('Unauthorized: Login First');
            return;
          }
          if (response.status === 400) {
            window.location.href = '/';
            alert(errorMessage);
            return;
          }
          throw new Error('Network response was not ok');
        }
        return;
      })
      .then(() => {
        setIsRead(!iisRead);
      })
      .catch((error) => {
        console.error('Error updating read status:', error);
      });
  };

  const typeColors = {
    maintenance: 'bg-orange-50',
    events: 'bg-purple-50',
    updates: 'bg-emerald-50',
  };

  return (
    <div
      className={`p-4 ${typeColors[noticeType]} shadow-md rounded-lg mb-4 hover:shadow-lg transition duration-200 cursor-pointer`}
      onClick={() => {setIsExpanded(!isExpanded),iisRead? '':handleRead(noticeId)}}
    >
      <div className="flex justify-between items-center">
        <h3 className={`text-xl font-bold ${iisRead ? 'text-gray-500' : 'text-indigo-800'}`}>{title}</h3>
        <button onClick={(e) => { e.stopPropagation(); handleFavorite(noticeId); }} aria-label="Toggle favorite">
          {iisFavorite ? <StarFilled className="text-yellow-500" /> : <Star className="text-gray-400" />}
        </button>
      </div>
      <p className="text-sm text-gray-500">{date}</p>
      <p className={`mt-2 ${iisRead ? 'text-gray-500' : 'text-gray-700'}`}>
        {isExpanded ? description : `${description.substring(0, 100)}...`}
      </p>
      <button onClick={(e) => { e.stopPropagation(); handleRead(noticeId); }} className="mt-2 text-sm text-indigo-600 hover:underline">
        Mark as {iisRead ? 'Unread' : 'Read'}
      </button>
    </div>
  );
};

export default NoticeItem;