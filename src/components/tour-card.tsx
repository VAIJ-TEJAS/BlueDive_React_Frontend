import React from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { ITour } from "../types/tours.types";
import moment from "moment";

interface TourCardProps {
  item: ITour;
}

const TourCard: React.FC<TourCardProps> = ({ item }) => {
  return (
    <div className="group rounded-md shadow dark:shadow-gray-700">
      <div className="relative overflow-hidden rounded-t-md shadow dark:shadow-gray-700 mx-3 mt-3">
        <img
          src={item.trip?.package?.cover_image || '/placeholder-image.jpg'}
          className="scale-125 group-hover:scale-100 duration-500"
          alt={"Package"}
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />
      </div>

      <div className="p-4">
        <p className="flex items-center text-slate-400 font-medium mb-2">
          <FiClock className="text-red-500 size-4 me-1" />{" "}
          {item.trip?.package?.duration || 'N/A'}
        </p>
        <Link
          to={`/package/${item.trip?.package?.name || 'unknown'}`}
          className="text-lg font-medium hover:text-red-500 duration-500 ease-in-out"
        >
          {item.trip?.package?.name || 'Unknown Package'}
        </Link>
        <div className="mt-4 pt-4 space-y-2 border-t border-slate-100 dark:border-gray-800">
          <div>
            Starts: {item.trip?.start_date ? moment(item.trip.start_date).format("DD MMM YYYY") : 'N/A'} 
          </div>
        </div>

        <div className="mt-4 pt-4 space-y-2 border-t border-slate-100 dark:border-gray-800">
          <h5 className="text-lg font-medium text-red-500">{item.status || 'Unknown'}</h5>

          <Link
            to={`/user-tour/${item.id || 'unknown'}`}
            className="py-2 px-5 w-full inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md"
          >
            Show Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
