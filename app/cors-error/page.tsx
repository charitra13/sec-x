'use client';

import { useEffect, useState } from 'react';
import { FiAlertCircle, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
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
              <FiAlertCircle className="h-12 w-12 text-red-500" />
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
              <FiRefreshCw className={`h-5 w-5 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry Connection'}
            </button>

            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 
                       text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              <FiExternalLink className="h-5 w-5" />
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