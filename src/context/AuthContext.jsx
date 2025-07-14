// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('https://asknova-host.onrender.com/auth/me', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();

        if (data?.user?._id) {
          setIsAuthenticated(true);
          setUser(data.user);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          throw new Error('Invalid user');
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]); 

  const login = () => {
    if (loggingIn) return;
    setLoggingIn(true);
  
    sessionStorage.setItem('postLoginRedirect', location.pathname);
    window.location.href = 'https://asknova-host.onrender.com/auth/github';
  };

  const logout = () => {
    fetch('https://asknova-host.onrender.com/auth/logout', {
      method: 'GET',
      credentials: 'include',
    }).finally(() => {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    });
  };


  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = sessionStorage.getItem('postLoginRedirect');
      if (redirectPath) {
        sessionStorage.removeItem('postLoginRedirect');
        window.history.replaceState({}, '', redirectPath); 
      }
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
