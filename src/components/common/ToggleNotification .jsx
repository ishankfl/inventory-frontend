import React, { useEffect, useState } from 'react';

const ToastNotification = ({ 
  type = 'success', 
  message = 'Operation completed!',
  duration = 5000,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(100);

  const startFadeOut = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsFading(false);
      if (onClose) onClose();
    }, 500);
  };

  const handleClose = () => {
    startFadeOut();
  };

  useEffect(() => {
    let timer;
    let startTime;
    if (isVisible) {
      setProgress(100);
      startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.max(100 - (elapsed / duration) * 100, 0);
        setProgress(newProgress);
        if (newProgress === 0) {
          clearInterval(timer);
          startFadeOut();
        }
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isVisible, duration]);

  // Define colors based on type
  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          progressBg: 'bg-green-200'
        };
      case 'error':
      case 'failed':
        return {
          bg: 'bg-red-500',
          progressBg: 'bg-red-200'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          progressBg: 'bg-yellow-200'
        };
      case 'info':
        return {
          bg: 'bg-blue-500',
          progressBg: 'bg-blue-200'
        };
      default:
        return {
          bg: 'bg-gray-500',
          progressBg: 'bg-gray-200'
        };
    }
  };

  const colors = getColors();

  return (
    <div className=" w-[20%] right-0 absolute top-[100px] p-4 flex flex-col gap-4">
      {isVisible && (
        <div
          className={`relative p-4 rounded shadow ${colors.bg} text-white font-semibold transition-opacity duration-500 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            onClick={handleClose}
            className="absolute top-1 right-1 text-white text-xl hover:text-gray-300 cursor-pointer select-none w-6 h-6 flex items-center justify-center"
          >
            &times;
          </div>
          <p>{message}</p>
          <div className={`w-full h-1 ${colors.progressBg} mt-2 overflow-hidden rounded`}>
            <div
              className="h-1 bg-white transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ToastNotification;