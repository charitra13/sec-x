import React from 'react';
import { cn } from '@/lib/utils';

interface BlogGlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'featured' | 'admin';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const BlogGlassCard = ({ 
  children, 
  variant = 'default', 
  className,
  onClick,
  style
}: BlogGlassCardProps) => {
  const baseClasses = 'backdrop-blur-xl border transition-all duration-300';
  
  const variants = {
    default: 'bg-white/5 border-white/10 hover:bg-white/10',
    interactive: 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 cursor-pointer',
    featured: 'bg-white/10 border-white/20 hover:bg-white/15 shadow-lg',
    admin: 'bg-white/5 border-white/10 hover:bg-white/10'
  } as const;

  return (
    <div 
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

