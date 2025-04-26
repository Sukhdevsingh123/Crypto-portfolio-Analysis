
// // ............................................
// require('dotenv').config();
// const AlpacaClient = require('./api/alpaca');
// const OpenAIClient = require('./api/openai');
// const PortfolioManager = require('./portfolio/manager');
// const RiskAnalyzer = require('./portfolio/risk');

// async function main() {
//   // Initialize clients
//   let alpaca, openai;
//   try {
//     alpaca = new AlpacaClient(
//       process.env.ALPACA_API_KEY,
//       process.env.ALPACA_API_SECRET,
//       process.env.ALPACA_BASE_URL
//     );
//   } catch (err) {
//     console.error('Failed to initialize Alpaca client:', err.message);
//     throw err;
//   }

//   try {
//     openai = new OpenAIClient(process.env.OPENAI_API_KEY);
//   } catch (err) {
//     console.error('Failed to initialize OpenAI client:', err.message);
//     throw err;
//   }

//   // Define symbols and risk profile
//   const symbols = ['BTC/USD', 'LTC/USD'];
//   const riskProfile = 'Moderate';

//   try {
//     // Fetch market data
//     const marketData = {
//       latestTrades: await alpaca.getLatestTrades(symbols),
//       latestBars: await alpaca.getLatestBars(symbols),
//       latestQuotes: await alpaca.getLatestQuotes(symbols),
//       latestOrderbook: await alpaca.getLatestOrderbook(symbols),
//       snapshots: await alpaca.getSnapshots(symbols),
//       historicalBars: await alpaca.getHistoricalBars(symbols, '1Day', '2025-03-25T00:00:00Z', '2025-04-24T23:59:59Z'),
//       historicalQuotes: await alpaca.getHistoricalQuotes(symbols, '2025-04-23T00:00:00Z', '2025-04-24T23:59:59Z'),
//       historicalTrades: await alpaca.getHistoricalTrades(symbols, '2025-04-23T00:00:00Z', '2025-04-24T23:59:59Z')
//     };

//     // Initialize portfolio and risk analyzer
//     const portfolio = new PortfolioManager();
//     const riskAnalyzer = new RiskAnalyzer();

//     // Update portfolio (example: buy 0.01 BTC)
//     const btcPrice = marketData.latestTrades.trades['BTC/USD'].p;
//     portfolio.updateHolding('BTC/USD', 0.01, btcPrice);

//     // Portfolio metrics
//     const portfolioValue = portfolio.calculatePortfolioValue(marketData);
//     const returns = portfolio.calculateReturns(marketData);
//     const btcPrices = marketData.historicalBars.bars['BTC/USD'].map(bar => bar.c);
//     const volatility = riskAnalyzer.calculateVolatility(btcPrices);
//     const varValue = riskAnalyzer.calculateVaR(portfolioValue, volatility);
//     const spreadRisk = riskAnalyzer.calculateSpreadRisk(marketData.latestQuotes);
//     const liquidity = portfolio.assessLiquidity(marketData.latestOrderbook);

//     // AI-driven insights
//     const tradingDecision = await openai.generateTradingDecision(marketData, portfolio.portfolio, riskProfile);
//     const riskAssessment = await riskAnalyzer.assessRiskWithAI(portfolio.portfolio, marketData, openai);
//     const optimization = await openai.optimizePortfolio(portfolio.portfolio, marketData, riskProfile);

//     // Return computed data
//     return {
//       marketData: {
//         latestTrades: marketData.latestTrades,
//         latestBars: marketData.latestBars,
//         latestQuotes: marketData.latestQuotes,
//         latestOrderbook: marketData.latestOrderbook,
//         snapshots: marketData.snapshots,
//         historicalBars: marketData.historicalBars
//       },
//       portfolio: {
//         value: portfolioValue,
//         returns,
//         volatility: volatility * 100, // Convert to percentage
//         varValue,
//         spreadRisk,
//         liquidity,
//         cash: portfolio.portfolio.cash,
//         holdings: portfolio.portfolio.holdings
//       },
//       insights: {
//         tradingDecision,
//         riskAssessment,
//         optimization
//       }
//     };
//   } catch (err) {
//     console.error('Error in main:', err.message);
//     throw err;
//   }
// }

