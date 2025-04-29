
require('dotenv').config();
const AlpacaClient = require('./api/alpaca');
const OpenAIClient = require('./api/openai');
const PortfolioManager = require('./portfolio/manager');
const RiskAnalyzer = require('./portfolio/risk');

async function main() {
  let alpaca, openai, lastTradeTime = null;
  const NOTIONAL_LIMIT = 200000; // Alpaca's notional limit per order

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
    portfolio.setCash(parseFloat(account.cash));

    // Sync portfolio with actual positions
    if (Array.isArray(positions)) {
      positions.forEach(pos => {
        const symbol = pos.symbol.includes('BTC') ? 'BTC/USD' : 'LTC/USD';
        const qty = parseFloat(pos.qty);
        const avgPrice = parseFloat(pos.avg_entry_price);
        portfolio.updateHolding(symbol, qty, avgPrice);
      });
    } else {
      console.warn('Positions is not an array:', positions);
    }

    // Fetch and cancel conflicting pending orders
    const pendingOrders = await alpaca.fetchData('/v2/orders', { status: 'open' }, 'GET', null, true);
    const currentTime = new Date().toISOString();
    if (pendingOrders && Array.isArray(pendingOrders)) {
      for (const order of pendingOrders) {
        const orderSymbol = order.symbol.includes('BTC') ? 'BTC/USD' : 'LTC/USD';
        const currentPrice = marketData.latestTrades.trades[orderSymbol]?.p || 0;
        if (currentPrice === 0) continue;
        const orderValue = order.qty * currentPrice;
        if (orderValue > 0.01 * parseFloat(account.buying_power) || order.status === 'accepted') {
          await alpaca.fetchData(`/v2/orders/${order.id}`, {}, 'DELETE', null, true);
          console.log(`Canceled pending order ${order.id} for ${orderSymbol} at ${currentTime}`);
        }
      }
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
      if (currentPrice >= holding.avgPrice * 1.2 && holding.quantity > 0 && currentTime !== lastTradeTime) {
        console.log(`Price of ${symbol} increased by 20% or more. Selling ${holding.quantity} units.`);
        const alpacaSymbol = symbol.replace('/', '');
        let qty = holding.quantity;
        // Cap quantity to stay within notional limit
        if (qty * currentPrice > NOTIONAL_LIMIT) {
          qty = Math.floor(NOTIONAL_LIMIT / currentPrice);
        }
        if (qty <= 0) {
          console.warn(`Notional value too low to sell ${symbol}.`);
          continue;
        }
        const order = await alpaca.createOrder({
          symbol: alpacaSymbol,
          qty,
          side: 'sell',
          type: 'market',
          time_in_force: 'gtc'
        });
        if (order.status === 'accepted' || order.status === 'filled') {
          portfolio.updateHolding(symbol, -qty, currentPrice);
          portfolio.setCash(portfolio.portfolio.cash + qty * currentPrice);
          console.log(`Sold ${qty} ${symbol} at $${currentPrice}`);
          lastTradeTime = currentTime;
        }
      }
    }

    // AI-driven trading decision
    const tradingDecision = await openai.generateTradingDecision(marketData, portfolio.portfolio, riskProfile);
    console.log('AI Trading Decision:', tradingDecision);

    // Parse AI trading decision and execute trades
    const decisionLines = tradingDecision.split('\n');
    let currentSymbol = null;
    if (currentTime !== lastTradeTime) {
      for (const line of decisionLines) {
        if (line.includes('Bitcoin (BTC/USD)')) {
          currentSymbol = 'BTC/USD';
        } else if (line.includes('Litecoin (LTC/USD)')) {
          currentSymbol = 'LTC/USD';
        }

        if (line.includes('**Recommendation:') && currentSymbol) {
          const decisionMatch = line.match(/\*\*Recommendation:\s*(Buy|Sell|Hold)\*\*/);
          if (decisionMatch) {
            const action = decisionMatch[1].toLowerCase();
            if (action === 'hold') {
              console.log(`AI Decision: Hold ${currentSymbol}, skipping trade.`);
              continue;
            }

            const currentPrice = marketData.latestTrades.trades[currentSymbol]?.p;
            if (!currentPrice) {
              console.warn(`No current price for ${currentSymbol}, skipping trade.`);
              continue;
            }

            const targetAllocation = currentSymbol === 'BTC/USD' ? 600000 : 300000;
            let qty = Math.max((targetAllocation / currentPrice) * 0.1, currentSymbol === 'BTC/USD' ? 0.00001 : 0.00002);
            // Cap quantity to stay within notional limit
            if (qty * currentPrice > NOTIONAL_LIMIT) {
              qty = Math.floor(NOTIONAL_LIMIT / currentPrice);
            }
            if (action === 'buy' && portfolio.portfolio.cash < qty * currentPrice) {
              qty = Math.max(portfolio.portfolio.cash / currentPrice, currentSymbol === 'BTC/USD' ? 0.00001 : 0.00002);
              if (qty * currentPrice > portfolio.portfolio.cash) {
                console.warn(`Insufficient cash to buy ${qty} ${currentSymbol}.`);
                continue;
              }
            }

            if (action === 'sell' && (!portfolio.portfolio.holdings[currentSymbol] || portfolio.portfolio.holdings[currentSymbol].quantity < qty)) {
              qty = portfolio.portfolio.holdings[currentSymbol]?.quantity || 0;
              if (qty * currentPrice > NOTIONAL_LIMIT) {
                qty = Math.floor(NOTIONAL_LIMIT / currentPrice);
              }
              if (qty === 0) {
                console.warn(`Insufficient quantity to sell ${qty} ${currentSymbol}.`);
                continue;
              }
            }

            if (qty <= 0) {
              console.warn(`Notional value too low to trade ${currentSymbol}.`);
              continue;
            }

            const alpacaSymbol = currentSymbol.replace('/', '');
            const order = await alpaca.createOrder({
              symbol: alpacaSymbol,
              qty,
              side: action,
              type: 'market',
              time_in_force: 'gtc'
            });

            if (order.status === 'accepted' || order.status === 'filled') {
              if (action === 'buy') {
                portfolio.updateHolding(currentSymbol, qty, currentPrice);
                portfolio.setCash(portfolio.portfolio.cash - qty * currentPrice);
              } else {
                portfolio.updateHolding(currentSymbol, -qty, currentPrice);
                portfolio.setCash(portfolio.portfolio.cash + qty * currentPrice);
              }
              console.log(`Trade executed: ${action} ${qty} ${currentSymbol} at $${currentPrice}`);
              lastTradeTime = currentTime;
            } else {
              console.error(`Trade failed for ${currentSymbol}: ${order.status}`);
            }
          }
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