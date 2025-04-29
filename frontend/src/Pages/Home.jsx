
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { ThemeContext } from '../components/ThemeContext';
import img1 from '../assets/bg1.webp'

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const tradeData = [
    { date: '2025-04-01', trades: 50 },
    { date: '2025-04-02', trades: 75 },
    { date: '2025-04-03', trades: 90 },
    { date: '2025-04-04', trades: 120 },
    { date: '2025-04-05', trades: 150 },
  ];

  const assetAllocation = [
    { name: 'BTC', value: 40 },
    { name: 'ETH', value: 30 },
    { name: 'LTC', value: 20 },
    { name: 'Others', value: 10 },
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className={`min-h-screen pt-24 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1634265182664-8d0b0c7d9d47?q=80&w=2070&auto=format&fit=crop')", opacity: 0.3 }}
        ></div>
        <div className="relative z-10">
          <section className="py-12 px-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
            {/* Left Side: Text and Buttons */}
            <div className="md:w-1/2 text-left mb-8 md:mb-0">
              {/* Badge */}
              <div className="flex items-center mb-4">
                <img
                  src="https://flagcdn.com/16x12/in.png"
                  alt="Indian Flag"
                  className="w-4 h-4 mr-2"
                />
                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 border-gray-800 rounded-full">
                  Made for INDIA
                </span>
              </div>
              {/* Heading and Subheading */}
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Master Futures & Options with CryptoPulse AI on Bitcoin 
              </h1>
              <p className={`text-lg md:text-xl mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Supercharge your trading with AI-powered insights, 24/7 open markets, efficient margining, and INR settlement.
              </p>
              {/* Sign Up Button */}
              <button oonClick={() => navigate('/signUp')} className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                Sign Up
              </button>
            
            </div>
            {/* Right Side: Phone Mockup */}
            <div className="md:w-1/2 relative">
              <img
                src={img1}
                alt="Phone Mockup"
                className="w-full max-w-md mx-auto transform -rotate-6 hover:rotate-0 transition-transform duration-300"
              />
              <div className={`absolute bottom-10 left-0 p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">9500 C</span>
                  <span className="text-sm text-green-500">+60.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">$263.30K</span>
                  <span className="text-lg font-bold">$2701.0</span>
                </div>
                <p className="text-xs text-cyan-500">Trade with INR →</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mb-12">
            <div className={`p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-semibold">Total Trades</h3>
              <p className="text-3xl">485</p>
            </div>
            <div className={`p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-semibold">Profit Today</h3>
              <p className="text-3xl text-green-500">+$1,200</p>
            </div>
            <div className={`p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-semibold">Active Assets</h3>
              <p className="text-3xl">4</p>
            </div>
          </section>

          <section className="flex flex-col md:flex-row justify-around px-6 mb-16">
            <div className={`p-6 rounded-xl shadow-2xl w-full md:w-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-semibold mb-4">Trade Volume Over Time</h3>
              <AreaChart width={600} height={350} data={tradeData} className="mx-auto">
                <CartesianGrid strokeDasharray="5 5" stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'} />
                <XAxis dataKey="date" stroke={theme === 'dark' ? '#D1D5DB' : '#374151'} />
                <YAxis stroke={theme === 'dark' ? '#D1D5DB' : '#374151'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: theme === 'dark' ? '#F9FAFB' : '#1F2937' }}
                />
                <Legend wrapperStyle={{ color: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884D8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884D8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="trades" stroke="#8884D8" fillOpacity={1} fill="url(#colorUv)" />
                <Line type="monotone" dataKey="trades" stroke="#8884D8" strokeWidth={3} activeDot={{ r: 10, stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </div>
            <div className={`p-6 rounded-xl shadow-2xl w-full md:w-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-semibold mb-4">Asset Allocation</h3>
              <PieChart width={400} height={300} className="mx-auto">
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884D8"
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: theme === 'dark' ? '#F9FAFB' : '#1F2937' }}
                />
                <Legend wrapperStyle={{ color: theme === 'dark' ? '#D1D5DB' : '#374151' }} />
              </PieChart>
            </div>
          </section>

          <section className="text-center py-12 px-6">
            <h2 className="text-3xl font-bold mb-4">Why Choose Alpaca Auto-Trading?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
              <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <h4 className="text-lg font-semibold">Real-Time Execution</h4>
                <p>Execute trades instantly with Alpaca's low-latency API.</p>
              </div>
              <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <h4 className="text-lg font-semibold">AI Optimization</h4>
                <p>AI-driven strategies maximize your portfolio returns.</p>
              </div>
              <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <h4 className="text-lg font-semibold">Paper & Live Trading</h4>
                <p>Test strategies with paper trading before going live.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
    </div>
  );
};

export default Home;