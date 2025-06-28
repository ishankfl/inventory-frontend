import { useEffect, useState } from 'react';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBox,
  FaUsers,
  FaSignInAlt,
  FaBuilding,
  FaLayerGroup,
  FaEllipsisH,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/navbar.scss';
import { isLoggedIn } from '../../utils/tokenutils';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
    setShowMore(false);
  };

  return (
    <div className="main-nav flex items-center justify-center fixed w-full z-[100]">
      <div className="navbar flex justify-between items-center rounded-sm shadow-md relative w-full py-8 px-16 text-white bg-primary z-[10000]">
        <div className="nav-logo text-[2.0rem] font-bold">Welcome to IMS</div>

        <div className="hidden md:flex items-center relative gap-12">
          {loggedIn ? (
            <>
              <div className="flex flex-col items-center group">
                <button
                  className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:scale-105 hover:bg-primary"
                  onClick={() => handleNavigate('/')}
                >
                  <FaHome /> Dashboard
                </button>
                <span className="w-3/4 bg-green-100 h-1 mt-1 rounded transform scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
              </div>

              <div className="flex flex-col items-center group">
                <button
                  className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:scale-105"
                  onClick={() => handleNavigate('/view-products')}
                >
                  <FaBox /> Product
                </button>
                <span className="w-3/4 bg-green-100 h-1 mt-1 rounded transform scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
              </div>

              <div className="flex flex-col items-center group">
                <button
                  className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:scale-105"
                  onClick={() => handleNavigate('/issue-products')}
                >
                  <FaLayerGroup /> Issue Product
                </button>
                <span className="w-3/4 bg-green-100 h-1 mt-1 rounded transform scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
              </div>

              <div className="relative flex flex-col items-center group">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="flex nav-item items-center gap-3 transition duration-300 ease-in-out hover:scale-105 text-[1.5rem] w-120px"
                >
                  <FaEllipsisH /> {showMore ? 'Less' : 'More'}
                </button>
                <span className="w-3/4 bg-green-100 h-1 mt-1 rounded transform scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>

                {showMore && (
                  <div className="absolute right-0 mt-20 bg-primary rounded-md shadow-lg z-50">
                    <div className="flex flex-col gap-3 p-3">
                      <button
                        className="nav-item flex items-center gap-2 whitespace-nowrap transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                        onClick={() => handleNavigate('/view-category')}
                      >
                        <FaLayerGroup /> Category
                      </button>
                      <button
                        className="nav-item flex items-center gap-2 whitespace-nowrap transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                        onClick={() => handleNavigate('/view-users')}
                      >
                        <FaUsers /> Staff
                      </button>
                      <button
                        className="nav-item flex items-center gap-2 whitespace-nowrap transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                        onClick={() => handleNavigate('/view-departments')}
                      >
                        <FaBuilding /> Department
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center group">
              <button
                className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                onClick={() => handleNavigate('/login')}
              >
                <FaSignInAlt /> Login
              </button>
              <span className="w-3/4 bg-green-100 h-1 mt-1 rounded transform scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300"></span>
            </div>
          )}
        </div>

        <div className="md:hidden z-50 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-primary flex flex-col items-center gap-4 py-4 px-4 md:hidden z-40 nav-links">
            {loggedIn ? (
              <>
                <button
                  className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                  onClick={() => handleNavigate('/')}
                >
                  <FaHome /> Dashboard
                </button>
                <button
                  className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                  onClick={() => handleNavigate('/view-products')}
                >
                  <FaBox /> Product
                </button>
                <button
                  className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                  onClick={() => handleNavigate('/issue-products')}
                >
                  <FaLayerGroup /> Issue Product
                </button>
                <button
                  className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                  onClick={() => handleNavigate('/view-category')}
                >
                  <FaLayerGroup /> Category
                </button>
                <button
                  className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                  onClick={() => handleNavigate('/view-users')}
                >
                  <FaUsers /> Staff
                </button>
                <button
                  className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                  onClick={() => handleNavigate('/view-departments')}
                >
                  <FaBuilding /> Department
                </button>
              </>
            ) : (
              <button
                className="nav-item flex items-center gap-2 transition duration-300 ease-in-out hover:bg-primary-dark hover:scale-105 rounded px-3 py-2"
                onClick={() => handleNavigate('/login')}
              >
                <FaSignInAlt /> Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
