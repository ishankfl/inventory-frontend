import { useEffect, useState, useRef } from 'react';
import {
  FaBox,
  FaSignInAlt,
  FaClock,
  FaFileAlt,
  FaBell,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaExternalLinkAlt,
  FaCircle,
} from 'react-icons/fa';
import { fetchAllActivities } from '../../api/activities';

const CurrentActivityBox = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const fetchAllActivity = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllActivities();
      if (response.status === 200) {
        console.log("Fetched successfully");
        setActivities(response.data);
      } else {
        console.log(response.status);
        console.log(response.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllActivity();
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-danger';
      case 'pending':
        return 'text-primary';
      default:
        return 'text-text-muted';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'success':
        return 'bg-success-light border-success/20';
      case 'warning':
        return 'bg-warning-light border-warning/20';
      case 'danger':
        return 'bg-danger-light border-danger/20';
      case 'pending':
        return 'bg-primary-light border-primary/20';
      default:
        return 'bg-background-tertiary border-border';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-danger';
      case 'pending':
        return 'text-primary';
      default:
        return 'text-text-muted';
    }
  };

  const getActivityIcon = (action) => {
    if (action.includes('login') || action.includes('Login')) return FaSignInAlt;
    if (action.includes('product') || action.includes('Product')) return FaBox;
    if (action.includes('user') || action.includes('User')) return FaUser;
    return FaFileAlt;
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // Floating Action Button
  if (!isOpen) {
    return (
      <div className="fixed bottom-0 right-6 z-50">
        <button
          onClick={handleToggle}
          className="relative group bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white h-16 w-16 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border border-primary/20"
        >
          <FaBell className="text-2xl group-hover:animate-pulse" />
          
          {/* Notification badge */}
          {activities.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-danger text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              {activities.length > 9 ? '9+' : activities.length}
            </span>
          )}
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-2xl bg-primary/30 animate-ping opacity-75 group-hover:opacity-100"></div>
        </button>
      </div>
    );
  }

  // Activity Panel
  return (
    <div className="fixed top-[65%] right-6 transform -translate-y-1/2 z-50 w-96 max-w-[90vw]">
      <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden backdrop-blur-sm">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FaBell className="text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Activity Feed</h3>
                <p className="text-sm opacity-90">Recent system activities</p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Time & Controls */}
        <div className="px-6 py-3 bg-background-secondary border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-secondary">
              <FaClock className="text-sm" />
              <span className="text-sm font-medium">
                {currentTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={scrollToTop}
                className="p-1 hover:bg-background-tertiary rounded transition-colors duration-200"
                title="Scroll to top"
              >
                <FaChevronUp className="text-xs text-text-muted" />
              </button>
              <button
                onClick={scrollToBottom}
                className="p-1 hover:bg-background-tertiary rounded transition-colors duration-200"
                title="Scroll to bottom"
              >
                <FaChevronDown className="text-xs text-text-muted" />
              </button>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div 
          className="max-h-96 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
          ref={scrollRef}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice().reverse().map((activity) => {
                const date = new Date(activity.timestamp);
                const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
                
                const IconComponent = getActivityIcon(activity.action);
                
                return (
                  <div
                    key={activity.id}
                    className={`relative py-2 px-2 rounded-xl border-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${getStatusBg(activity.status)} group`}
                  >
                    {/* Status indicator dot */}
                    <div className="absolute top-3 right-3">
                      <FaCircle className={`text-xs ${getStatusDot(activity.status)} animate-pulse`} />
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className={`px-3 py-1 rounded-xl bg-white shadow-sm ${getStatusColor(activity.status)} group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="text-lg" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-2">
                          <span className="font-semibold text-text truncate">
                            {activity.user.fullName}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)} ${getStatusBg(activity.status)} border`}>
                            {activity.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-text-secondary mb-2 leading-relaxed">
                          {activity.action}
                          {activity.email && (
                            <span className="font-medium text-text ml-1">
                              {activity.email}
                            </span>
                          )}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <FaClock className="text-xs" />
                          <span>{formatted}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="px-4 py-2 bg-background-tertiary rounded-2xl inline-block mb-2">
                <FaClock className="text-4xl text-text-muted" />
              </div>
              <h4 className="font-semibold text-text mb-2">No Recent Activity</h4>
              <p className="text-text-secondary text-sm">
                System activities will appear here when they occur
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-2 bg-background-secondary border-t border-border">
          <button className="w-full group flex items-center justify-center gap-2 text-sm text-primary hover:text-primary-dark font-medium px-4 rounded-lg hover:bg-primary-light transition-all duration-200 text-white">
            <span>View All Activities</span>
            <FaExternalLinkAlt className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentActivityBox;