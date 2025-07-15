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
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, removeToken } from '../../utils/tokenutils';
import { LogOut } from 'lucide-react'; // Ensure Lucide-React is installed if not already

const SideBar = ({ toggleNavbar }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleNavigate = async (path) => {
    if (path === '/logout') { // Use strict equality
      removeToken();
      window.location.href = '/login'; // Use window.location.href for clear redirection
      return;
    } else {
      navigate(path);
      toggleNavbar(); // close sidebar after navigation
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
    <div className="main-nav fixed top-0 left-0 h-screen w-[280px] bg-primary-dark text-white z-[100] flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="px-6 py-5 border-b border-primary/50 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">IMS Portal</h1>
        <button
          onClick={toggleNavbar}
          className="text-primary-light/80 text-xl p-2 rounded-full hover:bg-primary/40 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-light"
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-2 custom-scrollbar">
        {loggedIn ? (
          navItems.map((item, i) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`
                  group relative w-full flex items-center gap-4 px-4 py-3 rounded-lg 
                  transition-all duration-200 ease-in-out transform
                  ${active
                    ? 'bg-primary text-white shadow-md'
                    : 'text-primary-light hover:bg-primary/20 hover:text-white'
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-75
                `}
                style={{
                  animationDelay: `${i * 0.05}s`, // Slightly faster staggered animation
                  animation: 'slideInLeft 0.4s ease-out forwards',
                }}
              >
                {/* Active line indicator */}
                {active && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full animate-pulse-fade"></div>
                )}
                <div className={`text-xl ${active ? 'text-white' : 'text-primary-light group-hover:text-white'}`}>
                  <Icon />
                </div>
                <span className={`font-semibold text-base ${active ? 'text-white' : 'text-primary-light group-hover:text-white'}`}>
                  {item.label}
                </span>
              </button>
            );
          })
        ) : (
          <button
            onClick={() => handleNavigate('/login')}
            className="group relative w-full flex items-center gap-4 px-4 py-3 rounded-lg text-primary-light hover:bg-primary/20 hover:text-white transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-75"
          >
            <div className="text-xl text-primary-light group-hover:text-white">
              <FaSignInAlt />
            </div>
            <span className="font-semibold text-base">Login</span>
          </button>
        )}
      </div>

      {/* Logout Button (conditional rendering based on loggedIn state) */}
      {loggedIn && (
        <div className="px-4 py-4 border-t border-primary/50">
          <button
            onClick={() => handleNavigate('/logout')}
            className="group relative w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-danger-dark text-white hover:bg-danger transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-md focus:outline-none focus:ring-2 focus:ring-danger-light focus:ring-opacity-75"
          >
            <div className="text-xl text-white">
              <LogOut />
            </div>
            <span className="font-semibold text-base">Logout</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-primary/50 text-center text-xs text-primary-light/60">
        © {new Date().getFullYear()} IMS Portal
      </div>

      {/* CSS animations and scrollbar */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-pulse-fade {
            animation: pulse-fade 2s infinite ease-in-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default SideBar;