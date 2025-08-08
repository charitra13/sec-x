# 🔥 Frontend Implementation: Server Warming & Blog Pre-fetching

## Project Context
You are implementing **frontend-based server warming** for **SecurityX** to solve Render free tier cold start issues. This Next.js 14 + TypeScript application needs to keep the backend server active and pre-fetch blog content.

**Current Setup:**
- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Express.js hosted on Render free tier 
- **API Base**: `process.env.NEXT_PUBLIC_API_URL`
- **Existing endpoints**: `/api/health`, `/api/blogs`
- **Auth Context**: Already implemented with user state management

## 🎯 Implementation Goals

### ✅ Keep-Alive Service
- Ping server every 14 minutes to prevent sleep
- Smart retry logic with failure handling
- Statistics tracking and persistence
- React integration with hooks

### ✅ Blog Pre-fetching Service  
- Pre-fetch popular blogs on app load
- Cache blog data in localStorage
- Preload blog images for better UX
- Warm database connections

### ✅ React Integration
- Context provider for warming services
- Custom hooks for component integration
- Development monitoring tools
- Automatic lifecycle management

## 📂 File Structure to Create

```
lib/
├── serverWarming.ts          # Core keep-alive service
├── blogWarming.ts           # Blog pre-fetching service  
├── warmingManager.ts        # Orchestrates both services
└── api.ts                   # (modify existing)

app/
├── layout.tsx               # (modify existing)
└── providers/
    └── WarmingProvider.tsx  # React context provider

hooks/
└── useServerWarming.ts      # Custom hook for components

components/
└── WarmingStatus.tsx        # (optional) Dev monitoring
```

## 🔧 Step-by-Step Implementation

### Step 1: Create Server Warming Service

**File: `lib/serverWarming.ts`**
```typescript
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
  private warmingInterval: NodeJS.Timeout | null = null;
  private stats: WarmingStats;
  private listeners: Array<(stats: WarmingStats) => void> = [];

  constructor(config?: Partial<WarmingConfig>) {
    this.config = {
      interval: 14 * 60 * 1000, // 14 minutes (Render sleeps after 15)
      healthEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/health`,
      enabled: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_WARMING === 'true',
      maxRetries: 3,
      retryDelay: 30000, // 30 seconds
      ...config
    };

    this.stats = {
      totalPings: 0,
      successfulPings: 0,
      lastPingTime: null,
      lastSuccessTime: null,
      currentStreak: 0,
      isActive: false
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
            isActive: false // Always start as inactive
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
    this.listeners.forEach(listener => listener({ ...this.stats }));
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
      console.log(`🔥 Warming server (attempt ${retryCount + 1}/${this.config.maxRetries + 1})...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(this.config.healthEndpoint, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'X-Warming-Request': 'true',
          'X-Warming-Source': 'frontend-service'
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Server warming successful:', {
          status: response.status,
          timestamp: data.timestamp,
          responseTime: `${Date.now() - this.stats.lastPingTime!.getTime()}ms`
        });
        
        this.stats.successfulPings++;
        this.stats.currentStreak++;
        this.stats.lastSuccessTime = new Date();
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn(`❌ Server warming failed (attempt ${retryCount + 1}):`, error);
      
      this.stats.currentStreak = 0;
      
      // Retry logic
      if (retryCount < this.config.maxRetries) {
        console.log(`🔄 Retrying in ${this.config.retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.pingServer(retryCount + 1);
      }
      
      return false;
    }
  }

  private async performWarming(): Promise<void> {
    this.stats.totalPings++;
    this.stats.lastPingTime = new Date();
    
    const success = await this.pingServer();
    
    this.saveStats();
    this.notifyListeners();
    
    if (success) {
      console.log(`🔥 Server warming cycle complete. Streak: ${this.stats.currentStreak}`);
    } else {
      console.log('❌ Server warming cycle failed after all retries');
    }
  }

  public startWarming(): void {
    if (!this.config.enabled) {
      console.log('🚫 Server warming disabled');
      return;
    }

    if (this.warmingInterval) {
      console.log('⚠️ Server warming already active');
      return;
    }

    console.log(`🚀 Starting server warming service (interval: ${this.config.interval / 60000} minutes)`);
    
    this.stats.isActive = true;
    this.notifyListeners();
    
    // Immediate first ping
    this.performWarming();
    
    // Set up interval
    this.warmingInterval = setInterval(() => {
      this.performWarming();
    }, this.config.interval);
  }

  public stopWarming(): void {
    if (this.warmingInterval) {
      clearInterval(this.warmingInterval);
      this.warmingInterval = null;
      this.stats.isActive = false;
      this.saveStats();
      this.notifyListeners();
      console.log('🛑 Server warming service stopped');
    }
  }

  public getStats(): WarmingStats {
    return { ...this.stats };
  }

  public isActive(): boolean {
    return this.stats.isActive;
  }

  public async warmNow(): Promise<boolean> {
    console.log('🔥 Manual server warming triggered');
    return this.pingServer();
  }
}

