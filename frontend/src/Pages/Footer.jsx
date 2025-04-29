import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeContext';

const Footer = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <footer
      className={`w-full min-h-64 p-8 rounded-xl shadow-2xl bg-opacity-80 backdrop-blur-lg mt-12 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 border-t border-indigo-500' : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-900 border-t border-teal-400'}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="col-span-1">
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-indigo-300' : 'text-teal-600'}`}>
            CryptoPulse AI
          </h3>
          <p className="text-sm">
            Empowering your crypto trading with AI-driven insights and portfolio management.
          </p>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-indigo-300' : 'text-teal-600'}`}>
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-yellow-300 transition-colors duration-200`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/bot" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-yellow-300 transition-colors duration-200`}>
                AI Bot
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-yellow-300 transition-colors duration-200`}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/signup" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-yellow-300 transition-colors duration-200`}>
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/signin" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-yellow-300 transition-colors duration-200`}>
                Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="col-span-1">
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-indigo-300' : 'text-teal-600'}`}>
            Follow Us
          </h3>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-blue-400 transition-colors duration-200`}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .386.045.762.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.733-.666 1.585-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.396 0-.788-.023-1.175-.068 2.187 1.405 4.788 2.224 7.581 2.224 9.076 0 14.039-7.519 14.039-14.039 0-.213-.005-.426-.014-.637.962-.692 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-blue-600 transition-colors duration-200`}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/sukhdev-singh-70b01427b/" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-blue-700 transition-colors duration-200`}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.255-2.391-1.875-2.391-1.879 0-2.125 1.39-2.125 2.391v5.604h-3v-11h3v1.542c.5-.767 1.334-1.875 3.25-1.875 2.375 0 4.125 1.55 4.125 4.887v6.446z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="col-span-1">
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-indigo-300' : 'text-teal-600'}`}>
            Contact Us
          </h3>
          <p className="text-sm">Email: sukhdev@techsteck.com</p>
          <p className="text-sm">Phone: +91-9664627236</p>
          <p className="text-sm">Address: 123 Crypto Lane, Tech City, TC 45678</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 pt-4 border-t border-opacity-20 flex justify-between items-center">
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          © {new Date().getFullYear()} CryptoPulse AI. All rights reserved.
        </p>
       
      </div>
    </footer>
  );
};

export default Footer;