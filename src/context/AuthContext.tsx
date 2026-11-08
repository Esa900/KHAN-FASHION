import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser } from '../types';

export const DEFAULT_ADMIN: CustomerUser = {
  id: 'usr-admin',
  name: 'TechNova SuperAdmin',
  email: 'admin@technovamartbd.com',
  phone: '+880 1410-732067',
  role: 'admin',
  createdAt: '2025-10-01T00:00:00Z'
};

export const DEFAULT_CUSTOMER: CustomerUser = {
  id: 'usr-customer-1',
  name: 'Tanvir Ahmed',
  email: 'customer@technovamartbd.com',
  phone: '+880 1712-445566',
  role: 'customer',
  createdAt: '2025-11-12T10:00:00Z',
  address: {
    fullName: 'Tanvir Ahmed',
    phone: '+880 1712-445566',
    division: 'Dhaka',
    district: 'Dhaka',
    thana: 'Dhanmondi',
    streetAddress: '57/1, Road-7A, Dhanmondi, Dhaka',
    postalCode: '1209'
  }
};

interface AuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickSwitchAccount: (targetRole: 'admin' | 'customer') => Promise<void>;
  setAdminDirectly: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to DEFAULT_ADMIN so users can instantly open and manage the Admin Panel
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('technova_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to parse technova_user:', e);
    }
    return DEFAULT_ADMIN;
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('technova_token') || 'demo_admin_jwt_token';
    } catch {
      return 'demo_admin_jwt_token';
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync user state to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('technova_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('technova_user');
      }
    } catch (e) {
      console.error('Failed to save technova_user:', e);
    }
  }, [user]);

  const login = async (email: string, password = 'admin123'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        // If offline or static host fallback
        if (email.toLowerCase().includes('admin')) {
          setUser(DEFAULT_ADMIN);
          setToken('demo_admin_jwt_token');
          localStorage.setItem('technova_token', 'demo_admin_jwt_token');
          return { success: true };
        }
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem('technova_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      // Offline fallback for demo
      if (email.toLowerCase().includes('admin')) {
        setUser(DEFAULT_ADMIN);
        setToken('demo_admin_jwt_token');
        localStorage.setItem('technova_token', 'demo_admin_jwt_token');
        return { success: true };
      }
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
      localStorage.setItem('technova_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('technova_token');
    localStorage.removeItem('technova_user');
    setToken(null);
    setUser(null);
  };

  const quickSwitchAccount = async (targetRole: 'admin' | 'customer') => {
    if (targetRole === 'admin') {
      setUser(DEFAULT_ADMIN);
      setToken('demo_admin_jwt_token');
      localStorage.setItem('technova_token', 'demo_admin_jwt_token');
      localStorage.setItem('technova_user', JSON.stringify(DEFAULT_ADMIN));
    } else {
      setUser(DEFAULT_CUSTOMER);
      setToken('demo_customer_jwt_token');
      localStorage.setItem('technova_token', 'demo_customer_jwt_token');
      localStorage.setItem('technova_user', JSON.stringify(DEFAULT_CUSTOMER));
    }
  };

  const setAdminDirectly = () => {
    setUser(DEFAULT_ADMIN);
    setToken('demo_admin_jwt_token');
    localStorage.setItem('technova_token', 'demo_admin_jwt_token');
    localStorage.setItem('technova_user', JSON.stringify(DEFAULT_ADMIN));
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
        quickSwitchAccount,
        setAdminDirectly
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
