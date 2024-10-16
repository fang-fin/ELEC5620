import React from 'react';

function Sidebar({ setSelectedFunction }) {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Manager Dashboard</h2>
        <ul>
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
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
