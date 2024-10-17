import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ setSelectedFunction, setIsLoggedIn, userRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  const renderManagerOptions = () => (
    <>
      <li className="mb-2">
        <button
          onClick={() => setSelectedFunction('manage-projects')}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition-colors"
        >
          Manage Projects
        </button>
      </li>
      <li className="mb-2">
        <button
          onClick={() => setSelectedFunction('manage-team')}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition-colors"
        >
          Manage Team
        </button>
      </li>
      <li className="mb-2">
        <button
          onClick={() => setSelectedFunction('ai-secretary')}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition-colors"
        >
          AI Secretary
        </button>
      </li>
    </>
  );

  const renderEmployeeOptions = () => (
    <>
      <li className="mb-2">
        <button
          onClick={() => setSelectedFunction('financial-report')}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition-colors"
        >
          Financial Report
        </button>
      </li>
      <li className="mb-2">
        <button
          onClick={() => setSelectedFunction('psychological-assessment')}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition-colors"
        >
          Psychological Self-Assessment
        </button>
      </li>
      <li className="mb-2">
        <button
          onClick={() => setSelectedFunction('feedback')}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition-colors"
        >
          Feedback
        </button>
      </li>
      <li className="mb-2">
        <button
          onClick={() => setSelectedFunction('clock-in')}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition-colors"
        >
          Clock-In
        </button>
      </li>
      <li className="mb-2">
        <button
          onClick={() => setSelectedFunction('personal-savings-assistant')}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded transition-colors"
        >
          Personal Savings Assistant
        </button>
      </li>
    </>
  );

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-full">
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {userRole === 'manager' ? 'Manager Dashboard' : 'Employee Dashboard'}
        </h2>
        <ul>
          {userRole === 'manager' ? renderManagerOptions() : renderEmployeeOptions()}
        </ul>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