// Singleton instance
export const serverWarmingService = new ServerWarmingService();
```

### Step 2: Create Blog Pre-fetching Service

**File: `lib/blogWarming.ts`**
```typescript
'use client';

interface BlogWarmingConfig {
  enabled: boolean;
  blogLimit: number;
  cacheTimeout: number; 
  warmOnLoad: boolean;
  warmInterval: number;
}

interface CachedBlogData {
  blogs: any[];
  timestamp: number;
  metadata: {
    total: number;
    fetched: number;
    source: 'cache' | 'api';
  };
}

export class BlogWarmingService {
  private config: BlogWarmingConfig;
  private cache: CachedBlogData | null = null;
  private warmingTimer: NodeJS.Timeout | null = null;
  private isWarming = false;

  constructor(config?: Partial<BlogWarmingConfig>) {
    this.config = {
      enabled: true,
      blogLimit: 6, // Fetch top 6 blogs
      cacheTimeout: 10 * 60 * 1000, // 10 minutes cache
      warmOnLoad: true,
      warmInterval: 20 * 60 * 1000, // 20 minutes
      ...config
    };

    this.loadCache();
  }

  private loadCache(): void {
    if (typeof window !== 'undefined') {
      try {
        const cachedData = localStorage.getItem('blog-warming-cache');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          
          const isExpired = (Date.now() - parsed.timestamp) > this.config.cacheTimeout;
          if (!isExpired) {
            this.cache = parsed;
            console.log(`📚 Loaded ${parsed.blogs.length} blogs from cache`);
          } else {
            console.log('🗑️ Blog cache expired, will refresh');
            localStorage.removeItem('blog-warming-cache');
          }
        }
      } catch (error) {
        console.warn('Failed to load blog cache:', error);
      }
    }
  }

  private saveCache(data: CachedBlogData): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('blog-warming-cache', JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save blog cache:', error);
      }
    }
  }

  public async warmWithBlogs(): Promise<CachedBlogData | null> {
    if (!this.config.enabled) {
      console.log('🚫 Blog warming disabled');
      return null;
    }

    if (this.isWarming) {
      console.log('⚠️ Blog warming already in progress');
      return this.cache;
    }

    // Return cache if still valid
    if (this.cache && (Date.now() - this.cache.timestamp) < this.config.cacheTimeout) {
      console.log('📚 Using cached blog data');
      return this.cache;
    }

    this.isWarming = true;

    try {
      console.log('🔥 Warming server with blog pre-fetch...');
      
      const startTime = Date.now();
      
      // Parallel requests to warm multiple endpoints
      const [blogsResponse, healthResponse] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?limit=${this.config.blogLimit}&sort=popular`, {
          headers: {
            'X-Warming-Request': 'true',
            'X-Warming-Source': 'blog-prefetch'
          }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`, {
          headers: {
            'X-Warming-Request': 'true',
            'X-Warming-Source': 'blog-prefetch'
          }
        })
      ]);

      const responseTime = Date.now() - startTime;

      if (blogsResponse.status === 'fulfilled' && blogsResponse.value.ok) {
        const blogsData = await blogsResponse.value.json();
        
        const cacheData: CachedBlogData = {
          blogs: blogsData.data?.blogs || blogsData.blogs || [],
          timestamp: Date.now(),
          metadata: {
            total: blogsData.data?.pagination?.total || blogsData.total || 0,
            fetched: blogsData.data?.blogs?.length || blogsData.blogs?.length || 0,
            source: 'api'
          }
        };

        this.cache = cacheData;
        this.saveCache(cacheData);

        console.log('✅ Blog warming successful:', {
          blogsLoaded: cacheData.metadata.fetched,
          totalBlogs: cacheData.metadata.total,
          responseTime: `${responseTime}ms`,
          healthCheck: healthResponse.status === 'fulfilled' ? 'OK' : 'Failed'
        });

        return cacheData;
      } else {
        throw new Error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('❌ Blog warming failed:', error);
      
      if (this.cache) {
        console.log('📚 Using stale cache due to warming failure');
        return this.cache;
      }
      
      return null;
    } finally {
      this.isWarming = false;
    }
  }

  public startPeriodicWarming(): void {
    if (!this.config.enabled) return;

    if (this.config.warmOnLoad) {
      this.warmWithBlogs();
    }

    this.warmingTimer = setInterval(() => {
      this.warmWithBlogs();
    }, this.config.warmInterval);

    console.log(`🔥 Blog warming service started (interval: ${this.config.warmInterval / 60000} minutes)`);
  }

  public stopPeriodicWarming(): void {
    if (this.warmingTimer) {
      clearInterval(this.warmingTimer);
      this.warmingTimer = null;
      console.log('🛑 Blog warming service stopped');
    }
  }

  public getCachedBlogs(): CachedBlogData | null {
    return this.cache;
  }

  public clearCache(): void {
    this.cache = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('blog-warming-cache');
    }
    console.log('🗑️ Blog cache cleared');
  }

  public async preloadBlogImages(): Promise<void> {
    if (!this.cache?.blogs) return;

    const imageUrls = this.cache.blogs
      .map(blog => blog.coverImage || blog.imageUrl)
      .filter(Boolean)
      .slice(0, 3); // Preload first 3 images

    console.log(`🖼️ Preloading ${imageUrls.length} blog images...`);

    const imagePromises = imageUrls.map(url => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    });

    await Promise.all(imagePromises);
    console.log('✅ Blog images preloaded');
  }
}

