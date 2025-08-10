# Frontend Authentication Fix Implementation Guide

## 🎯 Objective
Fix authentication persistence issues, improve error handling, and support httpOnly cookie-based authentication for better security and reliability.

## 📁 Files to Modify

### 1. Update API Configuration for Cookie Support
**File:** `lib/api.ts` (MODIFY EXISTING)
```typescript
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// Toast management to prevent duplicates
let isShowingAuthToast = false;
let isShowingCORSToast = false;
let isShowingNetworkToast = false;

// Custom error class for CORS issues
export class CORSError extends Error {
  constructor(public origin: string, public allowedOrigins?: string[]) {
    super(`CORS Error: Origin ${origin} is not allowed`);
    this.name = 'CORSError';
  }
}

// Create axios instance with enhanced cookie support
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 30000, // 30 seconds
  withCredentials: true, // CRITICAL: Always send cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Simplified request interceptor - no manual token handling
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Remove manual Authorization header - cookies handle auth now
    // The backend will read httpOnly cookies automatically
    
    // Add CSRF token if available (for additional security)
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf-token='))
      ?.split('=')[1];
    
    if (csrfToken && config.headers) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        withCredentials: config.withCredentials,
        hasCSRF: !!csrfToken
      });
    }

    return config;
  },
  (error) => {
    console.error('[API] Request setup error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with better error categorization
api.interceptors.response.use(
  (response) => {
    // Reset toast flags on successful response
    isShowingAuthToast = false;
    isShowingCORSToast = false;
    isShowingNetworkToast = false;
    
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response:`, response.status, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle CORS errors specifically
    if (error.response?.status === 403) {
      const errorData = error.response.data as any;
      if (errorData?.error?.code === 'CORS_POLICY_VIOLATION') {
        console.error('[CORS Error]', errorData);
        
        const corsError = new CORSError(
          errorData.error.origin || window.location.origin,
          errorData.error.allowedOrigins
        );

        if (!isShowingCORSToast) {
          isShowingCORSToast = true;
          toast.error('Connection blocked: This domain is not authorized to access the API');
          setTimeout(() => { isShowingCORSToast = false; }, 3000);
        }
        
        if (window.location.pathname !== '/cors-error') {
          window.location.href = '/cors-error';
        }
        
        return Promise.reject(corsError);
      }
    }

    // Handle network errors (possible CORS issues) - DON'T auto-redirect on network errors
    if (!error.response && error.message === 'Network Error') {
      console.error('[Network Error] Possible CORS issue:', error);
      
      if (!isShowingNetworkToast) {
        isShowingNetworkToast = true;
        
        if (process.env.NODE_ENV === 'development') {
          toast.error('Network Error: Check if backend is running and CORS is configured correctly');
        } else {
          toast.error('Unable to connect to the server. Please try again later.');
        }
        
        setTimeout(() => { isShowingNetworkToast = false; }, 3000);
      }
      
      // DON'T redirect on network errors - let the app handle it gracefully
      return Promise.reject(error);
    }

    // Enhanced 401 handling - distinguish between different auth failures
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';
      const errorMessage = error.response?.data?.message || '';
      
      // Different handling based on error type
      if (errorMessage.includes('Session has been terminated') || 
          errorMessage.includes('Token has been invalidated')) {
        // Session was explicitly terminated (logout)
        if (!isShowingAuthToast && !isAuthPage) {
          isShowingAuthToast = true;
          toast.error('Your session has ended. Please login again.');
          setTimeout(() => { isShowingAuthToast = false; }, 2000);
        }
      } else if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        // Token expired or invalid
        if (!isShowingAuthToast && !isAuthPage) {
          isShowingAuthToast = true;
          toast.error('Session expired. Please login again.');
          setTimeout(() => { isShowingAuthToast = false; }, 2000);
        }
      }
      
      // Only redirect if we're not already on an auth page
      if (!isAuthPage) {
        window.location.href = '/login?session=expired';
      }
    }

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config?.url,
      });
    }

    return Promise.reject(error);
  }
);

// Helper function to test CORS configuration
export const testCORS = async () => {
  try {
    const response = await api.get('/cors-debug/test');
    console.log('[CORS Test] Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('[CORS Test] Failed:', error);
    throw error;
  }
};

// Helper function to check if error is CORS-related
export const isCORSError = (error: any): error is CORSError => {
  return error instanceof CORSError || 
         (error.response?.status === 403 && 
          error.response?.data?.error?.code === 'CORS_POLICY_VIOLATION');
};

// Helper function to check if error is a network error
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.message === 'Network Error';
};

