import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

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

// Enhanced request interceptor with Authorization header support
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // CRITICAL: Read token from cookie and send as Authorization header
    // This works cross-origin, unlike httpOnly cookies
    const token = Cookies.get('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Added Authorization header from cookie');
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('❌ No token found in cookies');
    }

    // Keep CSRF support
    try {
      const csrfToken = typeof document !== 'undefined'
        ? document.cookie
            .split('; ')
            .find(row => row.startsWith('csrf-token='))
            ?.split('=')[1]
        : undefined;

      if (csrfToken && config.headers) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    } catch (e) {
      // ignore if document is not available
    }

    // Enhanced development logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        hasAuthToken: !!token,
        withCredentials: config.withCredentials,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
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
        
        // Create custom CORS error
        const corsError = new CORSError(
          errorData.error.origin || window.location.origin,
          errorData.error.allowedOrigins
        );

        // Show user-friendly error message only if not already showing CORS toast
        if (!isShowingCORSToast) {
          isShowingCORSToast = true;
          toast.error('Connection blocked: This domain is not authorized to access the API');
          // Reset flag after delay
          setTimeout(() => { isShowingCORSToast = false; }, 3000);
        }
        
        // Redirect to CORS error page if critical
        if (window.location.pathname !== '/cors-error') {
          window.location.href = '/cors-error';
        }
        
        return Promise.reject(corsError);
      }
    }

    // Handle network errors (possible CORS issues) - DON'T auto-redirect on network errors
    if (!error.response && error.message === 'Network Error') {
      console.error('[Network Error] Possible CORS issue:', error);
      
      // Show network error toast only if not already showing one
      if (!isShowingNetworkToast) {
        isShowingNetworkToast = true;
        
        // Check if it's likely a CORS issue
        if (process.env.NODE_ENV === 'development') {
          toast.error(
            'Network Error: Check if backend is running and CORS is configured correctly'
          );
        } else {
          toast.error('Unable to connect to the server. Please try again later.');
        }
        
        // Reset flag after delay
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
      const errorMessage = (error.response?.data as any)?.message || '';
      
      // Different handling based on error type
      if (errorMessage.includes('Session has been terminated') || 
          errorMessage.includes('Token has been invalidated')) {
        if (!isShowingAuthToast && !isAuthPage) {
          isShowingAuthToast = true;
          toast.error('Your session has ended. Please login again.');
          setTimeout(() => { isShowingAuthToast = false; }, 2000);
        }
      } else if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
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
          (error.response?.data as any)?.error?.code === 'CORS_POLICY_VIOLATION');
};

// Helper function to check if error is a network error
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.message === 'Network Error';
};

// Helper function to categorize authentication errors
export const getAuthErrorType = (
  error: any
): 'network' | 'cors' | 'expired' | 'invalid' | 'server' => {
  if (isNetworkError(error)) return 'network';
  if (isCORSError(error)) return 'cors';
  
  if (error.response?.status === 401) {
    const message: string = (error.response?.data as any)?.message || '';
    if (message.includes('expired')) return 'expired';
    if (message.includes('invalid') || message.includes('terminated')) return 'invalid';
  }
  
  return 'server';
};

export default api; 