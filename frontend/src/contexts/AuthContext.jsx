import { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const saveUser = (userData) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem('authUser');
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      saveUser(data.user);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      saveUser(data.user);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: 'POST' });
    } catch {}
    saveUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
