import React from 'react';
import { cn } from '@/lib/utils';

interface BlogTypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'meta';
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const BlogTypography = ({ 
  variant, 
  children, 
  className,
  id
}: BlogTypographyProps) => {
  const styles = {
    h1: 'text-3xl font-semibold text-white leading-tight mb-6',
    h2: 'text-2xl font-medium text-white leading-tight mb-4',
    h3: 'text-xl font-medium text-white leading-tight mb-3',
    h4: 'text-lg font-medium text-white leading-tight mb-2',
    body: 'text-white/85 leading-relaxed mb-4',
    caption: 'text-white/70 text-sm leading-relaxed',
    meta: 'text-white/60 text-xs uppercase tracking-wider'
  } as const;

  const Component = (variant.startsWith('h') ? (variant as keyof JSX.IntrinsicElements) : 'p');

  return (
    <Component id={id} className={cn(styles[variant], className)}>
      {children}
    </Component>
  );
};

