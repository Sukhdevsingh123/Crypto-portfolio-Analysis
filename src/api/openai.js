
const { OpenAI } = require('openai');

class OpenAIClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }
    this.openai = new OpenAI({ apiKey });
  }

  // Preprocess market data to reduce token count
  preprocessMarketData(data) {
    const { marketData, portfolio } = data;
    return {
      latestPrices: Object.fromEntries(
        Object.entries(marketData.latestTrades?.trades || {}).map(([symbol, trade]) => [symbol, trade.p])
      ),
      bidAskSpreads: Object.fromEntries(
        Object.entries(marketData.latestQuotes?.quotes || {}).map(([symbol, quote]) => [
          symbol,
          quote.ap - quote.bp
        ])
      ),
      portfolio: {
        cash: portfolio.cash,
        holdings: Object.fromEntries(
          Object.entries(portfolio.holdings || {}).map(([symbol, holding]) => [
            symbol,
            { quantity: holding.quantity, avgPrice: holding.avgPrice }
          ])
        )
      }
    };
  }

  async analyzeMarketData(data, prompt) {
    try {
      // Preprocess data to reduce token count
      const processedData = this.preprocessMarketData(data);
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Use lighter model to reduce token usage
        messages: [
          { role: 'system', content: 'You are a financial analyst specializing in cryptocurrency trading.' },
          { role: 'user', content: `${prompt}\nData: ${JSON.stringify(processedData)}` }
        ],
        max_tokens: 500
      });
      return response.choices[0].message.content;
    } catch (err) {
      console.error('Error with OpenAI API:', err.message);
      throw err;
    }
  }

  async generateTradingDecision(marketData, portfolio, riskProfile) {
    const prompt = `Based on the following market data and portfolio, suggest a trading decision (buy, sell, hold) for each asset. Consider the user's risk profile: ${riskProfile}. Provide a brief rationale.`;
    return this.analyzeMarketData({ marketData, portfolio }, prompt);
  }

  async assessPortfolioRisk(portfolio, marketData) {
    const prompt = `Analyze the risk of the following portfolio based on market data. Calculate potential downside risks and suggest mitigation strategies.`;
    return this.analyzeMarketData({ portfolio, marketData }, prompt);
  }

  async optimizePortfolio(portfolio, marketData, riskProfile) {
    const prompt = `Optimize the following portfolio based on market data and the user's risk profile: ${riskProfile}. Suggest asset allocations and rebalancing actions.`;
    return this.analyzeMarketData({ portfolio, marketData }, prompt);
  }
}

module.exports = OpenAIClient;