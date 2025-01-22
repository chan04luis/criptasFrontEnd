import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const updateToken = (newToken: string, result:any) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authResult', JSON.stringify(result));
    setToken(newToken);
    window.location.href = '/admin';
  };

  const refreshToken = (newToken: string, result:any) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authResult', JSON.stringify(result));
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  return { token, updateToken, logout, refreshToken };
};
