import React, { memo, useMemo, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { IPackage } from "../types/package.types";

interface PackageCardProps {
  item: IPackage;
}

const PackageCard: React.FC<PackageCardProps> = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoize computed values to prevent unnecessary recalculations
  const packageUrl = useMemo(() => `/package/${item.name || 'unknown'}`, [item.name]);
  const displayPrice = useMemo(() => item.display_price || 0, [item.display_price]);
  const packageName = useMemo(() => item.name || 'Unknown Package', [item.name]);
  const duration = useMemo(() => item.duration || 'N/A', [item.duration]);
  const description = useMemo(() => item.description || 'No description available', [item.description]);
  
  // Generate optimized image URL with size parameters
  const optimizedImageSrc = useMemo(() => {
    const baseUrl = item.cover_image || '/placeholder-image.jpg';
    if (!item.cover_image) return baseUrl;
    
    // Add optimization parameters for supported image services
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set('w', '400'); // Width
    url.searchParams.set('h', '250'); // Height
    url.searchParams.set('q', '80');  // Quality
    url.searchParams.set('f', 'webp'); // Format preference
    
    return url.toString();
  }, [item.cover_image]);
  
  // Memoize discount display
  const discountDisplay = useMemo(() => {
    if (!item.display_discount_percentage) return null;
    return (
      <div className="absolute top-0 start-0 p-4">
        <span className="bg-red-500 text-white text-[12px] px-2.5 py-1 font-medium rounded-md h-5">
          {item.display_discount_percentage}% OFF
        </span>
      </div>
    );
  }, [item.display_discount_percentage]);
  
  // Intersection Observer for lazy loading
  useMemo(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );
  }, []);
  
  // Setup observer when component mounts
  useMemo(() => {
    if (imageRef.current && observerRef.current) {
      observerRef.current.observe(imageRef.current);
    }
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);
  
  // Memoized image load handler
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);
  
  // Memoized image error handler
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);
  return (
    <div>
      <div className="text-lg font-medium bg-black text-white text-[12px] px-2.5 py-1 rounded-md text-center">
            Starts at just <span className="text-yellow-500">
            ₹ {displayPrice}*
              </span>
          </div>
    
    <div className="group rounded-md shadow dark:shadow-gray-700">
      <div className="relative overflow-hidden rounded-t-md shadow dark:shadow-gray-700 mx-3 mt-3">
        {/* Image loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-t-md" />
        )}
        
        {/* Optimized image */}
        <img
          ref={imageRef}
          src={isInView ? optimizedImageSrc : undefined}
          className={`transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          alt={`${packageName} package`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
          width="400"
          height="250"
          style={{
            aspectRatio: '16/10',
            objectFit: 'cover'
          }}
        />
        
        {/* Fallback for error state */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-t-md">
            <div className="text-center p-4">
              <div className="text-gray-400 text-4xl mb-2">📷</div>
              <p className="text-gray-500 text-sm">Image not available</p>
            </div>
          </div>
        )}
        
        {discountDisplay}
      </div>

      <div className="p-4">
        <p className="flex items-center text-slate-400 font-medium mb-2">
          <FiClock className="text-red-500 size-4 me-1" /> {duration}
        </p>
        <Link
          to={packageUrl}
          className="text-lg font-medium hover:text-red-500 duration-500 ease-in-out"
        >
          {packageName}
        </Link>

        <p className="text-slate-400 pt-2">{description}</p>

        <div className="mt-4 pt-4 flex justify-between items-center border-t border-slate-100 dark:border-gray-800">
          <Link to={packageUrl} className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md w-full">
            Book Now <i className="mdi mdi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default memo(PackageCard);
