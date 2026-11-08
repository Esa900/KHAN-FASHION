import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser } from '../types';

interface AuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickSwitchAccount: (targetRole: 'admin' | 'customer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aura_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate or load initial user
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('aura_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem('aura_token');
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password = 'admin123'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem('aura_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error occurred' };
    }
  };

  const register = async (name: string, email: string, phone: string, password = 'customer123'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      localStorage.setItem('aura_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('aura_token');
    setToken(null);
    setUser(null);
  };

  const quickSwitchAccount = async (targetRole: 'admin' | 'customer') => {
    if (targetRole === 'admin') {
      await login('admin@technovamartbd.com', 'admin123');
    } else {
      await login('customer@technovamartbd.com', 'customer123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        quickSwitchAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
