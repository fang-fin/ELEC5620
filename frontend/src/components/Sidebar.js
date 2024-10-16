import React from 'react';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">AI Agents</h2>
      <ul>
        <li className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded">General AI</li>
        <li className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded">Code Assistant</li>
        <li className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded">Writing Helper</li>
      </ul>
    </div>
  );
}

export default Sidebar;
