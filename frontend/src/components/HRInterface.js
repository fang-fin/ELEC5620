import React, { useState } from 'react';
import Sidebar from './Sidebar';
import EmployeeManagement from './EmployeeManagement';
import AdviceBox from './AdviceBox';
import TimeAnalysis from './TimeAnalysis';
import MentalHealthMonitor from './MentalHealthMonitor';
// import PayrollEvaluation from './PayrollEvaluation';

function HRInterface({ setIsLoggedIn }) {
  const [selectedFunction, setSelectedFunction] = useState('employee-management');

  const renderContent = () => {
    switch (selectedFunction) {
      case 'employee-management':
        return <EmployeeManagement />;
      case 'advice-box':
        return <AdviceBox />;
      case 'time-analysis':
        return <TimeAnalysis />;
      case 'mental-health-monitor':
        return <MentalHealthMonitor />;
      // case 'payroll-evaluation':
      //   return <PayrollEvaluation />;
      default:
        return <div>Select a function</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setSelectedFunction={setSelectedFunction} setIsLoggedIn={setIsLoggedIn} userRole="hr" />
      <div className="flex flex-col flex-grow">
        <div className="flex-grow overflow-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default HRInterface;
