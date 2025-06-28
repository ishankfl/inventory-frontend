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
import { Link } from 'react-router-dom';
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
    { name: 'Dashboard', href: '/', icon: <FaHome /> },
    { name: 'Product', href: '/view-products', icon: <FaBox /> },
    { name: 'Issue Product', href: '/issue-products', icon: <FaLayerGroup /> },
    { name: 'Category', href: '/view-category', icon: <FaLayerGroup /> },
    { name: 'Staff', href: '/view-users', icon: <FaUsers /> },
    { name: 'Department', href: '/view-departments', icon: <FaBuilding /> },
  ];

  const renderMenuLinks = (isMobile = false) => (
    <div className={`nav-links ${isMobile ? 'flex-col' : 'flex'}`}>
      {loggedIn && menuItems.slice(0, 5).map((item, index) => (
        <Link key={index} className="nav-item flex items-center gap-2" to={item.href}>
          {item.icon}
          {item.name}
        </Link>
      ))}

      { loggedIn && menuItems.length > 3 && (
        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className="nav-item w-[100px] flex items-center gap-2 justify-center mt-[15px]"
          >
            <FaEllipsisH /> {showMore ? 'Less' : 'More'}
          </button>


          {showMore && (
            <div
              className={`absolute ${isMobile ? 'static mt-2' : 'right-0 mt-2'} bg-primary rounded-md shadow-lg z-50`}
            >
              <div className="flex flex-col gap-3 p-3">
                {menuItems.slice(5).map((item, index) => (
                  <Link
                    key={`more-${index}`}
                    className="nav-item flex items-center gap-2 whitespace-nowrap"
                    to={item.href}
                    onClick={() => setShowMore(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loggedIn && (
        <Link className="nav-item flex items-center gap-2" to="/login">
          <FaSignInAlt /> Login
        </Link>
      )}
    </div>
  );

  return (
    <div className="main-nav flex items-center justify-center  p-0 fixed w-full z-[100]">
      <div className="navbar flex justify-between items-center  shadow-md relative w-[100%] p-4 text-white bg-primary z-[10000]">
        <div className="nav-logo text-[1.5rem] font-bold">Welcome to IMS</div>

        <div className="hidden md:flex items-center relative">
          {renderMenuLinks(false)}
        </div>

        <div className="md:hidden z-50 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

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
