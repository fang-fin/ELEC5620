import React from 'react';
import GenericChatInterface from './GenericChatInterface';

function PersonalSavingsAssistant() {
  const handleSendMessage = async (message) => {
   
    const response = await fetch('/api/personal-savings', {
      method: 'POST',
      body: JSON.stringify({ message, userId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data.reply;
  };

  return <GenericChatInterface 
    title="Personal Savings Assistant" 
    onSendMessage={handleSendMessage}
  />;
}

export default PersonalSavingsAssistant;
