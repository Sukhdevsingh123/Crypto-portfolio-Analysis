


import { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from './ThemeContext';
import { useLocation } from 'react-router-dom';

const Bot = () => {
  const { theme } = useContext(ThemeContext);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); // Array to store chat history
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Controls popup visibility
  const maxPromptLength = 500;
  const chatEndRef = useRef(null); // For auto-scrolling to the latest message
  const location = useLocation(); // Get current route

  // Auto-scroll to the bottom when a new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Open popup after 5 seconds on non-/bot routes, immediate on /bot
  useEffect(() => {
    let timer;
    if (location.pathname === '/bot') {
      setIsOpen(true); // Immediate open on /bot
    } else {
      timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000); // 10 seconds on other routes
    }
    return () => clearTimeout(timer); // Cleanup timer on unmount or route change
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setMessages([...messages, { role: 'error', content: 'Please enter a prompt' }]);
      return;
    }

    if (prompt.length > maxPromptLength) {
      setMessages([...messages, { role: 'error', content: `Prompt is too long. Please keep it under ${maxPromptLength} characters.` }]);
      return;
    }

    // Add user message to chat history
    setMessages([...messages, { role: 'user', content: prompt }]);
    setPrompt('');
    setLoading(true);

    try {
      // const res = await fetch('http://localhost:5000/api/ai-prompt', {
      const res = await fetch('https://crypto-portfolio-komv.onrender.com/api/ai-prompt', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to get AI response');
      }

      // Add AI response to chat history
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'error', content: err.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setPrompt('');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${theme === 'dark' ? 'bg-black bg-opacity-50' : 'bg-gray-500 bg-opacity-30'}`}
          onClick={handleClose}
        >
          <div
            className={`max-w-4xl w-full mx-auto p-6 rounded-xl z-50 bg-opacity-80 backdrop-blur-lg bg-gradient-to-br ${theme === 'dark' ? 'from-gray-800 to-gray-900 text-gray-100 border-indigo-500' : 'from-gray-100 to-gray-200 text-gray-900 border-teal-400'} border border-opacity-30 shadow-2xl`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Header */}
            <div
              className={`p-4 border-b ${theme === 'dark' ? 'border-indigo-600' : 'border-teal-300'} flex justify-between items-center`}
            >
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-teal-600'}`}>
                Trading AI Assistant
              </h1>
              <button
                onClick={handleClose}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 bg-gradient-to-r from-red-400 to-red-600 text-white shadow-md hover:from-red-500 hover:to-red-700`}
              >
                Close
              </button>
            </div>

            {/* Chat Area */}
            <div
              className={`h-96 p-6 overflow-y-auto rounded-lg my-4 shadow-inner border-2 ${theme === 'dark' ? 'border-indigo-500 bg-gray-800/50' : 'border-teal-400 bg-gray-50/50'}`}
            >
              {messages.length === 0 && (
                <div className="text-center mt-20">
                  <p className={`text-lg ${theme === 'dark' ? 'text-indigo-300' : 'text-teal-600'}`}>
                    Start a conversation! Ask about trading, blockchain, or your Alpaca account.
                  </p>
                  <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-teal-500'}`}>
                    Example: "Should I buy more BTC/USD based on my current portfolio?"
                  </p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    message.role === 'user' ? 'justify-end' : message.role === 'error' ? 'justify-center' : 'justify-start'
                  }`}
                >
                  <div
                    className={`relative max-w-2xl p-4 rounded-xl z-${index + 10} shadow-lg transition-all duration-300 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-teal-400 to-teal-600 text-white'
                        : message.role === 'assistant'
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-gray-100'
                            : 'bg-gradient-to-r from-blue-300 to-blue-500 text-gray-900'
                          : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center mb-1">
                        <span className={`font-semibold mr-2 ${theme === 'dark' ? 'text-indigo-200' : 'text-blue-700'}`}>
                          AI:
                        </span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="mb-4 flex justify-start">
                  <div
                    className={`relative max-w-2xl p-4 rounded-xl shadow-lg z-10 ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-gray-100' : 'bg-gradient-to-r from-blue-300 to-blue-500 text-gray-900'}`}
                  >
                    <div className="flex items-center">
                      <span className={`font-semibold mr-2 ${theme === 'dark' ? 'text-indigo-200' : 'text-blue-700'}`}>
                        AI:
                      </span>
                      <div className="w-6 h-6 border-4 border-t-4 rounded-full animate-spin border-opacity-50 border-t-transparent border-gradient-to-r from-orange-400 to-orange-600"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div
              className={`p-4 border-t ${theme === 'dark' ? 'border-indigo-600' : 'border-teal-300'} shadow-lg rounded-b-xl z-20 bg-opacity-90 backdrop-blur-sm ${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'}`}
            >
              <form onSubmit={handleSubmit} className="flex items-center max-w-3xl mx-auto">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask about trading, blockchain, or your Alpaca account..."
                  className={`flex-1 p-3 rounded-l-lg border-2 resize-none h-12 focus:outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 text-gray-200 border-indigo-500 focus:ring-2 focus:ring-indigo-400' : 'bg-white text-gray-900 border-teal-400 focus:ring-2 focus:ring-teal-300'} shadow-sm`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`p-3 rounded-r-lg transition-colors duration-300 bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-500 hover:to-orange-700'} z-20`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bot;