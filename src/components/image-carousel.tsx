/**
 * Simple Image Carousel Component
 * Basic carousel with navigation and auto-play functionality
 */

import React, { useState, useEffect, useCallback } from 'react';

export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
  showNavigation?: boolean;
  showIndicators?: boolean;
  showThumbnails?: boolean;
  infinite?: boolean;
  className?: string;
  onSlideChange?: (index: number) => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoPlay = false,
  interval = 3000,
  showNavigation = true,
  showIndicators = true,
  showThumbnails = false,
  infinite = true,
  className = '',
  onSlideChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= images.length) {
          return infinite ? 0 : prev;
        }
        return nextIndex;
      });
      setIsTransitioning(false);
    }, 300);
  }, [images.length, infinite, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => {
        const prevIndex = prev - 1;
        if (prevIndex < 0) {
          return infinite ? images.length - 1 : prev;
        }
        return prevIndex;
      });
      setIsTransitioning(false);
    }, 300);
  }, [images.length, infinite, isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [currentIndex, isTransitioning]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (isPlaying && images.length > 1) {
      const timer = setInterval(nextSlide, interval);
      return () => clearInterval(timer);
    }
  }, [isPlaying, interval, nextSlide, images.length]);

  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  if (!images || images.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-200 rounded-lg ${className}`}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className={`relative w-full overflow-hidden rounded-lg bg-black ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-w-16 aspect-h-9">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isTransitioning ? 0.7 : 1 }}
        />
        
        {/* Overlay with title and description */}
        {(currentImage.title || currentImage.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            {currentImage.title && (
              <h3 className="text-white text-lg font-semibold mb-1">
                {currentImage.title}
              </h3>
            )}
            {currentImage.description && (
              <p className="text-white/90 text-sm">
                {currentImage.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {showNavigation && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={!infinite && currentIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            disabled={!infinite && currentIndex === images.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Play/Pause Button */}
      {autoPlay && images.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
          <div className="flex space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                  index === currentIndex
                    ? 'border-white'
                    : 'border-transparent hover:border-white/50'
                }`}
                aria-label={`Thumbnail ${index + 1}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for carousel control
export const useCarousel = (images: CarouselImage[], options?: Partial<ImageCarouselProps>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(options?.autoPlay || false);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      const nextIndex = prev + 1;
      if (nextIndex >= images.length) {
        return options?.infinite !== false ? 0 : prev;
      }
      return nextIndex;
    });
  }, [images.length, options?.infinite]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      const prevIndex = prev - 1;
      if (prevIndex < 0) {
        return options?.infinite !== false ? images.length - 1 : prev;
      }
      return prevIndex;
    });
  }, [images.length, options?.infinite]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return {
    currentIndex,
    currentImage: images[currentIndex],
    isPlaying,
    nextSlide,
    prevSlide,
    goToSlide,
    togglePlayPause,
    canGoNext: options?.infinite !== false || currentIndex < images.length - 1,
    canGoPrev: options?.infinite !== false || currentIndex > 0
  };
};

export default ImageCarousel;
