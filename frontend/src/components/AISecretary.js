import React from 'react';
import GenericChatInterface from './GenericChatInterface';

function AISecretary() {
  const handleSendMessage = async (message) => {
    // Get userId from localStorage
    const userId = localStorage.getItem('userId');
    
    // Debug log
    console.log('Sending message to AI Secretary:', { message, userId });
 
    const response = await fetch('/api/ai-secretary', {
      method: 'POST',
      body: JSON.stringify({ message, userId }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Debug log
    console.log('Response from server:', response);
    
    const data = await response.json();
    console.log('Parsed response data:', data);
    
    return data.reply;
  };

  return <GenericChatInterface 
    title="AI Secretary" 
    onSendMessage={handleSendMessage}
  />;
}

export default AISecretary;
