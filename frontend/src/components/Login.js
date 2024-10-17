import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn, setUserRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里应该有实际的登录逻辑
    setIsLoggedIn(true);
    if (username.toLowerCase() === 'manager') {
      setUserRole('manager');
    } else if (username.toLowerCase() === 'hr') {
      setUserRole('hr');
    } else {
      setUserRole('employee');
    }
    navigate('/chat');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-10 bg-white rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-5">Login to Arasaka Company Assistant</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
