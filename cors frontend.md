# Frontend CORS Implementation for SecurityX Blog

## Context
You are implementing frontend CORS handling for the SecurityX blog application. The frontend is a Next.js 14 application that communicates with an Express.js backend API. The application uses JWT authentication with cookies and needs proper CORS configuration to work across different environments (development, staging, production).

## Current State
- Frontend: Next.js 14 with TypeScript
- API Client: Axios with basic configuration
- Authentication: JWT tokens stored in cookies
- Deployment: Netlify (`https://sec-x.netlify.app`) and Vercel (`https://sec-x.vercel.app`)

## Implementation Tasks

### Task 1: Enhanced Axios Configuration with CORS Support

**Update file: `lib/api.ts`**

```typescript
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Custom error class for CORS issues
export class CORSError extends Error {
  constructor(public origin: string, public allowedOrigins?: string[]) {
    super(`CORS Error: Origin ${origin} is not allowed`);
    this.name = 'CORSError';
  }
}

// Create axios instance with comprehensive configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 30000, // 30 seconds
  withCredentials: true, // CRITICAL: Always send cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for auth and logging
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token from cookie
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token if available
    const csrfToken = Cookies.get('csrf-token');
    if (csrfToken && config.headers) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        withCredentials: config.withCredentials,
      });
    }

    return config;
  },
  (error) => {
    console.error('[API] Request setup error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
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
        
        // Create custom CORS error
        const corsError = new CORSError(
          errorData.error.origin || window.location.origin,
          errorData.error.allowedOrigins
        );

        // Show user-friendly error message
        toast.error('Connection blocked: This domain is not authorized to access the API');
        
        // Redirect to CORS error page if critical
        if (window.location.pathname !== '/cors-error') {
          window.location.href = '/cors-error';
        }
        
        return Promise.reject(corsError);
      }
    }

    // Handle network errors (possible CORS issues)
    if (!error.response && error.message === 'Network Error') {
      console.error('[Network Error] Possible CORS issue:', error);
      
      // Check if it's likely a CORS issue
      if (process.env.NODE_ENV === 'development') {
        toast.error(
          'Network Error: Check if backend is running and CORS is configured correctly'
        );
      } else {
        toast.error('Unable to connect to the server. Please try again later.');
      }
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear auth tokens
      Cookies.remove('token');
      
      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session=expired';
      }
    }

    // Log all errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config,
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

export default api;
```

### Task 2: Update Authentication Context for CORS

**Update file: `context/AuthContext.tsx`**

```typescript
"use client";

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie';
import api, { isCORSError } from '../lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'reader';
  avatar?: string;
}

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
      if (data.data.token) {
        Cookies.set('token', data.data.token, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }

      setUser(data.data.user);
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
```

### Task 3: Create CORS Error Page

**Create file: `app/cors-error/page.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, ExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { testCORS } from '@/lib/api';

export default function CORSErrorPage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [corsDetails, setCorsDetails] = useState<any>(null);

  useEffect(() => {
    // Try to get CORS details on mount
    testCORSConnection();
  }, []);

  const testCORSConnection = async () => {
    setIsRetrying(true);
    try {
      const result = await testCORS();
      setCorsDetails(result);
      // If test succeeds, redirect back
      window.location.href = '/';
    } catch (error: any) {
      console.error('CORS test failed:', error);
      setCorsDetails({
        error: true,
        origin: window.location.origin,
        message: error.message
      });
    } finally {
      setIsRetrying(false);
    }
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-red-500/20">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-red-500/10 rounded-full">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-4">
            Connection Blocked
          </h1>
          
          <p className="text-gray-300 text-center mb-8">
            The application cannot connect to the backend server due to security restrictions (CORS policy).
          </p>

          {/* Technical Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                Technical Details
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-500">Current Origin:</span>
                  <span className="text-cyan-400 ml-2 font-mono">{currentOrigin}</span>
                </div>
                <div>
                  <span className="text-gray-500">API URL:</span>
                  <span className="text-cyan-400 ml-2 font-mono">{apiUrl}</span>
                </div>
                {corsDetails?.error && (
                  <div>
                    <span className="text-gray-500">Error:</span>
                    <span className="text-red-400 ml-2 font-mono">{corsDetails.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={testCORSConnection}
              disabled={isRetrying}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 
                       disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg 
                       transition duration-200 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-5 w-5 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry Connection'}
            </button>

            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 
                       text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              <ExternalLink className="h-5 w-5" />
              Go to Homepage
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">
              What does this mean?
            </h3>
            <p className="text-sm text-gray-300">
              This error occurs when the frontend and backend are hosted on different domains 
              and the backend hasn't authorized this domain. This is a security feature that 
              prevents unauthorized websites from accessing the API.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-sm text-gray-400 mt-2">
                <strong>For developers:</strong> Ensure the backend CORS configuration includes 
                <code className="mx-1 px-2 py-1 bg-gray-800 rounded text-xs">{currentOrigin}</code>
                in the allowed origins list.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Task 4: Create CORS Status Component

**Create file: `app/components/CORSStatus.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'react-icons/fi';
import api from '@/lib/api';

