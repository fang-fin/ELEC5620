import React from 'react';
import GenericChatInterface from './GenericChatInterface';

function AISecretary() {
  const handleSendMessage = async (message) => {
 
    const response = await fetch('/api/ai-secretary', {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data.reply;
  };

  const extraUI = (
    <div className="p-4 bg-gray-100">
      {/*  */}
    </div>
  );

  return <GenericChatInterface 
    title="AI Secretary" 
    onSendMessage={handleSendMessage}
    extraUI={extraUI}
  />;
}

export default AISecretary;
