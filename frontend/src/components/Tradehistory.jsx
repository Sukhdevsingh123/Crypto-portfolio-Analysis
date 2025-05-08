import React, { useState, useEffect } from 'react';

const TradeHistory = ({ theme }) => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'APCA-API-KEY-ID': 'PK5UBT32UWC1M4V2EOA5',
            'APCA-API-SECRET-KEY': 'K8vciqCFMa9e57kWDNydBauUYuZlttckdgEe2u6q'
          }
        };

        const response = await fetch('https://paper-api.alpaca.markets/v2/orders?status=all', options);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setTrades(data);
        } else {
          setTrades([]);
          setError('Invalid data format received');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTrades();
    const interval = setInterval(fetchTrades, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className={`shadow-lg rounded-lg p-6 mt-6 transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
        <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Automated Trade History</h2>
        <div className="flex justify-center">
          <div className={`w-8 h-8 border-4 border-t-4 border-${theme === 'dark' ? 'white' : 'gray-900'} border-solid rounded-full animate-spin`}
            style={{ borderTopColor: theme === 'dark' ? '#D1D5DB' : '#374151' }}>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`shadow-lg rounded-lg p-6 mt-6 transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
        <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Automated Trade History</h2>
        <p className="text-red-500">Error loading trade history: {error}</p>
      </div>
    );
  }

  return (
    <div className={`shadow-lg rounded-lg p-6 mt-6 transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
      <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Automated Trade History</h2>
      <div className="overflow-x-auto">
        <div className="relative max-h-96 overflow-y-auto"> {/* Added max height and overflow-y */}
          <table className={`min-w-full ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
            <thead>
              <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} sticky top-0`}> {/* Added sticky header */}
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Side</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {trades.length > 0 ? (
                trades.map((trade) => (
                  <tr 
                    key={trade.id}
                    className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <td className="px-4 py-2">{trade.symbol}</td>
                    <td className={`px-4 py-2 ${trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.side.toUpperCase()}
                    </td>
                    <td className="px-4 py-2">{parseFloat(trade.qty).toFixed(6)}</td>
                    <td className="px-4 py-2">
                      ${trade.filled_avg_price ? parseFloat(trade.filled_avg_price).toFixed(2) : 'N/A'}
                    </td>
                    <td className={`px-4 py-2 ${
                      trade.status === 'filled' ? 'text-green-500' : 
                      trade.status === 'canceled' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {trade.status.toUpperCase()}
                    </td>
                    <td className="px-4 py-2">{formatDate(trade.filled_at || trade.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center">No trade history available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
};

export default TradeHistory;