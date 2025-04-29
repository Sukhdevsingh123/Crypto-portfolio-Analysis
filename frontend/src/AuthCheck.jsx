import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OAuthCheck() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/login';
  };

  const fetchAccount = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/account', { withCredentials: true });
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
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>OAuth Test</h2>
      <button onClick={handleLogin} disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        {loading ? 'Loading...' : 'Sign In with Alpaca'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {account && (
        <div style={{ marginTop: '20px' }}>
          <h3>Account Details:</h3>
          <p>Cash: ${account.cash}</p>
          <p>Equity: ${account.equity}</p>
          <p>Buying Power: ${account.buying_power}</p>
          <p>Status: {account.status}</p>
        </div>
      )}
    </div>
  );
}

export default OAuthCheck;