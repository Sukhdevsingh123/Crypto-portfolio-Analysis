


// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const { main } = require('./index');
// const AlpacaClient = require('./api/alpaca');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const alpaca = new AlpacaClient(
//   process.env.ALPACA_API_KEY,
//   process.env.ALPACA_API_SECRET
// );

// let latestData = null;

// async function refreshData() {
//   try {
//     latestData = await main();
//     console.log('Data refreshed:', new Date().toISOString(), JSON.stringify(latestData, null, 2));
//   } catch (err) {
//     console.error('Error refreshing data:', err.message);
//   }
// }

// async function startServer() {
//   await refreshData();
//   console.log('Initial data loaded, starting server...');
//   setInterval(refreshData, 30000); // Refresh every 30 seconds

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

// app.get('/api/data', (req, res) => {
//   console.log('API /api/data requested at:', new Date().toISOString(), 'latestData:', latestData ? 'available' : 'null');
//   if (latestData) {
//     res.json(latestData);
//     console.log('Sent data to client:', JSON.stringify(latestData, null, 2));
//   } else {
//     res.status(503).json({ error: 'Data not available yet' });
//     console.log('Sent 503 response: Data not available yet');
//   }
// });

// app.post('/api/trade', async (req, res) => {
//   const { symbol, action, quantity, price } = req.body;
//   if (!symbol || !action || !quantity || !price) {
//     return res.status(400).json({ error: 'Missing required fields: symbol, action, quantity, price' });
//   }

//   if (!latestData) {
//     return res.status(503).json({ error: 'Data not available yet' });
//   }

//   try {
//     const alpacaSymbol = symbol.replace('/', '');
//     const order = await alpaca.createOrder({
//       symbol: alpacaSymbol,
//       qty: quantity,
//       side: action.toLowerCase(),
//       type: 'market',
//       time_in_force: 'gtc'
//     });

//     if (order.status !== 'accepted' && order.status !== 'filled') {
//       throw new Error(`Order failed with status: ${order.status}`);
//     }

//     let updatedPortfolio = { ...latestData.portfolio };
//     const holdings = updatedPortfolio.holdings[symbol] || { quantity: 0, avgPrice: 0 };

//     if (action === 'Buy') {
//       const cost = quantity * price;
//       if (updatedPortfolio.cash < cost) {
//         return res.status(400).json({ error: 'Insufficient cash for purchase' });
//       }
//       updatedPortfolio.cash -= cost;
//       updatedPortfolio.holdings[symbol] = {
//         quantity: holdings.quantity + quantity,
//         avgPrice: price
//       };
//       console.log(`Backend: Bought ${quantity} ${symbol} at $${price}`);
//     } else if (action === 'Sell') {
//       if (holdings.quantity < quantity) {
//         return res.status(400).json({ error: 'Insufficient holdings to sell' });
//       }
//       updatedPortfolio.cash += quantity * price;
//       updatedPortfolio.holdings[symbol] = {
//         quantity: holdings.quantity - quantity,
//         avgPrice: holdings.quantity - quantity > 0 ? holdings.avgPrice : 0
//       };
//       console.log(`Backend: Sold ${quantity} ${symbol} at $${price}`);
//     } else {
//       return res.status(400).json({ error: 'Invalid action. Use Buy or Sell' });
//     }

//     latestData.portfolio = updatedPortfolio;
//     res.json({ message: `Successfully executed ${action} for ${quantity} ${symbol} on Alpaca`, portfolio: updatedPortfolio });
//   } catch (err) {
//     console.error(`Trade execution failed for ${symbol}:`, err.message);
//     res.status(500).json({ error: `Trade execution failed: ${err.message}` });
//   }
// });

// startServer();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { main } = require('./index');
const AlpacaClient = require('./api/alpaca');
const OpenAIClient = require('./api/openai');

const app = express();
app.use(cors());
app.use(express.json());

const alpaca = new AlpacaClient(
  process.env.ALPACA_API_KEY,
  process.env.ALPACA_API_SECRET
);

const openai = new OpenAIClient(process.env.OPENAI_API_KEY);

let latestData = null;

async function refreshData() {
  try {
    latestData = await main();
    console.log('Data refreshed:', new Date().toISOString(), JSON.stringify(latestData, null, 2));
  } catch (err) {
    console.error('Error refreshing data:', err.message);
  }
}