// Singleton instance
export const blogWarmingService = new BlogWarmingService();
```

### Step 3: Create Warming Manager Orchestrator

**File: `lib/warmingManager.ts`**
```typescript
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
      ...config
    };
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('⚠️ Warming manager already initialized');
      return;
    }

    console.log('🚀 Initializing warming services...');

    // Add delay to avoid blocking initial page load
    await new Promise(resolve => setTimeout(resolve, this.config.startDelay));

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
            blogWarmingService.preloadBlogImages();
          }, 5000); // 5 seconds after blog warming starts
        }
      }

      this.isInitialized = true;
      console.log('✅ Warming services initialized successfully');

      this.setupVisibilityHandling();

    } catch (error) {
      console.error('❌ Failed to initialize warming services:', error);
    }
  }

  private setupVisibilityHandling(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          if (this.config.enableServerWarming && !serverWarmingService.isActive()) {
            console.log('👁️ Page visible, restarting server warming');
            serverWarmingService.startWarming();
          }
        } else {
          console.log('👁️ Page hidden, warming continues in background');
        }
      });
    }
  }

  public shutdown(): void {
    console.log('🛑 Shutting down warming services...');
    
    if (this.config.enableServerWarming) {
      serverWarmingService.stopWarming();
    }
    
    if (this.config.enableBlogWarming) {
      blogWarmingService.stopPeriodicWarming();
    }

    this.isInitialized = false;
    console.log('✅ Warming services shut down');
  }

  public getStatus() {
    return {
      initialized: this.isInitialized,
      serverWarming: {
        enabled: this.config.enableServerWarming,
        active: serverWarmingService.isActive(),
        stats: serverWarmingService.getStats()
      },
      blogWarming: {
        enabled: this.config.enableBlogWarming,
        cache: blogWarmingService.getCachedBlogs()
      }
    };
  }

  public async warmNow(): Promise<void> {
    console.log('🔥 Manual warming triggered');
    
    const promises: Promise<any>[] = [];
    
    if (this.config.enableServerWarming) {
      promises.push(serverWarmingService.warmNow());
    }
    
    if (this.config.enableBlogWarming) {
      promises.push(blogWarmingService.warmWithBlogs());
    }

    await Promise.allSettled(promises);
    console.log('✅ Manual warming complete');
  }
}

// Singleton instance
export const warmingManager = new WarmingManager();
```

### Step 4: Create React Hook for Components

**File: `hooks/useServerWarming.ts`**
```typescript
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
    successRate: 0
  });

  const updateState = useCallback(() => {
    const stats = serverWarmingService.getStats();
    const successRate = stats.totalPings > 0 
      ? (stats.successfulPings / stats.totalPings) * 100 
      : 0;

    setState({
      isWarmingActive: serverWarmingService.isActive(),
      stats,
      lastPingTime: stats.lastPingTime,
      successRate
    });
  }, []);

  useEffect(() => {
    updateState();

    const unsubscribe = serverWarmingService.addStatsListener(updateState);
    const interval = setInterval(updateState, 30000); // Every 30 seconds

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
    warmingManager
  };
}
```

### Step 5: Create React Context Provider

**File: `app/providers/WarmingProvider.tsx`**
```typescript
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
    warmingManager.initialize();

    // Cleanup on unmount
    return () => {
      warmingManager.shutdown();
    };
  }, []);

  return (
    <WarmingContext.Provider value={{ warmingManager }}>
      {children}
    </WarmingContext.Provider>
  );
}

