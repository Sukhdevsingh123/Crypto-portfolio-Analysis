


// class PortfolioManager {
//   constructor() {
//     this.portfolio = {
//       cash: 10000, // Starting cash (USD)
//       holdings: {} // e.g., { 'BTC/USD': { quantity: 0.1, avgPrice: 50000 } }
//     };
//   }

//   updateHolding(symbol, quantity, price) {
//     if (quantity === 0) {
//       delete this.portfolio.holdings[symbol];
//       return;
//     }
//     this.portfolio.holdings[symbol] = {
//       quantity,
//       avgPrice: price
//     };
//     this.portfolio.cash -= quantity * price;
//   }

//   calculatePortfolioValue(marketData) {
//     let totalValue = this.portfolio.cash;
//     for (const [symbol, holding] of Object.entries(this.portfolio.holdings)) {
//       // Prefer latest trade price, fallback to latest bar or snapshot
//       const price = marketData.latestTrades?.trades[symbol]?.p ||
//                    marketData.latestBars?.bars[symbol]?.c ||
//                    marketData.snapshots?.snapshots[symbol]?.latestTrade?.p ||
//                    holding.avgPrice;
//       totalValue += holding.quantity * price;
//     }
//     return totalValue;
//   }

//   calculateReturns(marketData) {
//     const currentValue = this.calculatePortfolioValue(marketData);
//     const initialValue = 10000;
//     return ((currentValue - initialValue) / initialValue) * 100;
//   }

//   assessLiquidity(orderbookData) {
//     // console.log('Orderbook Data:', orderbookData); // Debug: Log raw orderbook data
//     const liquidity = {};
//     if (!orderbookData?.orderbooks) {
//       console.warn('No orderbooks found in orderbookData');
//       return liquidity;
//     }

//     for (const [symbol, orderbook] of Object.entries(orderbookData.orderbooks)) {
//       // console.log(`Processing orderbook for ${symbol}:`, orderbook); // Debug
//       if (!orderbook || !Array.isArray(orderbook.b) || !Array.isArray(orderbook.a)) {
//         console.warn(`Invalid or missing orderbook for ${symbol}`);
//         liquidity[symbol] = { bidDepth: 0, askDepth: 0 };
//         continue;
//       }

//       const bidDepth = orderbook.b.reduce((sum, bid) => sum + (bid.s || 0), 0);
//       const askDepth = orderbook.a.reduce((sum, ask) => sum + (ask.s || 0), 0);
//       liquidity[symbol] = { bidDepth, askDepth };
//     }
//     return liquidity;
//   }

//   rebalancePortfolio(allocations) {
//     console.log('Rebalancing portfolio with allocations:', allocations);
//     // Implement trading logic using Alpaca Trading API (future enhancement)
//   }
// }

// module.exports = PortfolioManager;




// setcase method added.......................
class PortfolioManager {
  constructor() {
    this.portfolio = {
      cash: 10000, // Starting cash (USD)
      holdings: {} // e.g., { 'BTC/USD': { quantity: 0.1, avgPrice: 50000 } }
    };
  }

  setCash(amount) {
    this.portfolio.cash = parseFloat(amount) || 0;
  }

  updateHolding(symbol, quantity, price) {
    if (quantity === 0) {
      delete this.portfolio.holdings[symbol];
      return;
    }
    this.portfolio.holdings[symbol] = {
      quantity,
      avgPrice: price
    };
    this.portfolio.cash -= quantity * price;
  }

  calculatePortfolioValue(marketData) {
    let totalValue = this.portfolio.cash;
    for (const [symbol, holding] of Object.entries(this.portfolio.holdings)) {
      const price = marketData.latestTrades?.trades[symbol]?.p ||
                   marketData.latestBars?.bars[symbol]?.c ||
                   marketData.snapshots?.snapshots[symbol]?.latestTrade?.p ||
                   holding.avgPrice;
      totalValue += holding.quantity * price;
    }
    return totalValue;
  }

  calculateReturns(marketData) {
    const currentValue = this.calculatePortfolioValue(marketData);
    const initialValue = 10000;
    return ((currentValue - initialValue) / initialValue) * 100;
  }

  assessLiquidity(orderbookData) {
    const liquidity = {};
    if (!orderbookData?.orderbooks) {
      // console.warn('No orderbooks found in orderbookData');
      return liquidity;
    }

    for (const [symbol, orderbook] of Object.entries(orderbookData.orderbooks)) {
      if (!orderbook || !Array.isArray(orderbook.b) || !Array.isArray(orderbook.a)) {
        // console.warn(`Invalid or missing orderbook for ${symbol}`);
        liquidity[symbol] = { bidDepth: 0, askDepth: 0 };
        continue;
      }

      const bidDepth = orderbook.b.reduce((sum, bid) => sum + (bid.s || 0), 0);
      const askDepth = orderbook.a.reduce((sum, ask) => sum + (ask.s || 0), 0);
      liquidity[symbol] = { bidDepth, askDepth };
    }
    return liquidity;
  }

  rebalancePortfolio(allocations) {
    console.log('Rebalancing portfolio with allocations:', allocations);
  }
}

module.exports = PortfolioManager;