async function startServer() {
  await refreshData();
  console.log('Initial data loaded, starting server...');
  setInterval(refreshData, 30000); // Refresh every 30 seconds

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

app.get('/api/data', (req, res) => {
  console.log('API /api/data requested at:', new Date().toISOString(), 'latestData:', latestData ? 'available' : 'null');
  if (latestData) {
    res.json(latestData);
    console.log('Sent data to client:', JSON.stringify(latestData, null, 2));
  } else {
    res.status(503).json({ error: 'Data not available yet' });
    console.log('Sent 503 response: Data not available yet');
  }
});

app.post('/api/trade', async (req, res) => {
  const { symbol, action, quantity, price } = req.body;
  console.log('Received trade request:', { symbol, action, quantity, price });

  if (!symbol || !action || !quantity || !price) {
    console.log('Missing required fields in trade request');
    return res.status(400).json({ error: 'Missing required fields: symbol, action, quantity, price' });
  }

  if (!latestData) {
    console.log('Data not available yet');
    return res.status(503).json({ error: 'Data not available yet' });
  }

  try {
    console.log('Attempting to create order on Alpaca...');
    const alpacaSymbol = symbol.replace('/', '');
    const order = await alpaca.createOrder({
      symbol: alpacaSymbol,
      qty: quantity,
      side: action.toLowerCase(),
      type: 'market',
      time_in_force: 'gtc'
    });
    console.log('Alpaca order response:', order);

    if (order.status !== 'accepted' && order.status !== 'filled') {
      throw new Error(`Order failed with status: ${order.status}`);
    }

    let updatedPortfolio = { ...latestData.portfolio };
    const holdings = updatedPortfolio.holdings[symbol] || { quantity: 0, avgPrice: 0 };

    if (action === 'Buy') {
      const cost = quantity * price;
      if (updatedPortfolio.cash < cost) {
        console.log('Insufficient cash for purchase:', { cash: updatedPortfolio.cash, cost });
        return res.status(400).json({ error: 'Insufficient cash for purchase' });
      }
      updatedPortfolio.cash -= cost;
      updatedPortfolio.holdings[symbol] = {
        quantity: holdings.quantity + quantity,
        avgPrice: price
      };
      console.log(`Backend: Bought ${quantity} ${symbol} at $${price}`);
    } else if (action === 'Sell') {
      if (holdings.quantity < quantity) {
        console.log('Insufficient holdings to sell:', { available: holdings.quantity, requested: quantity });
        return res.status(400).json({ error: 'Insufficient holdings to sell' });
      }
      updatedPortfolio.cash += quantity * price;
      updatedPortfolio.holdings[symbol] = {
        quantity: holdings.quantity - quantity,
        avgPrice: holdings.quantity - quantity > 0 ? holdings.avgPrice : 0
      };
      console.log(`Backend: Sold ${quantity} ${symbol} at $${price}`);
    } else {
      console.log('Invalid action:', action);
      return res.status(400).json({ error: 'Invalid action. Use Buy or Sell' });
    }

    latestData.portfolio = updatedPortfolio;
    res.json({ message: `Successfully executed ${action} for ${quantity} ${symbol} on Alpaca`, portfolio: updatedPortfolio });
  } catch (err) {
    console.error(`Trade execution failed for ${symbol}:`, err.message, err.stack);
    res.status(500).json({ error: `Trade execution failed: ${err.message}`, stack: err.stack });
  }
});

app.post('/api/ai-prompt', async (req, res) => {
  const { prompt } = req.body;
  console.log('Received AI prompt request:', prompt);

  if (!prompt) {
    console.log('Prompt is required but was not provided');
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!latestData) {
    console.log('Data not available yet');
    return res.status(503).json({ error: 'Data not available yet' });
  }

  try {
    console.log('Latest Data:', JSON.stringify(latestData, null, 2));

    const context = `
      Alpaca Account Details:
      - Cash: $${latestData.account.cash.toFixed(2)}
      - Equity: $${latestData.account.equity.toFixed(2)}
      - Buying Power: $${latestData.account.buyingPower.toFixed(2)}
      - Positions: ${JSON.stringify(latestData.account.positions, null, 2)}

      Portfolio Metrics:
      - Total Value: $${latestData.portfolio.value.toFixed(2)}
      - Total Profit/Loss: $${latestData.portfolio.totalProfitLoss.toFixed(2)}
      - Volatility: ${(latestData.portfolio.volatility).toFixed(2)}%
      - Holdings: ${JSON.stringify(latestData.portfolio.holdings, null, 2)}

      Recent Market Data (BTC/USD Latest Trade):
      - Price: $${latestData.marketData.latestTrades.trades['BTC/USD']?.p || 'N/A'}
      - Volume: ${latestData.marketData.latestTrades.trades['BTC/USD']?.v || 'N/A'}

      Recent AI Trading Decision:
      ${latestData.insights.tradingDecision}

      You are an expert in blockchain, trading, and the stock market. The user has an Alpaca trading account with the details provided above. Respond to the user's prompt with accurate information related to blockchain, trading, stock market, or their Alpaca account. If the prompt is about their account or trading decisions, provide specific recommendations based on the account details and market data. If the prompt is general (e.g., "What is blockchain?"), provide a clear and concise explanation without forcing a trading decision.

      User Prompt: ${prompt}
    `;
    console.log('Generated context:', context);

    const aiResponse = await openai.generateResponse(context);
    console.log('AI Response:', aiResponse);
    res.json({ response: aiResponse });
  } catch (err) {
    console.error('Error processing AI prompt:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to process prompt', message: err.message, stack: err.stack });
  }
});

startServer();