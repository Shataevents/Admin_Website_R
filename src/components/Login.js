import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

function Login({ setLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token-shata');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      let res = await signInWithEmailAndPassword(auth, email, password);
      setLogin?.(true);
      console.log("res", res.user.accessToken);
      // Store the token in local storage or context if needed
      localStorage.setItem('token-shata', res.user.accessToken);

      navigate('/dashboard');
    } catch (err) {
      setError("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset your password.');
      return;
    }
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError('Error sending password reset email. Please try again.');
    }
  };

  return (
    <div className="flex items-center w-full absolute bg-black justify-center h-full">
      <form onSubmit={handleSubmit} className="bg-black border-2 border-white text-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl text-center font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-3">{message}</p>}

        <div className="mb-4">
          <label className="block text-gray-200">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-200">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-blue-400 text-sm hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
