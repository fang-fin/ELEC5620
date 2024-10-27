import React from 'react';
import GenericChatInterface from './GenericChatInterface';

function MentalHealthMonitor() {
  const handleSendMessage = async (message) => {
    // Get userId from localStorage as employeeId
    const employeeId = localStorage.getItem('userId');
    
    // Debug log
    console.log('Sending message to Mental Health Monitor:', { message, employeeId });

    const response = await fetch('/api/mental-health', {
      method: 'POST',
      body: JSON.stringify({ message, employeeId }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Debug log
    console.log('Response from server:', response);
    
    const data = await response.json();
    console.log('Parsed response data:', data);
    
    return data.reply;
  };

  return <GenericChatInterface 
    title="Mental Health Monitor" 
    onSendMessage={handleSendMessage}
  />;
}

export default MentalHealthMonitor;
