import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn, setUserRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting login with:', { username, password });

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.toLowerCase(),
          password,
        }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        // 将 username 作为 userId 存储
        if (data.role) {
          setIsLoggedIn(true);
          setUserRole(data.role);

          // 使用 username 作为 userId
          localStorage.setItem('userId', username.toLowerCase()); 
          console.log('userId stored in localStorage:', localStorage.getItem('userId'));

          navigate('/chat');
        } else {
          console.error('Role missing in response:', data);
          alert('Login response missing required data.');
        }
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
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
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
