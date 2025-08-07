import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

/**
 * Custom hook for intersection observer to implement lazy loading with skeletons
 * Returns whether the element is visible and a ref to attach to the target element
 */
export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const { threshold = 0.1, rootMargin = '50px', root = null } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        
        // Once visible, mark as having been visible for optimization
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold,
        rootMargin,
        root
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, root]);

  return {
    isVisible,
    hasBeenVisible,
    elementRef
  };
}

/**
 * Hook specifically for lazy loading content with skeletons
 * Shows skeleton until element comes into view
 */
export function useLazyLoad(options: UseIntersectionObserverOptions = {}) {
  const { isVisible, hasBeenVisible, elementRef } = useIntersectionObserver(options);
  
  // Show content if it's visible or has been visible before
  const shouldShowContent = isVisible || hasBeenVisible;
  const shouldShowSkeleton = !shouldShowContent;

  return {
    shouldShowContent,
    shouldShowSkeleton,
    elementRef,
    isVisible
  };
}