import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="flex-grow overflow-auto p-4">
      {messages.map((message, index) => (
        <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
