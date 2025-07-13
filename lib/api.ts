import axios from 'axios';
import Cookies from 'js-cookie';

// Use the environment variable for both client and server-side requests
// This ensures all requests go directly to the backend instead of relying on Next.js rewrites
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // A sensible 10 s timeout prevents hanging requests from showing as generic "Network Error".
  timeout: 10000,
});

// Always send cookies (if any) so authenticated routes work in both dev & prod.
api.defaults.withCredentials = true;

// Interceptor to add JWT token and log outgoing requests (very useful for debugging).
api.interceptors.request.use((config) => {
  // Log the full URL – remove once everything is stable.
  // eslint-disable-next-line no-console
  console.log('[Axios] →', `${config.baseURL}${config.url}`);

  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 