import { Skeleton } from './index';
import { cn } from '@/lib/utils';

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  className?: string;
}

/**
 * Avatar/profile picture skeleton with multiple sizes and shapes
 */
export function SkeletonAvatar({
  size = 'md',
  shape = 'circle',
  className
}: SkeletonAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const shapeVariant = shape === 'circle' ? 'circular' : 'rounded';

  return (
    <Skeleton
      variant={shapeVariant}
      className={cn(sizeClasses[size], className)}
      aria-label="Loading profile picture"
    />
  );
}