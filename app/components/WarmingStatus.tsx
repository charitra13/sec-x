'use client';

import { useServerWarming } from '@/hooks/useServerWarming';

export default function WarmingStatus() {
  const { isWarmingActive, stats, successRate, triggerManualWarm } = useServerWarming();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">Warming Status</div>
      <div>Active: {isWarmingActive ? 'Yes' : 'No'}</div>
      <div>Success Rate: {successRate.toFixed(1)}%</div>
      <div>Total Pings: {stats?.totalPings || 0}</div>
      <div>Current Streak: {stats?.currentStreak || 0}</div>
      {stats?.lastPingTime && (
        <div>Last: {new Date(stats.lastPingTime).toLocaleTimeString()}</div>
      )}
      <button
        onClick={triggerManualWarm}
        className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-700"
      >
        Warm Now
      </button>
    </div>
  );
}

