import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CustomRouter from './routes';
import SideBar from './components/common/SideBar';
import './styles/main.scss';
import { FaBars, FaTimes } from 'react-icons/fa';
import CurrentActivityBox from './components/common/CurrentActivityBox';
import { isLoggedIn } from './utils/tokenutils';

function App() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [isUserLoggedin, setIsUserLoggedin] = useState(isLoggedIn());

  const toggleNavbar = () => setShowNavbar(prev => !prev);
  const closeNavbar = () => setShowNavbar(false);

  useEffect(() => {
    setIsUserLoggedin(isLoggedIn());
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-background-secondary via-primary-light to-background-tertiary relative">

        {/* Toggle Button - shown when user is logged in */}
        {isUserLoggedin && (
          <button
            onClick={toggleNavbar}
            className={`fixed top-4 z-50 p-3 text-white bg-primary rounded-full shadow-md hover:bg-purple-600 transition-all
  left-4 sm:left-6
  ${showNavbar ? 'left-[calc(260px+1rem)] lg:left-[280px]' : 'lg:left-4'}
`}

            aria-label={showNavbar ? "Close sidebar" : "Open sidebar"}
          >
            {showNavbar ? <FaTimes /> : <FaBars />}
          </button>
        )}

        {/* Sidebar */}
        {isUserLoggedin && (
          <div
            className={`
              fixed top-0 left-0 h-full bg-white shadow-lg z-40
              w-[260px]
              transition-all duration-300 ease-in-out
              ${showNavbar ? 'translate-x-0' : '-translate-x-full'}
              sm:relative sm:translate-x-0
              ${!showNavbar && 'sm:hidden'}
            `}
          >
            <SideBar closeNavbar={closeNavbar} />
          </div>
        )}

        {/* Overlay for mobile when sidebar open */}
        {showNavbar && isUserLoggedin && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
            onClick={closeNavbar}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Main Content */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300
            ${isUserLoggedin && showNavbar ? 'sm:ml-[260px] lg:ml-[0]' : ''}
          `}
          style={{ height: '100vh' }}
        >
          <div className="lg:mt-10 lg:ml-10 sm:m-0 sm:p-0">
            <CustomRouter />
            {isUserLoggedin && <CurrentActivityBox />}
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;