interface CORSStatusProps {
  className?: string;
  showDetails?: boolean;
}

export default function CORSStatus({ className = '', showDetails = false }: CORSStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    checkCORSStatus();
  }, []);

  const checkCORSStatus = async () => {
    try {
      const response = await api.get('/cors-debug/test');
      setStatus('connected');
      setDetails(response.data);
    } catch (error) {
      setStatus('error');
      setDetails({ error: error.message });
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader className="h-4 w-4 animate-spin text-gray-400" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking connection...';
      case 'connected':
        return 'API Connected';
      case 'error':
        return 'Connection Error';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getStatusIcon()}
      <span className="text-sm text-gray-300">{getStatusText()}</span>
      
      {showDetails && details && status !== 'checking' && (
        <div className="ml-4 text-xs text-gray-500">
          {status === 'connected' ? (
            <span>Origin: {details.origin || 'Direct'}</span>
          ) : (
            <span className="text-red-400">CORS blocked</span>
          )}
        </div>
      )}
    </div>
  );
}
```

### Task 5: Update Environment Configuration

**Update file: `.env.local`**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_CORS_DEBUG=true
NEXT_PUBLIC_SHOW_API_ERRORS=true
```

**Create file: `.env.production`**

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_APP_URL=https://sec-x.netlify.app

# Feature Flags
NEXT_PUBLIC_ENABLE_CORS_DEBUG=false
NEXT_PUBLIC_SHOW_API_ERRORS=false
```

### Task 6: Add CORS Testing Utilities

**Create file: `utils/corsUtils.ts`**

```typescript
import api from '@/lib/api';

export interface CORSTestResult {
  success: boolean;
  origin: string;
  headers: Record<string, string>;
  error?: string;
}

// Test basic CORS connectivity
export const testBasicCORS = async (): Promise<CORSTestResult> => {
  try {
    const response = await api.get('/cors-debug/test');
    return {
      success: true,
      origin: response.data.origin || window.location.origin,
      headers: response.data.headers || {}
    };
  } catch (error: any) {
    return {
      success: false,
      origin: window.location.origin,
      headers: {},
      error: error.message
    };
  }
};

// Test authenticated CORS request
export const testAuthCORS = async (): Promise<CORSTestResult> => {
  try {
    const response = await api.get('/cors-debug/test-auth');
    return {
      success: true,
      origin: response.data.origin || window.location.origin,
      headers: response.data.headers || {}
    };
  } catch (error: any) {
    return {
      success: false,
      origin: window.location.origin,
      headers: {},
      error: error.message
    };
  }
};

