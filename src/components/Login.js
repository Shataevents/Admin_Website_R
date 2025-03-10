import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple login logic (replace with actual authentication)
    if (email === 'admin@gmail.com' && password === '1234') {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center w-full absolute bg-black justify-center h-full">
      <form onSubmit={handleSubmit} className="bg-black border-2 border-white text-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-200">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-200">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black p-2 border rounded"
          />
        </div>
        <button type="submit" 
          className="bg-white  text-black px-4 py-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;