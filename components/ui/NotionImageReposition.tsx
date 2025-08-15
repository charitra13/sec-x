'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NotionImageRepositionProps {
  imageUrl: string;
  initialPosition: string;
  onPositionChange: (position: string) => void;
  className?: string;
}

export const NotionImageReposition: React.FC<NotionImageRepositionProps> = ({
  imageUrl,
  initialPosition = 'center',
  onPositionChange,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Convert position string to percentage values
  const positionToPercent = useCallback((position: string): { x: number; y: number } => {
    const posMap: Record<string, { x: number; y: number }> = {
      'top left': { x: 0, y: 0 },
      'top center': { x: 50, y: 0 },
      'top right': { x: 100, y: 0 },
      'center left': { x: 0, y: 50 },
      'center': { x: 50, y: 50 },
      'center right': { x: 100, y: 50 },
      'bottom left': { x: 0, y: 100 },
      'bottom center': { x: 50, y: 100 },
      'bottom right': { x: 100, y: 100 },
    };
    return posMap[position] || { x: 50, y: 50 };
  }, []);

  // Convert percentage to position string
  const percentToPosition = useCallback((x: number, y: number): string => {
    let horizontal = 'center';
    let vertical = 'center';

    if (x <= 25) horizontal = 'left';
    else if (x >= 75) horizontal = 'right';

    if (y <= 25) vertical = 'top';
    else if (y >= 75) vertical = 'bottom';

    if (vertical === 'center' && horizontal === 'center') return 'center';
    if (vertical === 'center') return `center ${horizontal}`;
    if (horizontal === 'center') return `${vertical} center`;
    return `${vertical} ${horizontal}`;
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartY(e.clientY);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, []);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const deltaY = e.clientY - dragStartY;
    const containerHeight = rect.height;
    
    // Calculate new position based on drag
    const currentPos = positionToPercent(currentPosition);
    const movePercent = (deltaY / containerHeight) * 100;
    
    // Primarily vertical movement, slight horizontal adjustment allowed
    let newY = Math.max(0, Math.min(100, currentPos.y + movePercent));
    let newX = currentPos.x;
    
    // Allow slight horizontal movement if mouse moves horizontally
    const deltaX = e.clientX - (rect.left + rect.width / 2);
    if (Math.abs(deltaX) > 20) {
      const horizontalMove = (deltaX / rect.width) * 50;
      newX = Math.max(0, Math.min(100, currentPos.x + horizontalMove));
    }

    const newPosition = percentToPosition(newX, newY);
    setCurrentPosition(newPosition);
    onPositionChange(newPosition);
  }, [isDragging, dragStartY, currentPosition, positionToPercent, percentToPosition, onPositionChange]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Update current position when initialPosition changes
  useEffect(() => {
    setCurrentPosition(initialPosition);
  }, [initialPosition]);

  return (
    <div className={cn("relative", className)}>
      {/* Main reposition container */}
      <div
        ref={containerRef}
        className={cn(
          "relative w-full h-48 rounded-lg overflow-hidden border border-white/20 group",
          "cursor-grab hover:cursor-grab active:cursor-grabbing",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Four-head arrow overlay */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-none z-20",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            isDragging && "opacity-100"
          )}
        >
          <div className="bg-black/60 rounded-full p-3 backdrop-blur-sm">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white"
            >
              <path 
                d="M8 5L12 1L16 5M16 19L12 23L8 19M5 8L1 12L5 16M19 16L23 12L19 8M12 5V19M5 12H19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Image */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Cover image reposition"
          className="w-full h-full object-cover transition-all duration-150"
          style={{
            objectPosition: currentPosition,
            filter: isDragging ? 'brightness(0.8)' : 'none'
          }}
          draggable={false}
        />

        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            {currentPosition}
          </div>
        )}
      </div>

      {/* Position info */}
      <div className="mt-2 text-xs text-white/60 text-center">
        Click and drag to reposition • Position: {currentPosition}
      </div>
    </div>
  );
};
