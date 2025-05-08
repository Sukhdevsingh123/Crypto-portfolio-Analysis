

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ThemeContext } from '../components/ThemeContext';
import TradeHistory from './Tradehistory'; // Make sure to create this file with the component above


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const MetricCard = ({ title, value, change, changeColor, theme }) => (
  <div className={`shadow-lg rounded-lg p-4 flex-1 transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
    <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
    <div className="flex items-center mt-2">
      <p className="text-2xl font-bold">{value}</p>
      {change !== undefined && (
        <span className={`ml-2 text-sm ${changeColor} font-medium`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
  </div>
);

const AccountInfo = ({ account, dailyChange, theme }) => (
  <div className={`shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
    <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Account Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Cash</p>
        <p className="text-xl font-bold">${account.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Equity</p>
        <p className="text-xl font-bold">${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Buying Power</p>
        <p className="text-xl font-bold">${account.buyingPower.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    </div>
    <div className="mt-4">
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Daily Change</p>
      <p className={`text-xl font-bold ${dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        ${Math.abs(dailyChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
    <div className="mt-4">
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Positions</p>
      {account.positions.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {account.positions.map((pos, index) => (
            <li key={index} className={`flex justify-between p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span>{pos.symbol}</span>
              <span>{parseFloat(pos.qty).toFixed(6)} units @ ${parseFloat(pos.avg_entry_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No positions held.</p>
      )}
    </div>
  </div>
);

const ProfitLossSummary = ({ portfolio, positions, theme }) => {
  const profitLoss = {};
  let totalProfitLoss = 0;
  positions.forEach(pos => {
    const symbol = pos.symbol.includes('BTC') ? 'BTC/USD' : 'LTC/USD';
    const currentPrice = pos.current_price || pos.avg_entry_price;
    const value = pos.qty * currentPrice;
    const cost = pos.qty * pos.avg_entry_price;
    const pl = value - cost;
    profitLoss[symbol] = pl;
    totalProfitLoss += pl;
  });

  return (
    <div className={`shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
      <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Profit & Loss Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Profit/Loss</p>
          <p className={`text-xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${Math.abs(totalProfitLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Breakdown</p>
          {Object.entries(profitLoss).length > 0 ? (
            <ul className="mt-2 space-y-2">
              {Object.entries(profitLoss).map(([symbol, pl], index) => (
                <li key={index} className={`flex justify-between p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span>{symbol}</span>
                  <span className={pl >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ${Math.abs(pl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No profit/loss data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const PortfolioEngagement = ({ historicalBars, theme }) => {
  const btcData = historicalBars['BTC/USD'] || [];
  const ltcData = historicalBars['LTC/USD'] || [];
  const limitedBtcData = btcData.slice(-12);
  const limitedLtcData = ltcData.slice(-12);
  const labels = limitedBtcData.map(bar => new Date(bar.t).toLocaleDateString('en-US', { month: 'short' }));

  const ctx = document.createElement('canvas').getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, theme === 'dark' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(54, 162, 235, 0.6)');
  gradient.addColorStop(1, theme === 'dark' ? 'rgba(54, 162, 235, 0.3)' : 'rgba(54, 162, 235, 0.1)');

  const chartData = {
    labels,
    datasets: [
      {
        label: 'BTC/USD Price',
        data: limitedBtcData.map(bar => bar.c),
        fill: true,
        backgroundColor: gradient,
        borderColor: theme === 'dark' ? '#60A5FA' : '#36A2EB',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: theme === 'dark' ? '#60A5FA' : '#36A2EB',
        pointBorderColor: theme === 'dark' ? '#1F2937' : '#fff',
        pointHoverBackgroundColor: theme === 'dark' ? '#D1D5DB' : '#fff',
        pointHoverBorderColor: theme === 'dark' ? '#60A5FA' : '#36A2EB',
      },
      {
        label: 'LTC/USD Price',
        data: limitedLtcData.map(bar => bar.c),
        fill: true,
        backgroundColor: theme === 'dark' ? 'rgba(255, 99, 132, 0.4)' : 'rgba(255, 99, 132, 0.2)',
        borderColor: theme === 'dark' ? '#F87171' : '#FF6384',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: theme === 'dark' ? '#F87171' : '#FF6384',
        pointBorderColor: theme === 'dark' ? '#1F2937' : '#fff',
        pointHoverBackgroundColor: theme === 'dark' ? '#D1D5DB' : '#fff',
        pointHoverBorderColor: theme === 'dark' ? '#F87171' : '#FF6384',
      },
    ],
  };

  return (
    <div className={`shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
      <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Portfolio Engagement</h2>
      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Monthly price trends of your assets</p>
      <div className="h-72">
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                grid: { color: theme === 'dark' ? '#4B5563' : '#E5E7EB' },
                ticks: { color: theme === 'dark' ? '#D1D5DB' : '#374151' },
              },
              x: { ticks: { color: theme === 'dark' ? '#D1D5DB' : '#374151' } },
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  boxWidth: 10,
                  font: { size: 12 },
                  color: theme === 'dark' ? '#D1D5DB' : '#374151',
                },
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: theme === 'dark' ? '#1F2937' : '#fff',
                titleColor: theme === 'dark' ? '#D1D5DB' : '#374151',
                bodyColor: theme === 'dark' ? '#D1D5DB' : '#374151',
              },
            },
            animation: { duration: 1000, easing: 'easeInOutQuad' },
          }}
        />
      </div>
    </div>
  );
};

const SkillBreakdown = ({ insights, theme }) => {
  const btcConfidence = insights.tradingDecision.includes('Sell') ? 75 : 50;
  const ltcConfidence = insights.tradingDecision.includes('Hold') ? 60 : 40;
  const chartData = {
    labels: ['BTC/USD Decision', 'LTC/USD Decision'],
    datasets: [
      {
        label: 'Confidence',
        data: [btcConfidence, ltcConfidence],
        backgroundColor: theme === 'dark' ? ['#F87171', '#60A5FA'] : ['#FF6384', '#36A2EB'],
        borderColor: theme === 'dark' ? ['#F87171', '#60A5FA'] : ['#FF6384', '#36A2EB'],
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 20,
      },
    ],
  };

  return (
    <div className={`shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
      <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>AI Trading Confidence</h2>
      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Confidence levels of AI trading decisions</p>
      <div className="h-72">
        <Bar
          data={chartData}
          options={{
            indexAxis: 'y',
            scales: {
              x: {
                beginAtZero: true,
                max: 100,
                grid: { color: theme === 'dark' ? '#4B5563' : '#E5E7EB' },
                ticks: { color: theme === 'dark' ? '#D1D5DB' : '#374151' },
              },
              y: { ticks: { color: theme === 'dark' ? '#D1D5DB' : '#374151' } },
            },
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%` },
                backgroundColor: theme === 'dark' ? '#1F2937' : '#fff',
                titleColor: theme === 'dark' ? '#D1D5DB' : '#374151',
                bodyColor: theme === 'dark' ? '#D1D5DB' : '#374151',
              },
            },
            animation: { duration: 1000, easing: 'easeInOutQuad' },
          }}
        />
      </div>
    </div>
  );
};

const ApplicationStatus = ({ portfolio, latestTrades, positions, theme }) => {
  const btcValue = positions.find((pos) => pos.symbol === 'BTCUSD')?.market_value || 0;
  const ltcValue = positions.find((pos) => pos.symbol === 'LTCUSD')?.market_value || 0;
  const chartData = {
    labels: ['Cash', 'BTC', 'LTC'],
    datasets: [
      {
        data: [portfolio.cash, btcValue, ltcValue],
        backgroundColor: theme === 'dark' ? ['#60A5FA', '#F87171', '#FBBF24'] : ['#36A2EB', '#FF6384', '#FFCE56'],
        borderWidth: 1,
        borderColor: theme === 'dark' ? '#1F2937' : '#fff',
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className={`shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
      <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Portfolio Allocation</h2>
      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Current distribution of your assets</p>
      <div className="max-w-xs mx-auto h-72">
        <Pie
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  boxWidth: 10,
                  font: { size: 12 },
                  color: theme === 'dark' ? '#D1D5DB' : '#374151',
                },
              },
              tooltip: {
                callbacks: { label: (ctx) => `${ctx.label}: $${ctx.raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                backgroundColor: theme === 'dark' ? '#1F2937' : '#fff',
                titleColor: theme === 'dark' ? '#D1D5DB' : '#374151',
                bodyColor: theme === 'dark' ? '#D1D5DB' : '#374151',
              },
            },
            animation: { animateRotate: true, animateScale: true, duration: 1000 },
          }}
        />
      </div>
    </div>
  );
};

const WeeklyActivity = ({ insights, theme }) => {
  const btcSpreadMatch = insights.tradingDecision.match(/The bid-ask spread is relatively wide \(\$(\d+\.\d+)\)/);
  const btcSpread = btcSpreadMatch ? parseFloat(btcSpreadMatch[1]) : 0;
  const ltcSpreadMatch = insights.tradingDecision.match(/The current market price for LTC\/USD is \$\d+\.\d+,.*?\. In a moderate risk profile/);
  const ltcSpread = ltcSpreadMatch ? 0.5 : 0;
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'BTC/USD Spread',
        data: Array(7).fill(btcSpread),
        backgroundColor: theme === 'dark' ? '#60A5FA' : '#36A2EB',
        borderRadius: 5,
        barThickness: 15,
      },
      {
        label: 'LTC/USD Spread',
        data: Array(7).fill(ltcSpread),
        backgroundColor: theme === 'dark' ? '#F87171' : '#FF6384',
        borderRadius: 5,
        barThickness: 15,
      },
    ],
  };

  return (
    <div className={`shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
      <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Weekly Spread Activity</h2>
      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Bid-Ask spreads over the week</p>
      <div className="h-72">
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: theme === 'dark' ? '#4B5563' : '#E5E7EB' },
                ticks: { color: theme === 'dark' ? '#D1D5DB' : '#374151' },
              },
              x: { ticks: { color: theme === 'dark' ? '#D1D5DB' : '#374151' } },
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  boxWidth: 10,
                  font: { size: 12 },
                  color: theme === 'dark' ? '#D1D5DB' : '#374151',
                },
              },
              tooltip: {
                callbacks: { label: (ctx) => `${ctx.dataset.label}: $${ctx.raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                backgroundColor: theme === 'dark' ? '#1F2937' : '#fff',
                titleColor: theme === 'dark' ? '#D1D5DB' : '#374151',
                bodyColor: theme === 'dark' ? '#D1D5DB' : '#374151',
              },
            },
            animation: { duration: 1000, easing: 'easeInOutQuad' },
          }}
        />
      </div>
    </div>
  );
};

