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
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/navbar.scss';
import { isLoggedIn } from '../../utils/tokenutils';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="main-nav top-0 left-0 h-[100vh] w-[250px] bg-primary text-white z-[100] flex flex-col shadow-md px-6 py-8">
      <div className="nav-logo text-[1.5rem] font-bold mb-8">
        Welcome to IMS
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex flex-col gap-6">
        {loggedIn ? (
          <>
            <button onClick={() => handleNavigate('/')} className="nav-item flex items-center gap-3 hover:text-gray-300">
              <FaHome /> Dashboard
            </button>
            <button onClick={() => handleNavigate('/view-products')} className="nav-item flex items-center gap-3 hover:text-gray-300">
              <FaBox /> Product
            </button>
            <button onClick={() => handleNavigate('/issue-products')} className="nav-item flex items-center gap-3 hover:text-gray-300">
              <FaLayerGroup /> Issue Product
            </button>
            <button onClick={() => handleNavigate('/view-category')} className="nav-item flex items-center gap-3 hover:text-gray-300">
              <FaLayerGroup /> Category
            </button>
            <button onClick={() => handleNavigate('/view-users')} className="nav-item flex items-center gap-3 hover:text-gray-300">
              <FaUsers /> Staff
            </button>
            <button onClick={() => handleNavigate('/view-departments')} className="nav-item flex items-center gap-3 hover:text-gray-300">
              <FaBuilding /> Department
            </button>
          </>
        ) : (
          <button onClick={() => handleNavigate('/login')} className="nav-item flex items-center gap-3 hover:text-gray-300">
            <FaSignInAlt /> Login
          </button>
        )}
      </div>

      {/* Mobile menu toggle button */}
      <div className="md:hidden mt-auto cursor-pointer z-50" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-primary flex flex-col items-start gap-4 px-6 py-4 z-40 md:hidden">
          {loggedIn ? (
            <>
              <button onClick={() => handleNavigate('/')} className="nav-item flex items-center gap-3 hover:text-gray-300">
                <FaHome /> Dashboard
              </button>
              <button onClick={() => handleNavigate('/view-products')} className="nav-item flex items-center gap-3 hover:text-gray-300">
                <FaBox /> Product
              </button>
              <button onClick={() => handleNavigate('/issue-products')} className="nav-item flex items-center gap-3 hover:text-gray-300">
                <FaLayerGroup /> Issue Product
              </button>
              <button onClick={() => handleNavigate('/view-category')} className="nav-item flex items-center gap-3 hover:text-gray-300">
                <FaLayerGroup /> Category
              </button>
              <button onClick={() => handleNavigate('/view-users')} className="nav-item flex items-center gap-3 hover:text-gray-300">
                <FaUsers /> Staff
              </button>
              <button onClick={() => handleNavigate('/view-departments')} className="nav-item flex items-center gap-3 hover:text-gray-300">
                <FaBuilding /> Department
              </button>
            </>
          ) : (
            <button onClick={() => handleNavigate('/login')} className="nav-item flex items-center gap-3 hover:text-gray-300">
              <FaSignInAlt /> Login
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
