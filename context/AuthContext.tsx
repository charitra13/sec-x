"use client";

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie';
import api, { isCORSError } from '../lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  // Fetch user profile with CORS error handling
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await api.get('/users/profile');
      setUser(data.data.user);
    } catch (err: any) {
      if (isCORSError(err)) {
        console.error('CORS Error in fetchUser:', err);
        setError(new Error('Unable to connect due to security restrictions'));
      } else if (err.response?.status === 401) {
        // Not authenticated, clear user
        setUser(null);
        Cookies.remove('token');
      } else {
        console.error('Error fetching user:', err);
        setError(err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  // Login with CORS error handling
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post('/auth/login', { email, password });
      
      // Store token in cookie (backend also sets httpOnly cookie)
      if (data.token) {
        Cookies.set('token', data.token, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }

      setUser(data.user);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (data.data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      if (isCORSError(err)) {
        setError(new Error('Unable to connect to authentication server'));
        toast.error('Connection blocked by security policy');
      } else if (err.response?.status === 401) {
        setError(new Error('Invalid email or password'));
        toast.error('Invalid credentials');
      } else {
        setError(err);
        toast.error(err.response?.data?.message || 'Login failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register with CORS error handling
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post('/auth/register', { name, email, password });
      
      // Store token
      if (data.data.token) {
        Cookies.set('token', data.data.token, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }

      setUser(data.data.user);
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (err: any) {
      if (isCORSError(err)) {
        setError(new Error('Unable to connect to registration server'));
        toast.error('Connection blocked by security policy');
      } else {
        setError(err);
        toast.error(err.response?.data?.message || 'Registration failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Even if logout fails, clear local state
      console.error('Logout error:', err);
    } finally {
      Cookies.remove('token');
      setUser(null);
      router.push('/');
      toast.success('Logged out successfully');
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        loading, 
        error,
        login, 
        register,
        logout, 
        refetchUser: fetchUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 