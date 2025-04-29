// import { Link } from 'react-router-dom';
// import { useContext } from 'react';
// import { ThemeContext } from '../components/ThemeContext';

// const Navbar = () => {
//   const { theme, toggleTheme } = useContext(ThemeContext);

//   return (
//     <nav
//       className={`fixed top-0 w-full z-50 shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray'} text-white p-4 flex justify-between items-center transition-all duration-300 transform hover:shadow-2xl rounded-b-lg`}
//     >
//       <div className="logo flex items-center space-x-2">
//         <Link to="/">
//           <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
//             CryptoPulse AI
//           </span>
//         </Link>
//       </div>
//       <ul className="flex space-x-6">|
//       <li>
//           <Link to="/bot" className="text-gray-800 hover:text-yellow-300 transition-colors duration-200">
//            Ai-Bot
//           </Link>
//         </li>
//         <li>
//           <Link to="/dashboard" className="text-gray-800 hover:text-yellow-300 transition-colors duration-200">
//             Dashboard
//           </Link>
//         </li>
//         <li>
//           <Link to="/signin" className="text-gray-800 hover:text-yellow-300 transition-colors duration-200">
//             Sign In
//           </Link>
//         </li>
//         <li>
//           <Link to="/signup" className=" text-gray-800 hover:text-yellow-300 transition-colors duration-200">
//             Sign Up
//           </Link>
//         </li>
//       </ul>
//       <button
//         onClick={toggleTheme}
//         className={`p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray hover:bg-gray-400'} shadow-md hover:shadow-lg`}
//       >
//         {theme === 'light' ? '🌙' : '☀️'}
//       </button>
//     </nav>
//   );
// };

// export default Navbar;

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav
      className={`fixed top-0 w-full z-50 shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray'} text-white p-4 flex justify-between items-center transition-all duration-300 transform hover:shadow-2xl rounded-b-lg`}
    >
      <div className="logo flex items-center space-x-2">
        <Link to="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CryptoPulse AI
          </span>
        </Link>
      </div>
      <ul className="flex space-x-6">
        <li>
          <Link to="/bot" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-yellow-300 transition-colors duration-200`}>
            Try-Bot🤖
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-yellow-300 transition-colors duration-200`}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/signin" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-yellow-300 transition-colors duration-200`}>
            Sign In
          </Link>
        </li>
        <li>
          <Link to="/signup" className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} hover:text-yellow-300 transition-colors duration-200`}>
            Sign Up
          </Link>
        </li>
      </ul>
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray hover:bg-gray-400'} shadow-md hover:shadow-lg`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </nav>
  );
};

export default Navbar;