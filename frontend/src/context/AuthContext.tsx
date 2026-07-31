import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      api.get('/users/me')
        .then((res) => {
          setUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (authToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    if (token) {
      api.post('/auth/logout').catch(() => {});
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.roles?.some((r) => r.name === 'ROLE_ADMIN' || (r as any) === 'ROLE_ADMIN') || false;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
