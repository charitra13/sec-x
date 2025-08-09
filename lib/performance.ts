import React, { useEffect, useState } from 'react';

// Image optimization utility (placeholder for external services)
export const getOptimizedImageUrl = (url: string, width: number, quality: number = 80) => {
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString(),
    f: 'webp'
  });
  return `${url}?${params.toString()}`;
};

// Lazy loading helper for heavy components
export const lazyWithPreload = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  const LazyComponent = React.lazy(factory);
  const preload = () => factory();
  return { Component: LazyComponent, preload };
};

// Debounce hook
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

