import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

/**
 * AuthContext for the mobile application. Similar to the web version,
 * this context holds authentication state and exposes helpers to
 * communicate with the backend API. For simplicity we do not
 * persist tokens between app launches in this demo.
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

  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json' }
  });
  api.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

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