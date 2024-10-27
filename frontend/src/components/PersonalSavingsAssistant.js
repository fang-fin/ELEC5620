import React from 'react';
import GenericChatInterface from './GenericChatInterface';

function PersonalSavingsAssistant() {
  const handleSendMessage = async (message) => {
    // Get userId from localStorage
    const userId = localStorage.getItem('userId');
    
    // Debug log
    console.log('Sending message with userId:', { message, userId });
   
    const response = await fetch('/api/personal-savings', {
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
    title="Personal Savings Assistant" 
    onSendMessage={handleSendMessage}
  />;
}

export default PersonalSavingsAssistant;
