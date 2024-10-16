import React from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import InputArea from './InputArea';

function ChatInterface() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <MessageList />
        <InputArea />
      </div>
    </div>
  );
}

export default ChatInterface;
