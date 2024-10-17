import React, { useState } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';

function ChatInterface({ title }) {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    // 添加用户消息
    setMessages([...messages, { text: message, isUser: true }]);

    // 这里是AI回答的接口
    // 在实际应用中，这里应该调用后端API
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: `AI response to: ${message}`, isUser: false }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-md rounded-lg">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <MessageList messages={messages} />
      <InputArea onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatInterface;