// module.exports = { main };
// ....................................................

require('dotenv').config();
const AlpacaClient = require('./api/alpaca');
const OpenAIClient = require('./api/openai');
const PortfolioManager = require('./portfolio/manager');
const RiskAnalyzer = require('./portfolio/risk');

async function main() {
  let alpaca, openai;
  try {
    alpaca = new AlpacaClient(
      process.env.ALPACA_API_KEY,
      process.env.ALPACA_API_SECRET
    );
  } catch (err) {
    console.error('Failed to initialize Alpaca client:', err.message);
    throw err;
  }

  try {
    openai = new OpenAIClient(process.env.OPENAI_API_KEY);
  } catch (err) {
    console.error('Failed to initialize OpenAI client:', err.message);
    throw err;
  }

  const symbols = ['BTC/USD', 'LTC/USD'];
  const riskProfile = 'Moderate';

  try {
    // Fetch market data
    const marketData = {
      latestTrades: await alpaca.getLatestTrades(symbols),
      latestBars: await alpaca.getLatestBars(symbols),
      latestQuotes: await alpaca.getLatestQuotes(symbols),
      latestOrderbook: await alpaca.getLatestOrderbook(symbols),
      snapshots: await alpaca.getSnapshots(symbols),
      historicalBars: await alpaca.getHistoricalBars(symbols, '1Day', '2025-03-25T00:00:00Z', '2025-04-24T23:59:59Z'),
      historicalQuotes: await alpaca.getHistoricalQuotes(symbols, '2025-04-23T00:00:00Z', '2025-04-24T23:59:59Z'),
      historicalTrades: await alpaca.getHistoricalTrades(symbols, '2025-04-23T00:00:00Z', '2025-04-24T23:59:59Z')
    };

    // Initialize portfolio and risk analyzer
    const portfolio = new PortfolioManager();
    const riskAnalyzer = new RiskAnalyzer();

    // Fetch account details and positions
    const account = await alpaca.getAccount();
    const positions = await alpaca.getPositions();
    // console.log('Positions received:', positions);
    portfolio.setCash(parseFloat(account.cash));

    // Sync portfolio with actual positions
    if (Array.isArray(positions)) {
      positions.forEach(pos => {
        const symbol = pos.symbol;
        const qty = parseFloat(pos.qty);
        const avgPrice = parseFloat(pos.avg_entry_price);
        portfolio.updateHolding(symbol, qty, avgPrice);
      });
    } else {
      console.warn('Positions is not an array:', positions);
    }

    // Calculate profit/loss for each holding
    const profitLoss = {};
    let totalProfitLoss = 0;
    for (const [symbol, holding] of Object.entries(portfolio.portfolio.holdings)) {
      const currentPrice = marketData.latestTrades.trades[symbol]?.p || holding.avgPrice;
      const value = holding.quantity * currentPrice;
      const cost = holding.quantity * holding.avgPrice;
      const pl = value - cost;
      profitLoss[symbol] = pl;
      totalProfitLoss += pl;

      // Check for 20% price increase and sell if applicable
      if (currentPrice >= holding.avgPrice * 1.2 && holding.quantity > 0) {
        console.log(`Price of ${symbol} increased by 20% or more. Selling ${holding.quantity} units.`);
        const order = await alpaca.createOrder({
          symbol,
          qty: holding.quantity,
          side: 'sell',
          type: 'market',
          time_in_force: 'gtc'
        });
        if (order.status === 'accepted' || order.status === 'filled') {
          portfolio.updateHolding(symbol, -holding.quantity, currentPrice);
          portfolio.setCash(portfolio.portfolio.cash + holding.quantity * currentPrice);
          console.log(`Sold ${holding.quantity} ${symbol} at $${currentPrice}`);
        }
      }
    }

    // AI-driven trading decision based on account state
    const tradingDecision = await openai.generateTradingDecision(marketData, portfolio.portfolio, riskProfile);
    console.log('AI Trading Decision:', tradingDecision);
    const decisionLines = tradingDecision.split('\n');
    for (const line of decisionLines) {
      if (line.includes('Buy') || line.includes('Sell')) {
        try {
          const match = line.match(/(Buy|Sell) (\d+\.?\d*) (BTC\/USD|LTC\/USD)/);
          if (match) {
            const action = match[1].toLowerCase();
            const qty = parseFloat(match[2]);
            const symbol = match[3];
            const currentPrice = marketData.latestTrades.trades[symbol].p;

            // Check if we have enough cash for buying
            if (action === 'buy' && portfolio.portfolio.cash < qty * currentPrice) {
              console.warn(`Insufficient cash to buy ${qty} ${symbol}. Available: $${portfolio.portfolio.cash}, Required: $${qty * currentPrice}`);
              continue;
            }

            // Check if we have enough quantity for selling
            if (action === 'sell' && (!portfolio.portfolio.holdings[symbol] || portfolio.portfolio.holdings[symbol].quantity < qty)) {
              console.warn(`Insufficient quantity to sell ${qty} ${symbol}. Available: ${portfolio.portfolio.holdings[symbol]?.quantity || 0}`);
              continue;
            }

            const order = await alpaca.createOrder({
              symbol,
              qty,
              side: action,
              type: 'market',
              time_in_force: 'gtc'
            });

            if (order.status === 'accepted' || order.status === 'filled') {
              if (action === 'buy') {
                portfolio.updateHolding(symbol, qty, currentPrice);
                portfolio.setCash(portfolio.portfolio.cash - qty * currentPrice);
              } else {
                portfolio.updateHolding(symbol, -qty, currentPrice);
                portfolio.setCash(portfolio.portfolio.cash + qty * currentPrice);
              }
              console.log(`Trade executed: ${action} ${qty} ${symbol} at $${currentPrice}`);
            }
          }
        } catch (err) {
          console.error(`Error executing trade for ${line}:`, err.message);
        }
      }
    }

    // Portfolio metrics
    const portfolioValue = portfolio.calculatePortfolioValue(marketData);
    const returns = portfolio.calculateReturns(marketData);
    const btcPrices = marketData.historicalBars.bars['BTC/USD'].map(bar => bar.c);
    const volatility = riskAnalyzer.calculateVolatility(btcPrices);
    const varValue = riskAnalyzer.calculateVaR(portfolioValue, volatility);
    const spreadRisk = riskAnalyzer.calculateSpreadRisk(marketData.latestQuotes);
    const liquidity = portfolio.assessLiquidity(marketData.latestOrderbook);

    return {
      account: {
        cash: parseFloat(account.cash),
        equity: parseFloat(account.equity),
        buyingPower: parseFloat(account.buying_power),
        positions
      },
      marketData: {
        latestTrades: marketData.latestTrades,
        latestBars: marketData.latestBars,
        latestQuotes: marketData.latestQuotes,
        latestOrderbook: marketData.latestOrderbook,
        snapshots: marketData.snapshots,
        historicalBars: marketData.historicalBars
      },
      portfolio: {
        value: portfolioValue,
        returns,
        volatility: volatility * 100,
        varValue,
        spreadRisk,
        liquidity,
        cash: portfolio.portfolio.cash,
        holdings: portfolio.portfolio.holdings,
        profitLoss,
        totalProfitLoss
      },
      insights: {
        tradingDecision,
        riskAssessment: await riskAnalyzer.assessRiskWithAI(portfolio.portfolio, marketData, openai),
        optimization: await openai.optimizePortfolio(portfolio.portfolio, marketData, riskProfile)
      }
    };
  } catch (err) {
    console.error('Error in main:', err.message);
    throw err;
  }
}

module.exports = { main };