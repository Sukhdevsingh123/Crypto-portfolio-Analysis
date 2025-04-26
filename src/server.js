
// .......................... working fine for first code
// const express = require('express');
// const cors = require('cors');

// const { main } = require('./index');

// const app = express();
// app.use(cors());

// let latestData = null;

// async function refreshData() {
//   try {
//     latestData = await main();
//     console.log('Data refreshed:', new Date().toISOString(), JSON.stringify(latestData, null, 2));
//   } catch (err) {
//     console.error('Error refreshing data:', err.message);
//   }
// }

// // Refresh data every 15 seconds
// setInterval(refreshData, 30 * 1000);

// // Initial refresh
// refreshData();

// // API endpoint to serve latest data
// app.get('/api/data', (req, res) => {
//   if (latestData) {
//     res.json(latestData);
//     console.log(latestData)
//   } else {
//     res.status(503).json({ error: 'Data not available yet' });
//   }
// });



// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// .........................




// ...............working fine for second code

// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const { main } = require('./index');

// const app = express();
// app.use(cors());

// let latestData = null;

// async function refreshData() {
//   try {
//     latestData = await main();
//     console.log('Data refreshed:', new Date().toISOString(), JSON.stringify(latestData, null, 2));
//   } catch (err) {
//     console.error('Error refreshing data:', err.message);
//   }
// }

// // Initial refresh and wait for it to complete
// async function startServer() {
//   await refreshData(); // Wait for initial data
//   console.log('Initial data loaded, starting server...');

//   // Refresh data every 30 seconds
//   setInterval(refreshData, 30 * 1000);

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

// app.get("/",(req,res)=>{
// res.send("hello")
// })

// // API endpoint to serve latest data
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

// // Start the server
// startServer();

// .............................

const express = require('express');
const cors = require('cors');
const path = require('path');
const { main } = require('./index');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies for POST requests

let latestData = null;

async function refreshData() {
  try {
    latestData = await main();
    console.log('Data refreshed:', new Date().toISOString(), JSON.stringify(latestData, null, 2));
  } catch (err) {
    console.error('Error refreshing data:', err.message);
  }
}

// Initial refresh and wait for it to complete
async function startServer() {
  await refreshData(); // Wait for initial data
  console.log('Initial data loaded, starting server...');

  // Refresh data every 30 seconds
  setInterval(refreshData, 30 * 1000);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// API endpoint to serve latest data
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

// API endpoint to handle trades
app.post('/api/trade', (req, res) => {
  const { symbol, action, quantity, price } = req.body;
  if (!symbol || !action || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields: symbol, action, quantity, price' });
  }

  if (!latestData) {
    return res.status(503).json({ error: 'Data not available yet' });
  }

  let updatedPortfolio = { ...latestData.portfolio };
  const holdings = updatedPortfolio.holdings[symbol] || { quantity: 0, avgPrice: 0 };

  if (action === 'Buy') {
    const cost = quantity * price;
    if (updatedPortfolio.cash < cost) {
      return res.status(400).json({ error: 'Insufficient cash for purchase' });
    }
    updatedPortfolio.cash -= cost;
    updatedPortfolio.holdings[symbol] = {
      quantity: holdings.quantity + quantity,
      avgPrice: price // Simplified: in real scenarios, calculate weighted avg price
    };
    console.log(`Backend: Bought ${quantity} ${symbol} at $${price}`);
  } else if (action === 'Sell') {
    if (holdings.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient holdings to sell' });
    }
    updatedPortfolio.cash += quantity * price;
    updatedPortfolio.holdings[symbol] = {
      quantity: holdings.quantity - quantity,
      avgPrice: holdings.quantity - quantity > 0 ? holdings.avgPrice : 0
    };
    console.log(`Backend: Sold ${quantity} ${symbol} at $${price}`);
  } else {
    return res.status(400).json({ error: 'Invalid action. Use Buy or Sell' });
  }

  // Update latestData with the new portfolio state
  latestData.portfolio = updatedPortfolio;
  res.json({ message: `Successfully executed ${action} for ${quantity} ${symbol}`, portfolio: updatedPortfolio });
});

// Start the server
startServer();