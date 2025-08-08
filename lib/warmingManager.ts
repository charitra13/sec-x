'use client';

import { serverWarmingService } from './serverWarming';
import { blogWarmingService } from './blogWarming';

interface WarmingManagerConfig {
  enableServerWarming: boolean;
  enableBlogWarming: boolean;
  enableImagePreloading: boolean;
  startDelay: number;
}

export class WarmingManager {
  private config: WarmingManagerConfig;
  private isInitialized = false;

  constructor(config?: Partial<WarmingManagerConfig>) {
    this.config = {
      enableServerWarming: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_WARMING === 'true',
      enableBlogWarming: true,
      enableImagePreloading: true,
      startDelay: 2000, // 2 seconds delay to avoid blocking page load
      ...config,
    };
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Warming manager already initialized');
      return;
    }

    console.log('Initializing warming services');

    // Add delay to avoid blocking initial page load
    await new Promise((resolve) => setTimeout(resolve, this.config.startDelay));

    try {
      // Start server warming
      if (this.config.enableServerWarming) {
        serverWarmingService.startWarming();
      }

      // Start blog warming
      if (this.config.enableBlogWarming) {
        blogWarmingService.startPeriodicWarming();

        // Preload images if enabled
        if (this.config.enableImagePreloading) {
          setTimeout(() => {
            void blogWarmingService.preloadBlogImages();
          }, 5000); // 5 seconds after blog warming starts
        }
      }

      this.isInitialized = true;
      console.log('Warming services initialized successfully');

      this.setupVisibilityHandling();
    } catch (error) {
      console.error('Failed to initialize warming services:', error);
    }
  }

  private setupVisibilityHandling(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          if (this.config.enableServerWarming && !serverWarmingService.isActive()) {
            console.log('Page visible, restarting server warming');
            serverWarmingService.startWarming();
          }
        } else {
          console.log('Page hidden, warming continues in background');
        }
      });
    }
  }

  public shutdown(): void {
    console.log('Shutting down warming services');

    if (this.config.enableServerWarming) {
      serverWarmingService.stopWarming();
    }

    if (this.config.enableBlogWarming) {
      blogWarmingService.stopPeriodicWarming();
    }

    this.isInitialized = false;
    console.log('Warming services shut down');
  }

  public getStatus() {
    return {
      initialized: this.isInitialized,
      serverWarming: {
        enabled: this.config.enableServerWarming,
        active: serverWarmingService.isActive(),
        stats: serverWarmingService.getStats(),
      },
      blogWarming: {
        enabled: this.config.enableBlogWarming,
        cache: blogWarmingService.getCachedBlogs(),
      },
    };
  }

  public async warmNow(): Promise<void> {
    console.log('Manual warming triggered');

    const promises: Promise<any>[] = [];

    if (this.config.enableServerWarming) {
      promises.push(serverWarmingService.warmNow());
    }

    if (this.config.enableBlogWarming) {
      promises.push(blogWarmingService.warmWithBlogs());
    }

    await Promise.allSettled(promises);
    console.log('Manual warming complete');
  }
}

// Singleton instance
export const warmingManager = new WarmingManager();

