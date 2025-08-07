import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
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

    // Handle network errors (possible CORS issues)
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
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      
      // Clear auth tokens
      Cookies.remove('token');
      
      // Only show auth toast if not already showing and not on login/register pages
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';
      
      if (!isShowingAuthToast && !isAuthPage) {
        isShowingAuthToast = true;
        toast.error('Session expired. Please login again.');
        // Reset flag after delay
        setTimeout(() => { isShowingAuthToast = false; }, 2000);
      }
      
      // Redirect to login
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
          error.response?.data?.error?.code === 'CORS_POLICY_VIOLATION');
};

export default api; 