import { useEffect, useState } from 'react';
import {
  FaTimes,
  FaHome,
  FaBox,
  FaUsers,
  FaSignInAlt,
  FaBuilding,
  FaReceipt,
  FaFileInvoice,
  FaTag,
  FaSellsy,
} from 'react-icons/fa';
import { LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, removeToken } from '../../utils/tokenutils';

const SideBar = ({ closeNavbar }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeLabel, setActiveLabel] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/view-products', icon: FaBox, label: 'Products' },
    { path: '/issue-list', icon: FaFileInvoice, label: 'Issues' },
    { path: '/receipts', icon: FaReceipt, label: 'Receipts' },
    { path: '/view-category', icon: FaTag, label: 'Categories' },
    { path: '/view-users', icon: FaUsers, label: 'Staff' },
    { path: '/view-departments', icon: FaBuilding, label: 'Departments' },
    { path: '/vendors', icon: FaSellsy, label: 'Vendors' },
  ];

  useEffect(() => {
    setLoggedIn(isLoggedIn());

    // Find the best match for the current path
    let matchedItem = null;
    // Sort navItems so that more specific paths come before less specific ones
    // This is crucial for paths like '/'
    const sortedNavItems = [...navItems].sort((a, b) => {
      if (a.path === '/') return 1; // Push '/' to the end
      if (b.path === '/') return -1; // Push '/' to the end
      return b.path.length - a.path.length; // Longer paths first
    });

    for (const item of sortedNavItems) {
      if (location.pathname.startsWith(item.path)) {
        // For the dashboard, ensure it's an exact match if it's not the only segment
        if (item.path === '/' && location.pathname !== '/') {
          continue; // Skip if it's the root path but we are on a sub-route
        }
        matchedItem = item;
        break; // Found the most specific match
      }
    }

    if (matchedItem) {
      setActiveLabel(matchedItem.label);
    } else {
      setActiveLabel(null); // Clear active label if no match
    }
  }, [location.pathname, navItems]); // Add navItems to dependency array

  const handleNavigate = (path) => {
    if (path === '/logout') {
      removeToken();
      window.location.href = '/login';
    } else {
      closeNavbar();
      navigate(path);
      // toggleNavbar();
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-[260px] bg-primary-dark text-white z-[100] flex flex-col shadow-lg transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#292A53] flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-wider">IMS PORTAL</h1>
        {/* <div
          onClick={toggleNavbar}
          className="bg-red-400 text-white text-xl p-2 rounded-full hover:bg-red-800 hover:text-white transition duration-300 cursor-pointer"
          aria-label="Close sidebar"
        >
          <FaTimes />
        </div> */}
      </div>

      {/* Breadcrumb */}
      <div className="text-sm text-[#8082B2] px-6 pt-4 pb-2 flex items-center space-x-2">
        <span className="text-xs">&lt;</span>
        {activeLabel && (
          <span className="text-white font-medium">{activeLabel}</span>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {loggedIn ? (
          navItems.map(({ path, icon: Icon, label }) => {
            const isActive = activeLabel === label;
            return (
              <div
                key={label}
                onClick={() => handleNavigate(path)}
                className={`bg-[#4B4EFC00] flex items-center gap-3 w-full px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium cursor-pointer ${
                  isActive
                    ? 'bg-[#4B4EFC] text-white'
                    : 'text-[#D3D5F3] hover:text-white hover:bg-[#2A2C5B]'
                }`}
              >
                <Icon className="text-base" />
                <span>{label}</span>
              </div>
            );
          })
        ) : (
          <div
            onClick={() => handleNavigate('/login')}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-[#D3D5F3] hover:text-white hover:bg-[#2A2C5B] transition-all duration-200 cursor-pointer"
          >
            <FaSignInAlt />
            <span className="text-sm font-medium">Login</span>
          </div>
        )}
      </div>

      {/* Logout */}
      {loggedIn && (
        <div className="px-4 py-4 border-t border-[#2C2D56]">
          <div
            onClick={() => handleNavigate('/logout')}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-md bg-[#E74C3C] text-white hover:bg-[#c0392b] transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#2C2D56] text-center text-xs text-[#8082B2]">
        © {new Date().getFullYear()} IMS Portal
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default SideBar;