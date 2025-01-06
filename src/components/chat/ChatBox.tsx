import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatBoxProps {
  isOpen: boolean;
}

const ChatBox = ({ isOpen }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! How can I help you with hall management today?', isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isBot: false }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "I'm here to help! You can ask me about room allocation, dining schedules, or any other hall-related queries.",
        isBot: true
      }]);
    }, 1000);

    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-40">
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">Hall Management Assistant</h3>
        <p className="text-sm opacity-75">Ask me anything about the hall</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;