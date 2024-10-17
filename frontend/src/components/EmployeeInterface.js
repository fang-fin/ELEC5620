import React, { useState } from 'react';
import Sidebar from './Sidebar';
import FinancialReport from './FinancialReport';
import PsychologicalAssessment from './PsychologicalAssessment';
import FeedbackMechanism from './FeedbackMechanism';
import ClockIn from './ClockIn';
import PersonalSavingsAssistant from './PersonalSavingsAssistant';

function EmployeeInterface({ setIsLoggedIn }) {
  const [selectedFunction, setSelectedFunction] = useState('personal-savings-assistant');

  const renderContent = () => {
    switch (selectedFunction) {
      case 'financial-report':
        return <FinancialReport />;
      case 'psychological-assessment':
        return <PsychologicalAssessment />;
      case 'feedback':
        return <FeedbackMechanism />;
      case 'clock-in':
        return <ClockIn />;
      case 'personal-savings-assistant':
        return <PersonalSavingsAssistant />;
      default:
        return <div>Select a function</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setSelectedFunction={setSelectedFunction} setIsLoggedIn={setIsLoggedIn} userRole="employee" />
      <div className="flex flex-col flex-grow">
        <div className="flex-grow overflow-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default EmployeeInterface;
