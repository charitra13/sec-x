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
  private warmingTimer: ReturnType<typeof setInterval> | null = null;
  private isWarming = false;
  private apiBase: string;

  constructor(config?: Partial<BlogWarmingConfig>) {
    this.apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '');

    this.config = {
      enabled: true,
      blogLimit: 6, // Fetch top 6 blogs
      cacheTimeout: 10 * 60 * 1000, // 10 minutes cache
      warmOnLoad: true,
      warmInterval: 20 * 60 * 1000, // 20 minutes
      ...config,
    };

    this.loadCache();
  }

  private loadCache(): void {
    if (typeof window !== 'undefined') {
      try {
        const cachedData = localStorage.getItem('blog-warming-cache');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);

          const isExpired = Date.now() - parsed.timestamp > this.config.cacheTimeout;
          if (!isExpired) {
            this.cache = parsed;
            console.log(`Loaded ${parsed.blogs.length} blogs from cache`);
          } else {
            console.log('Blog cache expired, will refresh');
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
      console.log('Blog warming disabled');
      return null;
    }

    if (this.isWarming) {
      console.log('Blog warming already in progress');
      return this.cache;
    }

    // Return cache if still valid
    if (this.cache && Date.now() - this.cache.timestamp < this.config.cacheTimeout) {
      console.log('Using cached blog data');
      return this.cache;
    }

    this.isWarming = true;

    try {
      const startTime = Date.now();

      // Parallel requests to warm multiple endpoints
      const [blogsResponse, healthResponse] = await Promise.allSettled([
        fetch(`${this.apiBase}/api/blogs?limit=${this.config.blogLimit}&sort=popular`, {
          headers: {
            'X-Warming-Request': 'true',
            'X-Warming-Source': 'blog-prefetch',
          },
        }),
        fetch(`${this.apiBase}/api/health`, {
          headers: {
            'X-Warming-Request': 'true',
            'X-Warming-Source': 'blog-prefetch',
          },
        }),
      ]);

      const responseTimeMs = Date.now() - startTime;

      if (blogsResponse.status === 'fulfilled' && blogsResponse.value.ok) {
        const blogsData = await blogsResponse.value.json();

        const cacheData: CachedBlogData = {
          blogs: blogsData.data?.blogs || blogsData.blogs || [],
          timestamp: Date.now(),
          metadata: {
            total: blogsData.data?.pagination?.total || blogsData.total || 0,
            fetched: blogsData.data?.blogs?.length || blogsData.blogs?.length || 0,
            source: 'api',
          },
        };

        this.cache = cacheData;
        this.saveCache(cacheData);

        console.log('Blog warming successful', {
          blogsLoaded: cacheData.metadata.fetched,
          totalBlogs: cacheData.metadata.total,
          responseTimeMs,
          healthCheck: healthResponse.status === 'fulfilled' ? 'OK' : 'Failed',
        });

        return cacheData;
      }

      throw new Error('Failed to fetch blogs');
    } catch (error) {
      console.error('Blog warming failed:', error);

      if (this.cache) {
        console.log('Using stale cache due to warming failure');
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
      void this.warmWithBlogs();
    }

    this.warmingTimer = setInterval(() => {
      void this.warmWithBlogs();
    }, this.config.warmInterval);

    console.log(`Blog warming service started (interval: ${this.config.warmInterval / 60000} minutes)`);
  }

  public stopPeriodicWarming(): void {
    if (this.warmingTimer) {
      clearInterval(this.warmingTimer);
      this.warmingTimer = null;
      console.log('Blog warming service stopped');
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
    console.log('Blog cache cleared');
  }

  public async preloadBlogImages(): Promise<void> {
    if (!this.cache?.blogs) return;

    const imageUrls = this.cache.blogs
      .map((blog) => blog.coverImage || blog.imageUrl)
      .filter(Boolean)
      .slice(0, 3);

    console.log(`Preloading ${imageUrls.length} blog images`);

    const imagePromises = imageUrls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(null);
        img.src = url as string;
      });
    });

    await Promise.all(imagePromises);
    console.log('Blog images preloaded');
  }
}

// Singleton instance
export const blogWarmingService = new BlogWarmingService();

