import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

/**
 * AuthContext handles user authentication, session persistence, and
 * reward tracking. It provides convenience methods to log in and
 * sign up against the backend API and maintains the authenticated
 * user's state across page reloads using localStorage.
 */

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  rewardUser: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Base URL for the API. Use environment variable or fallback.
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Attach token to each request if available
  api.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    // Load user and token from localStorage on initial render
    const storedToken = localStorage.getItem('cq_token');
    const storedUser = localStorage.getItem('cq_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Persist user and token whenever they change
  useEffect(() => {
    if (token) {
      localStorage.setItem('cq_token', token);
    } else {
      localStorage.removeItem('cq_token');
    }
    if (user) {
      localStorage.setItem('cq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cq_user');
    }
  }, [user, token]);

  async function login(email, password) {
    const res = await api.post('/api/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function signup(email, password, displayName) {
    const res = await api.post('/api/auth/signup', { email, password, displayName });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  async function rewardUser({ points = 0, badge = null }) {
    if (!token) return;
    const res = await api.post('/api/user/reward', { points, badge });
    // Update local user state with new points/badges
    setUser(prev => ({ ...prev, points: res.data.points, badges: res.data.badges }));
    return res.data;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, rewardUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}