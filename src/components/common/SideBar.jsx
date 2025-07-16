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
} from 'react-icons/fa';
import { LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, removeToken } from '../../utils/tokenutils';

const SideBar = ({ toggleNavbar }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleNavigate = (path) => {
    if (path === '/logout') {
      removeToken();
      window.location.href = '/login';
    } else {
      navigate(path);
      toggleNavbar();
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/view-products', icon: FaBox, label: 'Products' },
    { path: '/issue-list', icon: FaFileInvoice, label: 'Issues' },
    { path: '/receipt-list', icon: FaReceipt, label: 'Receipts' },
    { path: '/view-category', icon: FaTag, label: 'Categories' },
    { path: '/view-users', icon: FaUsers, label: 'Staff' },
    { path: '/view-departments', icon: FaBuilding, label: 'Departments' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-[260px] bg-[#1E1F48] text-white z-[100] flex flex-col shadow-lg transition-transform duration-300 ease-in-out">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#292A53] flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-wider">IMS PORTAL</h1>
        <button
          onClick={toggleNavbar}
          className="text-[#B0B2D1] text-xl p-2 rounded-full hover:bg-[#2A2C5B] hover:text-white transition duration-300"
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="text-sm text-[#8082B2] px-6 pt-4 pb-2 flex items-center space-x-2">
        <span className="text-xs">&lt;</span>
        <span className="font-medium">Organizations</span>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {loggedIn ? (
          navItems.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => handleNavigate(path)}
                className={`
                  flex items-center gap-3 w-full px-4 py-2 rounded-md
                  transition-all duration-200 text-sm font-medium bg-[#4A91E200]
                  ${active
                    ? 'bg-[#4A90E2] text-white'
                    : 'text-[#D3D5F3] hover:bg-[#2A2C5B] hover:text-white'}
                `}
              >
                <Icon className="text-base" />
                <span>{label}</span>
              </button>
            );
          })
        ) : (
          <button
            onClick={() => handleNavigate('/login')}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-[#D3D5F3] hover:text-white hover:bg-[#2A2C5B] transition-all duration-200"
          >
            <FaSignInAlt />
            <span className="text-sm font-medium">Login</span>
          </button>
        )}
      </div>

      {/* Logout */}
      {loggedIn && (
        <div className="px-4 py-4 border-t border-[#2C2D56]">
          <button
            onClick={() => handleNavigate('/logout')}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-md bg-[#E74C3C] text-white hover:bg-[#c0392b] transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
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
