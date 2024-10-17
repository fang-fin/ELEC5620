import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ProjectManagement from './ProjectManagement';
import TeamManagement from './TeamManagement';
import AISecretary from './AISecretary';

function ChatInterface({ setIsLoggedIn }) {
  const [selectedFunction, setSelectedFunction] = useState('ai-secretary');

  const renderContent = () => {
    switch (selectedFunction) {
      case 'manage-projects':
        return <ProjectManagement />;
      case 'manage-team':
        return <TeamManagement />;
      case 'ai-secretary':
        return <AISecretary />;
      default:
        return <div>Select a function</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setSelectedFunction={setSelectedFunction} setIsLoggedIn={setIsLoggedIn} userRole="manager" />
      <div className="flex flex-col flex-grow">
        <div className="flex-grow overflow-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
