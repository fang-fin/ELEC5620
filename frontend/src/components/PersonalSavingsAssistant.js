import React from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';

function PersonalSavingsAssistant() {
  return (
    <div className="flex flex-col h-full">
      <MessageList />
      <InputArea />
    </div>
  );
}

export default PersonalSavingsAssistant;
