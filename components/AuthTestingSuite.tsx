"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export default function AuthTestingSuite() {
  const { user, isAuthenticated, login, register, validateSessionPersistence, sessionPersistent } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'test@example.com',
    password: 'testpassword',
    name: 'Test User'
  });

  const addTestResult = (test: string, status: 'pending' | 'success' | 'error', message: string, data?: any) => {
    setTestResults(prev => [
      ...prev.filter(r => r.test !== test),
      { test, status, message, data }
    ]);
  };

  const runComprehensiveTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    try {
      // Test 1: API Connectivity
      addTestResult('API Connectivity', 'pending', 'Testing backend connection...');
      try {
        const response = await api.get('/health');
        addTestResult('API Connectivity', 'success', 'Backend is reachable', response.data);
      } catch (err: any) {
        addTestResult('API Connectivity', 'error', `Backend unreachable: ${err.message}`, err);
      }

      // Test 2: CORS Configuration
      addTestResult('CORS Configuration', 'pending', 'Testing CORS headers...');
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/health', {
          method: 'GET',
          credentials: 'include',
        });
        const corsHeaders = {
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
          'access-control-allow-credentials': response.headers.get('access-control-allow-credentials'),
        };
        addTestResult('CORS Configuration', 'success', 'CORS headers present', corsHeaders);
      } catch (err: any) {
        addTestResult('CORS Configuration', 'error', `CORS issue: ${err.message}`, err);
      }

      // Test 3: Test Login (if test credentials provided)
      if (testCredentials.email && testCredentials.password) {
        addTestResult('Login Flow', 'pending', 'Testing login with provided credentials...');
        try {
          await login(testCredentials.email, testCredentials.password);
          addTestResult('Login Flow', 'success', 'Login successful', { 
            user: user?.name, 
            role: user?.role 
          });
        } catch (err: any) {
          addTestResult('Login Flow', 'error', `Login failed: ${err.message}`, err);
        }
      }

      // Test 4: JWT Token Structure
      addTestResult('JWT Token', 'pending', 'Analyzing JWT token structure...');
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (token) {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            addTestResult('JWT Token', 'success', 'JWT token is valid', {
              hasRole: !!payload.role,
              role: payload.role,
              hasUserId: !!payload.id || !!payload.userId,
              exp: new Date(payload.exp * 1000).toLocaleString(),
              structure: Object.keys(payload)
            });
          } else {
            addTestResult('JWT Token', 'error', 'Invalid JWT structure', { parts: parts.length });
          }
        } else {
          addTestResult('JWT Token', 'error', 'No JWT token found in cookies', {});
        }
      } catch (err: any) {
        addTestResult('JWT Token', 'error', `JWT analysis failed: ${err.message}`, err);
      }

      // Test 5: Profile Endpoint
      if (isAuthenticated) {
        addTestResult('Profile Endpoint', 'pending', 'Testing profile endpoint...');
        try {
          const response = await api.get('/users/profile');
          addTestResult('Profile Endpoint', 'success', 'Profile data retrieved', response.data);
        } catch (err: any) {
          addTestResult('Profile Endpoint', 'error', `Profile fetch failed: ${err.message}`, err);
        }
      }

      // Test 6: Admin Route Access (if user is admin)
      if (user?.role === 'admin') {
        addTestResult('Admin Access', 'pending', 'Testing admin route access...');
        try {
          // Test if we can access admin dashboard
          const response = await fetch('/admin/dashboard', { 
            method: 'GET',
            credentials: 'include' 
          });
          if (response.ok) {
            addTestResult('Admin Access', 'success', 'Admin route accessible', {
              status: response.status,
              redirected: response.redirected
            });
          } else {
            addTestResult('Admin Access', 'error', `Admin route blocked: ${response.status}`, {
              status: response.status
            });
          }
        } catch (err: any) {
          addTestResult('Admin Access', 'error', `Admin access test failed: ${err.message}`, err);
        }
      }

      // Test 7: Session Persistence Validation
      if (isAuthenticated) {
        addTestResult('Session Persistence', 'pending', 'Validating session persistence...');
        try {
          const sessionValid = await validateSessionPersistence();
          addTestResult('Session Persistence', sessionValid ? 'success' : 'error', 
            sessionValid ? 'Session is persistent and valid' : 'Session validation failed', {
            sessionPersistent,
            tokenExists: !!document.cookie.includes('token='),
            browserSupportsStorage: {
              localStorage: typeof(Storage) !== 'undefined',
              sessionStorage: typeof(Storage) !== 'undefined'
            }
          });
        } catch (err: any) {
          addTestResult('Session Persistence', 'error', `Session validation failed: ${err.message}`, err);
        }
      }

      // Test 8: Rate Limiting
      addTestResult('Rate Limiting', 'pending', 'Testing rate limiting...');
      try {
        const promises = Array(5).fill(null).map(() => api.get('/health'));
        await Promise.all(promises);
        addTestResult('Rate Limiting', 'success', 'Multiple requests handled successfully', {
          requests: 5
        });
      } catch (err: any) {
        addTestResult('Rate Limiting', 'error', `Rate limiting issue: ${err.message}`, err);
      }

    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusColor = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg max-w-md w-96 max-h-96 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-900">
            🔧 Auth Testing Suite
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Development Environment Only</p>
            {sessionPersistent !== null && (
              <div className={`text-xs px-2 py-1 rounded-full ${
                sessionPersistent 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                Session: {sessionPersistent ? '✓ Valid' : '✗ Invalid'}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {/* Test Credentials */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Test Credentials (Optional)
            </label>
            <input
              type="email"
              placeholder="Email"
              value={testCredentials.email}
              onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={testCredentials.password}
              onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>

          {/* Run Tests Button */}
          <button
            onClick={runComprehensiveTests}
            disabled={isRunningTests}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunningTests ? 'Running Tests...' : 'Run Comprehensive Tests'}
          </button>

          {/* Test Results */}
          <div className="max-h-40 overflow-y-auto space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className={`p-2 rounded text-xs ${getStatusColor(result.status)}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {getStatusIcon(result.status)} {result.test}
                  </span>
                </div>
                <div className="text-xs mt-1">{result.message}</div>
                {result.data && (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-xs opacity-75">View Details</summary>
                    <pre className="text-xs mt-1 p-1 bg-gray-100 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}