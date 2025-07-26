import React, { useCallback } from "react";
import Image from "next/image";
import type { OptimizedCardProps } from "./types";

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
      <div className="relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card border border-border/20">
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

export default OptimizedCard;
export type { OptimizedCardProps };
