import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CustomRouter from './routes';
import SideBar from './components/common/SideBar';
import './styles/main.scss';
import { FaBars } from 'react-icons/fa';
import CurrentActivityBox from './components/common/CurrentActivityBox';
import { isLoggedIn } from './utils/tokenutils';

function App() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [isUserLoggedin, setIsUserLoggedin] = useState(isLoggedIn());

  const toggleNavbar = () => setShowNavbar(prev => !prev);

  useEffect(() => {
    setIsUserLoggedin(isLoggedIn());
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">

        {/* Toggle Button (only shown when sidebar is hidden) */}
        {!showNavbar && (
          <button
            onClick={toggleNavbar}
            className="fixed top-4 left-4 z-50 p-2 text-white bg-primary rounded-full shadow-md hover:bg-purple-600"
          >
            <FaBars />
          </button>
        )}

        {/* Sidebar */}
        {showNavbar && isUserLoggedin && (
          <SideBar toggleNavbar={toggleNavbar} showNavbar={showNavbar} />
        )}

        {/* Main Content */}
        <div
          className={`transition-all duration-300 ${showNavbar && isUserLoggedin
            ? 'ml-[260px] max-w-[calc(100%-260px)]'
            : 'ml-0 max-w-full'
          } flex-1`}
        >
          <div className="bg-gradient-to-br from-background-secondary via-primary-light to-background-tertiary p-4 md:p-10">
            <CustomRouter />
            {isUserLoggedin && <CurrentActivityBox />}
          </div>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