// Test preflight request simulation
export const testPreflightCORS = async (): Promise<boolean> => {
  try {
    // Make a request that triggers preflight
    const response = await api.post('/cors-debug/test', { test: true }, {
      headers: {
        'X-Custom-Header': 'test'
      }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Get current CORS configuration (admin only)
export const getCORSConfig = async () => {
  try {
    const response = await api.get('/cors-debug/config');
    return response.data;
  } catch (error) {
    console.error('Failed to get CORS config:', error);
    return null;
  }
};
```

### Task 7: Create Development CORS Dashboard

**Create file: `app/admin/cors-dashboard/page.tsx`**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, RefreshCw, Globe } from 'react-icons/fi';
import { 
  testBasicCORS, 
  testAuthCORS, 
  testPreflightCORS, 
  getCORSConfig 
} from '@/utils/corsUtils';
import { useAuth } from '@/context/AuthContext';

export default function CORSDashboard() {
  const { user } = useAuth();
  const [tests, setTests] = useState({
    basic: { status: 'pending', result: null },
    auth: { status: 'pending', result: null },
    preflight: { status: 'pending', result: null }
  });
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Only allow admin access
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>This page is restricted to administrators only.</p>
        </div>
      </div>
    );
  }

  const runAllTests = async () => {
    setIsLoading(true);

    // Test basic CORS
    setTests(prev => ({ ...prev, basic: { status: 'testing', result: null } }));
    const basicResult = await testBasicCORS();
    setTests(prev => ({ 
      ...prev, 
      basic: { 
        status: basicResult.success ? 'success' : 'error', 
        result: basicResult 
      } 
    }));

    // Test authenticated CORS
    setTests(prev => ({ ...prev, auth: { status: 'testing', result: null } }));
    const authResult = await testAuthCORS();
    setTests(prev => ({ 
      ...prev, 
      auth: { 
        status: authResult.success ? 'success' : 'error', 
        result: authResult 
      } 
    }));

    // Test preflight
    setTests(prev => ({ ...prev, preflight: { status: 'testing', result: null } }));
    const preflightResult = await testPreflightCORS();
    setTests(prev => ({ 
      ...prev, 
      preflight: { 
        status: preflightResult ? 'success' : 'error', 
        result: { success: preflightResult } 
      } 
    }));

    // Get CORS config
    const corsConfig = await getCORSConfig();
    setConfig(corsConfig);

    setIsLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <div className="h-5 w-5 rounded-full bg-gray-600" />;
      case 'testing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-500" />
            CORS Configuration Dashboard
          </h1>
          <p className="text-gray-400">
            Monitor and test Cross-Origin Resource Sharing configuration
          </p>
        </div>

        {/* Current Origin Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Current Origin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400">Frontend Origin:</span>
              <code className="ml-2 text-cyan-400">{window.location.origin}</code>
            </div>
            <div>
              <span className="text-gray-400">API URL:</span>
              <code className="ml-2 text-cyan-400">
                {process.env.NEXT_PUBLIC_API_URL}
              </code>
            </div>
          </div>
        </div>

        {/* CORS Tests */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">CORS Tests</h2>
            <button
              onClick={runAllTests}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 
                       text-white rounded-lg flex items-center gap-2 transition"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Run All Tests
            </button>
          </div>

          <div className="space-y-4">
            {/* Basic CORS Test */}
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(tests.basic.status)}
                <div>
                  <h3 className="text-white font-medium">Basic CORS Test</h3>
                  <p className="text-sm text-gray-400">
                    Tests unauthenticated cross-origin request
                  </p>
                </div>
              </div>
              {tests.basic.result && (
                <code className="text-xs text-gray-400">
                  Origin: {tests.basic.result.origin}
                </code>
              )}
            </div>

            {/* Authenticated CORS Test */}
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(tests.auth.status)}
                <div>
                  <h3 className="text-white font-medium">Authenticated CORS Test</h3>
                  <p className="text-sm text-gray-400">
                    Tests cross-origin request with credentials
                  </p>
                </div>
              </div>
              {tests.auth.result?.error && (
                <code className="text-xs text-red-400">
                  {tests.auth.result.error}
                </code>
              )}
            </div>

            {/* Preflight Test */}
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(tests.preflight.status)}
                <div>
                  <h3 className="text-white font-medium">Preflight Request Test</h3>
                  <p className="text-sm text-gray-400">
                    Tests OPTIONS preflight request handling
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CORS Configuration */}
        {config && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Current CORS Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Allowed Origins
                </h3>
                <div className="space-y-2">
                  {config.data?.corsConfig?.allowedOrigins?.map((origin: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                      <code className="text-sm text-cyan-400">{origin.url}</code>
                      <span className="text-xs text-gray-500">
                        {origin.environment} - {origin.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Credentials:</span>
                  <span className="ml-2 text-white">
                    {config.data?.corsConfig?.credentials ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Max Age:</span>
                  <span className="ml-2 text-white">
                    {config.data?.corsConfig?.maxAge} seconds
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Task 8: Update Package.json Scripts

**Update file: `package.json`**

Add these scripts for CORS testing:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "cors:test": "node -e \"require('./utils/corsTest.js')\"",
    "cors:test:prod": "NEXT_PUBLIC_API_URL=https://your-backend.com/api npm run cors:test"
  }
}
```

### Task 9: Create Browser CORS Test Script

**Create file: `utils/corsTest.js`**

```javascript
// Simple Node.js script to test CORS from command line
const https = require('https');
const http = require('http');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

console.log(`Testing CORS from origin: ${ORIGIN} to API: ${API_URL}`);

const url = new URL(`${API_URL}/cors-debug/test`);
const client = url.protocol === 'https:' ? https : http;

const options = {
  hostname: url.hostname,
  port: url.port,
  path: url.pathname,
  method: 'OPTIONS',
  headers: {
    'Origin': ORIGIN,
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type,Authorization'
  }
};

const req = client.request(options, (res) => {
  console.log(`\nPreflight Response Status: ${res.statusCode}`);
  console.log('\nCORS Headers:');
  console.log('Access-Control-Allow-Origin:', res.headers['access-control-allow-origin'] || 'NOT SET');
  console.log('Access-Control-Allow-Credentials:', res.headers['access-control-allow-credentials'] || 'NOT SET');
  console.log('Access-Control-Allow-Methods:', res.headers['access-control-allow-methods'] || 'NOT SET');
  console.log('Access-Control-Allow-Headers:', res.headers['access-control-allow-headers'] || 'NOT SET');
  console.log('Access-Control-Max-Age:', res.headers['access-control-max-age'] || 'NOT SET');
  
  if (res.statusCode === 200 || res.statusCode === 204) {
    console.log('\n✅ CORS preflight test PASSED');
  } else {
    console.log('\n❌ CORS preflight test FAILED');
  }
});

req.on('error', (e) => {
  console.error(`\n❌ Connection error: ${e.message}`);
});

req.end();
```

## Testing Instructions

### 1. Development Testing

```bash
# Start the frontend
npm run dev

# Test CORS connectivity
npm run cors:test

# Check in browser console
# Open http://localhost:3000 and run:
await testCORS()
```

### 2. Test Different Scenarios

```javascript
// In browser console at http://localhost:3000

// Test basic CORS
const testBasic = await fetch('http://localhost:8080/api/cors-debug/test', {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
});
console.log('Basic:', testBasic.status, await testBasic.json());

// Test with auth
const testAuth = await fetch('http://localhost:8080/api/cors-debug/test-auth', {
  credentials: 'include',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});
console.log('Auth:', testAuth.status);

// Test preflight
const testPreflight = await fetch('http://localhost:8080/api/blogs', {
  method: 'POST',
  credentials: 'include',
  headers: { 
    'Content-Type': 'application/json',
    'X-Custom-Header': 'test'
  },
  body: JSON.stringify({ test: true })
});
console.log('Preflight:', testPreflight.status);
```

### 3. Production Testing Checklist

- [ ] Deploy frontend to Netlify/Vercel
- [ ] Test from production URL
- [ ] Verify cookies are being sent/received
- [ ] Check auth flow works correctly
- [ ] Test error scenarios
- [ ] Monitor browser console for CORS errors
- [ ] Check Network tab for failed requests

## Common Issues and Solutions

### Issue: "The request client is not a secure context"
- Ensure HTTPS in production
- Set `secure: true` for cookies only in production

### Issue: "Cookies not being sent"
- Verify `withCredentials: true` in axios
- Check `sameSite` cookie attribute
- Ensure matching protocols (both HTTP or both HTTPS)

### Issue: "Network Error" with no details
- Often a CORS issue
- Check browser console for CORS errors
- Verify backend is running and accessible

### Issue: "Failed to fetch" errors
- Check if backend URL is correct
- Verify no typos in environment variables
- Ensure backend CORS allows your frontend origin

## Production Deployment Notes

1. **Update environment variables** in Netlify/Vercel:
   - Set `NEXT_PUBLIC_API_URL` to production backend URL
   - Set `NEXT_PUBLIC_APP_URL` to production frontend URL

2. **Verify HTTPS** is enabled on both frontend and backend

3. **Test authentication flow** from production domain

4. **Monitor errors** using browser developer tools

5. **Set up error tracking** (e.g., Sentry) to catch CORS issues in production

This implementation provides comprehensive CORS handling on the frontend with proper error management, testing utilities, and debugging tools.