import React from 'react';
import GenericChatInterface from './GenericChatInterface';

function MentalHealthMonitor() {
  const handleSendMessage = async (message) => {

    const employeeId = "emp456"; 
    const response = await fetch('/api/mental-health', {
      method: 'POST',
      body: JSON.stringify({ message, employeeId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data.reply;
  };

  return <GenericChatInterface 
    title="Mental Health Monitor" 
    onSendMessage={handleSendMessage}
  />;
}

export default MentalHealthMonitor;
