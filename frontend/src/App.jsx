

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Line, Pie, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const MetricCard = ({ title, value, change, changeColor }) => (
//   <div className="bg-white shadow-lg rounded-lg p-4 flex-1 transition-all duration-300 hover:shadow-xl">
//     <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
//     <div className="flex items-center mt-2">
//       <p className="text-2xl font-bold text-gray-900">{value}</p>
//       {change && (
//         <span className={`ml-2 text-sm ${changeColor} font-medium`}>
//           {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
//         </span>
//       )}
//     </div>
//   </div>
// );

// const PortfolioEngagement = ({ historicalBars }) => {
//   const btcData = historicalBars['BTC/USD'] || [];
//   const ltcData = historicalBars['LTC/USD'] || [];
//   const limitedBtcData = btcData.slice(-12);
//   const limitedLtcData = ltcData.slice(-12);
//   const labels = limitedBtcData.map(bar => new Date(bar.t).toLocaleDateString('en-US', { month: 'short' }));

//   // Gradient background
//   const ctx = document.createElement('canvas').getContext('2d');
//   const gradient = ctx.createLinearGradient(0, 0, 0, 400);
//   gradient.addColorStop(0, 'rgba(54, 162, 235, 0.6)');
//   gradient.addColorStop(1, 'rgba(54, 162, 235, 0.1)');

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: 'BTC/USD Price',
//         data: limitedBtcData.map(bar => bar.c),
//         fill: true,
//         backgroundColor: gradient,
//         borderColor: '#36A2EB',
//         borderWidth: 2,
//         tension: 0.4,
//         pointBackgroundColor: '#36A2EB',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: '#36A2EB'
//       },
//       {
//         label: 'LTC/USD Price',
//         data: limitedLtcData.map(bar => bar.c),
//         fill: true,
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         borderColor: '#FF6384',
//         borderWidth: 2,
//         tension: 0.4,
//         pointBackgroundColor: '#FF6384',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: '#FF6384'
//       }
//     ]
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-bold text-gray-800 mb-2">Portfolio Engagement</h2>
//       <p className="text-sm text-gray-600 mb-4">Monthly price trends of your assets</p>
//       <div className="h-72">
//         <Line
//           data={chartData}
//           options={{
//             maintainAspectRatio: false,
//             scales: { y: { beginAtZero: false, grid: { color: '#E5E7EB' } } },
//             plugins: {
//               legend: { position: 'top', labels: { boxWidth: 10, font: { size: 12 } } },
//               tooltip: { mode: 'index', intersect: false }
//             },
//             animation: { duration: 1000, easing: 'easeInOutQuad' }
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// const SkillBreakdown = ({ insights }) => {
//   const btcConfidence = insights.tradingDecision.includes('Hold') ? 75 : 50;
//   const ltcConfidence = insights.tradingDecision.includes('Buy') ? 60 : 40;
//   const chartData = {
//     labels: ['BTC/USD Decision', 'LTC/USD Decision'],
//     datasets: [{
//       label: 'Confidence',
//       data: [btcConfidence, ltcConfidence],
//       backgroundColor: ['#FF6384', '#36A2EB'],
//       borderColor: ['#FF6384', '#36A2EB'],
//       borderWidth: 1,
//       borderRadius: 5,
//       barThickness: 20
//     }]
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-bold text-gray-800 mb-2">AI Trading Confidence</h2>
//       <p className="text-sm text-gray-600 mb-4">Confidence levels of AI trading decisions</p>
//       <div className="h-72">
//         <Bar
//           data={chartData}
//           options={{
//             indexAxis: 'y',
//             scales: { x: { beginAtZero: true, max: 100, grid: { color: '#E5E7EB' } } },
//             maintainAspectRatio: false,
//             plugins: {
//               legend: { display: false },
//               tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}%` } }
//             },
//             animation: { duration: 1000, easing: 'easeInOutQuad' }
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// const ApplicationStatus = ({ portfolio, latestTrades }) => {
//   const btcValue = portfolio.holdings['BTC/USD']?.quantity * latestTrades.trades['BTC/USD'].p || 0;
//   const chartData = {
//     labels: ['Cash', 'BTC'],
//     datasets: [{
//       data: [portfolio.cash, btcValue],
//       backgroundColor: ['#36A2EB', '#FF6384'],
//       borderWidth: 1,
//       borderColor: '#fff',
//       hoverOffset: 10
//     }]
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-bold text-gray-800 mb-2">Portfolio Allocation</h2>
//       <p className="text-sm text-gray-600 mb-4">Current distribution of your assets</p>
//       <div className="max-w-xs mx-auto h-72">
//         <Pie
//           data={chartData}
//           options={{
//             maintainAspectRatio: false,
//             plugins: {
//               legend: { position: 'top', labels: { boxWidth: 10, font: { size: 12 } } },
//               tooltip: { callbacks: { label: ctx => `${ctx.label}: $${ctx.raw.toFixed(2)}` } }
//             },
//             animation: { animateRotate: true, animateScale: true, duration: 1000 }
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// const WeeklyActivity = ({ insights }) => {
//   const btcSpread = parseFloat(insights.tradingDecision.match(/Bid-Ask Spread: (\d+\.\d+)/)?.[1]) || 0;
//   const ltcSpread = parseFloat(insights.tradingDecision.match(/Bid-Ask Spread: (\d+\.\d+)/)?.[1]) || 0;
//   const chartData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         label: 'BTC/USD Spread',
//         data: Array(7).fill(btcSpread),
//         backgroundColor: '#36A2EB',
//         borderRadius: 5,
//         barThickness: 15
//       },
//       {
//         label: 'LTC/USD Spread',
//         data: Array(7).fill(ltcSpread),
//         backgroundColor: '#FF6384',
//         borderRadius: 5,
//         barThickness: 15
//       }
//     ]
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-bold text-gray-800 mb-2">Weekly Spread Activity</h2>
//       <p className="text-sm text-gray-600 mb-4">Bid-Ask spreads over the week</p>
//       <div className="h-72">
//         <Bar
//           data={chartData}
//           options={{
//             maintainAspectRatio: false,
//             scales: { y: { beginAtZero: true, grid: { color: '#E5E7EB' } } },
//             plugins: {
//               legend: { position: 'top', labels: { boxWidth: 10, font: { size: 12 } } },
//               tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: $${ctx.raw.toFixed(2)}` } }
//             },
//             animation: { duration: 1000, easing: 'easeInOutQuad' }
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// const Web3Verification = ({ insights, portfolio }) => {
//   const currentBtcValue = portfolio.holdings['BTC/USD']?.quantity * portfolio.holdings['BTC/USD'].avgPrice || 0;
//   const suggestedBtc = parseFloat(insights.optimization.match(/Target BTC Allocation.*= \$(\d+)/)?.[1]) || 0;
//   const progress = suggestedBtc ? (currentBtcValue / suggestedBtc) * 100 : 0;
//   const chartData = {
//     labels: ['Optimization Progress'],
//     datasets: [{
//       data: [progress, 100 - progress],
//       backgroundColor: ['#36A2EB', '#E5E7EB'],
//       borderWidth: 0,
//       borderRadius: 10
//     }]
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-bold text-gray-800 mb-2">Portfolio Optimization Progress</h2>
//       <p className="text-sm text-gray-600 mb-4">Progress towards suggested allocation</p>
//       <div className="max-w-xs mx-auto h-72">
//         <Pie
//           data={chartData}
//           options={{
//             maintainAspectRatio: false,
//             cutout: '80%',
//             plugins: {
//               legend: { display: false },
//               tooltip: { enabled: false }
//             },
//             animation: { animateRotate: true, animateScale: true, duration: 1000 }
//           }}
//         />
//         <div className="text-center mt-2">
//           <p className="text-2xl font-bold text-gray-800">{Math.round(progress)}%</p>
//           <p className="text-sm text-gray-600">Optimized</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// function App() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/data');
//       setData(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(); // Initial fetch
//     const interval = setInterval(fetchData, 15000); // Poll every 15 seconds
//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
//   if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

//   return (
//     <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Crypto Portfolio Dashboard</h1>
//       {/* Top Metrics */}
//       <div className="flex gap-4 mb-6 flex-wrap">
//         <MetricCard
//           title="Total Value"
//           value={`$${data.portfolio.value.toFixed(2)}`}
//           change={data.portfolio.returns}
//           changeColor={data.portfolio.returns >= 0 ? 'text-green-500' : 'text-red-500'}
//         />
//         <MetricCard
//           title="Returns"
//           value={`${data.portfolio.returns.toFixed(2)}%`}
//           change={data.portfolio.returns}
//           changeColor={data.portfolio.returns >= 0 ? 'text-green-500' : 'text-red-500'}
//         />
//         <MetricCard
//           title="Volatility"
//           value={`${data.portfolio.volatility.toFixed(2)}%`}
//           change={data.portfolio.volatility - 50} // Mocked change
//           changeColor={data.portfolio.volatility - 50 >= 0 ? 'text-green-500' : 'text-red-500'}
//         />
//         <MetricCard
//           title="Value at Risk (95%)"
//           value={`$${data.portfolio.varValue.toFixed(2)}`}
//           change={data.portfolio.varValue / 100} // Mocked change
//           changeColor="text-red-500"
//         />
//       </div>
//       {/* Portfolio Engagement */}
//       <PortfolioEngagement historicalBars={data.marketData.historicalBars.bars} />
//       {/* Skill Breakdown and Application Status */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <SkillBreakdown insights={data.insights} />
//         <ApplicationStatus portfolio={data.portfolio} latestTrades={data.marketData.latestTrades} />
//       </div>
//       {/* Weekly Activity and Web3 Verification */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         <WeeklyActivity insights={data.insights} />
//         <Web3Verification insights={data.insights} portfolio={data.portfolio} />
//       </div>
//     </div>
//   );
// }

// export default App;

// ...........................






// ...................second code

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Line, Pie, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const MetricCard = ({ title, value, change, changeColor }) => (
//   <div className="bg-white shadow-lg rounded-lg p-4 flex-1 transition-all duration-300 hover:shadow-xl">
//     <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
//     <div className="flex items-center mt-2">
//       <p className="text-2xl font-bold text-gray-900">{value}</p>
//       {change !== undefined && (
//         <span className={`ml-2 text-sm ${changeColor} font-medium`}>
//           {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
//         </span>
//       )}
//     </div>
//   </div>
// );

// const AccountInfo = ({ account }) => (
//   <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
//     <h2 className="text-lg font-bold text-gray-800 mb-4">Account Overview</h2>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div>
//         <p className="text-sm text-gray-600">Cash</p>
//         <p className="text-xl font-bold text-gray-900">${account.cash.toFixed(2)}</p>
//       </div>
//       <div>
//         <p className="text-sm text-gray-600">Equity</p>
//         <p className="text-xl font-bold text-gray-900">${account.equity.toFixed(2)}</p>
//       </div>
//       <div>
//         <p className="text-sm text-gray-600">Buying Power</p>
//         <p className="text-xl font-bold text-gray-900">${account.buyingPower.toFixed(2)}</p>
//       </div>
//     </div>
//     <div className="mt-4">
//       <p className="text-sm text-gray-600">Positions</p>
//       {account.positions.length > 0 ? (
//         <ul className="mt-2 space-y-2">
//           {account.positions.map((pos, index) => (
//             <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-lg">
//               <span>{pos.symbol}</span>
//               <span>{pos.qty} units @ ${parseFloat(pos.avg_entry_price).toFixed(2)}</span>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-sm text-gray-500 mt-2">No positions held.</p>
//       )}
//     </div>
//   </div>
// );

// const ProfitLossSummary = ({ portfolio }) => (
//   <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
//     <h2 className="text-lg font-bold text-gray-800 mb-4">Profit & Loss Summary</h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div>
//         <p className="text-sm text-gray-600">Total Profit/Loss</p>
//         <p className={`text-xl font-bold ${portfolio.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//           ${portfolio.totalProfitLoss.toFixed(2)}
//         </p>
//       </div>
//       <div>
//         <p className="text-sm text-gray-600">Breakdown</p>
//         {Object.entries(portfolio.profitLoss).length > 0 ? (
//           <ul className="mt-2 space-y-2">
//             {Object.entries(portfolio.profitLoss).map(([symbol, pl], index) => (
//               <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-lg">
//                 <span>{symbol}</span>
//                 <span className={pl >= 0 ? 'text-green-500' : 'text-red-500'}>
//                   ${pl.toFixed(2)}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-sm text-gray-500 mt-2">No profit/loss data available.</p>
//         )}
//       </div>
//     </div>
//   </div>
// );

// const PortfolioEngagement = ({ historicalBars }) => {
//   const btcData = historicalBars['BTC/USD'] || [];
//   const ltcData = historicalBars['LTC/USD'] || [];
//   const limitedBtcData = btcData.slice(-12);
//   const limitedLtcData = ltcData.slice(-12);
//   const labels = limitedBtcData.map(bar => new Date(bar.t).toLocaleDateString('en-US', { month: 'short' }));

//   const ctx = document.createElement('canvas').getContext('2d');
//   const gradient = ctx.createLinearGradient(0, 0, 0, 400);
//   gradient.addColorStop(0, 'rgba(54, 162, 235, 0.6)');
//   gradient.addColorStop(1, 'rgba(54, 162, 235, 0.1)');

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: 'BTC/USD Price',
//         data: limitedBtcData.map(bar => bar.c),
//         fill: true,
//         backgroundColor: gradient,
//         borderColor: '#36A2EB',
//         borderWidth: 2,
//         tension: 0.4,
//         pointBackgroundColor: '#36A2EB',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: '#36A2EB'
//       },
//       {
//         label: 'LTC/USD Price',
//         data: limitedLtcData.map(bar => bar.c),
//         fill: true,
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         borderColor: '#FF6384',
//         borderWidth: 2,
//         tension: 0.4,
//         pointBackgroundColor: '#FF6384',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: '#FF6384'
//       }
//     ]
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-bold text-gray-800 mb-2">Portfolio Engagement</h2>
//       <p className="text-sm text-gray-600 mb-4">Monthly price trends of your assets</p>
//       <div className="h-72">
//         <Line
//           data={chartData}
//           options={{
//             maintainAspectRatio: false,
//             scales: { y: { beginAtZero: false, grid: { color: '#E5E7EB' } } },
//             plugins: {
//               legend: { position: 'top', labels: { boxWidth: 10, font: { size: 12 } } },
//               tooltip: { mode: 'index', intersect: false }
//             },
//             animation: { duration: 1000, easing: 'easeInOutQuad' }
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// const SkillBreakdown = ({ insights }) => {
//   const btcConfidence = insights.tradingDecision.includes('Hold') ? 75 : 50;
//   const ltcConfidence = insights.tradingDecision.includes('Buy') ? 60 : 40;
//   const chartData = {
//     labels: ['BTC/USD Decision', 'LTC/USD Decision'],
//     datasets: [{
//       label: 'Confidence',
//       data: [btcConfidence, ltcConfidence],
//       backgroundColor: ['#FF6384', '#36A2EB'],
//       borderColor: ['#FF6384', '#36A2EB'],
//       borderWidth: 1,
//       borderRadius: 5,
//       barThickness: 20
//     }]
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-bold text-gray-800 mb-2">AI Trading Confidence</h2>
//       <p className="text-sm text-gray-600 mb-4">Confidence levels of AI trading decisions</p>
//       <div className="h-72">
//         <Bar
//           data={chartData}
//           options={{
//             indexAxis: 'y',
//             scales: { x: { beginAtZero: true, max: 100, grid: { color: '#E5E7EB' } } },
//             maintainAspectRatio: false,
//             plugins: {
//               legend: { display: false },
//               tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}%` } }
//             },
//             animation: { duration: 1000, easing: 'easeInOutQuad' }
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// const ApplicationStatus = ({ portfolio, latestTrades }) => {
//   const btcValue = portfolio.holdings['BTC/USD']?.quantity * latestTrades.trades['BTC/USD'].p || 0;
//   const chartData = {
//     labels: ['Cash', 'BTC'],
//     datasets: [{
//       data: [portfolio.cash, btcValue],
//       backgroundColor: ['#36A2EB', '#FF6384'],
//       borderWidth: 1,
//       borderColor: '#fff',
//       hoverOffset: 10
//     }]
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-bold text-gray-800 mb-2">Portfolio Allocation</h2>
//       <p className="text-sm text-gray-600 mb-4">Current distribution of your assets</p>
//       <div className="max-w-xs mx-auto h-72">
//         <Pie
//           data={chartData}
//           options={{
//             maintainAspectRatio: false,
//             plugins: {
//               legend: { position: 'top', labels: { boxWidth: 10, font: { size: 12 } } },
//               tooltip: { callbacks: { label: ctx => `${ctx.label}: $${ctx.raw.toFixed(2)}` } }
//             },
//             animation: { animateRotate: true, animateScale: true, duration: 1000 }
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// const WeeklyActivity = ({ insights }) => {
//   const btcSpread = parseFloat(insights.tradingDecision.match(/Bid-Ask Spread: (\d+\.\d+)/)?.[1]) || 0;
//   const ltcSpread = parseFloat(insights.tradingDecision.match(/Bid-Ask Spread: (\d+\.\d+)/)?.[1]) || 0;
//   const chartData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         label: 'BTC/USD Spread',
//         data: Array(7).fill(btcSpread),
//         backgroundColor: '#36A2EB',
//         borderRadius: 5,
//         barThickness: 15
//       },
//       {
//         label: 'LTC/USD Spread',
//         data: Array(7).fill(ltcSpread),
//         backgroundColor: '#FF6384',
//         borderRadius: 5,
//         barThickness: 15
//       }
//     ]
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-bold text-gray-800 mb-2">Weekly Spread Activity</h2>
//       <p className="text-sm text-gray-600 mb-4">Bid-Ask spreads over the week</p>
//       <div className="h-72">
//         <Bar
//           data={chartData}
//           options={{
//             maintainAspectRatio: false,
//             scales: { y: { beginAtZero: true, grid: { color: '#E5E7EB' } } },
//             plugins: {
//               legend: { position: 'top', labels: { boxWidth: 10, font: { size: 12 } } },
//               tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: $${ctx.raw.toFixed(2)}` } }
//             },
//             animation: { duration: 1000, easing: 'easeInOutQuad' }
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// const Web3Verification = ({ insights, portfolio }) => {
//   const currentBtcValue = (portfolio.holdings['BTC/USD']?.quantity || 0) * (portfolio.holdings['BTC/USD']?.avgPrice || 0);
//   const suggestedBtc = parseFloat(insights.optimization.match(/Target BTC Allocation.*= \$(\d+)/)?.[1]) || 0;
//   const progress = suggestedBtc ? (currentBtcValue / suggestedBtc) * 100 : 0;
//   const chartData = {
//     labels: ['Optimization Progress'],
//     datasets: [{
//       data: [progress, 100 - progress],
//       backgroundColor: ['#36A2EB', '#E5E7EB'],
//       borderWidth: 0,
//       borderRadius: 10
//     }]
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-bold text-gray-800 mb-2">Portfolio Optimization Progress</h2>
//       <p className="text-sm text-gray-600 mb-4">Progress towards suggested allocation</p>
//       <div className="max-w-xs mx-auto h-72">
//         <Pie
//           data={chartData}
//           options={{
//             maintainAspectRatio: false,
//             cutout: '80%',
//             plugins: {
//               legend: { display: false },
//               tooltip: { enabled: false }
//             },
//             animation: { animateRotate: true, animateScale: true, duration: 1000 }
//           }}
//         />
//         <div className="text-center mt-2">
//           <p className="text-2xl font-bold text-gray-800">{Math.round(progress)}%</p>
//           <p className="text-sm text-gray-600">Optimized</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// function App() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/data');
//       setData(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
//   if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

//   return (
//     <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Crypto Portfolio Dashboard</h1>
//       {/* Account Info */}
//       <AccountInfo account={data.account} />
//       {/* Profit/Loss Summary */}
//       <ProfitLossSummary portfolio={data.portfolio} />
//       {/* Top Metrics */}
//       <div className="flex gap-4 mb-6 flex-wrap">
//         <MetricCard
//           title="Total Value"
//           value={`$${data.portfolio.value.toFixed(2)}`}
//           change={data.portfolio.returns}
//           changeColor={data.portfolio.returns >= 0 ? 'text-green-500' : 'text-red-500'}
//         />
//         <MetricCard
//           title="Returns"
//           value={`${data.portfolio.returns.toFixed(2)}%`}
//           change={data.portfolio.returns}
//           changeColor={data.portfolio.returns >= 0 ? 'text-green-500' : 'text-red-500'}
//         />
//         <MetricCard
//           title="Volatility"
//           value={`${data.portfolio.volatility.toFixed(2)}%`}
//           change={data.portfolio.volatility - 50}
//           changeColor={data.portfolio.volatility - 50 >= 0 ? 'text-green-500' : 'text-red-500'}
//         />
//         <MetricCard
//           title="Value at Risk (95%)"
//           value={`$${data.portfolio.varValue.toFixed(2)}`}
//           change={data.portfolio.varValue / 100}
//           changeColor="text-red-500"
//         />
//       </div>
//       {/* Portfolio Engagement */}
//       <PortfolioEngagement historicalBars={data.marketData.historicalBars.bars} />
//       {/* Skill Breakdown and Application Status */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <SkillBreakdown insights={data.insights} />
//         <ApplicationStatus portfolio={data.portfolio} latestTrades={data.marketData.latestTrades} />
//       </div>
//       {/* Weekly Activity and Web3 Verification */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <WeeklyActivity insights={data.insights} />
//         <Web3Verification insights={data.insights} portfolio={data.portfolio} />
//       </div>
//     </div>
//   );
// }

// export default App;

// .........................

import React, { useState, useEffect } from 'react';
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
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MetricCard = ({ title, value, change, changeColor }) => (
  <div className="bg-white shadow-lg rounded-lg p-4 flex-1 transition-all duration-300 hover:shadow-xl">
    <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
    <div className="flex items-center mt-2">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {change !== undefined && (
        <span className={`ml-2 text-sm ${changeColor} font-medium`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
  </div>
);

const AccountInfo = ({ account }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
    <h2 className="text-lg font-bold text-gray-800 mb-4">Account Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-gray-600">Cash</p>
        <p className="text-xl font-bold text-gray-900">${account.cash.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Equity</p>
        <p className="text-xl font-bold text-gray-900">${account.equity.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Buying Power</p>
        <p className="text-xl font-bold text-gray-900">${account.buyingPower.toFixed(2)}</p>
      </div>
    </div>
    <div className="mt-4">
      <p className="text-sm text-gray-600">Positions</p>
      {account.positions.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {account.positions.map((pos, index) => (
            <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-lg">
              <span>{pos.symbol}</span>
              <span>{pos.qty} units @ ${parseFloat(pos.avg_entry_price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mt-2">No positions held.</p>
      )}
    </div>
  </div>
);

const ProfitLossSummary = ({ portfolio }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
    <h2 className="text-lg font-bold text-gray-800 mb-4">Profit & Loss Summary</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-600">Total Profit/Loss</p>
        <p className={`text-xl font-bold ${portfolio.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          ${portfolio.totalProfitLoss.toFixed(2)}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Breakdown</p>
        {Object.entries(portfolio.profitLoss).length > 0 ? (
          <ul className="mt-2 space-y-2">
            {Object.entries(portfolio.profitLoss).map(([symbol, pl], index) => (
              <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-lg">
                <span>{symbol}</span>
                <span className={pl >= 0 ? 'text-green-500' : 'text-red-500'}>
                  ${pl.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mt-2">No profit/loss data available.</p>
        )}
      </div>
    </div>
  </div>
);

const PortfolioEngagement = ({ historicalBars }) => {
  const btcData = historicalBars['BTC/USD'] || [];
  const ltcData = historicalBars['LTC/USD'] || [];
  const limitedBtcData = btcData.slice(-12);
  const limitedLtcData = ltcData.slice(-12);
  const labels = limitedBtcData.map(bar => new Date(bar.t).toLocaleDateString('en-US', { month: 'short' }));

  const ctx = document.createElement('canvas').getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(54, 162, 235, 0.6)');
  gradient.addColorStop(1, 'rgba(54, 162, 235, 0.1)');

  const chartData = {
    labels,
    datasets: [
      {
        label: 'BTC/USD Price',
        data: limitedBtcData.map(bar => bar.c),
        fill: true,
        backgroundColor: gradient,
        borderColor: '#36A2EB',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#36A2EB',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#36A2EB'
      },
      {
        label: 'LTC/USD Price',
        data: limitedLtcData.map(bar => bar.c),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: '#FF6384',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#FF6384',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#FF6384'
      }
    ]
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Portfolio Engagement</h2>
      <p className="text-sm text-gray-600 mb-4">Monthly price trends of your assets</p>
      <div className="h-72">
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: false, grid: { color: '#E5E7EB' } } },
            plugins: {
              legend: { position: 'top', labels: { boxWidth: 10, font: { size: 12 } } },
              tooltip: { mode: 'index', intersect: false }
            },
            animation: { duration: 1000, easing: 'easeInOutQuad' }
          }}
        />
      </div>
    </div>
  );
};

const SkillBreakdown = ({ insights }) => {
  const btcConfidence = insights.tradingDecision.includes('Hold') ? 75 : 50;
  const ltcConfidence = insights.tradingDecision.includes('Buy') ? 60 : 40;
  const chartData = {
    labels: ['BTC/USD Decision', 'LTC/USD Decision'],
    datasets: [{
      label: 'Confidence',
      data: [btcConfidence, ltcConfidence],
      backgroundColor: ['#FF6384', '#36A2EB'],
      borderColor: ['#FF6384', '#36A2EB'],
      borderWidth: 1,
      borderRadius: 5,
      barThickness: 20
    }]
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-bold text-gray-800 mb-2">AI Trading Confidence</h2>
      <p className="text-sm text-gray-600 mb-4">Confidence levels of AI trading decisions</p>
      <div className="h-72">
        <Bar
          data={chartData}
          options={{
            indexAxis: 'y',
            scales: { x: { beginAtZero: true, max: 100, grid: { color: '#E5E7EB' } } },
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}%` } }
            },
            animation: { duration: 1000, easing: 'easeInOutQuad' }
          }}
        />
      </div>
    </div>
  );
};

const ApplicationStatus = ({ portfolio, latestTrades }) => {
  const btcValue = portfolio.holdings['BTC/USD']?.quantity * latestTrades.trades['BTC/USD'].p || 0;
  const chartData = {
    labels: ['Cash', 'BTC'],
    datasets: [{
      data: [portfolio.cash, btcValue],
      backgroundColor: ['#36A2EB', '#FF6384'],
      borderWidth: 1,
      borderColor: '#fff',
      hoverOffset: 10
    }]
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Portfolio Allocation</h2>
      <p className="text-sm text-gray-600 mb-4">Current distribution of your assets</p>
      <div className="max-w-xs mx-auto h-72">
        <Pie
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { boxWidth: 10, font: { size: 12 } } },
              tooltip: { callbacks: { label: ctx => `${ctx.label}: $${ctx.raw.toFixed(2)}` } }
            },
            animation: { animateRotate: true, animateScale: true, duration: 1000 }
          }}
        />
      </div>
    </div>
  );
};

const WeeklyActivity = ({ insights }) => {
  const btcSpread = parseFloat(insights.tradingDecision.match(/Bid-Ask Spread: (\d+\.\d+)/)?.[1]) || 0;
  const ltcSpread = parseFloat(insights.tradingDecision.match(/Bid-Ask Spread: (\d+\.\d+)/)?.[1]) || 0;
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'BTC/USD Spread',
        data: Array(7).fill(btcSpread),
        backgroundColor: '#36A2EB',
        borderRadius: 5,
        barThickness: 15
      },
      {
        label: 'LTC/USD Spread',
        data: Array(7).fill(ltcSpread),
        backgroundColor: '#FF6384',
        borderRadius: 5,
        barThickness: 15
      }
    ]
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Weekly Spread Activity</h2>
      <p className="text-sm text-gray-600 mb-4">Bid-Ask spreads over the week</p>
      <div className="h-72">
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, grid: { color: '#E5E7EB' } } },
            plugins: {
              legend: { position: 'top', labels: { boxWidth: 10, font: { size: 12 } } },
              tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: $${ctx.raw.toFixed(2)}` } }
            },
            animation: { duration: 1000, easing: 'easeInOutQuad' }
          }}
        />
      </div>
    </div>
  );
};

const Web3Verification = ({ insights, portfolio }) => {
  const currentBtcValue = (portfolio.holdings['BTC/USD']?.quantity || 0) * (portfolio.holdings['BTC/USD']?.avgPrice || 0);
  const suggestedBtc = parseFloat(insights.optimization.match(/Target BTC Allocation.*= \$(\d+)/)?.[1]) || 0;
  const progress = suggestedBtc ? (currentBtcValue / suggestedBtc) * 100 : 0;
  const chartData = {
    labels: ['Optimization Progress'],
    datasets: [{
      data: [progress, 100 - progress],
      backgroundColor: ['#36A2EB', '#E5E7EB'],
      borderWidth: 0,
      borderRadius: 10
    }]
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Portfolio Optimization Progress</h2>
      <p className="text-sm text-gray-600 mb-4">Progress towards suggested allocation</p>
      <div className="max-w-xs mx-auto h-72">
        <Pie
          data={chartData}
          options={{
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            },
            animation: { animateRotate: true, animateScale: true, duration: 1000 }
          }}
        />
        <div className="text-center mt-2">
          <p className="text-2xl font-bold text-gray-800">{Math.round(progress)}%</p>
          <p className="text-sm text-gray-600">Optimized</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastTradeTime, setLastTradeTime] = useState(null); // Track last trade to avoid duplicates

  const executeTrade = async (symbol, action, quantity, price) => {
    try {
      const response = await axios.post('http://localhost:5000/api/trade', {
        symbol,
        action,
        quantity,
        price
      });
      console.log(response.data.message);
      // Fetch updated data after trade
      const updatedResponse = await axios.get('http://localhost:5000/api/data');
      setData(updatedResponse.data);
    } catch (err) {
      console.error('Trade execution failed:', err.message);
    }
  };

  const handleAutomatedTrading = async (data) => {
    const { marketData, insights } = data;

    // Parse trading decisions
    const decisions = {
      'BTC/USD': insights.tradingDecision.includes('Hold') ? 'Hold' : insights.tradingDecision.includes('Sell') ? 'Sell' : 'Buy',
      'LTC/USD': insights.tradingDecision.includes('Buy') ? 'Buy' : insights.tradingDecision.includes('Sell') ? 'Sell' : 'Hold'
    };

    // Get latest prices from market data
    const btcPrice = marketData.latestTrades.trades['BTC/USD'].p;
    const ltcPrice = marketData.snapshots.snapshots['LTC/USD']?.latestTrade?.p || 0; // Correct path with safety checks

    // Use a timestamp to avoid duplicate trades
    const currentTime = new Date().toISOString();
    if (lastTradeTime === currentTime) return; // Skip if already traded at this timestamp
    setLastTradeTime(currentTime);

    // Trading logic
    for (const [symbol, decision] of Object.entries(decisions)) {
      const price = symbol === 'BTC/USD' ? btcPrice : ltcPrice;
      if (price === 0) {
        console.warn(`No valid price for ${symbol}, skipping trade.`);
        continue; // Skip if price is not available
      }

      const holdings = data.portfolio.holdings[symbol] || { quantity: 0, avgPrice: 0 };
      const cash = data.portfolio.cash;

      if (decision === 'Buy') {
        const targetAllocation = symbol === 'BTC/USD' ? 600000 : 300000; // From optimization
        const quantityToBuy = Math.min(Math.floor((targetAllocation / price) * 0.1), Math.floor(cash / price)); // Buy 10% of target or max affordable
        if (quantityToBuy > 0 && cash >= quantityToBuy * price) {
          await executeTrade(symbol, 'Buy', quantityToBuy, price);
        }
      } else if (decision === 'Sell' && holdings.quantity > 0) {
        const quantityToSell = holdings.quantity;
        await executeTrade(symbol, 'Sell', quantityToSell, price);
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      const newData = response.data;
      setData(newData);
      setLoading(false);
      await handleAutomatedTrading(newData); // Execute trades after fetching data
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

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Crypto Portfolio Dashboard</h1>
      {/* Account Info */}
      <AccountInfo account={{ cash: data.portfolio.cash, equity: data.portfolio.value, buyingPower: data.portfolio.cash, positions: [] }} />
      {/* Profit/Loss Summary */}
      <ProfitLossSummary portfolio={data.portfolio} />
      {/* Top Metrics */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <MetricCard
          title="Total Value"
          value={`$${data.portfolio.value.toFixed(2)}`}
          change={data.portfolio.returns}
          changeColor={data.portfolio.returns >= 0 ? 'text-green-500' : 'text-red-500'}
        />
        <MetricCard
          title="Returns"
          value={`${data.portfolio.returns.toFixed(2)}%`}
          change={data.portfolio.returns}
          changeColor={data.portfolio.returns >= 0 ? 'text-green-500' : 'text-red-500'}
        />
        <MetricCard
          title="Volatility"
          value={`${data.portfolio.volatility.toFixed(2)}%`}
          change={data.portfolio.volatility - 50}
          changeColor={data.portfolio.volatility - 50 >= 0 ? 'text-green-500' : 'text-red-500'}
        />
        <MetricCard
          title="Value at Risk (95%)"
          value={`$${data.portfolio.varValue.toFixed(2)}`}
          change={data.portfolio.varValue / 100}
          changeColor="text-red-500"
        />
      </div>
      {/* Portfolio Engagement */}
      <PortfolioEngagement historicalBars={data.marketData.historicalBars.bars} />
      {/* Skill Breakdown and Application Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SkillBreakdown insights={data.insights} />
        <ApplicationStatus portfolio={data.portfolio} latestTrades={data.marketData.latestTrades} />
      </div>
      {/* Weekly Activity and Web3 Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeeklyActivity insights={data.insights} />
        <Web3Verification insights={data.insights} portfolio={data.portfolio} />
      </div>
    </div>
  );
}

export default App;