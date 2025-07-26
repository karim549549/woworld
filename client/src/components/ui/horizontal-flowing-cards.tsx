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

interface CardData {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  date: string;
  pages: number;
  category: string;
}

interface OptimizedCardProps extends CardData {
  onClick?: (card: CardData) => void;
  priority?: boolean;
}

interface ProductData {
  id: number;
  name: string;
  price: string;
  color: string;
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

// Optimized card component with Next.js Image and TypeScript
const OptimizedCard: React.FC<OptimizedCardProps> = React.memo(({ 
  id,
  title, 
  subtitle, 
  image, 
  date, 
  pages, 
  category,
  onClick,
  priority = false // For LCP optimization
}) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick({ id, title, subtitle, image, date, pages, category });
    }
  }, [onClick, id, title, subtitle, image, date, pages, category]);

  return (
    <div 
      className="relative group cursor-pointer"
      onClick={handleClick}
    >
      {/* Main card */}
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-card border border-border/20">
        {/* Optimized image with Next.js Image */}
        <div className="relative h-[400px] overflow-hidden">
          <Image
            src={image}
            alt={`${title} magazine cover`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-md">
              {category}
            </span>
          </div>
          
          {/* Brand dots */}
          <div className="absolute top-4 right-4">
            <div className="flex space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-accent'
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-bold leading-tight tracking-wide mb-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="text-sm opacity-90 leading-relaxed mb-3 line-clamp-2">
              {subtitle}
            </p>
            <div className="flex justify-between items-center text-xs opacity-80">
              <span className="font-medium">{pages} Pages</span>
              <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info section */}
      <div className="p-4 text-center space-y-2">
        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h4>
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-0.5 bg-muted/50 rounded text-xs">{pages} PGs</span>
          <span>•</span>
          <time className="text-xs" dateTime={date}>
            {new Date(date).toLocaleDateString()}
          </time>
        </div>
        <button 
          className="inline-flex items-center gap-1 text-secondary hover:text-primary font-medium transition-all duration-200 hover:scale-105 text-sm"
          aria-label={`Learn more about ${title}`}
        >
          Learn More
          <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

// Product card component with TypeScript
const ProductCard: React.FC<ProductData> = React.memo(({ id, name, price, color }) => (
  <div className="bg-card p-6 rounded-xl border border-border shadow-md hover:shadow-lg transition-all">
    <div className={`w-full h-32 bg-gradient-to-br ${color} rounded-lg mb-4`} />
    <h3 className="font-bold text-foreground text-lg">{name}</h3>
    <p className="text-primary font-semibold text-xl">{price}</p>
  </div>
));

ProductCard.displayName = 'ProductCard';

// Main demo component with full TypeScript support
const Demo: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  // Sample data with proper typing
  const magazines: CardData[] = useMemo(() => [
    {
      id: 1,
      title: "UNEXPECTED AI BEAUTY",
      subtitle: "Exploring the Harmony Between Humanity and Nature Through Digital Art",
      category: "Tech & Art",
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&h=800&fit=crop&auto=format&q=80",
      date: "2024-10-01",
      pages: 105
    },
    {
      id: 2,
      title: "ENCODED COUTURE",
      subtitle: "Aesthetic Intelligence Meets Machine Made Fashion",
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop&auto=format&q=80",
      date: "2024-12-01",
      pages: 105
    },
    {
      id: 3,
      title: "EMOTIVE MACHINES",
      subtitle: "DNA of Intelligent Empathy in Modern Technology",
      category: "Psychology",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=800&fit=crop&auto=format&q=80",
      date: "2024-12-01",
      pages: 105
    },
    {
      id: 4,
      title: "DIGITAL DREAMS",
      subtitle: "Virtual Reality and the Future of Human Experience",
      category: "VR/AR",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=600&h=800&fit=crop&auto=format&q=80",
      date: "2024-11-15",
      pages: 98
    },
    {
      id: 5,
      title: "QUANTUM LEAP",
      subtitle: "Breaking Barriers in Computational Science",
      category: "Science",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=800&fit=crop&auto=format&q=80",
      date: "2025-01-20",
      pages: 120
    }
  ], []);

  // Memoized cards to prevent unnecessary re-renders
  const magazineCards: React.ReactNode[] = useMemo(() => 
    magazines.map((magazine, index) => (
      <OptimizedCard
        key={magazine.id}
        {...magazine}
        priority={index < 2} // Prioritize first 2 images for LCP
        onClick={setSelectedCard}
      />
    )), [magazines]
  );

  const productCards: React.ReactNode[] = useMemo(() => {
    const products: ProductData[] = [
      { id: 1, name: "Premium Package", price: "$299", color: "from-primary to-primary/80" },
      { id: 2, name: "Standard Package", price: "$199", color: "from-secondary to-secondary/80" },
      { id: 3, name: "Basic Package", price: "$99", color: "from-accent to-accent/80" }
    ];

    return products.map((product) => (
      <ProductCard key={product.id} {...product} />
    ));
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCard(null);
  }, []);

  const handleModalBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedCard(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* SEO optimized header */}
        <header className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Featured <span className="text-primary">Issues</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collection with smooth drag navigation and hover interactions. 
            Built for performance and accessibility.
          </p>
        </header>

        {/* Main carousel */}
        <section aria-label="Featured magazines">
          <HorizontalFlowingCards 
            cards={magazineCards}
            autoPlay={true}
            speed={0.8}
            cardWidth={320}
            gap={24}
            dragSensitivity={1}
          />
        </section>

        {/* Secondary carousel */}
        <section aria-label="Product packages" className="space-y-8">
          <h2 className="text-2xl font-bold text-center">
            <span className="text-secondary">Products</span> Collection
          </h2>
          <HorizontalFlowingCards 
            cards={productCards}
            autoPlay={true}
            speed={0.5}
            cardWidth={280}
            gap={20}
            dragSensitivity={0.8}
          />
        </section>

        {/* Modal with proper focus management and TypeScript */}
        {selectedCard && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleModalBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div 
              className="bg-card p-6 rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="modal-title" className="text-xl font-bold mb-2">
                {selectedCard.title}
              </h3>
              <p className="text-muted-foreground mb-4">{selectedCard.subtitle}</p>
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                <span>{selectedCard.category}</span>
                <span>{selectedCard.pages} pages</span>
              </div>
              <button 
                onClick={handleCloseModal}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                autoFocus
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export with proper TypeScript types
export default Demo;
export type { HorizontalFlowingCardsProps, CardData, OptimizedCardProps, ProductData };