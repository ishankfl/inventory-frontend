import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CustomRouter from './routes';
import Navbar from './components/common/NavBar';
import './styles/main.scss';
import { FaBars } from 'react-icons/fa';
import CurrentActivityBox from './components/common/CurrentActivityBox';
import { isLoggedIn } from './utils/tokenutils';

function App() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [isUserLoggedin, setIsUserLoggedin] = useState(isLoggedIn()); // Track login state

  const toggleNavbar = () => setShowNavbar(prev => !prev);

  // Recheck if the user is logged in when the component mounts or after login
  useEffect(() => {
    setIsUserLoggedin(isLoggedIn());
  }, []);

  return (
    <BrowserRouter>
      <div className='flex min-h-screen'>
        {/* Toggle Button (only shown when navbar is hidden) */}
        {!showNavbar && (
          <button
            onClick={toggleNavbar}
            className='fixed top-4 left-4 z-50 p-2 text-white bg-primary rounded-full shadow-md hover:bg-purple-600'
          >
            <FaBars />
          </button>
        )}

        {/* Conditionally Render Navbar */}
        {showNavbar && isUserLoggedin && <Navbar toggleNavbar={toggleNavbar} showNavbar={showNavbar} />}

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${showNavbar ? 'ml-[300px]' : 'ml-0'}`}>
          <div className='p-8'>
            <CustomRouter />
            {isUserLoggedin && <CurrentActivityBox />}
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
