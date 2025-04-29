const express = require('express');
const session = require('express-session');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Adjust to your frontend port
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'test-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

const config = {
  clientId: process.env.ALPACA_OAUTH_CLIENT_ID,
  clientSecret: process.env.ALPACA_OAUTH_CLIENT_SECRET,
  redirectUri: 'http://localhost:5173', // Must match Alpaca Developer Portal
  authUrl: 'https://app.alpaca.markets/oauth/authorize',
  tokenUrl: 'https://api.alpaca.markets/oauth/token',
  scope: 'account:write trading',
  env: 'paper' // For paper trading
};

if (!config.clientId || !config.clientSecret) {
  console.error('Missing ALPACA_OAUTH_CLIENT_ID or ALPACA_OAUTH_CLIENT_SECRET in environment variables');
  process.exit(1);
}

function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

app.get('/auth/login', (req, res) => {
  const state = generateState();
  req.session.state = state;
  const authUrl = `${config.authUrl}?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&state=${state}&scope=${encodeURIComponent(config.scope)}&env=${config.env}`;
  console.log('Redirecting to authorization URL:', authUrl);
  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  console.log('Callback received:', { code, state, sessionState: req.session.state });
  if (!code || !state || state !== req.session.state) {
    return res.status(400).send('Invalid callback parameters or state mismatch');
  }

  try {
    console.log('Attempting token exchange with body:', {
      grant_type: 'authorization_code',
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri
    });
    const tokenResponse = await axios.post(config.tokenUrl, new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token, token_type, scope } = tokenResponse.data;
    console.log('Token exchange successful:', { access_token, token_type, scope });
    const accountResponse = await axios.get('https://paper-api.alpaca.markets/v2/account', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    req.session.accessToken = access_token;
    req.session.account = accountResponse.data;
    res.redirect(`${config.redirectUri}/success?account=${encodeURIComponent(JSON.stringify(accountResponse.data))}`);
  } catch (error) {
    console.error('Error in callback:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).send(`Error: ${error.response?.data?.message || error.message}`);
  }
});

app.get('/auth/callback/success', (req, res) => {
  const account = JSON.parse(decodeURIComponent(req.query.account));
  res.send(`
    <html>
      <body>
        <h2>Authentication Successful!</h2>
        <p>Cash: $${account.cash}</p>
        <p>Equity: $${account.equity}</p>
        <p>Buying Power: $${account.buying_power}</p>
        <p>Status: ${account.status}</p>
        <a href="http://localhost:5173">Back to App</a>
      </body>
    </html>
  `);
});

app.get('/api/account', (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).send('Not authenticated');
  }
  res.json(req.session.account);
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out successfully');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`OAuth test server running on port ${PORT}`));