const Web3Verification = ({ insights, portfolio, positions, theme }) => {
  const btcValue = positions.find((pos) => pos.symbol === 'BTCUSD')?.market_value || 0;
  const suggestedBtc = parseFloat(insights.optimization.match(/Target BTC Allocation.*= \$([\d,]+\.\d+)/)?.[1].replace(/,/g, '')) || 0;
  const progress = suggestedBtc ? (btcValue / suggestedBtc) * 100 : 0;
  const chartData = {
    labels: ['Optimization Progress'],
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: theme === 'dark' ? ['#60A5FA', '#4B5563'] : ['#36A2EB', '#E5E7EB'],
        borderWidth: 0,
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className={`shadow-lg rounded-lg p-6 mt-6 transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
      <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Portfolio Optimization Progress</h2>
      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Progress towards suggested allocation</p>
      <div className="w-full h-64 relative"> {/* Changed to relative positioning and fixed height */}
        <div className="absolute inset-0 flex items-center justify-center"> {/* Centering container */}
          <div className="w-64 h-64"> {/* Fixed dimensions for chart container */}
            <Pie
              data={chartData}
              options={{
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: false },
                },
                animation: { animateRotate: true, animateScale: true, duration: 1000 },
              }}
            />
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"> {/* Centered text overlay */}
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{Math.round(progress)}%</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Optimized</p>
        </div>
      </div>
    </div>
  );
};

function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastTradeTime, setLastTradeTime] = useState(null);
 
  const NOTIONAL_LIMIT = 200000;

  const executeTrade = async (symbol, action, quantity, price) => {
    try {
    //   const response = await axios.post('http://localhost:5000/api/trade', {
      const response = await axios.post('https://crypto-portfolio-komv.onrender.com/api/trade', {

        symbol,
        action,
        quantity,
        price,
      });
      console.log(response.data.message);
    //   const updatedResponse = await axios.get('http://localhost:5000/api/data');
      const updatedResponse = await axios.get('https://crypto-portfolio-komv.onrender.com/api/data');

      setData(updatedResponse.data);
    } catch (err) {
      console.error('Trade execution failed:', err.message);
    }
  };

  const handleAutomatedTrading = async (data) => {
    const { marketData, insights } = data;

    const decisions = {
      'BTC/USD': insights.tradingDecision.includes('Sell') ? 'Sell' : insights.tradingDecision.includes('Buy') ? 'Buy' : 'Hold',
      'LTC/USD': insights.tradingDecision.includes('Buy') ? 'Buy' : insights.tradingDecision.includes('Sell') ? 'Sell' : 'Hold',
    };

    const btcPrice = marketData.latestTrades.trades['BTC/USD'].p;
    const ltcPrice = marketData.snapshots.snapshots['LTC/USD']?.latestTrade?.p || 0;

    const currentTime = new Date().toISOString();
    if (lastTradeTime === currentTime) return;
    setLastTradeTime(currentTime);

    for (const [symbol, decision] of Object.entries(decisions)) {
      const price = symbol === 'BTC/USD' ? btcPrice : ltcPrice;
      if (price === 0) {
        console.warn(`No valid price for ${symbol}, skipping trade.`);
        continue;
      }

      const holdings = data.portfolio.holdings[symbol] || { quantity: 0, avgPrice: 0 };
      const cash = data.portfolio.cash;

      if (decision === 'Buy') {
        const targetAllocation = symbol === 'BTC/USD' ? 600000 : 300000;
        let quantityToBuy = Math.min(Math.floor((targetAllocation / price) * 0.1), Math.floor(cash / price));
        quantityToBuy = Math.max(quantityToBuy, symbol === 'BTC/USD' ? 0.00001 : 0.00002);
        if (quantityToBuy * price > NOTIONAL_LIMIT) {
          quantityToBuy = Math.floor(NOTIONAL_LIMIT / price);
        }
        if (quantityToBuy > 0 && cash >= quantityToBuy * price) {
          await executeTrade(symbol, 'Buy', quantityToBuy, price);
        }
      } else if (decision === 'Sell' && holdings.quantity > 0) {
        let quantityToSell = Math.min(holdings.quantity, Math.max(holdings.quantity, symbol === 'BTC/USD' ? 0.00001 : 0.00002));
        if (quantityToSell * price > NOTIONAL_LIMIT) {
          quantityToSell = Math.floor(NOTIONAL_LIMIT / price);
        }
        if (quantityToSell > 0) {
          await executeTrade(symbol, 'Sell', quantityToSell, price);
        }
      }
    }
  };

  const fetchData = async () => {
    try {
    //   const response = await axios.get('http://localhost:5000/api/data');
      const response = await axios.get('https://crypto-portfolio-komv.onrender.com/api/data');

      const newData = response.data;
      newData.account.positions = newData.account.positions.map((pos) => ({
        ...pos,
        current_price: newData.marketData.latestTrades.trades[pos.symbol.includes('BTC') ? 'BTC/USD' : 'LTC/USD']?.p || pos.avg_entry_price,
        market_value: pos.qty * (newData.marketData.latestTrades.trades[pos.symbol.includes('BTC') ? 'BTC/USD' : 'LTC/USD']?.p || pos.avg_entry_price),
      }));
      setData(newData);
      setLoading(false);
      await handleAutomatedTrading(newData);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="relative">
          <div
            className={`w-16 h-16 border-8 border-t-8 border-${theme === 'dark' ? 'white' : 'gray-900'} border-solid rounded-full animate-spin`}
            style={{ borderTopColor: theme === 'dark' ? '#D1D5DB' : '#374151' }}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-${theme === 'dark' ? 'white' : 'gray-900'} text-lg font-semibold`}
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className={`text-center mt-10 text-red-500 ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'}`}>Error: {error}</div>;

  const dailyChange = -5624.54;

  return (
    <div className={`container mx-auto p-4 min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      <div className="flex flex-col items-center justify-center ">
      <h1 className="text-3xl font-bold text-center  mt-6 p-13">
        Crypto Portfolio Manager
      </h1>
      <Link to="/bot">
        <button
          className={`px-4 py-2 mb-3 w-60 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg ${theme === 'dark'
            ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white hover:from-indigo-600 hover:to-indigo-800'
            : 'bg-gradient-to-r from-blue-300 to-blue-500 text-gray-900 hover:from-blue-400 hover:to-blue-600'}`}
        >
          Ask bot
        </button>
      </Link>
    </div>
      <AccountInfo account={data.account} dailyChange={dailyChange} theme={theme} />
      <ProfitLossSummary portfolio={data.portfolio} positions={data.account.positions} theme={theme} />
      <div className="flex gap-4 mb-6 flex-wrap">
        <MetricCard
          title="Total Value"
          value={`$${data.account.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={data.portfolio.returns}
          changeColor={data.portfolio.returns >= 0 ? 'text-green-500' : 'text-red-500'}
          theme={theme}
        />
        <MetricCard
          title="Returns"
          value={`${data.portfolio.returns.toFixed(2)}%`}
          change={data.portfolio.returns}
          changeColor={data.portfolio.returns >= 0 ? 'text-green-500' : 'text-red-500'}
          theme={theme}
        />
        <MetricCard
          title="Volatility"
          value={`${data.portfolio.volatility.toFixed(2)}%`}
          change={data.portfolio.volatility - 50}
          changeColor={data.portfolio.volatility - 50 >= 0 ? 'text-green-500' : 'text-red-500'}
          theme={theme}
        />
        <MetricCard
          title="Value at Risk (95%)"
          value={`$${data.portfolio.varValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={data.portfolio.varValue / 100}
          changeColor="text-red-500"
          theme={theme}
        />
      </div>
      <PortfolioEngagement historicalBars={data.marketData.historicalBars.bars} theme={theme} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SkillBreakdown insights={data.insights} theme={theme} />
        <ApplicationStatus portfolio={data.portfolio} latestTrades={data.marketData.latestTrades} positions={data.account.positions} theme={theme} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeeklyActivity insights={data.insights} theme={theme} />
        <Web3Verification insights={data.insights} portfolio={data.portfolio} positions={data.account.positions} theme={theme} />
      </div>
      <div>
      <TradeHistory theme={theme} />
      </div>
    </div>
  );
}

export default Dashboard;