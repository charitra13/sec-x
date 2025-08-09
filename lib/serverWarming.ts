'use client';

interface WarmingConfig {
  interval: number; // milliseconds
  healthEndpoint: string;
  enabled: boolean;
  maxRetries: number;
  retryDelay: number;
}

interface WarmingStats {
  totalPings: number;
  successfulPings: number;
  lastPingTime: Date | null;
  lastSuccessTime: Date | null;
  currentStreak: number;
  isActive: boolean;
}

export class ServerWarmingService {
  private config: WarmingConfig;
  private warmingInterval: ReturnType<typeof setInterval> | null = null;
  private stats: WarmingStats;
  private listeners: Array<(stats: WarmingStats) => void> = [];

  constructor(config?: Partial<WarmingConfig>) {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '');
  
    // Ensure we don't have double /api paths
    const cleanApiBase = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
  
    this.config = {
      interval: 14 * 60 * 1000, // 14 minutes (Render sleeps after 15)
      healthEndpoint: `${cleanApiBase}/health`, // Use clean base URL
      enabled: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_WARMING === 'true',
      maxRetries: 3,
      retryDelay: 30000, // 30 seconds
      ...config,
    };

    this.stats = {
      totalPings: 0,
      successfulPings: 0,
      lastPingTime: null,
      lastSuccessTime: null,
      currentStreak: 0,
      isActive: false,
    };

    this.loadStats();
  }

  private loadStats(): void {
    if (typeof window !== 'undefined') {
      try {
        const savedStats = localStorage.getItem('server-warming-stats');
        if (savedStats) {
          const parsed = JSON.parse(savedStats);
          this.stats = {
            ...this.stats,
            ...parsed,
            lastPingTime: parsed.lastPingTime ? new Date(parsed.lastPingTime) : null,
            lastSuccessTime: parsed.lastSuccessTime ? new Date(parsed.lastSuccessTime) : null,
            isActive: false, // Always start as inactive
          };
        }
      } catch (error) {
        console.warn('Failed to load warming stats:', error);
      }
    }
  }

  private saveStats(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('server-warming-stats', JSON.stringify(this.stats));
      } catch (error) {
        console.warn('Failed to save warming stats:', error);
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener({ ...this.stats }));
  }

  public addStatsListener(listener: (stats: WarmingStats) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private async pingServer(retryCount = 0): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(this.config.healthEndpoint, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'X-Warming-Request': 'true',
          'X-Warming-Source': 'frontend-service',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        const lastPing = this.stats.lastPingTime?.getTime() ?? Date.now();
        const responseTimeMs = Date.now() - lastPing;

        // Optional structured log
        console.log('Server warming successful', {
          status: response.status,
          timestamp: (data as any).timestamp ?? null,
          responseTimeMs,
        });

        this.stats.successfulPings += 1;
        this.stats.currentStreak += 1;
        this.stats.lastSuccessTime = new Date();
        return true;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.warn(`Server warming failed (attempt ${retryCount + 1})`, error);

      this.stats.currentStreak = 0;

      // Retry logic
      if (retryCount < this.config.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay));
        return this.pingServer(retryCount + 1);
      }

      return false;
    }
  }

  private async performWarming(): Promise<void> {
    this.stats.totalPings += 1;
    this.stats.lastPingTime = new Date();

    const success = await this.pingServer();

    this.saveStats();
    this.notifyListeners();

    if (success) {
      console.log(`Server warming cycle complete. Streak: ${this.stats.currentStreak}`);
    } else {
      console.log('Server warming cycle failed after all retries');
    }
  }

  public startWarming(): void {
    if (!this.config.enabled) {
      console.log('Server warming disabled');
      return;
    }

    if (this.warmingInterval) {
      console.log('Server warming already active');
      return;
    }

    console.log(`Starting server warming service (interval: ${this.config.interval / 60000} minutes)`);

    this.stats.isActive = true;
    this.notifyListeners();

    // Immediate first ping
    void this.performWarming();

    // Set up interval
    this.warmingInterval = setInterval(() => {
      void this.performWarming();
    }, this.config.interval);
  }

  public stopWarming(): void {
    if (this.warmingInterval) {
      clearInterval(this.warmingInterval);
      this.warmingInterval = null;
      this.stats.isActive = false;
      this.saveStats();
      this.notifyListeners();
      console.log('Server warming service stopped');
    }
  }

  public getStats(): WarmingStats {
    return { ...this.stats };
  }

  public isActive(): boolean {
    return this.stats.isActive;
  }

  public async warmNow(): Promise<boolean> {
    console.log('Manual server warming triggered');
    return this.pingServer();
  }
}

// Singleton instance
export const serverWarmingService = new ServerWarmingService();

