// ....................................

// class AlpacaClient {
//   constructor(apiKey, apiSecret, baseUrl) {
//     if (!baseUrl) {
//       throw new Error('ALPACA_BASE_URL is required');
//     }
//     // Ensure baseUrl ends with a single slash
//     this.baseUrl = baseUrl.replace(/\/+$/, '');
//     this.apiKey = apiKey;
//     this.apiSecret = apiSecret;
//   }

//   async fetchData(endpoint, params = {}) {
//     const fetch = (await import('node-fetch')).default;
//     // Ensure endpoint starts with a single slash
//     const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
//     const urlString = `${this.baseUrl}${normalizedEndpoint}`;
    
//     // Debug: Log the URL before creating
//     // console.log('Constructing URL:', urlString, 'Params:', params);

//     let url;
//     try {
//       url = new URL(urlString);
//     } catch (err) {
//       throw new Error(`Invalid URL: ${urlString}`);
//     }

//     Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
//     const options = {
//       method: 'GET',
//       headers: {
//         'accept': 'application/json',
//         'APCA-API-KEY-ID': this.apiKey,
//         'APCA-API-SECRET-KEY': this.apiSecret
//       }
//     };

//     try {
//       const res = await fetch(url, options);
//       if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText}`);
//       }
//       return await res.json();
//     } catch (err) {
//       console.error(`Error fetching ${normalizedEndpoint}:`, err.message);
//       throw err;
//     }
//   }

//   async getHistoricalBars(symbols, timeframe = '1Day', start, end, limit = 1000) {
//     return this.fetchData('/v1beta3/crypto/us/bars', {
//       symbols: symbols.join(','),
//       timeframe,
//       start,
//       end,
//       limit,
//       sort: 'asc'
//     });
//   }

//   async getLatestBars(symbols) {
//     return this.fetchData('/v1beta3/crypto/us/latest/bars', {
//       symbols: symbols.join(',')
//     });
//   }

//   async getLatestOrderbook(symbols) {
//     return this.fetchData('/v1beta3/crypto/us/latest/orderbooks', {
//       symbols: symbols.join(',')
//     });
//   }

//   async getLatestQuotes(symbols) {
//     return this.fetchData('/v1beta3/crypto/us/latest/quotes', {
//       symbols: symbols.join(',')
//     });
//   }

//   async getLatestTrades(symbols) {
//     return this.fetchData('/v1beta3/crypto/us/latest/trades', {
//       symbols: symbols.join(',')
//     });
//   }

//   async getHistoricalQuotes(symbols, start, end, limit = 1000) {
//     return this.fetchData('/v1beta3/crypto/us/quotes', {
//       symbols: symbols.join(','),
//       start,
//       end,
//       limit,
//       sort: 'asc'
//     });
//   }

//   async getSnapshots(symbols) {
//     return this.fetchData('/v1beta3/crypto/us/snapshots', {
//       symbols: symbols.join(',')
//     });
//   }

//   async getHistoricalTrades(symbols, start, end, limit = 1000) {
//     return this.fetchData('/v1beta3/crypto/us/trades', {
//       symbols: symbols.join(','),
//       start,
//       end,
//       limit,
//       sort: 'asc'
//     });
//   }
// }

// module.exports = AlpacaClient;
// .................................




require('dotenv').config();

class AlpacaClient {
  constructor(apiKey, apiSecret) {
    if (!process.env.ALPACA_BASE_URL || !process.env.ALPACA_ACCOUNT_URL) {
      throw new Error('ALPACA_BASE_URL and ALPACA_ACCOUNT_URL must be defined in .env');
    }
    this.dataBaseUrl = process.env.ALPACA_BASE_URL.replace(/\/+$/, ''); // For market data
    this.tradingBaseUrl = process.env.ALPACA_ACCOUNT_URL.replace(/\/+$/, ''); // For account and trading endpoints
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    // console.log('Initialized AlpacaClient with dataBaseUrl:', this.dataBaseUrl, 'and tradingBaseUrl:', this.tradingBaseUrl);
  }

  async fetchData(endpoint, params = {}, method = 'GET', body = null, isTradingEndpoint = false) {
    const fetch = (await import('node-fetch')).default;
    const baseUrl = isTradingEndpoint ? this.tradingBaseUrl : this.dataBaseUrl;
    // console.log('fetchData - baseUrl:', baseUrl, 'endpoint:', endpoint); // Debug URL components
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const urlString = `${baseUrl}${normalizedEndpoint}`; // Always append the endpoint
    
    let url;
    try {
      url = new URL(urlString);
    } catch (err) {
      throw new Error(`Invalid URL: ${urlString} - ${err.message}`);
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    // console.log('Fetching:', url.href, 'with method:', method, 'and headers:', {
    //   'accept': 'application/json',
    //   'APCA-API-KEY-ID': this.apiKey,
    //   'APCA-API-SECRET-KEY': this.apiSecret
    // });

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
        // console.error(`HTTP error! Status: ${res.status} - ${res.statusText} - ${errorText}`);
        throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText} - ${errorText}`);
      }
      const data = await res.json();
      // console.log(`Response from ${url.href}:`, data);
      return data;
    } catch (err) {
      // console.error(`Error fetching ${normalizedEndpoint}:`, err.message);
      throw err;
    }
  }

  async getAccount() {
    return this.fetchData('/v2/account', {}, 'GET', null, true); // Explicitly set to /v2/account
  }

  async getPositions() {
    const response = await this.fetchData('/v2/positions', {}, 'GET', null, true);
    // console.log('getPositions raw response:', response);
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