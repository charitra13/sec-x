import axios from 'axios';
import Cookies from 'js-cookie';

// Determine the base URL dynamically.  
//  • On the **client** we use a relative `/api` path so the request is always made to the same
//    origin that served the Next.js app (avoids mixed-content errors in production where the
//    site is likely served over HTTPS). A rewrite rule in `next.config.mjs` forwards these
//    requests to the real backend.
//  • On the **server** (SSR / getServerSideProps / Route Handlers) we fall back to the absolute
//    URL supplied via the `NEXT_PUBLIC_API_URL` env-var, or to the local default during
//    development.
const isBrowser = typeof window !== 'undefined';

const api = axios.create({
  baseURL: isBrowser ? '/api' : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
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