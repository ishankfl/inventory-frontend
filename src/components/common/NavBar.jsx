import { useEffect, useState } from 'react';
import {
  FaTimes,
  FaHome,
  FaBox,
  FaUsers,
  FaSignInAlt,
  FaBuilding,
  FaLayerGroup,
  FaReceipt,
  FaFileInvoice,
  FaTag,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../../utils/tokenutils';

const Navbar = ({ toggleNavbar }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    toggleNavbar(); // close sidebar after navigation
  };

  const isActive = (path) => location.pathname === path;
  // import { FaHome, FaBox, FaFileInvoice, FaReceipt, FaTags, FaUsers, FaBuilding } from 'react-icons/fa';

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/view-products', icon: FaBox, label: 'Product' },
    { path: '/issue-list', icon: FaFileInvoice, label: 'Issue' }, 
    { path: '/receipt-list', icon: FaReceipt, label: 'Receipt' },        
    { path: '/view-category', icon: FaTag, label: 'Category' },   
    { path: '/view-users', icon: FaUsers, label: 'Staff' },
    { path: '/view-departments', icon: FaBuilding, label: 'Department' },
  ];


  return (
    <div className="main-nav fixed top-0 left-0 h-screen w-[300px] bg-primary text-white z-[100] flex flex-col shadow-xl">
      {/* Header */}
      <div className="px-6 py-6 border-b border-primary/40">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-primarylight">IMS Portal</h1>
          <button
            onClick={toggleNavbar}
            className="text-white/80 text-xl hover:text-white hover:rotate-90 transition-all duration-300 p-2 rounded-full hover:bg-primary/40"
          >
            <FaTimes />
          </button>
        </div>
        <p className="text-sm text-primarylight/70">Inventory Management System</p>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
        {loggedIn ? (
          navItems.map((item, i) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`!nav-item group relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${active
                    ? 'bg-gradient-to-r from-primary to-primarylight text-white shadow-lg scale-105'
                    : 'text-primarylight hover:bg-primary/40 hover:text-white'
                  }`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animation: 'slideInLeft 0.6s ease-out forwards',
                }}
              >
                {/* Active line indicator */}
                {active && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full animate-pulse"></div>
                )}
                <div className={`text-lg ${active ? 'text-white' : 'text-primarylight/80 group-hover:text-white'}`}>
                  <Icon />
                </div>
                <span className={`font-medium ${active ? 'text-white' : 'text-primarylight group-hover:text-white'}`}>
                  {item.label}
                </span>
              </button>
            );
          })
        ) : (
          <button
            onClick={() => handleNavigate('/login')}
            className="group relative w-full flex items-center gap-4 px-4 py-3 rounded-xl text-primarylight hover:bg-primary/40 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <div className="text-lg text-primarylight group-hover:text-white">
              <FaSignInAlt />
            </div>
            <span className="font-medium">Login</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-primary/40 text-center text-xs text-primarylight/70">
        © 2024 IMS Portal
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .main-nav .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .main-nav .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .main-nav .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
        }
        .main-nav .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Navbar;