export function useWarming() {
  const context = useContext(WarmingContext);
  if (context === undefined) {
    throw new Error('useWarming must be used within a WarmingProvider');
  }
  return context;
}
```

### Step 6: Update Root Layout

**File: `app/layout.tsx` (modify existing)**

Add the import:
```typescript
import { WarmingProvider } from './providers/WarmingProvider';
```

Update the component:
```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WarmingProvider>
            <ClientLayout>
              {children}
              <Toaster position="bottom-right" />
            </ClientLayout>
          </WarmingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 7: Optional Development Monitoring Component

**File: `app/components/WarmingStatus.tsx`**
```typescript
'use client';

import { useServerWarming } from '@/hooks/useServerWarming';

export default function WarmingStatus() {
  const { isWarmingActive, stats, successRate, triggerManualWarm } = useServerWarming();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">🔥 Warming Status</div>
      <div>Active: {isWarmingActive ? '✅' : '❌'}</div>
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
```

### Step 8: Environment Configuration

**File: `.env.local` (add these variables)**
```bash
# Warming Configuration
NEXT_PUBLIC_ENABLE_WARMING=true

# API Configuration (ensure this matches your backend)
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
```

### Step 9: Optional - Add to Existing Blog Page for Pre-cached Data

**File: `app/blog/page.tsx` (example usage)**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { blogWarmingService } from '@/lib/blogWarming';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      // Try to get cached blogs first
      const cachedBlogs = blogWarmingService.getCachedBlogs();
      
      if (cachedBlogs && cachedBlogs.blogs.length > 0) {
        console.log('📚 Using pre-cached blogs');
        setBlogs(cachedBlogs.blogs);
        setLoading(false);
      } else {
        // Fallback to API call
        console.log('🔄 Loading blogs from API');
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
          const data = await response.json();
          setBlogs(data.blogs || []);
        } catch (error) {
          console.error('Failed to load blogs:', error);
        }
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  if (loading) {
    return <div>Loading blogs...</div>;
  }

  return (
    <div>
      {/* Your blog rendering logic */}
      {blogs.map(blog => (
        <div key={blog._id}>
          {/* Blog card component */}
        </div>
      ))}
    </div>
  );
}
```

## 🧪 Testing & Verification

### 1. Development Testing
```javascript
// Open browser console and test:
window.warmingManager = warmingManager;

// Check status
warmingManager.getStatus();

// Manual warming
warmingManager.warmNow();

// Check cached blogs
blogWarmingService.getCachedBlogs();
```

### 2. Console Log Monitoring
Look for these logs:
- `🚀 Starting server warming service`
- `✅ Server warming successful`
- `📚 Loaded X blogs from cache`
- `🔥 Blog warming service started`

### 3. Network Tab Monitoring
- Health endpoint calls every 14 minutes
- Blog API calls for pre-fetching
- Reduced response times on subsequent requests

### 4. localStorage Inspection
Check browser DevTools > Application > Local Storage:
- `server-warming-stats`
- `blog-warming-cache`

## 🎯 Expected Results

### ✅ **Performance Improvements**
- **Cold start reduction**: 30s → 3s response times
- **Blog loading**: Instant loading from cache
- **User experience**: Smoother navigation

### ✅ **Monitoring Capabilities**
- Real-time warming statistics
- Success rate tracking
- Cache hit ratios
- Development debugging tools

### ✅ **Smart Behavior**
- Automatic retry on failures
- Cache expiration handling
- Page visibility optimization
- Graceful degradation

## 📊 Configuration Options

### Warming Intervals
```typescript
// Adjust in warmingManager.ts
serverWarming: 14 * 60 * 1000,  // 14 minutes
blogWarming: 20 * 60 * 1000,    // 20 minutes
```

### Cache Settings
```typescript
// Adjust in blogWarming.ts
cacheTimeout: 10 * 60 * 1000,   // 10 minutes
blogLimit: 6,                   // Number of blogs to cache
```

### Environment Controls
```bash
# Enable/disable warming
NEXT_PUBLIC_ENABLE_WARMING=true

# Force warming in development
NEXT_PUBLIC_ENABLE_WARMING=true
```

This frontend implementation will keep your Render backend warm and provide a significantly better user experience!