import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const updateToken = (newToken: string, id:string) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authId', id);
    setToken(newToken);
    window.location.href = '/admin';
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  return { token, updateToken, logout };
};
