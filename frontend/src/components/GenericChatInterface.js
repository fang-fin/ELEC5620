import React, { useState } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';

function GenericChatInterface({ title, onSendMessage, extraUI }) {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (message) => {
    setMessages([...messages, { text: message, isUser: true }]);
    if (onSendMessage) {
      const response = await onSendMessage(message);
      setMessages(prevMessages => [...prevMessages, { text: response, isUser: false }]);
    } else {
      console.warn('onSendMessage function not provided');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-md rounded-lg">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {extraUI}
      <MessageList messages={messages} />
      <InputArea onSendMessage={handleSendMessage} />
    </div>
  );
}

export default GenericChatInterface;
