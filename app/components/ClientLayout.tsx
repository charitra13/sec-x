'use client';

import { useEffect, useLayoutEffect } from 'react';

// Create a safe version of useLayoutEffect that falls back to useEffect on the server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useIsomorphicLayoutEffect(() => {
    const removeVSCodeClasses = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const element = mutation.target as HTMLElement;
            if (element.className.includes('vsc-')) {
              const classNames = element.className.split(' ').filter(className => 
                !className.includes('vsc-') && 
                !className.includes('initialized') && 
                className !== ''
              );
              element.className = classNames.join(' ');
            }
          }
        });
      });

      // Start observing the document with the configured parameters
      observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['class']
      });

      // Initial cleanup
      document.querySelectorAll('*').forEach(element => {
        if (element instanceof HTMLElement && element.className) {
          const classNames = element.className.split(' ').filter(className => 
            !className.includes('vsc-') && 
            !className.includes('initialized') && 
            className !== ''
          );
          element.className = classNames.join(' ');
        }
      });

      return () => observer.disconnect();
    };

    return removeVSCodeClasses();
  }, []);

  return children;
} 