import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';
import EmployeeInterface from './components/EmployeeInterface';
import HRInterface from './components/HRInterface';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  return (
    <Router>
      <div className="h-screen">
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
          <Route 
            path="/chat" 
            element={
              isLoggedIn 
                ? (userRole === 'manager' 
                    ? <ChatInterface setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
                    : userRole === 'hr'
                    ? <HRInterface setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
                    : <EmployeeInterface setIsLoggedIn={setIsLoggedIn} userRole={userRole} />)
                : <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
