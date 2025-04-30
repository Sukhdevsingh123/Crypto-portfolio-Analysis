import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeContext';

function SignUp() {
  const { theme } = useContext(ThemeContext);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    // window.location.href = 'http://localhost:5000/auth/login';
    window.location.href = 'https://crypto-portfolio-komv.onrender.com/auth/login';

   
  };

  const fetchAccount = async () => {
    setLoading(true);
    try {
    //   const response = await axios.get('http://localhost:5000/api/account', { withCredentials: true });
      const response = await axios.get('https://crypto-portfolio-komv.onrender.com/api/account', { withCredentials: true });
      setAccount(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch account');
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if we're coming back from OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      fetchAccount(); // Fetch account after redirect
    } else if (!account) {
      fetchAccount(); // Initial fetch
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`max-w-md w-full p-6 rounded-xl bg-opacity-80 backdrop-blur-lg shadow-2xl border border-opacity-30 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-indigo-500' : 'bg-gray-100 text-gray-900 border-teal-400'}`}
      >
        <h2 className={`text-2xl font-bold text-center mb-4 ${theme === 'dark' ? 'text-indigo-300' : 'text-teal-600'}`}>
          OAuth Test
        </h2>
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg mb-4 ${theme === 'dark'
            ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white hover:from-indigo-600 hover:to-indigo-800'
            : 'bg-gradient-to-r from-blue-300 to-blue-500 text-gray-900 hover:from-blue-400 hover:to-blue-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Loading...' : 'Sign In with Alpaca'}
        </button>
        {error && (
          <p className="text-center text-red-500 mb-4">
            {error}
          </p>
        )}
        {account && (
          <div className="bg-opacity-50 rounded-lg p-4">
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-indigo-200' : 'text-teal-500'}`}>
              Account Details:
            </h3>
            <div className="space-y-2">
              <p>Cash: <span className="font-medium">${account.cash}</span></p>
              <p>Equity: <span className="font-medium">${account.equity}</span></p>
              <p>Buying Power: <span className="font-medium">${account.buying_power}</span></p>
              <p>Status: <span className="font-medium">{account.status}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;