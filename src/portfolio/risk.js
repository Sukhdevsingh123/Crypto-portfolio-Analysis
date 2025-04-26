class RiskAnalyzer {
  
    calculateVolatility(prices) {
      const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);
      const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length;
      return Math.sqrt(variance) * Math.sqrt(365); // Annualized volatility
    }
  
    calculateVaR(portfolioValue, volatility, days = 1) {
      const zScore = 1.645; // 95% confidence
      return portfolioValue * volatility * zScore * Math.sqrt(days / 365);
    }
  
    calculateSpreadRisk(quotes) {
      const spreads = {};
      for (const [symbol, quote] of Object.entries(quotes.quotes)) {
        spreads[symbol] = quote.ap - quote.bp; // Ask price - Bid price
      }
      return spreads;
    }
  
    async assessRiskWithAI(portfolio, marketData, openAIClient) {
      const aiRiskAnalysis = await openAIClient.assessPortfolioRisk(portfolio, marketData);
      return aiRiskAnalysis;
    }
  }
  
  module.exports = RiskAnalyzer;