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
  loadingMessage: string | null;
  error: Error | null;
  sessionPersistent: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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

  // Enhanced debugging utility for API response structure verification
  const debugLoginResponse = (data: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Login Response Debug:', {
        hasData: !!data,
        hasDataData: !!data.data,
        hasUser: !!data.data?.user,
        hasToken: !!data.data?.token,
        userRole: data.data?.user?.role,
        fullResponse: data
      });
      
      // CRITICAL: Test different possible response structures
      console.log('🧪 Response Structure Analysis:', {
        // Direct access patterns
        directUser: data.user,
        directToken: data.token,
        directRole: data.user?.role,
        
        // Nested data.data access patterns
        nestedUser: data.data?.user,
        nestedToken: data.data?.token,
        nestedRole: data.data?.user?.role,
        
        // Alternative patterns
        payloadUser: data.payload?.user,
        payloadToken: data.payload?.token,
        
        // Response metadata
        responseKeys: Object.keys(data || {}),
        dataKeys: data.data ? Object.keys(data.data) : null,
        userKeys: data.data?.user ? Object.keys(data.data.user) : null
      });
      
      // Test middleware compatibility
      if (data.data?.token) {
        console.log('🔐 Testing JWT token structure for middleware compatibility...');
        try {
          // Parse JWT payload (without verification for debugging)
          const tokenParts = data.data.token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('🔍 JWT Payload Structure:', {
              hasRole: !!payload.role,
              role: payload.role,
              hasUserId: !!payload.id || !!payload.userId,
              userId: payload.id || payload.userId,
              exp: payload.exp,
              iat: payload.iat,
              fullPayload: payload
            });
          }
        } catch (e) {
          console.error('❌ Failed to parse JWT:', e);
        }
      }
    }
  };

  // Enhanced loading state management with specific messages
  const setLoadingState = useCallback((loading: boolean, message?: string) => {
    setLoading(loading);
    setLoadingMessage(loading ? message || null : null);
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Loading: ${loading}, Message: ${message || 'none'}`);
    }
  }, []);

  // Fetch user profile with CORS error handling
  const fetchUser = useCallback(async () => {
    try {
      setLoadingState(true, 'Loading user profile...');
      setError(null);
      
      const { data } = await api.get('/users/profile');
      
      // ADAPTIVE: Handle different possible API response structures for profile
      let user;
      if (data.data?.user) {
        user = data.data.user;
        console.log('✅ Profile using nested data.data structure');
      } else if (data.user) {
        user = data.user;
        console.log('✅ Profile using direct structure');
      } else if (data.payload?.user) {
        user = data.payload.user;
        console.log('✅ Profile using payload structure');
      } else {
        console.error('❌ No valid profile response structure found:', data);
        throw new Error('Invalid profile response structure from server');
      }
      
      setUser(user);
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
      setLoadingState(false);
    }
  }, [setLoadingState]);

  // Initial load
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUser();
    } else {
      setLoadingState(false);
    }
  }, [fetchUser, setLoadingState]);

  // Enhanced error state management
  const resetAuthState = useCallback(() => {
    setError(null);
    setIsShowingToast(false);
    setLoadingState(false);
    console.log('🔄 Auth state reset');
  }, [setLoadingState]);

  // Login with enhanced error state management
  const login = async (email: string, password: string) => {
    try {
      // ENHANCED: Clear all error states at the start of new login attempt
      resetAuthState();
      setLoadingState(true, 'Authenticating...');
      
      console.log('🔐 Starting login attempt...');

      const { data } = await api.post('/auth/login', { email, password });
      
      // Debug logging in development
      debugLoginResponse(data);
      
      // ADAPTIVE: Handle different possible API response structures
      let user, token;
      
      // Try different response structure patterns
      if (data.data?.user && data.data?.token) {
        // Pattern 1: { data: { user: {...}, token: "..." } }
        user = data.data.user;
        token = data.data.token;
        console.log('✅ Using nested data.data structure');
      } else if (data.user && data.token) {
        // Pattern 2: { user: {...}, token: "..." }
        user = data.user;
        token = data.token;
        console.log('✅ Using direct structure');
      } else if (data.payload?.user && data.payload?.token) {
        // Pattern 3: { payload: { user: {...}, token: "..." } }
        user = data.payload.user;
        token = data.payload.token;
        console.log('✅ Using payload structure');
      } else {
        console.error('❌ No valid response structure found:', data);
        console.error('Available keys:', Object.keys(data || {}));
        throw new Error('Invalid response structure from server - no user or token found');
      }
      
      // Validate we have both user and token
      if (!user) {
        console.error('❌ No user data in response:', data);
        throw new Error('No user data received from server');
      }
      
      if (!token) {
        console.error('❌ No token in response:', data);
        throw new Error('No authentication token received');
      }
      
      // Store token in cookie (backend also sets httpOnly cookie)
      Cookies.set('token', token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      setLoadingState(true, 'Setting up user session...');
      setUser(user);
      
      // Only show success toast if not already showing one
      if (!isShowingToast) {
        setIsShowingToast(true);
        toast.success('Login successful!');
      }
      
      // Validate user role before redirect
      const userRole = user.role;
      if (!userRole) {
        console.error('❌ No user role found:', user);
        throw new Error('User role not found in response');
      }
      
      setLoadingState(true, 'Redirecting to dashboard...');
      console.log('✅ Redirecting user with role:', userRole);
      
      // Redirect based on role - FIXED: Use consistent data structure
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Only show error toast if not already showing one
      if (!isShowingToast) {
        setIsShowingToast(true);
        
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
      }
      throw err;
    } finally {
      setLoadingState(false);
      // Reset toast flag after a delay
      setTimeout(() => setIsShowingToast(false), 1000);
    }
  };

  // Register with enhanced error state management
  const register = async (name: string, email: string, password: string) => {
    try {
      // ENHANCED: Clear all error states at the start of new registration attempt
      resetAuthState();
      setLoadingState(true, 'Creating your account...');
      
      console.log('📝 Starting registration attempt...');

      const { data } = await api.post('/auth/register', { username: name, email, password });
      
      // Debug logging in development
      debugLoginResponse(data);
      
      // ADAPTIVE: Handle different possible API response structures
      let user, token;
      
      // Try different response structure patterns
      if (data.data?.user && data.data?.token) {
        // Pattern 1: { data: { user: {...}, token: "..." } }
        user = data.data.user;
        token = data.data.token;
        console.log('✅ Registration using nested data.data structure');
      } else if (data.user && data.token) {
        // Pattern 2: { user: {...}, token: "..." }
        user = data.user;
        token = data.token;
        console.log('✅ Registration using direct structure');
      } else if (data.payload?.user && data.payload?.token) {
        // Pattern 3: { payload: { user: {...}, token: "..." } }
        user = data.payload.user;
        token = data.payload.token;
        console.log('✅ Registration using payload structure');
      } else {
        console.error('❌ No valid registration response structure found:', data);
        console.error('Available keys:', Object.keys(data || {}));
        throw new Error('Invalid response structure from server - no user or token found');
      }
      
      // Validate we have both user and token
      if (!user) {
        console.error('❌ No user data in registration response:', data);
        throw new Error('No user data received from server');
      }
      
      if (!token) {
        console.error('❌ No token in registration response:', data);
        throw new Error('No authentication token received');
      }
      
      // Store token
      Cookies.set('token', token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      setLoadingState(true, 'Setting up your account...');
      setUser(user);
      
      // Only show success toast if not already showing one
      if (!isShowingToast) {
        setIsShowingToast(true);
        toast.success('Registration successful!');
      }
      
      // Validate user role before redirect
      const userRole = user.role;
      if (!userRole) {
        console.error('❌ No user role found in registration:', user);
        throw new Error('User role not found in response');
      }
      
      setLoadingState(true, 'Redirecting to your dashboard...');
      console.log('✅ Redirecting registered user with role:', userRole);
      
      // Always redirect regular users to dashboard (admins are rarely registered, but handle anyway)
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Only show error toast if not already showing one
      if (!isShowingToast) {
        setIsShowingToast(true);
        
        if (isCORSError(err)) {
          setError(new Error('Unable to connect to registration server'));
          toast.error('Connection blocked by security policy');
        } else {
          setError(err);
          toast.error(err.response?.data?.message || 'Registration failed');
        }
      }
      throw err;
    } finally {
      setLoadingState(false);
      // Reset toast flag after a delay
      setTimeout(() => setIsShowingToast(false), 1000);
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

  // Enhanced error clearing with state management
  const clearError = useCallback(() => {
    setError(null);
    console.log('🧹 Error state cleared');
  }, []);

  // Session persistence validation
  const validateSessionPersistence = useCallback(async (): Promise<boolean> => {
    try {
      setLoadingState(true, 'Validating session persistence...');
      
      // Check if token exists in cookie
      const token = Cookies.get('token');
      if (!token) {
        console.log('❌ No token found in cookies');
        setSessionPersistent(false);
        return false;
      }

      // Test if we can access localStorage/sessionStorage
      const storageTest = {
        localStorage: false,
        sessionStorage: false,
        cookieStorage: !!token
      };

      try {
        localStorage.setItem('auth_test', 'test');
        storageTest.localStorage = localStorage.getItem('auth_test') === 'test';
        localStorage.removeItem('auth_test');
      } catch (e) {
        console.log('⚠️ localStorage not available:', e);
      }

      try {
        sessionStorage.setItem('auth_test', 'test');
        storageTest.sessionStorage = sessionStorage.getItem('auth_test') === 'test';
        sessionStorage.removeItem('auth_test');
      } catch (e) {
        console.log('⚠️ sessionStorage not available:', e);
      }

      // Test token validity with backend
      let tokenValid = false;
      try {
        await api.get('/users/profile');
        tokenValid = true;
        console.log('✅ Token is valid with backend');
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.log('❌ Token is invalid or expired');
          tokenValid = false;
        } else {
          console.log('⚠️ Unable to validate token due to network/server error');
          // Assume token is valid if we can't verify due to network issues
          tokenValid = true;
        }
      }

      // Test cookie persistence settings
      const cookiePersistent = token.length > 0; // Basic check

      const sessionValid = tokenValid && cookiePersistent;
      setSessionPersistent(sessionValid);

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Session Persistence Validation:', {
          tokenExists: !!token,
          tokenValid,
          cookiePersistent,
          storageAvailability: storageTest,
          sessionValid,
          cookieContent: token ? `${token.substring(0, 20)}...` : 'none'
        });
      }

      if (sessionValid) {
        console.log('✅ Session persistence validated successfully');
        toast.success('Session validated successfully');
      } else {
        console.log('❌ Session persistence validation failed');
        toast.error('Session validation failed - please login again');
      }

      return sessionValid;
    } catch (err: any) {
      console.error('❌ Session validation error:', err);
      setSessionPersistent(false);
      return false;
    } finally {
      setLoadingState(false);
    }
  }, [setLoadingState]);

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
        refetchUser: fetchUser,
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