import React, { useState, useRef, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { useBlurDataURL } from '../hooks/useBlurDataURL';
import './OptimizedImage.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  blurDataURL?: string;
}

/**
 * Optimized image component with lazy loading, error handling, and loading states
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  style,
  onLoad,
  onError,
  placeholder,
  blurDataURL,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate blur data URL if not provided
  const generatedBlurDataURL = useBlurDataURL();
  const finalBlurDataURL = blurDataURL || generatedBlurDataURL;

  // Intersection Observer for lazy loading
  useEffect(() => {
    // Check if IntersectionObserver is available (for tests)
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setLoaded(false);
    onError?.();
  };

  return (
    <div
      ref={containerRef}
      className={`optimized-image ${className}`}
      style={style}
    >
      {/* Placeholder/Blur background */}
      {!loaded && !error && (placeholder || finalBlurDataURL) && (
        <div
          className="optimized-image__placeholder"
          style={{
            backgroundImage: finalBlurDataURL
              ? `url(${finalBlurDataURL})`
              : undefined,
            backgroundColor: placeholder || 'rgba(255, 255, 255, 0.1)',
          }}
        />
      )}

      {/* Loading spinner */}
      {!loaded && !error && inView && (
        <div className="optimized-image__loading">
          <LoadingSpinner size="small" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="optimized-image__error">
          <div className="optimized-image__error-icon">📷</div>
          <span className="optimized-image__error-text">
            Image non disponible
          </span>
        </div>
      )}

      {/* Actual image */}
      {inView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`optimized-image__img ${loaded ? 'optimized-image__img--loaded' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
