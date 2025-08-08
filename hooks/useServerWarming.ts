'use client';

import { useState, useEffect, useCallback } from 'react';
import { warmingManager } from '@/lib/warmingManager';
import { serverWarmingService } from '@/lib/serverWarming';

interface WarmingHookState {
  isWarmingActive: boolean;
  stats: any;
  lastPingTime: Date | null;
  successRate: number;
}

export function useServerWarming() {
  const [state, setState] = useState<WarmingHookState>({
    isWarmingActive: false,
    stats: null,
    lastPingTime: null,
    successRate: 0,
  });

  const updateState = useCallback(() => {
    const stats = serverWarmingService.getStats();
    const successRate = stats.totalPings > 0 ? (stats.successfulPings / stats.totalPings) * 100 : 0;

    setState({
      isWarmingActive: serverWarmingService.isActive(),
      stats,
      lastPingTime: stats.lastPingTime,
      successRate,
    });
  }, []);

  useEffect(() => {
    updateState();

    const unsubscribe = serverWarmingService.addStatsListener(updateState);
    const interval = setInterval(updateState, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [updateState]);

  const triggerManualWarm = useCallback(async () => {
    await warmingManager.warmNow();
  }, []);

  const getWarmingStatus = useCallback(() => {
    return warmingManager.getStatus();
  }, []);

  return {
    ...state,
    triggerManualWarm,
    getWarmingStatus,
    warmingManager,
  };
}

