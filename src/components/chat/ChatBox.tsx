import React, { useState, useEffect, useRef } from 'react';
import { DOMAIN } from '../../constants/domain';

interface ChatBoxProps {
  isOpen: boolean;
}

interface Message {
  text: string;
  senderName: string;
  isMyself: boolean;
}

const ChatBox = ({ isOpen }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${DOMAIN}/Chat/GetChats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }
        const data = await response.json();
        const fetchedMessages = data.chats.map((chat: any) => ({
          text: chat.message,
          senderName: chat.sender === chat.myself ? 'You' : chat.senderName,
          isMyself: chat.sender === chat.myself,
        }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 1000); // Fetch chats every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { text: input, senderName: 'You', isMyself: true };
    setMessages(prev => [...prev, newMessage]);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${DOMAIN}/Chat/AddChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setInput('');
  };

  useEffect(() => {
    const sendPostRequest = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${DOMAIN}/Chat/Update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ message: 'Automated message' }),
        });
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    const interval = setInterval(sendPostRequest, 1000); // Send POST request every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-40">
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold">Chat Box</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
        <div ref={messagesEndRef} />
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isMyself ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.isMyself ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              <div>{message.text}</div>
              <div style={{ fontSize: '0.75rem', color: message.isMyself ? 'white' : 'gray' }}>By {message.senderName}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Type your message..."
        />
      </form>
    </div>
  );
};

export default ChatBox;