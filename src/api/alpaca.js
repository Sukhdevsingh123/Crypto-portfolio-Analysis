



require('dotenv').config();

class AlpacaClient {
  constructor(apiKey, apiSecret) {
    if (!process.env.ALPACA_BASE_URL || !process.env.ALPACA_ACCOUNT_URL) {
      throw new Error('ALPACA_BASE_URL and ALPACA_ACCOUNT_URL must be defined in .env');
    }
    this.dataBaseUrl = process.env.ALPACA_BASE_URL.replace(/\/+$/, '');
    this.tradingBaseUrl = process.env.ALPACA_ACCOUNT_URL.replace(/\/+$/, '');
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    console.log('Initialized AlpacaClient with dataBaseUrl:', this.dataBaseUrl, 'and tradingBaseUrl:', this.tradingBaseUrl);
  }

  async fetchData(endpoint, params = {}, method = 'GET', body = null, isTradingEndpoint = false) {
    const fetch = (await import('node-fetch')).default;
    const baseUrl = isTradingEndpoint ? this.tradingBaseUrl : this.dataBaseUrl;
    console.log('fetchData - baseUrl:', baseUrl, 'endpoint:', endpoint);
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const urlString = `${baseUrl}${normalizedEndpoint}`;

    let url;
    try {
      url = new URL(urlString);
    } catch (err) {
      throw new Error(`Invalid URL: ${urlString} - ${err.message}`);
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    console.log('Fetching:', url.href, 'with method:', method, 'and headers:', {
      'accept': 'application/json',
      'APCA-API-KEY-ID': this.apiKey,
      'APCA-API-SECRET-KEY': this.apiSecret
    });

    const options = {
      method,
      headers: {
        'accept': 'application/json',
        'APCA-API-KEY-ID': this.apiKey,
        'APCA-API-SECRET-KEY': this.apiSecret,
        ...(body && { 'Content-Type': 'application/json' })
      },
      ...(body && { body: JSON.stringify(body) })
    };

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`HTTP error! Status: ${res.status} - ${res.statusText} - ${errorText}`);
        throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText} - ${errorText}`);
      }
      const data = await res.json();
      console.log(`Response from ${url.href}:`, data);
      return data;
    } catch (err) {
      console.error(`Error fetching ${normalizedEndpoint}:`, err.message);
      throw err;
    }
  }

  async getAccount() {
    return this.fetchData('/v2/account', {}, 'GET', null, true);
  }

  async getPositions() {
    const response = await this.fetchData('/v2/positions', {}, 'GET', null, true);
    console.log('getPositions raw response:', response);
    return Array.isArray(response) ? response : [];
  }

  async createOrder(order) {
    return this.fetchData('/v2/orders', {}, 'POST', order, true);
  }

  async getHistoricalBars(symbols, timeframe = '1Day', start, end, limit = 1000) {
    return this.fetchData('/v1beta3/crypto/us/bars', {
      symbols: symbols.join(','),
      timeframe,
      start,
      end,
      limit,
      sort: 'asc'
    });
  }

  async getLatestBars(symbols) {
    return this.fetchData('/v1beta3/crypto/us/latest/bars', {
      symbols: symbols.join(',')
    });
  }

  async getLatestOrderbook(symbols) {
    return this.fetchData('/v1beta3/crypto/us/latest/orderbooks', {
      symbols: symbols.join(',')
    });
  }

  async getLatestQuotes(symbols) {
    return this.fetchData('/v1beta3/crypto/us/latest/quotes', {
      symbols: symbols.join(',')
    });
  }

  async getLatestTrades(symbols) {
    return this.fetchData('/v1beta3/crypto/us/latest/trades', {
      symbols: symbols.join(',')
    });
  }

  async getHistoricalQuotes(symbols, start, end, limit = 1000) {
    return this.fetchData('/v1beta3/crypto/us/quotes', {
      symbols: symbols.join(','),
      start,
      end,
      limit,
      sort: 'asc'
    });
  }

  async getSnapshots(symbols) {
    return this.fetchData('/v1beta3/crypto/us/snapshots', {
      symbols: symbols.join(',')
    });
  }

  async getHistoricalTrades(symbols, start, end, limit = 1000) {
    return this.fetchData('/v1beta3/crypto/us/trades', {
      symbols: symbols.join(','),
      start,
      end,
      limit,
      sort: 'asc'
    });
  }
}

module.exports = AlpacaClient;