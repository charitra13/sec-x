"use client";

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import api, { isNetworkError, isCORSError, getAuthErrorType } from '../lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  loadingMessage: string | null;
  error: Error | null;
  sessionPersistent: boolean | null;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  clearError: () => void;
  resetAuthState: () => void;
  validateSessionPersistence: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [sessionPersistent, setSessionPersistent] = useState<boolean | null>(null);
  const [isShowingToast, setIsShowingToast] = useState(false);
  const router = useRouter();

  // Enhanced loading state management
  const setLoadingState = useCallback((loading: boolean, message?: string) => {
    setLoading(loading);
    setLoadingMessage(loading ? message || null : null);
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Loading: ${loading}, Message: ${message || 'none'}`);
    }
  }, []);

  // Robust error handling that doesn't immediately logout
  const handleApiError = useCallback((err: any, context: string) => {
    const errorType = getAuthErrorType(err);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 ${context} error type:`, errorType, err);
    }

    switch (errorType) {
      case 'network':
        setError(new Error('Network connection issue. Please check your internet connection.'));
        break;
      case 'cors':
        setError(new Error('Security policy blocks this connection'));
        break;
      case 'expired':
      case 'invalid':
        setUser(null);
        setError(new Error('Session expired. Please login again.'));
        break;
      default:
        setError(err);
        break;
    }
  }, []);

  // Simplified user fetching with robust error handling
  const fetchUser = useCallback(async (showToast: boolean = false) => {
    try {
      setLoadingState(true, 'Loading user profile...');
      setError(null);
      
      const { data } = await api.get('/users/profile');
      
      const userData = (data as any).data || (data as any).user || data;
      
      if (!userData || !(userData as any).id) {
        throw new Error('Invalid user data received from server');
      }
      
      setUser(userData as IUser);
      setSessionPersistent(true);
      
      if (showToast && !isShowingToast) {
        setIsShowingToast(true);
        toast.success('Session restored successfully');
        setTimeout(() => setIsShowingToast(false), 1000);
      }
      
    } catch (err: any) {
      handleApiError(err, 'fetchUser');
      
      const errorType = getAuthErrorType(err);
      if (errorType === 'expired' || errorType === 'invalid') {
        setSessionPersistent(false);
        setUser(null);
      } else {
        setSessionPersistent(null);
      }
    } finally {
      setLoadingState(false);
    }
  }, [setLoadingState, handleApiError, isShowingToast]);

  // Initial load with retry mechanism
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 2;
    
    const tryFetchUser = async () => {
      try {
        await fetchUser();
      } catch (err) {
        if (retryCount < maxRetries && isNetworkError(err)) {
          retryCount++;
          console.log(`Retrying user fetch (${retryCount}/${maxRetries})...`);
          setTimeout(tryFetchUser, 1000 * retryCount);
        } else {
          setLoadingState(false);
        }
      }
    };
    
    tryFetchUser();
  }, [fetchUser, setLoadingState]);

  // Enhanced error state management
  const resetAuthState = useCallback(() => {
    setError(null);
    setIsShowingToast(false);
    setLoadingState(false);
    console.log('🔄 Auth state reset');
  }, [setLoadingState]);

  // Simplified login with better error handling
  const login = async (emailOrUsername: string, password: string) => {
    try {
      resetAuthState();
      setLoadingState(true, 'Authenticating...');
      
      console.log('🔐 Starting login attempt...');

      const { data } = await api.post('/auth/login', { emailOrUsername, password });
      
      const userData = (data as any).data?.user || (data as any).user || data;
      
      if (!userData || !(userData as any).id) {
        throw new Error('Invalid login response from server');
      }
      
      setUser(userData as IUser);
      setSessionPersistent(true);
      
      if (!isShowingToast) {
        setIsShowingToast(true);
        toast.success('Login successful!');
        setTimeout(() => setIsShowingToast(false), 1000);
      }
      
      const userRole = (userData as any).role;
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      
    } catch (err: any) {
      if (!isShowingToast) {
        setIsShowingToast(true);
        
        const errorType = getAuthErrorType(err);
        switch (errorType) {
          case 'network':
            toast.error('Connection failed. Please check your internet.');
            break;
          case 'cors':
            toast.error('Connection blocked by security policy');
            break;
          default:
            toast.error((err.response?.data as any)?.message || 'Login failed');
            break;
        }
        
        setTimeout(() => setIsShowingToast(false), 2000);
      }
      
      handleApiError(err, 'login');
      throw err;
    } finally {
      setLoadingState(false);
    }
  };

  // Simplified register with better error handling
  const register = async (name: string, username: string, email: string, password: string) => {
    try {
      resetAuthState();
      setLoadingState(true, 'Creating your account...');
      
      console.log('📝 Starting registration attempt...');

      const { data } = await api.post('/auth/register', { name, username, email, password });
      
      const userData = (data as any).data?.user || (data as any).user || data;
      
      if (!userData || !(userData as any).id) {
        throw new Error('Invalid registration response from server');
      }
      
      setUser(userData as IUser);
      setSessionPersistent(true);
      
      if (!isShowingToast) {
        setIsShowingToast(true);
        toast.success('Registration successful!');
        setTimeout(() => setIsShowingToast(false), 1000);
      }
      
      const userRole = (userData as any).role;
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      
    } catch (err: any) {
      if (!isShowingToast) {
        setIsShowingToast(true);
        
        const errorType = getAuthErrorType(err);
        switch (errorType) {
          case 'network':
            toast.error('Connection failed. Please check your internet.');
            break;
          case 'cors':
            toast.error('Connection blocked by security policy');
            break;
          default:
            toast.error((err.response?.data as any)?.message || 'Registration failed');
            break;
        }
        
        setTimeout(() => setIsShowingToast(false), 2000);
      }
      
      handleApiError(err, 'register');
      throw err;
    } finally {
      setLoadingState(false);
    }
  };

  // Enhanced logout with proper backend call
  const logout = async () => {
    try {
      setLoadingState(true, 'Logging out...');
      
      await api.post('/auth/logout');
      
      console.log('✅ Backend logout successful');
    } catch (err: any) {
      console.error('Backend logout error (proceeding anyway):', err);
      
      if ((err.response as any)?.status !== 401) {
        toast.error('Logout warning: Session may not be fully cleared');
      }
    } finally {
      setUser(null);
      setSessionPersistent(false);
      setLoadingState(false);
      
      router.push('/');
      toast.success('Logged out successfully');
    }
  };

  // Enhanced error clearing
  const clearError = useCallback(() => {
    setError(null);
    console.log('🧹 Error state cleared');
  }, []);

  // Improved session persistence validation
  const validateSessionPersistence = useCallback(async (): Promise<boolean> => {
    try {
      setLoadingState(true, 'Validating session...');
      
      await api.get('/users/profile');
      
      setSessionPersistent(true);
      console.log('✅ Session persistence validated');
      
      if (!isShowingToast) {
        setIsShowingToast(true);
        toast.success('Session validated successfully');
        setTimeout(() => setIsShowingToast(false), 1000);
      }
      
      return true;
    } catch (err: any) {
      const errorType = getAuthErrorType(err);
      
      if (errorType === 'expired' || errorType === 'invalid') {
        setSessionPersistent(false);
        setUser(null);
        
        if (!isShowingToast) {
          setIsShowingToast(true);
          toast.error('Session validation failed - please login again');
          setTimeout(() => setIsShowingToast(false), 1000);
        }
        
        return false;
      } else {
        console.log('⚠️ Session validation inconclusive due to:', errorType);
        setSessionPersistent(null);
        
        if (!isShowingToast) {
          setIsShowingToast(true);
          toast('Unable to validate session - network issue');
          setTimeout(() => setIsShowingToast(false), 1000);
        }
        
        return false;
      }
    } finally {
      setLoadingState(false);
    }
  }, [setLoadingState, isShowingToast]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        loading, 
        loadingMessage,
        error,
        sessionPersistent,
        login, 
        register,
        logout, 
        refetchUser: () => fetchUser(true),
        clearError,
        resetAuthState,
        validateSessionPersistence
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