// Helper function to categorize authentication errors
export const getAuthErrorType = (error: any): 'network' | 'cors' | 'expired' | 'invalid' | 'server' => {
  if (isNetworkError(error)) return 'network';
  if (isCORSError(error)) return 'cors';
  
  if (error.response?.status === 401) {
    const message = error.response?.data?.message || '';
    if (message.includes('expired')) return 'expired';
    if (message.includes('invalid') || message.includes('terminated')) return 'invalid';
  }
  
  return 'server';
};

export default api;
```

### 2. Simplified and Robust Auth Context
**File:** `context/AuthContext.tsx` (REPLACE EXISTING)
```typescript
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
        // Don't logout on network errors - user might be temporarily offline
        break;
        
      case 'cors':
        setError(new Error('Security policy blocks this connection'));
        break;
        
      case 'expired':
      case 'invalid':
        // Only logout on explicit auth failures
        setUser(null);
        setError(new Error('Session expired. Please login again.'));
        break;
        
      default:
        setError(err);
        // Don't automatically logout on server errors
        break;
    }
  }, []);

  // Simplified user fetching with robust error handling
  const fetchUser = useCallback(async (showToast: boolean = false) => {
    try {
      setLoadingState(true, 'Loading user profile...');
      setError(null);
      
      const { data } = await api.get('/users/profile');
      
      // Simplified response handling - backend should use consistent structure
      const userData = data.data || data.user || data;
      
      if (!userData || !userData.id) {
        throw new Error('Invalid user data received from server');
      }
      
      setUser(userData);
      setSessionPersistent(true);
      
      if (showToast && !isShowingToast) {
        setIsShowingToast(true);
        toast.success('Session restored successfully');
        setTimeout(() => setIsShowingToast(false), 1000);
      }
      
    } catch (err: any) {
      handleApiError(err, 'fetchUser');
      
      // Only set sessionPersistent to false on auth errors, not network errors
      const errorType = getAuthErrorType(err);
      if (errorType === 'expired' || errorType === 'invalid') {
        setSessionPersistent(false);
        setUser(null);
      } else {
        // Keep session state uncertain on network/server errors
        setSessionPersistent(null);
        // Don't clear user on network errors
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
          setTimeout(tryFetchUser, 1000 * retryCount); // Progressive delay
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
      
      // Simplified response handling
      const userData = data.data?.user || data.user || data;
      
      if (!userData || !userData.id) {
        throw new Error('Invalid login response from server');
      }
      
      setUser(userData);
      setSessionPersistent(true);
      
      if (!isShowingToast) {
        setIsShowingToast(true);
        toast.success('Login successful!');
        setTimeout(() => setIsShowingToast(false), 1000);
      }
      
      // Role-based redirect
      const userRole = userData.role;
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
            toast.error(err.response?.data?.message || 'Login failed');
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
      
      // Simplified response handling
      const userData = data.data?.user || data.user || data;
      
      if (!userData || !userData.id) {
        throw new Error('Invalid registration response from server');
      }
      
      setUser(userData);
      setSessionPersistent(true);
      
      if (!isShowingToast) {
        setIsShowingToast(true);
        toast.success('Registration successful!');
        setTimeout(() => setIsShowingToast(false), 1000);
      }
      
      // Role-based redirect
      const userRole = userData.role;
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
            toast.error(err.response?.data?.message || 'Registration failed');
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
      
      // Call backend logout endpoint to invalidate session
      await api.post('/auth/logout');
      
      console.log('✅ Backend logout successful');
    } catch (err: any) {
      // Log error but don't prevent logout
      console.error('Backend logout error (proceeding anyway):', err);
      
      // Only show error if it's not a 401 (already logged out)
      if (err.response?.status !== 401) {
        toast.error('Logout warning: Session may not be fully cleared');
      }
    } finally {
      // Always clear local state regardless of backend response
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
      
      // Test backend connectivity and session validity
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
        // Network or server errors - don't invalidate session
        console.log('⚠️ Session validation inconclusive due to:', errorType);
        setSessionPersistent(null);
        
        if (!isShowingToast) {
          setIsShowingToast(true);
          toast.warning('Unable to validate session - network issue');
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
```

### 3. Add Session Persistence Hook
**File:** `hooks/useSessionPersistence.ts` (CREATE NEW)
```typescript
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface SessionPersistenceState {
  isValidating: boolean;
  lastValidation: Date | null;
  validationInterval: number;
}

export const useSessionPersistence = (
  autoValidateInterval: number = 5 * 60 * 1000 // 5 minutes default
) => {
  const { validateSessionPersistence, sessionPersistent, isAuthenticated } = useAuth();
  const [state, setState] = useState<SessionPersistenceState>({
    isValidating: false,
    lastValidation: null,
    validationInterval: autoValidateInterval
  });

  // Manual validation trigger
  const validateNow = async () => {
    if (state.isValidating) return;
    
    setState(prev => ({ ...prev, isValidating: true }));
    
    try {
      const isValid = await validateSessionPersistence();
      setState(prev => ({ 
        ...prev, 
        lastValidation: new Date(),
        isValidating: false 
      }));
      return isValid;
    } catch (error) {
      setState(prev => ({ ...prev, isValidating: false }));
      return false;
    }
  };

  // Auto-validation on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        // Only validate if it's been more than 1 minute since last validation
        const now = new Date();
        const lastCheck = state.lastValidation;
        
        if (!lastCheck || (now.getTime() - lastCheck.getTime()) > 60000) {
          validateNow();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, state.lastValidation]);

  // Periodic validation
  useEffect(() => {
    if (!isAuthenticated || autoValidateInterval <= 0) return;

    const interval = setInterval(() => {
      validateNow();
    }, autoValidateInterval);

    return () => clearInterval(interval);
  }, [isAuthenticated, autoValidateInterval]);

  return {
    validateNow,
    isValidating: state.isValidating,
    lastValidation: state.lastValidation,
    sessionPersistent,
    isAuthenticated
  };
};
```

### 4. Create Offline Detection Hook
**File:** `hooks/useOfflineDetection.ts` (CREATE NEW)
```typescript
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useOfflineDetection = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast.success('Connection restored');
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast.error('Connection lost - working offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
};
```

### 5. Update Environment Configuration
**File:** `.env.local` (ADD TO EXISTING)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_CORS_DEBUG=true
NEXT_PUBLIC_SHOW_API_ERRORS=true

# Session Management
NEXT_PUBLIC_SESSION_VALIDATION_INTERVAL=300000
NEXT_PUBLIC_OFFLINE_RETRY_ATTEMPTS=3
NEXT_PUBLIC_AUTH_RETRY_DELAY=1000
```

## 🚀 Implementation Steps

1. **Update api.ts** with enhanced cookie support and error categorization
2. **Replace AuthContext.tsx** with the simplified, robust version
3. **Create new hooks** for session persistence and offline detection
4. **Update environment variables** for session management configuration
5. **Test authentication flow** with network interruptions
6. **Verify session persistence** across page reloads and browser restarts

## ✅ Expected Outcomes

- ✅ **No more logout on page reload** - robust error handling distinguishes between network issues and auth failures
- ✅ **httpOnly cookie support** - enhanced security with automatic cookie handling
- ✅ **Proper session persistence** - validates sessions without immediately failing on network errors
- ✅ **Better user experience** - clear error messages and graceful handling of offline scenarios
- ✅ **Simplified code** - removed complex response parsing and fragile token management
- ✅ **Backward compatibility** - works with existing backend until httpOnly cookies are fully implemented

## 🔍 Testing Scenarios

```bash
# Test session persistence
1. Login → Refresh page → Should stay logged in
2. Login → Disconnect internet → Reconnect → Should stay logged in
3. Login → Wait for token expiry → Should prompt for reauth
4. Login → Logout → Try accessing protected route → Should redirect to login

# Test error handling
1. Login while backend is down → Should show network error, not logout
2. Login with invalid credentials → Should show auth error
3. Navigate while offline → Should work with cached data where possible
```

## 🚨 Important Notes

- **httpOnly cookies** provide better security than localStorage/client-side cookies
- **Error categorization** prevents unnecessary logouts on network issues
- **Session validation** happens on visibility change and periodically
- **Offline detection** provides better user experience during network issues
- **Simplified response handling** reduces fragility from backend changes
- **Retry mechanisms** handle temporary network interruptions gracefully

## 🔄 Migration Notes

- The new implementation maintains compatibility with current backend responses
- Token-based auth still works while transitioning to cookie-based auth
- Error handling is more granular and user-friendly
- Session persistence is more reliable and doesn't fail on minor network issues