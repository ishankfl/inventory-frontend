import { useEffect, useState, useRef } from 'react';
import {
  FaBox,
  FaSignInAlt,
  FaClock,
  FaFileAlt,
  FaBell,
} from 'react-icons/fa';
import { fetchAllActivities } from '../../api/activities';

const CurrentActivityBox = () => {
  // const [activities, setActivities] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const scrollRef = useRef(null);  

  // const scrollToBottom = () => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  //   }
  // };

  // const scrollToTop = () => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTop = 0;
  //   }
  // };

  const fetchAllActivity = async () => {
    try {
      const response = await fetchAllActivities();
      if (response.status == 200) {
        console.log("Fetched successfull")
        setActivities(response.data);

      }
      else {
        console.log(response.status)
        console.log(response.data);
      }
    } catch (e) {
      console.log(e)
    }

  }


  useEffect(() => {

    fetchAllActivity()


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
  const handleCrossButton = () => {
    setIsOpen(isOpen ? false : true);
  }
  return isOpen ? (<div className="bg-slate-800 w-[400px] fixed top-[70vh] left-[98vw] transform -translate-x-full -translate-y-1/2 text-white shadow-2xl rounded-lg overflow-hidden border border-slate-700 ">
    {/* Header */}
    <div className="bg-blue-600 text-white px-4 py-3 text-lg font-semibold flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FaBell className="text-sm" />
        Current Activity
      </div>
      <div className="text-sm font-normal opacity-80 flex flex-row items-center gap-2">
        <span className="flex items-center">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <button className="border rounded-xl w-10 h-6 flex items-center justify-center !bg-transparent hover:!bg-blue-0 hover:text-lg transition-all duration-200" onClick={handleCrossButton}>
          X
        </button>
      </div>

    </div>

    <div className="p-4 max-h-90  max-h-[400px] overflow-y-scroll !scrollbar-hide" ref={scrollRef}>
      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.reverse().map((activity) => {
            const date = new Date(activity.timestamp);

            const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

            // const IconComponent = activity.icon;
            return (
              <div
                key={activity.id}
                className={`p-3 rounded-lg border border-slate-600 hover:border-slate-500 transition-all duration-200 ${getStatusBg(activity.status)}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-slate-700 ${getStatusColor(activity.status)}`}>
                    {/* <IconComponent className="text-sm" /> */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-200 truncate">
                        {activity.user.fullName}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)} ${getStatusBg(activity.status)} border border-current/20`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-1">
                      {activity.action}
                      {activity.email && (
                        <span className="font-medium text-slate-200 ml-1">
                          {activity.email}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <FaClock className="text-xs" />
                      {formatted}
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
  </div>) : ((<div className="fixed bottom-[20px] right-[10px] h-16 w-16 rounded-xl bg-primary flex items-center justify-center shadow-2xl border border-slate-700 text-white"
    onClick={handleCrossButton}

  >
    <FaBell className="text-4xl" />
  </div>
  ))
};

export default CurrentActivityBox;