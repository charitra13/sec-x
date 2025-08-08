'use client';

import { useEffect, useState } from 'react';
import { FiAlertCircle, FiRefreshCw, FiExternalLink, FiCheckCircle, FiWifi, FiServer, FiSettings } from 'react-icons/fi';
import Link from 'next/link';
import { testCORS } from '@/lib/api';
import toast from 'react-hot-toast';

interface TroubleshootingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  action?: () => Promise<void>;
}

export default function CORSErrorPage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [corsDetails, setCorsDetails] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(false);
  const [troubleshootingSteps, setTroubleshootingSteps] = useState<TroubleshootingStep[]>([
    {
      id: 'network',
      title: 'Network Connectivity',
      description: 'Testing basic internet connection',
      status: 'pending',
      action: testNetworkConnectivity
    },
    {
      id: 'dns',
      title: 'DNS Resolution',
      description: 'Verifying domain name resolution',
      status: 'pending',
      action: testDNSResolution
    },
    {
      id: 'cors',
      title: 'CORS Configuration',
      description: 'Testing cross-origin resource sharing',
      status: 'pending',
      action: testCORSConfiguration
    },
    {
      id: 'backend',
      title: 'Backend Health',
      description: 'Checking backend server status',
      status: 'pending',
      action: testBackendHealth
    }
  ]);

  useEffect(() => {
    // Try to get CORS details on mount
    testCORSConnection();
  }, []);

  // Auto-retry mechanism
  useEffect(() => {
    if (autoRetryEnabled && retryCount < 5) {
      const timer = setTimeout(() => {
        runDiagnostics();
      }, 10000); // Retry every 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [autoRetryEnabled, retryCount, runDiagnostics]);

  // Individual troubleshooting functions
  async function testNetworkConnectivity(): Promise<void> {
    try {
      const response = await fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors',
        cache: 'no-cache'
      });
      updateStepStatus('network', 'success');
    } catch (error) {
      updateStepStatus('network', 'failed');
      throw new Error('Network connectivity failed');
    }
  }

  async function testDNSResolution(): Promise<void> {
    try {
      const apiDomain = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').hostname;
      // Try to resolve the API domain
      await fetch(`https://${apiDomain}`, { mode: 'no-cors', cache: 'no-cache' });
      updateStepStatus('dns', 'success');
    } catch (error) {
      updateStepStatus('dns', 'failed');
      throw new Error('DNS resolution failed');
    }
  }

  async function testCORSConfiguration(): Promise<void> {
    try {
      const result = await testCORS();
      setCorsDetails(result);
      updateStepStatus('cors', 'success');
    } catch (error: any) {
      setCorsDetails({
        error: true,
        origin: window.location.origin,
        message: error.message
      });
      updateStepStatus('cors', 'failed');
      throw error;
    }
  }

  async function testBackendHealth(): Promise<void> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        updateStepStatus('backend', 'success');
      } else {
        updateStepStatus('backend', 'failed');
        throw new Error(`Backend returned status: ${response.status}`);
      }
    } catch (error) {
      updateStepStatus('backend', 'failed');
      throw new Error('Backend health check failed');
    }
  }

  const updateStepStatus = (stepId: string, status: TroubleshootingStep['status']) => {
    setTroubleshootingSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const runDiagnostics = useCallback(async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Reset all steps
    setTroubleshootingSteps(prev => 
      prev.map(step => ({ ...step, status: 'pending' }))
    );

    for (const step of troubleshootingSteps) {
      if (step.action) {
        try {
          updateStepStatus(step.id, 'running');
          await step.action();
          await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
        } catch (error) {
          console.error(`Step ${step.id} failed:`, error);
          // Continue with other steps even if one fails
        }
      }
    }

    // Check if all critical steps passed
    const criticalSteps = ['network', 'cors'];
    const allCriticalPassed = criticalSteps.every(stepId => 
      troubleshootingSteps.find(step => step.id === stepId)?.status === 'success'
    );

    if (allCriticalPassed) {
      toast.success('Connection restored! Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }

    setIsRetrying(false);
  }, [troubleshootingSteps]);

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

          {/* Enhanced Troubleshooting Steps */}
          <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-300">
                🔍 Diagnostic Tests
              </h3>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoRetryEnabled}
                    onChange={(e) => setAutoRetryEnabled(e.target.checked)}
                    className="rounded"
                  />
                  Auto-retry ({retryCount}/5)
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              {troubleshootingSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex-shrink-0">
                    {step.status === 'pending' && (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-500"></div>
                    )}
                    {step.status === 'running' && (
                      <FiRefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />
                    )}
                    {step.status === 'success' && (
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {step.status === 'failed' && (
                      <FiAlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {step.id === 'network' && <FiWifi className="h-4 w-4 text-gray-400" />}
                      {step.id === 'dns' && <FiSettings className="h-4 w-4 text-gray-400" />}
                      {step.id === 'cors' && <FiAlertCircle className="h-4 w-4 text-gray-400" />}
                      {step.id === 'backend' && <FiServer className="h-4 w-4 text-gray-400" />}
                      <h4 className="text-sm font-medium text-white">{step.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {step.status === 'success' && (
                      <span className="text-xs text-green-400 font-medium">✓ Passed</span>
                    )}
                    {step.status === 'failed' && (
                      <span className="text-xs text-red-400 font-medium">✗ Failed</span>
                    )}
                    {step.status === 'running' && (
                      <span className="text-xs text-yellow-400 font-medium">Testing...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={runDiagnostics}
              disabled={isRetrying}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 
                       disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg 
                       transition duration-200 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`h-5 w-5 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Running Diagnostics...' : 'Run Full Diagnostics'}
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

          {/* Enhanced Help Text */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">
                🤔 What does this mean?
              </h3>
              <p className="text-sm text-gray-300">
                This error occurs when the frontend and backend are hosted on different domains 
                and the backend hasn&apos;t authorized this domain. This is a security feature that 
                prevents unauthorized websites from accessing the API.
              </p>
            </div>

            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <h3 className="text-sm font-semibold text-yellow-400 mb-2">
                🛠️ Troubleshooting Steps
              </h3>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Clear your browser cache and cookies</li>
                <li>Disable browser extensions temporarily</li>
                <li>Try accessing the site in incognito/private mode</li>
                <li>Check if other websites are working</li>
              </ol>
            </div>

            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <h3 className="text-sm font-semibold text-green-400 mb-2">
                📞 Still having issues?
              </h3>
              <p className="text-sm text-gray-300 mb-2">
                If the problem persists, this might be a temporary server issue. 
                You can:
              </p>
              <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                <li>Wait a few minutes and try again</li>
                <li>Contact our support team</li>
                <li>Check our status page for known issues</li>
              </ul>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <h3 className="text-sm font-semibold text-red-400 mb-2">
                  👨‍💻 For Developers
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  Ensure the backend CORS configuration includes this origin in the allowed list:
                </p>
                <code className="block px-3 py-2 bg-gray-800 rounded text-xs text-cyan-400 font-mono">
                  {currentOrigin}
                </code>
                <p className="text-sm text-gray-400 mt-2">
                  Check the server logs for more detailed error information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 