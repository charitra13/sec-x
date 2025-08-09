import React from 'react';
import { cn } from '@/lib/utils';

interface BlogContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BlogContainer = ({ 
  children, 
  size = 'lg', 
  className 
}: BlogContainerProps) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl'
  } as const;

  return (
    <div className={cn(
      'w-full mx-auto px-8 py-24 relative z-10',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

