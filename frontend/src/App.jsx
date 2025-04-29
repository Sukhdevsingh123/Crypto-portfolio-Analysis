
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Navbar from './Pages/Navbar';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { ThemeProvider } from './components/ThemeContext';
import Bot from './components/Bot'
import Footer from './Pages/Footer';

const App = () => {
  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/bot" element={<Bot />} />

        <Route path="/" element={<Home />} />
      </Routes>
      <Bot/>
      <Footer/>
    </ThemeProvider>
  );
};

export default App;
