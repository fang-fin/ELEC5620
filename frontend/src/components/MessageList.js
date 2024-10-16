import React from 'react';

function MessageList() {
  // 这里应该有一个状态来存储消息
  const messages = [
    { id: 1, text: "Hello! How can I assist you today?", isAI: true },
    { id: 2, text: "I need help with React.", isAI: false },
  ];

  return (
    <div className="flex-grow overflow-auto p-4">
      {messages.map((message) => (
        <div key={message.id} className={`mb-4 ${message.isAI ? 'text-left' : 'text-right'}`}>
          <div className={`inline-block p-2 rounded-lg ${message.isAI ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
