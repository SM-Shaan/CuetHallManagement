import { useState } from 'react';
import ChatButton from './ChatButton';
import ChatBox from './ChatBox';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <ChatBox isOpen={isOpen} />
    </>
  );
};

export default ChatWidget;