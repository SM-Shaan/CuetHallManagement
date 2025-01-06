
import { Bot, X } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatButton = ({ isOpen, onClick }: ChatButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 z-50 flex items-center justify-center"
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? <X size={24} /> : <Bot size={24} />}
    </button>
  );
};

export default ChatButton;