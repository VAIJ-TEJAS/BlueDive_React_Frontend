import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { IPackage } from "../types/package.types";

interface PackageCardProps {
  item: IPackage;
}

const PackageCard: React.FC<PackageCardProps> = ({ item }) => {
  // Memoize computed values to prevent unnecessary recalculations
  const packageUrl = useMemo(() => `/package/${item.name || 'unknown'}`, [item.name]);
  const displayPrice = useMemo(() => item.display_price || 0, [item.display_price]);
  const packageName = useMemo(() => item.name || 'Unknown Package', [item.name]);
  const duration = useMemo(() => item.duration || 'N/A', [item.duration]);
  const description = useMemo(() => item.description || 'No description available', [item.description]);
  
  // Memoize image source with fallback
  const imageSrc = useMemo(() => item.cover_image || '/placeholder-image.jpg', [item.cover_image]);
  
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
  
  // Memoize error handler to prevent recreation on each render
  const handleImageError = useMemo(() => (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-image.jpg';
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
        <img
          src={imageSrc}
          className=""
          alt="Package"
          onError={handleImageError}
          loading="lazy"
        />
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
