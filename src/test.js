const axios = require('axios');
require('dotenv').config();

async function getAccount() {
  const url = 'https://paper-api.alpaca.markets/v2/account';
  const options = {
    headers: {
      'accept': 'application/json',
      'APCA-API-KEY-ID': process.env.ALPACA_API_KEY,
      'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET
    }
  };


  try {
    const res = await axios.get(url, options);
    console.log('Account response received:', res.data);
  } catch (err) {
    console.error('Error fetching:', err.message);
  }
}

getAccount();


