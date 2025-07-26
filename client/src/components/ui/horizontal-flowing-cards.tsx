'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

// Type definitions
interface HorizontalFlowingCardsProps {
  cards: React.ReactNode[];
  autoPlay?: boolean;
  speed?: number;
  cardWidth?: number;
  gap?: number;
  className?: string;
  dragSensitivity?: number;
  preloadImages?: boolean;
}

interface DragState {
  x: number;
  offset: number;
}

const HorizontalFlowingCards: React.FC<HorizontalFlowingCardsProps> = ({ 
  cards = [], 
  autoPlay = true,
  speed = 1,
  cardWidth = 320, 
  gap = 24,
  className = "",
  dragSensitivity = 1,
  preloadImages = true
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<DragState>({ x: 0, offset: 0 });
  const isPausedRef = useRef<boolean>(false);

  // Intersection Observer for performance - only animate when visible
  const { ref: viewRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '50px',
  });

  // SSR hydration safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoized calculations
  const { cardWidthWithGap, totalWidth, infiniteCards } = useMemo(() => {
    const cardWidthWithGap = cardWidth + gap;
    const totalWidth = cards.length * cardWidthWithGap;
    const infiniteCards = [...cards, ...cards, ...cards];
    
    return { cardWidthWithGap, totalWidth, infiniteCards };
  }, [cards, cardWidth, gap]);

  // Optimized animation with RAF
  useEffect(() => {
    if (!isMounted || !inView) return;

    const animate = (): void => {
      if (!isDraggingRef.current && !isPausedRef.current && autoPlay) {
        setOffset(prev => {
          const newOffset = prev - speed;
          return newOffset <= -totalWidth ? 0 : newOffset;
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoPlay, speed, totalWidth, isMounted, inView]);

  // Memoized drag handlers for better performance
  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = true;
    
    const clientX = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX || 0;
    dragStartRef.current = {
      x: clientX,
      offset: offset
    };
    
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  }, [offset]);

  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    e.preventDefault();
    const currentX = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX || 0;
    const deltaX = (currentX - dragStartRef.current.x) * dragSensitivity;
    const newOffset = dragStartRef.current.offset + deltaX;
    
    if (newOffset > cardWidthWithGap) {
      setOffset(newOffset - totalWidth);
      dragStartRef.current.offset = newOffset - totalWidth;
    } else if (newOffset < -totalWidth - cardWidthWithGap) {
      setOffset(newOffset + totalWidth);
      dragStartRef.current.offset = newOffset + totalWidth;
    } else {
      setOffset(newOffset);
    }
  }, [dragSensitivity, cardWidthWithGap, totalWidth]);

  const handlePointerUp = useCallback((): void => {
    isDraggingRef.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  }, []);

  const handleCardHover = useCallback((index: number, isHovering: boolean): void => {
    if (!isDraggingRef.current) {
      setHoveredIndex(isHovering ? index : null);
      isPausedRef.current = isHovering;
    }
  }, []);

  // Global event listeners with cleanup
  useEffect(() => {
    const handleGlobalMove = handlePointerMove;
    const handleGlobalUp = handlePointerUp;

    if (typeof window !== 'undefined') {
      document.addEventListener('mousemove', handleGlobalMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalUp);
      document.addEventListener('touchmove', handleGlobalMove, { passive: false });
      document.addEventListener('touchend', handleGlobalUp);
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('mousemove', handleGlobalMove);
        document.removeEventListener('mouseup', handleGlobalUp);
        document.removeEventListener('touchmove', handleGlobalMove);
        document.removeEventListener('touchend', handleGlobalUp);
      }
    };
  }, [handlePointerMove, handlePointerUp]);

  // Don't render until mounted (prevent hydration issues)
  if (!isMounted) {
    return (
      <div className={`relative overflow-hidden w-full py-8 ${className}`}>
        <div className="flex gap-6 opacity-50">
          {cards.slice(0, 3).map((_, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 bg-muted animate-pulse rounded-xl"
              style={{ width: `${cardWidth}px`, height: '500px' }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={viewRef} className={`relative overflow-hidden w-full py-8 ${className}`}>
      {/* Edge gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Controls indicator */}
      <div className="absolute top-2 right-4 z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card/90 backdrop-blur-sm border border-border/30 rounded-full text-xs text-muted-foreground shadow-sm">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
          Drag • Hover to pause
        </div>
      </div>
      
      {/* Cards container */}
      <div 
        ref={containerRef}
        className="flex cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: `translate3d(${offset}px, 0, 0)`, // Use translate3d for GPU acceleration
          gap: `${gap}px`,
          willChange: 'transform'
        }}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        {infiniteCards.map((card, index) => {
          const originalIndex = index % cards.length;
          const isHovered = hoveredIndex === originalIndex;
          const isDulled = hoveredIndex !== null && !isHovered;
          
          return (
            <div
              key={`card-${originalIndex}-${Math.floor(index / cards.length)}`}
              className={`
                flex-shrink-0 transition-all duration-300 ease-out
                ${isDulled ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100'}
                ${isHovered ? 'scale-105 z-20' : 'z-0'}
              `}
              style={{ 
                width: `${cardWidth}px`,
                filter: isDulled ? 'brightness(0.7)' : 'brightness(1)'
              }}
              onMouseEnter={() => handleCardHover(originalIndex, true)}
              onMouseLeave={() => handleCardHover(originalIndex, false)}
            >
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
};


export { HorizontalFlowingCards };
export type { HorizontalFlowingCardsProps };