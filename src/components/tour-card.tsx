import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { ITour } from "../types/tours.types";
import moment from "moment";

interface TourCardProps {
  item: ITour;
}

const TourCard: React.FC<TourCardProps> = ({ item }) => {
  // Memoize computed values to prevent unnecessary recalculations
  const packageData = useMemo(() => item.trip?.package, [item.trip?.package]);
  const tourId = useMemo(() => item.id || 'unknown', [item.id]);
  
  const imageSrc = useMemo(() => packageData?.cover_image || '/placeholder-image.jpg', [packageData?.cover_image]);
  const packageName = useMemo(() => packageData?.name || 'Unknown Package', [packageData?.name]);
  const duration = useMemo(() => packageData?.duration || 'N/A', [packageData?.duration]);
  const status = useMemo(() => item.status || 'Unknown', [item.status]);
  
  const packageUrl = useMemo(() => `/package/${packageData?.name || 'unknown'}`, [packageData?.name]);
  const tourUrl = useMemo(() => `/user-tour/${tourId}`, [tourId]);
  
  // Memoize formatted date
  const formattedStartDate = useMemo(() => {
    if (!item.trip?.start_date) return 'N/A';
    return moment(item.trip.start_date).format("DD MMM YYYY");
  }, [item.trip?.start_date]);
  
  // Memoize error handler
  const handleImageError = useMemo(() => (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-image.jpg';
  }, []);
  return (
    <div className="group rounded-md shadow dark:shadow-gray-700">
      <div className="relative overflow-hidden rounded-t-md shadow dark:shadow-gray-700 mx-3 mt-3">
        <img
          src={imageSrc}
          className="scale-125 group-hover:scale-100 duration-500"
          alt="Package"
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <p className="flex items-center text-slate-400 font-medium mb-2">
          <FiClock className="text-red-500 size-4 me-1" />{" "}
          {duration}
        </p>
        <Link
          to={packageUrl}
          className="text-lg font-medium hover:text-red-500 duration-500 ease-in-out"
        >
          {packageName}
        </Link>
        <div className="mt-4 pt-4 space-y-2 border-t border-slate-100 dark:border-gray-800">
          <div>
            Starts: {formattedStartDate}
          </div>
        </div>

        <div className="mt-4 pt-4 space-y-2 border-t border-slate-100 dark:border-gray-800">
          <h5 className="text-lg font-medium text-red-500">{status}</h5>

          <Link
            to={tourUrl}
            className="py-2 px-5 w-full inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md"
          >
            Show Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(TourCard);
