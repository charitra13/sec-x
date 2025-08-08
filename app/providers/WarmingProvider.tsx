'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { warmingManager } from '@/lib/warmingManager';

interface WarmingContextType {
  warmingManager: typeof warmingManager;
}

const WarmingContext = createContext<WarmingContextType | undefined>(undefined);

export function WarmingProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize warming services
    void warmingManager.initialize();

    // Cleanup on unmount
    return () => {
      warmingManager.shutdown();
    };
  }, []);

  return <WarmingContext.Provider value={{ warmingManager }}>{children}</WarmingContext.Provider>;
}

export function useWarming() {
  const context = useContext(WarmingContext);
  if (context === undefined) {
    throw new Error('useWarming must be used within a WarmingProvider');
  }
  return context;
}

