import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IDLE_TIMEOUT = 2 * 10 * 10; // 2 minutes

const AutoLogoutProvider = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let logoutTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
          localStorage.removeItem('authToken');
          navigate('/');
        }
      }, IDLE_TIMEOUT);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') resetTimer();
    });

    resetTimer(); // start timer initially

    return () => {
      clearTimeout(logoutTimer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  return <>{children}</>;
};

export default AutoLogoutProvider;
