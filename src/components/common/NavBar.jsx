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
import '../../styles/navbar.scss';
import { isLoggedIn } from '../../utils/tokenutils';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const checkLoggedin = () => {
    const isUserLoggedIn = isLoggedIn();
    setLoggedIn(isUserLoggedIn);
  };

  useEffect(() => {
    checkLoggedin();
  }, []);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FaHome /> },
    { name: 'Product', href: '/product', icon: <FaBox /> },
    { name: 'Issue Product', href: '/issue-product', icon: <FaLayerGroup /> },
    { name: 'Category', href: '/category', icon: <FaLayerGroup /> },
    { name: 'Staff', href: '/users', icon: <FaUsers /> },
    { name: 'Department', href: '/deprtments', icon: <FaBuilding /> },
  ];

  const renderMenuLinks = (isMobile = false) => (
    <div className={`nav-links ${isMobile ? 'flex-col' : 'flex'} gap-5`}>
      {/* First 3 menu items */}
      {menuItems.slice(0, 3).map((item, index) => (
        <a key={index} className="nav-item flex items-center gap-2" href={item.href}>
          {item.icon}
          {item.name}
        </a>
      ))}

      {/* More button and dropdown */}
      {menuItems.length > 3 && (
        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className="nav-item flex items-center gap-2"
          >
            <FaEllipsisH /> {showMore ? 'Less' : 'More'}
          </button>
          
          {/* Dropdown for additional items */}
          {showMore && (
            <div className={`absolute ${isMobile ? 'static mt-2' : 'right-0 mt-2'} bg-primary rounded-md shadow-lg z-50`}>
              <div className="flex flex-col gap-3 p-3">
                {menuItems.slice(3).map((item, index) => (
                  <a
                    key={`more-${index}`}
                    className="nav-item flex items-center gap-2 whitespace-nowrap"
                    href={item.href}
                    onClick={() => setShowMore(false)}
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Login shown only if not logged in */}
      {!loggedIn && (
        <a className="nav-item flex items-center gap-2" href="/login">
          <FaSignInAlt /> Login
        </a>
      )}
    </div>
  );

  return (
    <div className="main-nav flex items-center justify-center p-8 fixed w-full">
      <div className="navbar flex justify-between items-center rounded-lg shadow-md relative w-[80%] p-4 text-white bg-primary z-[10000]">
        <div className="nav-logo text-[1.5rem] font-bold">Welcome to IMS</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center relative">{renderMenuLinks(false)}</div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden z-50 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-primary flex flex-col items-center gap-4 py-4 px-4 md:hidden z-40">
            {renderMenuLinks(true)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;