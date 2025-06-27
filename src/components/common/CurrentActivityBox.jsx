import { useEffect, useState } from 'react';
import {
  FaBox,
  FaSignInAlt,
  FaClock,
  FaFileAlt,
  FaBell,
} from 'react-icons/fa';

const CurrentActivityBox = () => {
  const [activities, setActivities] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  // Sample activity data
  const sampleActivities = [

    {
      id: 3,
      type: 'inventory',
      user: 'System',
      action: 'low stock alert for',
      item: 'Widget ABC-789',
      time: '8 minutes ago',
      status: 'warning',
      icon: FaBox,
    },
    {
      id: 4,
      type: 'document',
      user: 'Mike Johnson',
      action: 'uploaded new document',
      item: 'Monthly Report.pdf',
      time: '12 minutes ago',
      status: 'success',
      icon: FaFileAlt,
    },
    {
      id: 5,
      type: 'login',
      user: 'Admin User',
      action: 'logged into dashboard',
      item: null,
      time: '15 minutes ago',
      status: 'info',
      icon: FaSignInAlt,
    },
  ];

  useEffect(() => {
    // Simulate real-time updates
    setActivities(sampleActivities);

    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'danger':
        return 'text-red-400';
      case 'pending':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20';
      case 'warning':
        return 'bg-yellow-500/20';
      case 'danger':
        return 'bg-red-500/20';
      case 'pending':
        return 'bg-blue-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };
const handleCrossButton=()=>{
  setIsOpen(isOpen?false:true);
}
  return (
   isOpen ? (<div className="bg-slate-800 w-[500px] fixed top-[70vh] left-[98vw] transform -translate-x-full -translate-y-1/2 text-white shadow-2xl rounded-lg overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 text-lg font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaBell className="text-sm" />
          Current Activity
        </div>
        <div class="text-sm font-normal opacity-80 flex flex-row items-center gap-2">
          <span class="flex items-center">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button class="border rounded-xl w-10 h-6 flex items-center justify-center !bg-transparent hover:!bg-blue-0 hover:text-lg transition-all duration-200" onClick={handleCrossButton}>
            X
          </button>
        </div>

      </div>

      {/* Activity List */}
      <div className="p-4 max-h-90 overflow-y-auto">
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={activity.id}
                  className={`p-3 rounded-lg border border-slate-600 hover:border-slate-500 transition-all duration-200 ${getStatusBg(activity.status)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-slate-700 ${getStatusColor(activity.status)}`}>
                      <IconComponent className="text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-200 truncate">
                          {activity.user}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)} ${getStatusBg(activity.status)} border border-current/20`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-1">
                        {activity.action}
                        {activity.item && (
                          <span className="font-medium text-slate-200 ml-1">
                            {activity.item}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <FaClock className="text-xs" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaClock className="text-4xl text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No recent activity</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-900 border-t border-slate-700">
        <button className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium">
          View All Activities →
        </button>
      </div>
    </div>):(<div
  className="fixed bottom-[20px] right-[10px] h-16 w-16 rounded-xl bg-primary flex items-center justify-center shadow-2xl border border-slate-700 text-white"
  onClick={handleCrossButton}

>
  <FaBell className="text-4xl" />
</div>
));
};

export default CurrentActivityBox;