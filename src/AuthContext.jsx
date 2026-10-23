import { useState, useEffect } from 'react';
import { AuthContext } from './useAuth'; // <-- Import from the new file
import { expenseAPI } from './api/client';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      expenseAPI('/auth/me')
        .then(data => {
          setUser(data);
          document.body.classList.add('logged-in');
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('current_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const data = await expenseAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('current_user', JSON.stringify(data.user));
    setUser(data.user);
    document.body.classList.add('logged-in');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    setUser(null);
    document.body.classList.remove('logged-in');
    window.location.hash = '#/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}